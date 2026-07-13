import { AiInterface, SimpleDQNModel } from './T/Class/Elder/Adult/Teen/Child/Toddler/Infant/Fetus/ai.js';

export class AiGameManager {
    constructor(game, options = {}) {
        this.game = game;
        this.agents = [];
        this.spawnInterval = options.spawnInterval || 300; // ticks
        this.lastSpawn = 0;
        this.tick = 0;
        this.maxEnemies = options.maxEnemies || 6;
        this.spawnPoint = options.spawnPoint || { x: 10, y: 10 };
        this.logger = [];

        // manager-level policy to control spawning (tabular small policy)
        this.policy = new AiInterface({ actions: ['spawn_less', 'spawn_more', 'no_change', 'inc_cap', 'dec_cap'], alpha: 0.05, gamma: 0.9, epsilon: 0.1 });
        this.policyStateSize = 1; // will encode enemyCount discretized
    }

    log(...args) { this.logger.push({ t: Date.now(), args }); console.log('[AiGameManager]', ...args); }

    registerAgent(agent) {
        this.agents.push(agent);
        this.log('registered agent', agent.id || '(no-id)');
        return agent;
    }

    addEnemyFromSprite(spriteConfig, options = {}) {
        const sprite = Object.assign({}, spriteConfig);
        // ensure size
        sprite.width = sprite.width || 28;
        sprite.height = sprite.height || 28;
        sprite.x = options.x || this.spawnPoint.x;
        sprite.y = options.y || this.spawnPoint.y;
        sprite.type = 'sprite';

        // register component into game
        this.game.component.enemies = this.game.component.enemies || [];
        this.game.component.enemies.push(sprite);

        const agent = options.agentClass ? new options.agentClass(sprite, this.game, options.agentOptions || {}) : new TabularEnemyAgent(sprite, this.game, options.agentOptions || {});
        return this.registerAgent(agent);
    }

    saveState(key = 'ai_game_state') {
        const agentsDump = this.agents.map(a => {
            const base = { id: a.id || null, q: Array.from((a.ai && a.ai.q) ? a.ai.q.entries() : []) };
            try {
                if (a.ai && a.ai.targetModel && typeof a.ai.targetModel.toJSON === 'function') base.model = a.ai.targetModel.toJSON();
            } catch (e) { /* ignore model serialization errors */ }
            return base;
        });
        const dump = {
            agents: agentsDump,
            policy: Array.from(this.policy.q.entries()),
            meta: { spawnInterval: this.spawnInterval, maxEnemies: this.maxEnemies }
        };
        try { localStorage.setItem(key, JSON.stringify(dump)); this.log('state saved'); } catch (e) { console.warn('saveState failed', e); }
    }

    loadState(key = 'ai_game_state') {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return;
            const dump = JSON.parse(raw);
            if (dump.agents) {
                for (let i = 0; i < dump.agents.length && i < this.agents.length; i++) {
                    try { this.agents[i].ai.q = new Map(dump.agents[i].q || []); } catch (e) { /* ignore */ }
                    // restore model if present and model class available
                    try {
                        if (dump.agents[i].model && typeof dump.agents[i].model === 'object' && typeof SimpleDQNModel === 'function') {
                            const mdl = SimpleDQNModel.fromJSON(dump.agents[i].model);
                            // if agent has actions, set action map
                            if (this.agents[i].actions) mdl.setActionMap(this.agents[i].actions);
                            this.agents[i].ai.setTargetModel(mdl);
                        }
                    } catch (e) { console.warn('could not restore agent model', e); }
                }
            }
            if (dump.policy) this.policy.q = new Map(dump.policy || []);
            if (dump.meta) { this.spawnInterval = dump.meta.spawnInterval || this.spawnInterval; this.maxEnemies = dump.meta.maxEnemies || this.maxEnemies; }
            this.log('state loaded');
        } catch (e) { console.warn('loadState failed', e); }
    }

    // Compute manager policy state (discretize enemy count)
    _policyState() {
        const enemies = (this.game.component.enemies || []).length;
        const bucket = Math.min(5, Math.floor(enemies / Math.max(1, Math.ceil(this.maxEnemies / 5))));
        return `enemies_${bucket}`;
    }

    // Manager-level decision: adjust spawnInterval based on small policy
    _controlSpawnByPolicy() {
        const s = this._policyState();
        const act = this.policy.chooseAction(s);
        switch (act) {
            case 'spawn_less': this.spawnInterval = Math.min(1000, this.spawnInterval + 50); break;
            case 'spawn_more': this.spawnInterval = Math.max(20, this.spawnInterval - 40); break;
            case 'inc_cap': this.maxEnemies = Math.min(50, this.maxEnemies + 1); break;
            case 'dec_cap': this.maxEnemies = Math.max(1, this.maxEnemies - 1); break;
            case 'no_change': default: break;
        }
        // small intrinsic reward: prefer balanced enemy counts
        const enemies = (this.game.component.enemies || []).length;
        const desired = Math.max(1, Math.floor(this.maxEnemies / 3));
        // reward scaled 0..1 where 1 is ideal enemy count
        const reward = 1 - Math.abs(enemies - desired) / Math.max(1, this.maxEnemies);
        const nextS = this._policyState();
        this.policy.update(s, act, reward, nextS);
        this.log('policy fired', act, 'spawnInterval now', this.spawnInterval);
    }

    spawnController() {
        // manager-controlled spawn
        const enemies = this.game.component.enemies || [];
        if (enemies.length >= this.maxEnemies) return;
        const config = {
            color: './Pictures/Games/Sprites/Stickman/Sheets/standingNwalking.png',
            spriteStates: { stand: { frame: 2, loc: [{ y: 0 }, { y: 0 }] } },
            spriteState: 'stand', spriteFrameInterval: 0, dw: 120, dh: 120,
            width: 28, height: 28, x: Math.random() * (this.game.canvas.width - 28), y: Math.random() * (this.game.canvas.height - 28), text: ''
        };
        this.addEnemyFromSprite(config);
    }

    step(dt = 1) {
        this.tick += dt;
        // periodically allow manager policy to adjust spawning frequency
        if (this.tick % 60 === 0) {
            try { this._controlSpawnByPolicy(); } catch (e) { console.warn('policy error', e); }
        }

        // spawn periodically
        if (this.tick - this.lastSpawn > this.spawnInterval) {
            this.spawnController();
            this.lastSpawn = this.tick;
        }

        // step agents
        for (const agent of this.agents) {
            try { agent.step(dt); } catch (e) { console.warn('agent.step error', e); }
        }
    }
}

/** Tabular Enemy Agent (Q-learning) **/
class TabularEnemyAgent {
    constructor(sprite, game, options = {}) {
        this.sprite = sprite;
        this.game = game;
        this.id = options.id || `enemy_${Math.floor(Math.random() * 1e6)}`;
        this.gridSize = options.gridSize || 20; // discretization
        this.actions = options.actions || ['left', 'right', 'up', 'down', 'approach', 'flee', 'idle'];
        this.ai = new AiInterface({ actions: this.actions, alpha: 0.2, gamma: 0.9, epsilon: 0.2 });
        this.playerRef = options.playerRef || (() => this.game.player1 || null);
        this.age = 0;
    }

    _state() {
        const sx = Math.floor((this.sprite.x || 0) / this.gridSize);
        const sy = Math.floor((this.sprite.y || 0) / this.gridSize);
        const player = this.playerRef ? this.playerRef() : null;
        const px = player ? Math.floor((player.x || 0) / this.gridSize) : -1;
        const py = player ? Math.floor((player.y || 0) / this.gridSize) : -1;
        return `${sx}:${sy}|${px}:${py}`;
    }

    _applyAction(action) {
        switch (action) {
            case 'left': this.sprite.x = Math.max(0, this.sprite.x - 2); break;
            case 'right': this.sprite.x = Math.min(this.game.canvas.width - this.sprite.width, this.sprite.x + 2); break;
            case 'up': this.sprite.y = Math.max(0, this.sprite.y - 2); break;
            case 'down': this.sprite.y = Math.min(this.game.canvas.height - this.sprite.height, this.sprite.y + 2); break;
            case 'approach': {
                const p = this.playerRef(); if (p) {
                    const vx = p.x - this.sprite.x, vy = p.y - this.sprite.y; const m = Math.hypot(vx, vy) || 1;
                    this.sprite.x += (vx / m) * 2; this.sprite.y += (vy / m) * 2;
                }
            } break;
            case 'flee': {
                const p = this.playerRef(); if (p) {
                    const vx = this.sprite.x - p.x, vy = this.sprite.y - p.y; const m = Math.hypot(vx, vy) || 1;
                    this.sprite.x += (vx / m) * 3; this.sprite.y += (vy / m) * 3;
                }
            } break;
            case 'idle': default: break;
        }
    }

    _reward() {
        const player = this.playerRef ? this.playerRef() : null;
        if (!player) return 0;
        const dx = Math.abs((this.sprite.x || 0) - (player.x || 0));
        const dy = Math.abs((this.sprite.y || 0) - (player.y || 0));
        const dist = Math.hypot(dx, dy);
        const collision = dx < (this.sprite.width + (player.width || 16)) / 2 && dy < (this.sprite.height + (player.height || 16)) / 2;
        if (collision) return 2; // big positive for touching player
        // reward: approach -> positive when distance decreases, small time penalty
        const prev = this._lastDistance || null; this._lastDistance = dist;
        let r = (200 - dist) / 200; // closer yields higher
        if (prev !== null) {
            if (dist < prev) r += 0.1; else r -= 0.05;
        }
        r -= 0.01; // small living penalty
        return Math.max(-2, Math.min(2, r));
    }

    step(dt = 1) {
        this.age += dt;
        const state = this._state();
        const action = this.ai.chooseAction(state);
        this._applyAction(action);
        // update game visuals
        try { this.game.updateComponent(this.sprite); } catch (e) { /* ignore drawing error */ }
        const reward = this._reward();
        const nextState = this._state();
        this.ai.update(state, action, reward, nextState);
    }
}

/** DQNAgent skeleton: uses AiInterface replay/trainStep hooks **/
class DQNAgent {
    constructor(sprite, game, options = {}) {
        this.sprite = sprite;
        this.game = game;
        this.id = options.id || `dqn_${Math.floor(Math.random() * 1e6)}`;
        this.actions = options.actions || ['left', 'right', 'up', 'down', 'approach', 'flee', 'idle'];
        // reuse AiInterface's replay and trainStep methods when available
        this.ai = new AiInterface({
            actions: this.actions,
            replaySize: options.replaySize || 5000,
            batchSize: options.batchSize || 32,
            gamma: options.gamma || 0.99,
            epsilon: options.epsilon || 0.2,
            minEpsilon: options.minEpsilon || 0.05,
            epsilonDecay: options.epsilonDecay || 0.9997
        });
        this.playerRef = options.playerRef || (() => this.game.player1 || null);
        this.targetSyncInterval = options.targetSyncInterval || 100;
        this.trainStepCount = 0;
        // create a small DQN model and target model
        try {
            const inputSize = options.inputSize || 2;
            const hiddenSize = options.hiddenSize || 32;
            const lr = options.lr || 0.01;
            this.model = new SimpleDQNModel(inputSize, this.actions.length, hiddenSize, lr);
            if (typeof this.model.setActionMap === 'function') this.model.setActionMap(this.actions);
            this.targetModel = this.model.clone();
            this.ai.setModel(this.model);
            this.ai.setTargetModel(this.targetModel);
        } catch (e) { console.warn('DQNAgent model init failed', e); }
    }

    _stateVec() {
        // simple state vector: normalized x,y to [0,1]
        const x = (this.sprite.x || 0) / Math.max(1, this.game.canvas.width);
        const y = (this.sprite.y || 0) / Math.max(1, this.game.canvas.height);
        return [x, y];
    }

    _chooseAction(state) {
        // use epsilon-greedy via AiInterface.chooseAction on stringified state
        return this.ai.chooseAction(JSON.stringify(state));
    }

    step(dt = 1) {
        const state = this._stateVec();
        const action = this._chooseAction(state);
        // apply
        switch (action) {
            case 'left': this.sprite.x = Math.max(0, this.sprite.x - 3); break;
            case 'right': this.sprite.x = Math.min(this.game.canvas.width - this.sprite.width, this.sprite.x + 3); break;
            case 'up': this.sprite.y = Math.max(0, this.sprite.y - 3); break;
            case 'down': this.sprite.y = Math.min(this.game.canvas.height - this.sprite.height, this.sprite.y + 3); break;
            case 'approach': {
                const p = this.playerRef(); if (p) {
                    const vx = p.x - this.sprite.x, vy = p.y - this.sprite.y; const m = Math.hypot(vx, vy) || 1;
                    this.sprite.x += (vx / m) * 4; this.sprite.y += (vy / m) * 4;
                }
            } break;
            case 'flee': {
                const p = this.playerRef(); if (p) {
                    const vx = this.sprite.x - p.x, vy = this.sprite.y - p.y; const m = Math.hypot(vx, vy) || 1;
                    this.sprite.x += (vx / m) * 5; this.sprite.y += (vy / m) * 5;
                }
            } break;
            case 'idle': default: break;
        }
        // visual
        try { this.game.updateComponent(this.sprite); } catch (e) { }
        const nextState = this._stateVec();
        const player = this.playerRef();
        const dx = player ? Math.abs(this.sprite.x - player.x) : 0;
        const dy = player ? Math.abs(this.sprite.y - player.y) : 0;
        const dist = Math.hypot(dx, dy);
        const collision = dx < (this.sprite.width + (player && player.width || 16)) / 2 && dy < (this.sprite.height + (player && player.height || 16)) / 2;
        if (collision) return 2;
        // shaped reward similar to tabular agent
        this._lastDistance = this._lastDistance || null;
        const prev = this._lastDistance; this._lastDistance = dist;
        let r = (200 - dist) / 200;
        if (prev !== null) { if (dist < prev) r += 0.1; else r -= 0.05; }
        r -= 0.01;
        const reward = Math.max(-2, Math.min(2, r));
        // remember and train
        this.ai.remember({ state: JSON.stringify(state), action, reward, nextState: JSON.stringify(nextState), done: false });
        this.ai.trainStep();
        this.trainStepCount += 1;
        if (this.trainStepCount > 0 && this.trainStepCount % this.targetSyncInterval === 0) {
            this.syncTargetNetwork();
        }
    }

    syncTargetNetwork() {
        if (this.model && typeof this.model.clone === 'function') {
            this.targetModel = this.model.clone();
            if (typeof this.targetModel.setActionMap === 'function') this.targetModel.setActionMap(this.actions);
            this.ai.setTargetModel(this.targetModel);
        }
    }
}
