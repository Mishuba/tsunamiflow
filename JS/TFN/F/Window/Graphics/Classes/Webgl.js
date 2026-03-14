export class TfWebGL {
    constructor(canvas) {
        if (!canvas) throw new Error("Canvas element is required");
        this.canvas = canvas;
        this.gl = null;
        this.isReady = false;
    }

    init() {
        try {
            this.gl = this.canvas.getContext("webgl");
            if (!this.gl) throw new Error("WebGL not supported");
            this.isReady = true;
            console.log("WebGL initialized");
        } catch (err) {
            console.error("WebGL init failed:", err);
            this.gl = null;
        }
    }

    clear(r = 0, g = 0, b = 0, a = 1) {
        if (!this.isReady) return;
        this.gl.clearColor(r, g, b, a);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    resize(width, height) {
        if (!this.isReady) return;
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(0, 0, width, height);
    }

    createShader(type, source) {
        if (!this.isReady) return null;
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error("Shader compile error:", this.gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    createProgram(vertexShader, fragmentShader) {
        if (!this.isReady) return null;
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error("Program link error:", this.gl.getProgramInfoLog(program));
            return null;
        }
        return program;
    }
}