export class TfSharedArrayBuffer {
    constructor(size = 1024) {
        if (!window.SharedArrayBuffer) {
            console.warn("SharedArrayBuffer not supported");
            this.buffer = null;
            this.view = null;
            return;
        }

        this.buffer = new SharedArrayBuffer(size);
        this.view = new Uint8Array(this.buffer);
        console.log("SharedArrayBuffer created with size", size);
    }

    write(index = 0, value = 0) {
        if (!this.view) return;
        this.view[index] = value;
    }

    read(index = 0) {
        if (!this.view) return null;
        return this.view[index];
    }

    fill(value = 0) {
        if (!this.view) return;
        this.view.fill(value);
    }

    slice(start = 0, end = this.view.length) {
        if (!this.view) return null;
        return this.view.slice(start, end);
    }

    getBuffer() {
        return this.buffer;
    }
}