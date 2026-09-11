// Example: using AiInterface (ai.js) with the sprite class (sprite.js)
// Adjust import paths if your project uses a different folder layout.
import { AiInterface } from '../T/Class/Elder/Adult/Teen/Child/Toddler/Infant/Fetus/ai.js';
import { letsDoIt } from '../N/Games/sprite.js';

// Helper: convert ImageData to grayscale 2D array
function imageDataToGray2D(imageData) {
    const { data, width, height } = imageData;
    const out = Array.from({ length: height }, () => Array(width).fill(0));
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const r = data[i], g = data[i + 1], b = data[i + 2];
            const gray = Math.round(0.2989 * r + 0.5870 * g + 0.1140 * b);
            out[y][x] = gray / 255; // normalize 0..1
        }
    }
    return out;
}

// Create game and a simple sprite "data" object compatible with updateComponent
const game = new letsDoIt('ExampleGame', null);
// append canvas to document so drawing works
document.body.appendChild(game.canvas);
game.canvas.width = 240; game.canvas.height = 240;

// Minimal sprite frame/state structure used by SpritePosition / updateComponent
const spriteData = {
    type: 'sprite',
    color: './Pictures/Games/Sprites/Stickman/Sheets/standingNwalking.png', // image src
    spriteStates: { stand: { frame: 2, loc: [{ y: 0 }, { y: 0 }], name: { x: 0, y: 0 } }, walk: { frame: 2, loc: [{ y: 120 }, { y: 120 }], name: { x: 0, y: 120 } } },
    spriteState: 'stand',
    spriteFrameInterval: 0,
    dw: 120, dh: 120, // source frame size inside sheet
    width: 64, height: 64, // drawn size on canvas
    x: 88, y: 88,
    text: '', textSize: '12px', textStyle: 'Consolas', textColor: '#fff', textWidth: 10, textHeight: 10
};

// 1) Draw sprite frame to canvas and extract pixels -> pass to AiInterface CNN
async function exampleCNN() {
    // ensure the image is loaded
    const img = new Image();
    img.src = spriteData.color;
    await new Promise(r => img.onload = r);

    // draw using sprite API
    spriteData.color = img.src; // game.updateComponent will set image.src
    game.updateComponent(spriteData);

    // read pixels
    const ctx = game.context;
    const imageData = ctx.getImageData(0, 0, game.canvas.width, game.canvas.height);
    const gray2D = imageDataToGray2D(imageData);

    // Use AiInterface conv and pool
    const kernel = [[[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]]]; // simple edge kernel (depth 3)
    const conv = AiInterface.convolve(gray2D, kernel, { stride: 1, padding: 1 });
    const relu = AiInterface.reluMap(conv);
    const pooled = AiInterface.pool(relu, 2, 2, 'max');
    console.log('CNN output (pooled shape):', pooled.length, pooled[0].length);
}

// 2) Use static math helpers and attention on small vectors
function exampleMathAndAttention() {
    const A = [[1, 2, 3]]; // 1x3
    const B = [[0.5], [0.1], [0.2]]; // 3x1
    console.log('dot:', AiInterface.dot(A, B));

    const Q = [[0.2, 0.5]];
    const K = [[0.1, 0.3]];
    const V = [[1, 0.0]];
    const att = AiInterface.calculate(Q, K, V, null, { scale: true, returnWeights: true });
    console.log('attention out:', att.output, 'weights:', att.weights);
}

// 3) Small neural net usage: build, predict
function exampleNN() {
    const ai = new AiInterface();
    ai.neuralnetwork(8, 4, 8); // hidden=8, output=4, inputsPerNeuron=8
    const input = Array.from({ length: 8 }, () => Math.random());
    const out = ai.predict(input);
    console.log('network predict:', out);
}

// 4) Sequence models: get simple feature vectors per frame and run through RNN/LSTM/GRU
function frameToVector(imageData, length = 16) {
    // very small feature: sample averaged blocks
    const h = imageData.length, w = imageData[0].length;
    const vec = [];
    for (let i = 0; i < length; i++) {
        const sx = Math.floor((i % 4) * (w / 4));
        const sy = Math.floor(Math.floor(i / 4) * (h / 4));
        let sum = 0, count = 0;
        for (let y = sy; y < sy + Math.floor(h / 4) && y < h; y++) for (let x = sx; x < sx + Math.floor(w / 4) && x < w; x++) { sum += imageData[y][x]; count++; }
        vec.push(count ? sum / count : 0);
    }
    return vec;
}

async function exampleSequenceModels() {
    // draw twice with different spriteState to simulate frames
    spriteData.spriteState = 'stand'; game.updateComponent(spriteData);
    const im1 = imageDataToGray2D(game.context.getImageData(0, 0, game.canvas.width, game.canvas.height));
    spriteData.spriteState = 'walk'; game.updateComponent(spriteData);
    const im2 = imageDataToGray2D(game.context.getImageData(0, 0, game.canvas.width, game.canvas.height));

    const v1 = frameToVector(im1, 16);
    const v2 = frameToVector(im2, 16);

    const ai = new AiInterface();
    ai.RNNCell(16, 8, 4);
    ai.resetStateRNNCell();
    console.log('RNN step1:', ai.forwardRNNCell(v1));
    console.log('RNN step2:', ai.forwardRNNCell(v2));

    ai.LSTMCell(16, 8, 4);
    ai.resetStateLSTMCell();
    console.log('LSTM step1:', ai.forwardLSTMCell(v1));
    console.log('LSTM step2:', ai.forwardLSTMCell(v2));

    ai.GRUCell(16, 8, 4);
    ai.resetStateGRUCell();
    console.log('GRU step1:', ai.forwardGRUCell(v1));
    console.log('GRU step2:', ai.forwardGRUCell(v2));
}

// 5) Knowledge graph / logic usage (AiInterface exposes these methods)
function exampleKGandLogic() {
    const ai = new AiInterface();
    ai.addNode('player', { team: 'blue' });
    ai.addNode('enemy', { team: 'red' });
    ai.connect('player', 'enemy', 'hostile');
    console.log('neighbors of player:', ai.getNeighbors('player'));

    ai.addFact('near(enemy)');
    ai.addFact('lowHealth');
    ai.addRule('flee', ['near(enemy)', 'lowHealth'], 'shouldFlee');
    const res = ai.infer();
    console.log('inferred facts:', res.facts);
    console.log('prove shouldFlee:', ai.prove('shouldFlee'));
}

// 6) Q-learning example (tabular) using sprite position discretized
function makeEnvFromSprite(game, sprite) {
    // discrete grid environment wrapper
    return {
        reset() {
            sprite.x = Math.floor(game.canvas.width / 2);
            sprite.y = Math.floor(game.canvas.height / 2);
            return `${Math.floor(sprite.x / 20)}:${Math.floor(sprite.y / 20)}`; // discretize
        },
        step(action) {
            // action: 'left'|'right'|'up'|'down'
            switch (action) {
                case 'left': sprite.x = Math.max(0, sprite.x - 5); break;
                case 'right': sprite.x = Math.min(game.canvas.width - sprite.width, sprite.x + 5); break;
                case 'up': sprite.y = Math.max(0, sprite.y - 5); break;
                case 'down': sprite.y = Math.min(game.canvas.height - sprite.height, sprite.y + 5); break;
            }
            game.updateComponent(sprite);
            const state = `${Math.floor(sprite.x / 20)}:${Math.floor(sprite.y / 20)}`;
            const reward = (sprite.x > game.canvas.width - sprite.width - 1) ? 1 : 0; // reward for reaching right edge
            const done = reward === 1;
            return { nextState: state, reward, done };
        },
        onEpisodeEnd(ep) { /* decay epsilon if using AiInterface.epsilon */ }
    };
}

async function exampleQLearning() {
    const ai = new AiInterface({ actions: ['left', 'right', 'up', 'down'], alpha: 0.2, gamma: 0.9, epsilon: 0.2 });
    // Prepare sprite as "agent"
    const playerSprite = Object.assign({}, spriteData); // shallow copy
    playerSprite.x = 10; playerSprite.y = 10;
    // attach width/height
    playerSprite.width = 24; playerSprite.height = 24;
    const env = makeEnvFromSprite(game, playerSprite);

    // run a few episodes
    for (let ep = 0; ep < 20; ep++) {
        let state = env.reset();
        for (let t = 0; t < 100; t++) {
            const action = ai.chooseAction(state);
            const { nextState, reward, done } = env.step(action);
            ai.update(state, action, reward, nextState);
            state = nextState;
            if (done) break;
        }
    }
    console.log('Q-table sample:', Array.from(ai.q.entries()).slice(0, 5));
}

// Run the examples sequentially
(async function runAll() {
    await exampleCNN();
    exampleMathAndAttention();
    exampleNN();
    await exampleSequenceModels();
    exampleKGandLogic();
    await exampleQLearning();
    console.log('All examples done.');
})();
