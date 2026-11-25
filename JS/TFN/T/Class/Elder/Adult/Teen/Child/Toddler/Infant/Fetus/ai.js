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
