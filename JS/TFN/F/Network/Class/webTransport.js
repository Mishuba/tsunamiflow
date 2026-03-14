export class TfWebTransport {
    constructor(url = null) {
        this.url = url;
        this.transport = null;
        this.listeners = {};
    }

    async connect() {
        if (!('WebTransport' in window)) {
            console.error("WebTransport not supported in this browser");
            return;
        }

        try {
            this.transport = new WebTransport(this.url);
            await this.transport.ready;
            console.log("WebTransport ready");
            this.emit("open");

            this.receiveLoop();
        } catch (err) {
            console.error("WebTransport failed:", err);
            this.emit("error", err);
        }
    }

    async receiveLoop() {
        try {
            const reader = this.transport.incomingUnidirectionalStreams.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                this.emit("message", value);
            }
        } catch (err) {
            console.error("WebTransport receive error:", err);
            this.emit("error", err);
        }
    }

    async send(data) {
        if (!this.transport) return;

        const writer = await this.transport.createUnidirectionalStream();
        const streamWriter = writer.getWriter();

        if (data instanceof Blob) {
            const buf = await data.arrayBuffer();
            await streamWriter.write(buf);
        } else if (data instanceof ArrayBuffer) {
            await streamWriter.write(data);
        } else {
            await streamWriter.write(new TextEncoder().encode(data));
        }

        await streamWriter.close();
    }

    emit(event, data) {
        const listeners = this.listeners[event] || [];
        listeners.forEach(fn => fn(data));
    }

    on(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }

    close() {
        if (this.transport) {
            this.transport.close();
            this.transport = null;
            this.emit("close");
        }
    }
}