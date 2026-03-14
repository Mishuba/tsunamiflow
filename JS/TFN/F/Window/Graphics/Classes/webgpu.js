export class TfWebGPU {
    constructor(canvas) {
        if (!canvas) throw new Error("Canvas element is required");
        this.canvas = canvas;
        this.adapter = null;
        this.device = null;
        this.context = null;
        this.format = "bgra8unorm";
        this.isReady = false;
    }

    async init() {
        if (!navigator.gpu) {
            console.error("WebGPU not supported in this browser");
            return;
        }

        try {
            this.adapter = await navigator.gpu.requestAdapter();
            if (!this.adapter) throw new Error("Failed to get GPU adapter");

            this.device = await this.adapter.requestDevice();
            this.context = this.canvas.getContext("webgpu");
            this.context.configure({
                device: this.device,
                format: this.format,
                alphaMode: "opaque"
            });

            this.isReady = true;
            console.log("WebGPU initialized");
        } catch (err) {
            console.error("WebGPU init failed:", err);
        }
    }

    resize(width, height) {
        if (!this.isReady) return;
        this.canvas.width = width;
        this.canvas.height = height;
    }

    createBuffer(data, usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST) {
        if (!this.isReady) return null;
        const buffer = this.device.createBuffer({
            size: ((data.byteLength + 3) & ~3),
            usage,
            mappedAtCreation: true
        });
        const mapping = buffer.getMappedRange();
        new data.constructor(mapping).set(data);
        buffer.unmap();
        return buffer;
    }

    clear(color = [0, 0, 0, 1]) {
        if (!this.isReady) return;
        const encoder = this.device.createCommandEncoder();
        const textureView = this.context.getCurrentTexture().createView();
        const pass = encoder.beginRenderPass({
            colorAttachments: [{
                view: textureView,
                clearValue: { r: color[0], g: color[1], b: color[2], a: color[3] },
                loadOp: "clear",
                storeOp: "store"
            }]
        });
        pass.end();
        this.device.queue.submit([encoder.finish()]);
    }
}