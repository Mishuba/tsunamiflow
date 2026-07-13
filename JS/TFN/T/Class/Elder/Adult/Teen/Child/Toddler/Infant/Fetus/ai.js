//neural network
export class AiInterface {
  layer1 = null;
  layer2 = null;
  weights = null;
  bias = null;
  neurons = null;
  inputSize = null;
  hiddenSize = null;
  outputSize = null;
  activation = null;
  outputActivation = null;
  Wxh = null;
  Whh = null;
  bh = null;
  Why = null;
  by = null;
  // Gates weights: W_x (for input) and W_h (for hidden) per gate
  Wxi = null;
  Whi = null;
  bi = null;
  Wxf = null;
  Whf = null;
  bf = null;
  Wxc = null;
  Whc = null;
  bc = null;
  Wxo = null;
  Who = null;
  bo = null;
  Why = null;
  by = null;

  Wxz = null;
  Wrz = null;
  Wxh = null;
  Whz = null;
  Whr = null;
  Whh = null;
  bz = null;
  br = null;
  bh = null;

  h = null;
  c = null;
  hidden = null;
  nodes = {};
  edges = [];
  facts = new Map();
  rules = [];
  inferenceHistory = [];
  sprite = null;
  alpha = null; // learning rate
  targetModel = null;
  replay = [];
  replaySize = null;
  batchSize = null;
  gamma = null; // discount factor
  epsilon = null; // exploration
  q = new Map(); // Q-table: key -> {action: value}
  actions = null;

  static dot(a, b) {
    return a.map((row, i) =>
      b[0].map((_, j) =>
        row.reduce((sum, val, k) => sum + val * b[k][j], 0)
      )
    );
  }

  static add(a, b) {
    return a.map((row, i) =>
      row.map((val, j) => val + b[i][j])
    );
  }

  static subtract(a, b) {
    return a.map((row, i) =>
      row.map((val, j) => val - b[i][j])
    );
  }

  static scale(m, scalar) {
    return m.map(row =>
      row.map(val => val * scalar)
    );
  }

  static concat(a, b) {
    return a.map((row, i) =>
      row.map((val, j) => String(val) + String(b[i][j]))
    );
  }

  static transpose(m) {
    return m[0].map((_, i) => m.map(row => row[i]));
  }

  static _is3D(x) {
    return Array.isArray(x) && Array.isArray(x[0]) && Array.isArray(x[0][0]);
  }

  static _transpose2D(m) {
    return m[0].map((_, i) => m.map(row => row[i]));
  }

  static _matMul2D(a, b) {
    const m = a.length, n = a[0].length, p = b[0].length;
    const out = Array.from({ length: m }, () => Array(p).fill(0));
    for (let i = 0; i < m; i++) {
      for (let k = 0; k < n; k++) {
        const aik = a[i][k];
        for (let j = 0; j < p; j++) out[i][j] += aik * b[k][j];
      }
    }
    return out;
  }

  static _softmax2D(scores) {
    return scores.map(row => {
      const max = Math.max(...row);
      const exps = row.map(v => Math.exp(v - max));
      const sum = exps.reduce((s, x) => s + x, 0) || 1;
      return exps.map(x => x / sum);
    });
  }

  static _applyMask(scores, mask) {
    // mask expected same shape as scores; truthy values keep, falsy values mask
    if (!mask) return scores;
    return scores.map((row, i) => row.map((v, j) => (mask[i] && mask[i][j]) ? v : -1e9));
  }

  // calculate performs scaled dot-product attention
  // Q: [seqQ x d] or [batch x seqQ x d]
  // K: [seqK x d] or [batch x seqK x d]
  // V: [seqK x dv] or [batch x seqK x dv]
  // mask (optional): for each Q row, which K positions to allow (same shape as scores)
  // options: { scale: true, returnWeights: false }
  static calculate(Q, K, V, mask = null, options = {}) {
    const { scale = true, returnWeights = false } = options;

    const singleBatch = !this._is3D(Q);
    const batchQ = singleBatch ? [Q] : Q;
    const batchK = singleBatch ? [K] : K;
    const batchV = singleBatch ? [V] : V;
    const batchMask = mask && singleBatch ? [mask] : mask;

    const results = [];
    const weightsArr = [];

    for (let b = 0; b < batchQ.length; b++) {
      const q = batchQ[b];
      const k = batchK[b];
      const v = batchV[b];

      // compute scores = Q * K^T  -> [seqQ x seqK]
      const kT = this._transpose2D(k);
      let scores = this._matMul2D(q, kT);

      // scale by sqrt(dk)
      if (scale && q[0] && q[0].length) {
        const dk = q[0].length;
        const s = Math.sqrt(dk);
        scores = scores.map(row => row.map(x => x / s));
      }

      // apply mask
      const m = batchMask ? batchMask[b] : null;
      if (m) scores = this._applyMask(scores, m);

      // softmax to get attention weights
      const weights = this._softmax2D(scores);

      // output = weights * V
      const out = this._matMul2D(weights, v);

      results.push(out);
      weightsArr.push(weights);
    }

    if (singleBatch) {
      return returnWeights ? { output: results[0], weights: weightsArr[0] } : results[0];
    }
    return returnWeights ? { output: results, weights: weightsArr } : results;
  }

  // Pad a single-channel 2D matrix with zeros
  static _pad2D(mat, pad) {
    if (pad === 0) return mat;
    const h = mat.length, w = mat[0].length;
    const outH = h + pad * 2, outW = w + pad * 2;
    const out = Array.from({ length: outH }, () => Array(outW).fill(0));
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) out[y + pad][x + pad] = mat[y][x];
    return out;
  }

  static _is3D(x) {
    return Array.isArray(x) && Array.isArray(x[0]) && Array.isArray(x[0][0]);
  }

  static reluMap(map) {
    return map.map(row => row.map(v => Math.max(0, v)));
  }

  // convolve supports:
  // - single filter (kernel) applied to single-channel 2D input
  // - multi-channel input with kernel depth matching channels
  // - multiple filters (array) producing multiple feature maps
  // options: { stride=1, padding=0 }
  static convolve(input, kernel, options = {}) {
    const { stride = 1, padding = 0 } = options;

    const inputIs3D = this._is3D(input);

    // normalize kernels: allow single kernel or array of kernels
    const kernels = Array.isArray(kernel) && this._is3D(kernel[0]) ? kernel : [kernel];

    // helper to get channel count and pad each channel
    const inChannels = inputIs3D ? input[0][0].length : 1;

    // If input is single-channel, convert to 3D-like [H][W][1] for uniformity
    let in3D;
    if (!inputIs3D) {
      in3D = input.map(row => row.map(v => [v]));
    } else {
      in3D = input;
    }

    // Pad each channel separately by reconstructing padded channels
    const H = in3D.length, W = in3D[0].length;
    // Build per-channel 2D arrays
    const channels = Array.from({ length: inChannels }, (_, c) => {
      const mat = Array.from({ length: H }, (_, y) => Array.from({ length: W }, (_, x) => in3D[y][x][c]));
      return this._pad2D(mat, padding);
    });

    const outMaps = kernels.map(k => {
      // kernel may be 2D (single-channel) or 3D [kH][kW][channels]
      const kIs3D = this._is3D(k);
      const kH = kIs3D ? k.length : k.length;
      const kW = kIs3D ? k[0].length : k[0].length;

      const outH = Math.floor((H + padding * 2 - kH) / stride) + 1;
      const outW = Math.floor((W + padding * 2 - kW) / stride) + 1;
      const out = Array.from({ length: outH }, () => Array(outW).fill(0));

      for (let y = 0; y < outH; y++) {
        for (let x = 0; x < outW; x++) {
          let sum = 0;
          for (let c = 0; c < inChannels; c++) {
            for (let ky = 0; ky < kH; ky++) {
              for (let kx = 0; kx < kW; kx++) {
                const iv = channels[c][y * stride + ky][x * stride + kx];
                const kv = (kIs3D ? k[ky][kx][c] : k[ky][kx]) || 0;
                sum += iv * kv;
              }
            }
          }
          out[y][x] = sum;
        }
      }
      return out;
    });

    // if single kernel input, return single map, else array
    return outMaps.length === 1 ? outMaps[0] : outMaps;
  }

  // pool: supports single feature map or array of maps. type = 'max'|'avg'
  static pool(featureMap, size = 2, stride = 2, type = 'max') {
    const applyPool = (map) => {
      const h = map.length, w = map[0].length;
      const outH = Math.floor((h - size) / stride) + 1;
      const outW = Math.floor((w - size) / stride) + 1;
      const out = Array.from({ length: outH }, () => Array(outW).fill(0));
      for (let y = 0; y < outH; y++) {
        for (let x = 0; x < outW; x++) {
          const vals = [];
          for (let yy = 0; yy < size; yy++) for (let xx = 0; xx < size; xx++) vals.push(map[y * stride + yy][x * stride + xx]);
          if (type === 'avg') out[y][x] = vals.reduce((s, v) => s + v, 0) / vals.length;
          else out[y][x] = Math.max(...vals);
        }
      }
      return out;
    };

    if (Array.isArray(featureMap) && this._is3D(featureMap[0])) {
      // array of multi-channel maps? treat each as separate map
      return featureMap.map(m => applyPool(m));
    }
    if (Array.isArray(featureMap) && Array.isArray(featureMap[0]) && typeof featureMap[0][0] === 'number') {
      return applyPool(featureMap);
    }
    // fallback: if array of maps
    if (Array.isArray(featureMap)) return featureMap.map(m => applyPool(m));
    return applyPool(featureMap);
  }

  static flatten(maps) {
    // maps can be single 2D or array of 2D maps
    const arr = [];
    if (!Array.isArray(maps)) return [];
    if (this._is3D(maps)) {
      // array of maps
      for (const map of maps) for (const row of map) for (const v of row) arr.push(v);
      return arr;
    }
    if (Array.isArray(maps) && Array.isArray(maps[0]) && typeof maps[0][0] === 'number') {
      for (const row of maps) for (const v of row) arr.push(v);
      return arr;
    }
    return arr;
  }

  static _dotMatVec(mat, vec) {
    return mat.map(row => row.reduce((s, v, i) => s + v * vec[i], 0));
  }

  static _sigmoidVec(v) {
    return v.map(x => 1 / (1 + Math.exp(-x)));
  }
  static _tanhVec(v) { return v.map(x => Math.tanh(x)); }
  static _reluVec(v) { return v.map(x => Math.max(0, x)); }
  static _softmaxVec(v) { const m = Math.max(...v); const ex = v.map(x => Math.exp(x - m)); const s = ex.reduce((a, b) => a + b, 0) || 1; return ex.map(e => e / s); }

  constructor(options = {}) {
    if (options.weights && !Array.isArray(options.weights)) {
      throw new Error("weights must be an array");
    } else if (options.weights && options.weights.length === 0) {
      throw new Error("weights array cannot be empty");
    } else if (options.weights && options.weights.some(w => !Array.isArray(w))) {
      throw new Error("each weight must be an array");
    } else if (options.weights && options.weights.some(w => w.length === 0)) {
      throw new Error("each weight array cannot be empty");
    } else {
      if (options.weights) {
        this.weights = options.weights || [];
      }
    }

    if (options.bias && typeof options.bias !== 'number') {
      throw new Error("bias must be a number");
    } else {
      if (options.bias !== undefined) {
        this.bias = options.bias;
      } else {
        this.bias = Math.random() - 0.5;
      }
    }

    if (options.inputSize && typeof options.inputSize !== 'number') {
      throw new Error("inputSize must be a number");
    } else {
      if (options.inputSize) {
        this.inputSize = options.inputSize;
      } else {
        this.inputSize = 1; // default to 1 if not provided
      }
    }

    if (options.hiddenSize && typeof options.hiddenSize !== 'number') {
      throw new Error("hiddenSize must be a number");
    } else {
      if (options.hiddenSize) {
        this.hiddenSize = options.hiddenSize;
      } else {
        this.hiddenSize = 1; // default to 1 if not provided
      }
    }

    if (options.outputSize && typeof options.outputSize !== 'number') {
      throw new Error("outputSize must be a number");
    } else {
      if (options.outputSize) {
        this.outputSize = options.outputSize;
      } else {
        this.outputSize = 1; // default to 1 if not provided
      }
    }

    if (options.activation && typeof options.activation !== 'string') {
      throw new Error("activation must be a string");
    } else {
      if (options.activation) {
        this.activation = options.activation;
      } else {
        this.activation = 'tanh'; // default to 'tanh' if not provided
      }
    }

    if (options.outputActivation && typeof options.outputActivation !== 'string') {
      throw new Error("outputActivation must be a string");
    } else {
      if (options.outputActivation) {
        this.outputActivation = options.outputActivation;
      } else {
        this.outputActivation = null;
      }
    }

    if (options.alpha && typeof options.alpha !== 'number') {
      throw new Error("alpha must be a number");
    } else {
      if (options.alpha) {
        this.alpha = options.alpha;
      } else {
        this.alpha = 0.1; // default to 0.1 if not provided
      }
    }

    if (options.gamma && typeof options.gamma !== 'number') {
      throw new Error("gamma must be a number");
    } else {
      if (options.gamma) {
        this.gamma = options.gamma;
      } else {
        this.gamma = 0.99; // default to 0.99 if not provided
      }
    }

    if (options.epsilon && typeof options.epsilon !== 'number') {
      throw new Error("epsilon must be a number");
    } else {
      if (options.epsilon) {
        this.epsilon = options.epsilon;
      } else {
        this.epsilon = 0.1; // default to 0.1 if not provided
      }
    }

    if (options.q && !(options.q instanceof Map)) {
      throw new Error("q must be a Map");
    } else {
      if (options.q) {
        this.q = options.q;
      } else {
        this.q = new Map();
      }
    }
    if (options.actions && !Array.isArray(options.actions)) {
      throw new Error("actions must be an array");
    } else {
      if (options.actions) {
        this.actions = options.actions;
      } else {
        this.actions = [];
      }
    }

    if (options.replaySize && typeof options.replaySize !== 'number') {
      throw new Error("replaySize must be a number");
    } else {
      if (options.replaySize) {
        this.replaySize = options.replaySize;
      } else {
        this.replaySize = 10000;
      }
    }

    if (options.batchSize && typeof options.batchSize !== 'number') {
      throw new Error("batchSize must be a number");
    } else {
      if (options.batchSize) {
        this.batchSize = options.batchSize;
      } else {
        this.batchSize = 32;
      }
    }
  }

  // Create a new Neuron instance (weights + bias) and return it
  neuron(numInputs) {
    return {
      weights: Array.from({ length: numInputs }, () => Math.random() - 0.5),
      bias: Math.random() - 0.5,
      activate(inputs) {
        let sum = this.bias;
        for (let i = 0; i < this.weights.length; i++) {
          sum += inputs[i] * this.weights[i];
        }
        return 1 / (1 + Math.exp(-sum));
      }
    };
  }

  activate(inputs) {
    let sum = this.bias;

    for (let i = 0; i < this.weights.length; i++) {
      sum += inputs[i] * this.weights[i];
    }

    return this.sigmoid(sum);
  }

  // Build and return a layer object with its own neurons and forward()
  layer(numNeurons, inputsPerNeuron) {
    const neurons = Array.from({ length: numNeurons }, () => this.neuron(inputsPerNeuron));
    return {
      neurons,
      forward(inputs) {
        return this.neurons.map(n => n.activate(inputs));
      }
    };
  }

  // Initialize a simple 2-layer network. `a` and `b` are neuron counts.
  neuralnetwork(a, b, inputsPerNeuron = null) {
    // If inputsPerNeuron not provided, assume input size equals first layer neuron count
    const inp = inputsPerNeuron || a;
    this.layer1 = this.layer(a, inp);
    this.layer2 = this.layer(b, a);
    return this;
  }

  predict(input) {
    const out1 = this.layer1.forward(input);
    const out2 = this.layer2.forward(out1);
    return out2;
  }

  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  sigmoidDerivative(x) {
    return x * (1 - x);
  }

  // Training loop with multi-output support and backpropagation to hidden layer.
  // `labels` should be an array where each item is either a scalar (for single output)
  // or an array of target values matching the output layer size.
  train(network, data, labels, lr = 0.1) {
    if (!network.layer1 || !network.layer2) return;

    const nHidden = network.layer1.neurons.length;
    const nOutput = network.layer2.neurons.length;

    for (let i = 0; i < data.length; i++) {
      const input = data[i];
      const target = labels[i];

      // forward
      const hidden = network.layer1.forward(input);
      const output = network.layer2.forward(hidden);

      // ensure target is array for multi-output
      const targetArr = Array.isArray(target) ? target : [target];

      // compute output deltas and update output-layer weights/biases
      const deltasOut = Array(nOutput).fill(0);
      for (let k = 0; k < nOutput; k++) {
        const outK = output[k];
        const tK = targetArr[k] !== undefined ? targetArr[k] : 0;
        const err = tK - outK;
        const delta = err * (outK * (1 - outK));
        deltasOut[k] = delta;

        const outNeuron = network.layer2.neurons[k];
        for (let j = 0; j < outNeuron.weights.length; j++) {
          outNeuron.weights[j] += lr * delta * hidden[j];
        }
        outNeuron.bias += lr * delta;
      }

      // backpropagate errors to hidden layer and update hidden weights/biases
      for (let j = 0; j < nHidden; j++) {
        // error contribution from all output deltas
        let errHidden = 0;
        for (let k = 0; k < nOutput; k++) {
          const outNeuron = network.layer2.neurons[k];
          errHidden += deltasOut[k] * outNeuron.weights[j];
        }
        const hVal = hidden[j];
        const deltaH = errHidden * (hVal * (1 - hVal));

        const hiddenNeuron = network.layer1.neurons[j];
        for (let m = 0; m < hiddenNeuron.weights.length; m++) {
          hiddenNeuron.weights[m] += lr * deltaH * input[m];
        }
        hiddenNeuron.bias += lr * deltaH;
      }
    }
  }
  kMeans(data, k = 2, iterations = 10) {
    let centroids = data.slice(0, k);

    for (let iter = 0; iter < iterations; iter++) {
      let clusters = Array.from({ length: k }, () => []);

      for (let point of data) {
        let distances = centroids.map(c =>
          Math.hypot(...c.map((v, i) => v - point[i]))
        );

        let idx = distances.indexOf(Math.min(...distances));
        clusters[idx].push(point);
      }

      const prevCentroids = centroids;
      centroids = clusters.map((cluster, idx) => {
        if (!cluster.length) {
          // if cluster empty, keep previous centroid or pick a random data point
          return prevCentroids && prevCentroids[idx]
            ? prevCentroids[idx]
            : data[Math.floor(Math.random() * data.length)];
        }
        return cluster[0].map((_, i) =>
          cluster.reduce((sum, p) => sum + p[i], 0) / cluster.length
        );
      });
    }

    return centroids;
  }

  // forward pipeline: filters is array of kernels for conv layer1, options may include pooling and activation
  // image: 2D (grayscale) or 3D [H][W][C]
  // returns feature maps (or flattened vector if flatten=true)
  forwardCNN(image, filters, options = {}) {
    const { convOptions = {}, poolSize = 2, poolStride = 2, poolType = 'max', activation = 'relu', flatten = false } = options;

    // conv -> activation -> pool
    const convOut = AiInterface.convolve(image, filters, convOptions);
    // convOut may be single map or array
    const maps = Array.isArray(convOut) ? convOut : [convOut];

    const activated = maps.map(m => activation === 'relu' ? AiInterface.reluMap(m) : m);
    const pooled = activated.map(m => AiInterface.pool(m, poolSize, poolStride, poolType));

    if (flatten) return AiInterface.flatten(pooled);
    return pooled.length === 1 ? pooled[0] : pooled;
  }

  RNNCell(inputSize, hiddenSize, outputSize = null, activation = 'tanh', outputActivation = null) {
    const rand = () => (Math.random() - 0.5) * 0.2;
    this.Wxh = Array.from({ length: hiddenSize }, () => Array.from({ length: inputSize }, rand));
    this.Whh = Array.from({ length: hiddenSize }, () => Array.from({ length: hiddenSize }, rand));
    this.bh = Array.from({ length: hiddenSize }, () => 0);
    if (outputSize) {
      this.Why = Array.from({ length: outputSize }, () => Array.from({ length: hiddenSize }, rand));
      this.by = Array.from({ length: outputSize }, () => 0);
    }
    this.hidden = Array.from({ length: hiddenSize }, () => 0);
  }


  resetStateRNNCell(value = 0) { this.hidden = Array.from({ length: this.hiddenSize }, () => value); }

  forwardRNNCell(input, hiddenState = null) {
    if (!Array.isArray(input) || input.length !== this.inputSize) throw new Error(`AiInterface.forward: expected input length ${this.inputSize}`);
    const prevH = hiddenState || this.hidden;
    const wx = AiInterface._dotMatVec(this.Wxh, input);
    const wh = AiInterface._dotMatVec(this.Whh, prevH);
    const hRaw = wx.map((v, i) => v + wh[i] + (this.bh[i] || 0));
    let nextH = this.activation === 'tanh' ? AiInterface._tanhVec(hRaw) : this.activation === 'sigmoid' ? AiInterface._sigmoidVec(hRaw) : AiInterface._reluVec(hRaw);
    this.hidden = nextH.slice();
    let output = nextH;
    if (this.outputSize) {
      const yRaw = AiInterface._dotMatVec(this.Why, nextH).map((v, i) => v + (this.by[i] || 0));
      output = this.outputActivation === 'softmax' ? AiInterface._softmaxVec(yRaw) : this.outputActivation === 'sigmoid' ? AiInterface._sigmoidVec(yRaw) : yRaw;
    }
    return { nextHidden: nextH, output };
  }

  LSTMCell(inputSize, hiddenSize, outputSize = null, options = {}) {
    const rand = () => (Math.random() - 0.5) * 0.2;
    // Gates weights: W_x (for input) and W_h (for hidden) per gate
    this.Wxi = Array.from({ length: hiddenSize }, () => Array.from({ length: inputSize }, rand));
    this.Whi = Array.from({ length: hiddenSize }, () => Array.from({ length: hiddenSize }, rand));
    this.bi = Array.from({ length: hiddenSize }, () => 0);

    this.Wxf = Array.from({ length: hiddenSize }, () => Array.from({ length: inputSize }, rand));
    this.Whf = Array.from({ length: hiddenSize }, () => Array.from({ length: hiddenSize }, rand));
    this.bf = Array.from({ length: hiddenSize }, () => 0);

    this.Wxc = Array.from({ length: hiddenSize }, () => Array.from({ length: inputSize }, rand));
    this.Whc = Array.from({ length: hiddenSize }, () => Array.from({ length: hiddenSize }, rand));
    this.bc = Array.from({ length: hiddenSize }, () => 0);

    this.Wxo = Array.from({ length: hiddenSize }, () => Array.from({ length: inputSize }, rand));
    this.Who = Array.from({ length: hiddenSize }, () => Array.from({ length: hiddenSize }, rand));
    this.bo = Array.from({ length: hiddenSize }, () => 0);

    if (this.outputSize) { this.Why = Array.from({ length: this.outputSize }, () => Array.from({ length: hiddenSize }, rand)); this.by = Array.from({ length: this.outputSize }, () => 0); }

    this.h = Array.from({ length: hiddenSize }, () => 0);
    this.c = Array.from({ length: hiddenSize }, () => 0);
  }

  resetStateLSTMCell() { this.h.fill(0); this.c.fill(0); }

  forwardLSTMCell(x, state = null) {
    const prevH = state && state.h ? state.h : this.h;
    const prevC = state && state.c ? state.c : this.c;

    const i = AiInterface._sigmoidVec(AiInterface._dotMatVec(this.Wxi, x).map((v, i) => v + AiInterface._dotMatVec(this.Whi, prevH)[i] + this.bi[i]));
    const f = AiInterface._sigmoidVec(AiInterface._dotMatVec(this.Wxf, x).map((v, i) => v + AiInterface._dotMatVec(this.Whf, prevH)[i] + this.bf[i]));
    const g = AiInterface._tanhVec(AiInterface._dotMatVec(this.Wxc, x).map((v, i) => v + AiInterface._dotMatVec(this.Whc, prevH)[i] + this.bc[i]));
    const o = AiInterface._sigmoidVec(AiInterface._dotMatVec(this.Wxo, x).map((v, i) => v + AiInterface._dotMatVec(this.Who, prevH)[i] + this.bo[i]));

    const nextC = prevC.map((cv, i) => f[i] * cv + i[i] * g[i]);
    const nextH = nextC.map((cv, i) => o[i] * Math.tanh(cv));

    this.h = nextH.slice(); this.c = nextC.slice();

    let output = nextH;
    if (this.outputSize) {
      const yRaw = AiInterface._dotMatVec(this.Why, nextH).map((v, i) => v + this.by[i]);
      output = yRaw;
    }
    return { nextState: { h: this.h.slice(), c: this.c.slice() }, output };
  }

  GRUCell(inputSize, hiddenSize, outputSize = null) {
    const rand = () => (Math.random() - 0.5) * 0.2;
    this.Wxz = Array.from({ length: hiddenSize }, () => Array.from({ length: inputSize }, rand));
    this.Wrz = Array.from({ length: hiddenSize }, () => Array.from({ length: inputSize }, rand));
    this.Wxh = Array.from({ length: hiddenSize }, () => Array.from({ length: inputSize }, rand));

    this.Whz = Array.from({ length: hiddenSize }, () => Array.from({ length: hiddenSize }, rand));
    this.Whr = Array.from({ length: hiddenSize }, () => Array.from({ length: hiddenSize }, rand));
    this.Whh = Array.from({ length: hiddenSize }, () => Array.from({ length: hiddenSize }, rand));

    this.bz = Array.from({ length: hiddenSize }, () => 0);
    this.br = Array.from({ length: hiddenSize }, () => 0);
    this.bh = Array.from({ length: hiddenSize }, () => 0);

    if (this.outputSize) { this.Why = Array.from({ length: this.outputSize }, () => Array.from({ length: hiddenSize }, rand)); this.by = Array.from({ length: this.outputSize }, () => 0); }
    this.h = Array.from({ length: hiddenSize }, () => 0);
  }

  resetStateGRUCell() { this.h.fill(0); }

  forwardGRUCell(x, state = null) {
    const prevH = state && state.h ? state.h : this.h;
    const z = AiInterface._sigmoidVec(AiInterface._dotMatVec(this.Wxz, x).map((v, i) => v + AiInterface._dotMatVec(this.Whz, prevH)[i] + this.bz[i]));
    const r = AiInterface._sigmoidVec(AiInterface._dotMatVec(this.Wrz, x).map((v, i) => v + AiInterface._dotMatVec(this.Whr, prevH)[i] + this.br[i]));
    const hhRaw = AiInterface._dotMatVec(this.Wxh, x).map((v, i) => v + AiInterface._dotMatVec(this.Whh, prevH.map((hv, ii) => hv * r[ii]))[i] + this.bh[i]);
    const hh = hhRaw.map(x => Math.tanh(x));
    const nextH = prevH.map((pv, i) => (1 - z[i]) * pv + z[i] * hh[i]);
    this.h = nextH.slice();
    let output = nextH;
    if (this.outputSize) { const yRaw = AiInterface._dotMatVec(this.Why, nextH).map((v, i) => v + this.by[i]); output = yRaw; }
    return { nextState: { h: this.h.slice() }, output };
  }

  addNode(id, data = {}) {
    if (!id) throw new Error('Node id is required');
    this.nodes[id] = { id, ...data };
    return this.nodes[id];
  }

  getNode(id) {
    return this.nodes[id] || null;
  }

  removeNode(id) {
    delete this.nodes[id];
    this.edges = this.edges.filter(edge => edge.a !== id && edge.b !== id);
  }

  connect(a, b, relation, directed = true, metadata = {}) {
    if (!this.nodes[a] || !this.nodes[b]) {
      throw new Error('Both nodes must exist before connecting them');
    }
    this.edges.push({ a, b, relation, directed, metadata });
  }

  removeEdge(a, b, relation) {
    this.edges = this.edges.filter(edge => !(edge.a === a && edge.b === b && edge.relation === relation));
  }

  getEdges(filter = {}) {
    return this.edges.filter(edge => {
      return Object.entries(filter).every(([key, value]) => edge[key] === value);
    });
  }

  getNeighbors(id, relation = null, direction = 'outgoing') {
    const neighbors = new Set();
    for (const edge of this.edges) {
      if (direction !== 'incoming' && edge.a === id && (!relation || edge.relation === relation)) {
        neighbors.add(edge.b);
      }
      if (direction !== 'outgoing' && edge.b === id && (!relation || edge.relation === relation)) {
        neighbors.add(edge.a);
      }
      if (!edge.directed && edge.a === id && !relation) {
        neighbors.add(edge.b);
      }
      if (!edge.directed && edge.b === id && !relation) {
        neighbors.add(edge.a);
      }
    }
    return Array.from(neighbors).map(nodeId => this.getNode(nodeId));
  }

  findPath(start, end, maxDepth = 5) {
    const visited = new Set();
    const path = [];
    const results = [];

    const dfs = (current, depth) => {
      if (depth > maxDepth) return;
      if (current === end) {
        results.push([...path]);
        return;
      }
      visited.add(current);
      for (const edge of this.getEdges({ a: current })) {
        if (!visited.has(edge.b)) {
          path.push(edge);
          dfs(edge.b, depth + 1);
          path.pop();
        }
      }
      visited.delete(current);
    };

    dfs(start, 0);
    return results;
  }

  infer(a, relation) {
    const firstHop = this.getEdges({ a, relation });
    const secondHop = [];
    for (const edge of firstHop) {
      secondHop.push(...this.getEdges({ a: edge.b, relation }));
    }
    return secondHop.map(edge => edge.b).filter((value, index, self) => self.indexOf(value) === index);
  }

  KnowledgetoJSON() {
    return JSON.stringify({ nodes: this.nodes, edges: this.edges });
  }

  static KnowledgefromJSON(json) {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    const graph = new KnowledgeGraph();
    graph.nodes = { ...data.nodes };
    graph.edges = Array.isArray(data.edges) ? [...data.edges] : [];
    return graph;
  }

  addFact(fact, metadata = true) {
    if (!fact) throw new Error('Fact is required');
    const key = typeof fact === 'string' ? fact : JSON.stringify(fact);
    this.facts.set(key, metadata);
    return key;
  }

  addFacts(facts) {
    if (!Array.isArray(facts)) return;
    for (const fact of facts) {
      this.addFact(fact);
    }
  }

  hasFact(fact) {
    const key = typeof fact === 'string' ? fact : JSON.stringify(fact);
    return this.facts.has(key);
  }

  getFact(fact) {
    const key = typeof fact === 'string' ? fact : JSON.stringify(fact);
    return this.facts.get(key);
  }

  retractFact(fact) {
    const key = typeof fact === 'string' ? fact : JSON.stringify(fact);
    return this.facts.delete(key);
  }

  addRule(name, antecedent, consequent, options = {}) {
    if (!name || !antecedent || !consequent) {
      throw new Error('Rule name, antecedent and consequent are required');
    }
    this.rules.push({
      name,
      antecedent,
      consequent,
      priority: options.priority || 0,
      action: options.action || null,
      once: options.once || false,
      applied: false,
      metadata: options.metadata || {}
    });
  }

  getRules() {
    return [...this.rules];
  }

  evaluateCondition(condition) {
    if (typeof condition === 'function') {
      return condition(this);
    }

    if (typeof condition === 'string') {
      return this.hasFact(condition);
    }

    if (Array.isArray(condition)) {
      return condition.every(term => this.evaluateCondition(term));
    }

    if (condition && typeof condition === 'object') {
      if ('not' in condition) {
        return !this.evaluateCondition(condition.not);
      }
      if ('any' in condition) {
        return Array.isArray(condition.any) && condition.any.some(term => this.evaluateCondition(term));
      }
      if ('all' in condition) {
        return Array.isArray(condition.all) && condition.all.every(term => this.evaluateCondition(term));
      }
    }

    return false;
  }

  infer(initialFacts = [], options = {}) {
    this.inferenceHistory = [];
    this.addFacts(initialFacts);

    const maxIterations = options.maxIterations || 50;
    let changed = true;
    let iteration = 0;

    while (changed && iteration < maxIterations) {
      changed = false;
      iteration += 1;
      const sortedRules = [...this.rules].sort((a, b) => b.priority - a.priority);

      for (const rule of sortedRules) {
        if (rule.once && rule.applied) continue;
        const conditionMet = this.evaluateCondition(rule.antecedent);

        if (!conditionMet) continue;

        const consequents = Array.isArray(rule.consequent) ? rule.consequent : [rule.consequent];
        let ruleFired = false;

        for (const consequent of consequents) {
          const key = typeof consequent === 'string' ? consequent : JSON.stringify(consequent);
          if (!this.facts.has(key)) {
            this.facts.set(key, rule.metadata || true);
            ruleFired = true;
            changed = true;
            this.inferenceHistory.push({
              rule: rule.name,
              antecedent: rule.antecedent,
              consequent,
              iteration,
              timestamp: new Date().toISOString()
            });
          }
        }

        if (ruleFired && typeof rule.action === 'function') {
          rule.action(this);
        }

        if (ruleFired) {
          rule.applied = true;
        }
      }
    }

    return {
      facts: Array.from(this.facts.keys()),
      inferenceHistory: [...this.inferenceHistory],
      iterations: iteration
    };
  }

  prove(goal, maxDepth = 10) {
    const visited = new Set();

    const dfs = (target, depth) => {
      if (depth > maxDepth) return false;
      if (this.hasFact(target)) return true;
      if (visited.has(target)) return false;
      visited.add(target);

      for (const rule of this.rules) {
        const consequents = Array.isArray(rule.consequent) ? rule.consequent : [rule.consequent];
        if (!consequents.some(consequent => consequent === target)) continue;

        const antecedent = rule.antecedent;
        if (Array.isArray(antecedent)) {
          if (antecedent.every(term => dfs(term, depth + 1))) {
            return true;
          }
        } else if (typeof antecedent === 'string') {
          if (dfs(antecedent, depth + 1)) return true;
        } else if (typeof antecedent === 'function') {
          if (antecedent(this)) return true;
        } else if (antecedent && typeof antecedent === 'object') {
          if (antecedent.all && antecedent.all.every(term => dfs(term, depth + 1))) {
            return true;
          }
          if (antecedent.any && antecedent.any.some(term => dfs(term, depth + 1))) {
            return true;
          }
        }
      }

      return false;
    };

    return dfs(goal, 0);
  }

  query(predicate) {
    if (!predicate) {
      return Array.from(this.facts.entries()).map(([fact, metadata]) => ({ fact, metadata }));
    }

    return Array.from(this.facts.entries())
      .filter(([fact]) => fact.includes(predicate))
      .map(([fact, metadata]) => ({ fact, metadata }));
  }

  explain(fact) {
    const key = typeof fact === 'string' ? fact : JSON.stringify(fact);
    return this.inferenceHistory.filter(entry => {
      const consequent = typeof entry.consequent === 'string' ? entry.consequent : JSON.stringify(entry.consequent);
      return consequent === key;
    });
  }

  reset() {
    this.facts.clear();
    this.rules = [];
    this.inferenceHistory = [];
  }

  _key(state) {
    return typeof state === 'string' ? state : JSON.stringify(state);
  }

  getQ(state, action) {
    const key = this._key(state);
    const row = this.q.get(key) || {};
    return typeof row[action] === 'number' ? row[action] : 0;
  }

  setQ(state, action, value) {
    const key = this._key(state);
    const row = this.q.get(key) || {};
    row[action] = value;
    this.q.set(key, row);
  }

  chooseAction(state) {
    const key = this._key(state);
    if (Math.random() < this.epsilon) {
      return this.actions[Math.floor(Math.random() * this.actions.length)];
    }
    const row = this.q.get(key) || {};
    let bestAction = this.actions[0];
    let bestValue = -Infinity;
    for (const a of this.actions) {
      const v = typeof row[a] === 'number' ? row[a] : 0;
      if (v > bestValue) {
        bestValue = v;
        bestAction = a;
      }
    }
    return bestAction;
  }

  update(state, action, reward, nextState) {
    const oldQ = this.getQ(state, action);
    const nextKey = this._key(nextState);
    const nextRow = this.q.get(nextKey) || {};
    let bestNext = -Infinity;
    for (const a of this.actions) {
      const v = typeof nextRow[a] === 'number' ? nextRow[a] : 0;
      if (v > bestNext) bestNext = v;
    }
    if (bestNext === -Infinity) bestNext = 0;
    const newQ = oldQ + this.alpha * (reward + this.gamma * bestNext - oldQ);
    this.setQ(state, action, newQ);
  }

  // Simple training loop for tabular environments
  trainDQN(env, episodes = 1000, maxSteps = 200) {
    for (let ep = 0; ep < episodes; ep++) {
      let state = env.reset();
      for (let t = 0; t < maxSteps; t++) {
        const action = this.chooseAction(state);
        const { nextState, reward, done } = env.step(action);
        this.update(state, action, reward, nextState);
        state = nextState;
        if (done) break;
      }
      // optionally decay epsilon
      if (typeof env.onEpisodeEnd === 'function') env.onEpisodeEnd(ep);
    }
  }


  remember(transition) {
    this.replay.push(transition);
    if (this.replay.length > this.replaySize) this.replay.shift();
  }

  sampleBatch() {
    const batch = [];
    const n = Math.min(this.batchSize, this.replay.length);
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * this.replay.length);
      batch.push(this.replay[idx]);
    }
    return batch;
  }

  async trainStep() {
    if (this.replay.length < this.batchSize) return;
    const batch = this.sampleBatch();
    const trainer = (this.model && typeof this.model.train === 'function') ? this.model : (this.targetModel && typeof this.targetModel.train === 'function' ? this.targetModel : null);
    if (trainer) {
      try {
        await trainer.train(batch, { gamma: this.gamma, targetModel: this.targetModel });
      } catch (e) {
        console.warn('model.train failed, falling back to tabular', e);
        for (const tr of batch) {
          try { this.update(tr.state, tr.action, tr.reward, tr.nextState); } catch (err) { /* ignore */ }
        }
      }
    } else {
      // Simple fallback: perform tabular Q-updates for each sampled transition
      for (const tr of batch) {
        try {
          const s = tr.state;
          const a = tr.action;
          const r = typeof tr.reward === 'number' ? tr.reward : 0;
          const ns = tr.nextState;
          this.update(s, a, r, ns);
        } catch (err) { /* ignore */ }
      }
    }

    if (typeof this.decayEpsilon === 'function') {
      this.decayEpsilon();
    }
  }

  setModel(model) {
    this.model = model;
  }

  setTargetModel(model) {
    this.targetModel = model;
  }

  decayEpsilon() {
    if (typeof this.epsilonDecay !== 'number') return;
    const minEpsilon = typeof this.minEpsilon === 'number' ? this.minEpsilon : 0.01;
    this.epsilon = Math.max(minEpsilon, this.epsilon * this.epsilonDecay);
  }
}

// Simple single-hidden-layer DQN model for in-browser training
export class SimpleDQNModel {
  constructor(inputSize, actionSize, hiddenSize = 32, lr = 0.01) {
    this.inputSize = inputSize;
    this.actionSize = actionSize;
    this.hiddenSize = hiddenSize;
    this.lr = lr;
    const rand = () => (Math.random() - 0.5) * 0.1;
    this.W1 = Array.from({ length: hiddenSize }, () => Array.from({ length: inputSize }, rand));
    this.b1 = Array.from({ length: hiddenSize }, () => 0);
    this.W2 = Array.from({ length: actionSize }, () => Array.from({ length: hiddenSize }, rand));
    this.b2 = Array.from({ length: actionSize }, () => 0);
  }

  _toVec(s) {
    if (typeof s === 'string') {
      try { return JSON.parse(s); } catch (e) { return [0, 0]; }
    }
    if (!Array.isArray(s)) return [0, 0];
    return s;
  }

  predict(state) {
    const x = this._toVec(state);
    const h = this.W1.map((row, i) => {
      let sum = this.b1[i] || 0;
      for (let j = 0; j < this.inputSize; j++) sum += row[j] * (x[j] || 0);
      // tanh activation
      return Math.tanh(sum);
    });
    const out = this.W2.map((row, i) => {
      let sum = this.b2[i] || 0;
      for (let j = 0; j < this.hiddenSize; j++) sum += row[j] * h[j];
      return sum; // linear outputs for Q-values
    });
    return out;
  }

  // batch: array of {state, action, reward, nextState, done}
  async train(batch, options = {}) {
    const gamma = options.gamma || 0.99;
    for (const tr of batch) {
      const s = this._toVec(tr.state);
      const ns = this._toVec(tr.nextState);
      const a = typeof tr.action === 'number' ? tr.action : (this._actionIndexOf ? this._actionIndexOf(tr.action) : 0);
      const r = typeof tr.reward === 'number' ? tr.reward : 0;
      const done = !!tr.done;

      // forward
      const h = this.W1.map((row, i) => {
        let sum = this.b1[i] || 0;
        for (let j = 0; j < this.inputSize; j++) sum += row[j] * (s[j] || 0);
        return Math.tanh(sum);
      });
      const qs = this.W2.map((row, i) => {
        let sum = this.b2[i] || 0;
        for (let j = 0; j < this.hiddenSize; j++) sum += row[j] * h[j];
        return sum;
      });

      const nextH = this.W1.map((row, i) => {
        let sum = this.b1[i] || 0;
        for (let j = 0; j < this.inputSize; j++) sum += row[j] * (ns[j] || 0);
        return Math.tanh(sum);
      });
      const nextQs = this.W2.map((row, i) => {
        let sum = this.b2[i] || 0;
        for (let j = 0; j < this.hiddenSize; j++) sum += row[j] * nextH[j];
        return sum;
      });

      const target = r + (done ? 0 : gamma * Math.max(...nextQs));

      // compute gradients (MSE loss on single output)
      const gradOut = Array.from({ length: this.actionSize }, () => 0);
      gradOut[a] = 2 * (qs[a] - target);

      // update W2 and b2
      for (let i = 0; i < this.actionSize; i++) {
        for (let j = 0; j < this.hiddenSize; j++) {
          this.W2[i][j] -= this.lr * gradOut[i] * h[j];
        }
        this.b2[i] -= this.lr * gradOut[i];
      }

      // backprop into hidden layer
      const gradHidden = Array.from({ length: this.hiddenSize }, () => 0);
      for (let j = 0; j < this.hiddenSize; j++) {
        let sum = 0;
        for (let i = 0; i < this.actionSize; i++) sum += gradOut[i] * this.W2[i][j];
        // derivative tanh' = 1 - h^2
        gradHidden[j] = sum * (1 - h[j] * h[j]);
      }

      // update W1 and b1
      for (let j = 0; j < this.hiddenSize; j++) {
        for (let k = 0; k < this.inputSize; k++) {
          this.W1[j][k] -= this.lr * gradHidden[j] * (s[k] || 0);
        }
        this.b1[j] -= this.lr * gradHidden[j];
      }
    }
  }

  toJSON() {
    return {
      inputSize: this.inputSize,
      actionSize: this.actionSize,
      hiddenSize: this.hiddenSize,
      lr: this.lr,
      W1: this.W1,
      b1: this.b1,
      W2: this.W2,
      b2: this.b2,
      actionList: this.actionList || []
    };
  }

  static fromJSON(obj) {
    const m = new SimpleDQNModel(obj.inputSize, obj.actionSize, obj.hiddenSize, obj.lr);
    m.W1 = obj.W1; m.b1 = obj.b1; m.W2 = obj.W2; m.b2 = obj.b2;
    if (Array.isArray(obj.actionList) && obj.actionList.length) m.setActionMap(obj.actionList);
    return m;
  }

  clone() {
    const copy = SimpleDQNModel.fromJSON(this.toJSON());
    if (Array.isArray(this.actionList) && this.actionList.length) copy.setActionMap(this.actionList);
    return copy;
  }

  // optional helper to map action names to indices
  setActionMap(actionList) {
    this.actionList = Array.isArray(actionList) ? actionList.slice() : [];
    this._actionMap = {};
    this.actionList.forEach((a, i) => this._actionMap[a] = i);
    this._actionIndexOf = (act) => typeof act === 'number' ? act : (this._actionMap[act] !== undefined ? this._actionMap[act] : 0);
  }
}
