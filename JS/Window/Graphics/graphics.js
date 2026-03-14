// TfGraphics.js
import { TfCanvas } from './TfCanvas.js';
import { TfWebGL } from './TfWebGL.js';
import { TfWebGL2 } from './TfWebGL2.js';
import { TfWebGPU } from './TfWebGPU.js';

export class TfGraphics {
    constructor(canvas) {
        if (!canvas) throw new Error("Canvas element is required");

        this.canvas = canvas;
        this.backends = {
            canvas2d: new TfCanvas(canvas, "2d"),
            webgl: new TfWebGL(canvas),
            webgl2: new TfWebGL2(canvas),
            webgpu: new TfWebGPU(canvas)
        };
        this.activeBackend = null;
    }

    // Initialize a specific backend
    async init(backend) {
        if (!this.backends[backend]) throw new Error(`Backend "${backend}" not available`);

        const engine = this.backends[backend];

        if (backend === "webgpu") await engine.init();
        else engine.init();

        this.activeBackend = backend;
        console.log(`${backend} initialized`);
        return engine;
    }

    // Automatically select the best available backend
    async initBest() {
        const order = ["webgpu", "webgl2", "webgl", "canvas2d"];

        for (let backend of order) {
            try {
                const engine = this.backends[backend];
                if (backend === "webgpu") {
                    await engine.init();
                } else {
                    engine.init();
                }

                // Check if backend is ready
                if (engine.isReady) {
                    this.activeBackend = backend;
                    console.log(`Auto-selected backend: ${backend}`);
                    return engine;
                }
            } catch {
                // Ignore errors and try the next backend
                continue;
            }
        }

        throw new Error("No supported graphics backend found");
    }

    // Get the active backend instance
    getActiveBackend() {
        if (!this.activeBackend) throw new Error("No backend initialized yet");
        return this.backends[this.activeBackend];
    }

    // Get a specific backend instance directly
    getBackend(backend) {
        if (!this.backends[backend]) throw new Error(`Backend "${backend}" not available`);
        return this.backends[backend];
    }
}