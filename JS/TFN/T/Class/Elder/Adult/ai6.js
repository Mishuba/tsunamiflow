import { AiAdvance } from "./Teen/ai5"


export class AiWizard extends AiAdvance {

    constructor() {

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
}