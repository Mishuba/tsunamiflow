export class TfAtomics {
    constructor() {
        if (!window.SharedArrayBuffer || !window.Atomics) {
            console.warn("Atomics API or SharedArrayBuffer not supported");
            this.supported = false;
            this.buffer = null;
            this.view = null;
            return;
        }
        this.supported = true;
        this.buffer = null;
        this.view = null;
    }

    create(size = 1024) {
        if (!this.supported) return;
        this.buffer = new SharedArrayBuffer(size);
        this.view = new Int32Array(this.buffer);
        console.log("SharedArrayBuffer for Atomics created with size", size);
    }

    load(index = 0) {
        if (!this.view) return null;
        return Atomics.load(this.view, index);
    }

    store(index = 0, value = 0) {
        if (!this.view) return;
        Atomics.store(this.view, index, value);
    }

    add(index = 0, value = 0) {
        if (!this.view) return null;
        return Atomics.add(this.view, index, value);
    }

    sub(index = 0, value = 0) {
        if (!this.view) return null;
        return Atomics.sub(this.view, index, value);
    }

    wait(index = 0, value = 0, timeout = Infinity) {
        if (!this.view) return;
        return Atomics.wait(this.view, index, value, timeout);
    }

    notify(index = 0, count = 1) {
        if (!this.view) return;
        return Atomics.notify(this.view, index, count);
    }
}