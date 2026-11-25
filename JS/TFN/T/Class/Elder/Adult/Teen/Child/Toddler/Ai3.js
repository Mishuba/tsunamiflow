import { AICore } from "./Infant/ai2";


export class AiBasic extends AICore {

    static _dotMatVec(mat, vec) {
        return mat.map(row => row.reduce((s, v, i) => s + v * vec[i], 0));
    }
    static _sigmoidVec(v) {
        return v.map(x => 1 / (1 + Math.exp(-x)));
    }
    static _tanhVec(v) { return v.map(x => Math.tanh(x)); }
    static _reluVec(v) { return v.map(x => Math.max(0, x)); }
    static _softmaxVec(v) { const m = Math.max(...v); const ex = v.map(x => Math.exp(x - m)); const s = ex.reduce((a, b) => a + b, 0) || 1; return ex.map(e => e / s); }

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
    constructor() {

    }
    // forward pipeline: filters is array of kernels for conv layer1, options may include pooling and activation
    // image: 2D (grayscale) or 3D [H][W][C]
    // returns feature maps (or flattened vector if flatten=true)


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


    resetStateRNNCell(value = 0) { this.hidden = Array.from({ length: this.hiddenSize }, () => value); }

    forwardRNNCell(input, hiddenState = null) {
        if (!Array.isArray(input) || input.length !== this.inputSize) throw new Error(`AiInterface.forward: expected input length ${this.inputSize}`);
        const prevH = hiddenState || this.hidden;
        const wx = AiBasic._dotMatVec(this.Wxh, input);
        const wh = AiBasic._dotMatVec(this.Whh, prevH);
        const hRaw = wx.map((v, i) => v + wh[i] + (this.bh[i] || 0));
        let nextH = this.activation === 'tanh' ? AiBasic._tanhVec(hRaw) : this.activation === 'sigmoid' ? AiBasic._sigmoidVec(hRaw) : AiBasic._reluVec(hRaw);
        this.hidden = nextH.slice();
        let output = nextH;
        if (this.outputSize) {
            const yRaw = AiBasic._dotMatVec(this.Why, nextH).map((v, i) => v + (this.by[i] || 0));
            output = this.outputActivation === 'softmax' ? AiBasic._softmaxVec(yRaw) : this.outputActivation === 'sigmoid' ? AiBasic._sigmoidVec(yRaw) : yRaw;
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

        const i = AiBasic._sigmoidVec(AiBasic._dotMatVec(this.Wxi, x).map((v, i) => v + AiBasic._dotMatVec(this.Whi, prevH)[i] + this.bi[i]));
        const f = AiBasic._sigmoidVec(AiBasic._dotMatVec(this.Wxf, x).map((v, i) => v + AiBasic._dotMatVec(this.Whf, prevH)[i] + this.bf[i]));
        const g = AiBasic._tanhVec(AiBasic._dotMatVec(this.Wxc, x).map((v, i) => v + AiBasic._dotMatVec(this.Whc, prevH)[i] + this.bc[i]));
        const o = AiBasic._sigmoidVec(AiBasic._dotMatVec(this.Wxo, x).map((v, i) => v + AiBasic._dotMatVec(this.Who, prevH)[i] + this.bo[i]));

        const nextC = prevC.map((cv, i) => f[i] * cv + (i[i] * g[i]));
        const nextH = nextC.map((cv, i) => o[i] * Math.tanh(cv));

        this.h = nextH.slice(); this.c = nextC.slice();

        let output = nextH;
        if (this.outputSize) {
            const yRaw = AiBasic._dotMatVec(this.Why, nextH).map((v, i) => v + this.by[i]);
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
        const z = AiBasic._sigmoidVec(AiBasic._dotMatVec(this.Wxz, x).map((v, i) => v + AiBasic._dotMatVec(this.Whz, prevH)[i] + this.bz[i]));
        const r = AiBasic._sigmoidVec(AiBasic._dotMatVec(this.Wrz, x).map((v, i) => v + AiBasic._dotMatVec(this.Whr, prevH)[i] + this.br[i]));
        const hhRaw = AiBasic._dotMatVec(this.Wxh, x).map((v, i) => v + AiBasic._dotMatVec(this.Whh, prevH.map((hv, ii) => hv * r[ii]))[i] + this.bh[i]);
        const hh = hhRaw.map(x => Math.tanh(x));
        const nextH = prevH.map((pv, i) => (1 - z[i]) * pv + z[i] * hh[i]);
        this.h = nextH.slice();
        let output = nextH;
        if (this.outputSize) { const yRaw = AiBasic._dotMatVec(this.Why, nextH).map((v, i) => v + this.by[i]); output = yRaw; }
        return { nextState: { h: this.h.slice() }, output };
    }
}