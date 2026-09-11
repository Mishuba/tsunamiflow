export class TfWebNN {
    constructor() {
        this.supported = 'navigator.ml' in window || 'ML' in window;
        this.context = null;
        if (!this.supported) console.warn("WebNN API not supported");
    }

    async init() {
        if (!this.supported) return;
        try {
            this.context = await navigator.ml.createContext?.() || new ML();
        } catch (err) {
            console.error("WebNN init failed:", err);
        }
    }

    async compile(model) {
        if (!this.context) return null;
        try {
            return await this.context.compile(model);
        } catch (err) {
            console.error("WebNN compile failed:", err);
            return null;
        }
    }

    async run(model, inputs) {
        if (!this.context) return null;
        try {
            return await model.compute(inputs);
        } catch (err) {
            console.error("WebNN run failed:", err);
            return null;
        }
    }
}