export class TfVideoEncoder {
    constructor() {
        this.supported = 'VideoEncoder' in window;
        this.encoder = null;
        this.output = null;
        if (!this.supported) console.warn("VideoEncoder API not supported");
    }

    init(config = { codec: 'vp8', width: 640, height: 480, framerate: 30 }) {
        if (!this.supported) return;
        this.encoder = new VideoEncoder({
            output: (chunk) => {
                this.output = chunk;
            },
            error: (err) => console.error("VideoEncoder error:", err)
        });
        this.encoder.configure(config);
    }

    encode(frame) {
        if (!this.encoder || !frame) return;
        try {
            this.encoder.encode(frame);
        } catch (err) {
            console.error("VideoEncoder encode failed:", err);
        }
    }

    flush() {
        if (!this.encoder) return;
        return this.encoder.flush();
    }

    close() {
        if (!this.encoder) return;
        this.encoder.close();
        this.encoder = null;
    }
}