import { TsunamiFlowAudio } from "./Adult/Noise.js";
export class Flow extends TsunamiFlowAudio {
    _wired = false;
    _radioBound = false;
    WeLive = null;
    hls = null;
    baseRadius = 2;
    particles = [];
    constructor(options = {}) {
        super(options);
    }
    update(p, fftValue, volume, baseRadius) {

        const energy = (fftValue / 255) * volume * 50;

        p.radius = baseRadius + energy;

        p.dx += (Math.random() - 0.5) * energy * 0.05;
        p.dy += (Math.random() - 0.5) * energy * 0.05;

        p.dx *= 0.97;
        p.dy *= 0.97;

        p.x += p.dx;
        p.y += p.dy;
    }
    draw(p) {
        this.canvasctx.save();
        this.canvasctx.beginPath();
        this.canvasctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
        this.canvasctx.fillStyle = p.color;
        this.canvasctx.shadowColor = p.color;
        this.canvasctx.shadowBlur = 20;
        this.canvasctx.fill();
        this.canvasctx.restore();
    }
    tfParticles(x, y, dx, dy, radius, color) {
        return { x, y, dx, dy, radius, color };
    }
    particle(particles) {
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const dx = (Math.random() - 0.5) * 0.5;
            const dy = (Math.random() - 0.5) * 0.5;
            const radius = Math.random() * 0.5 + 0.2;
            const color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, 0.8)`;
            particles.push(this.tfParticles(x, y, dx, dy, radius, color));
        }
    }
    RadioVisualizer(dataArray, baseRadius, particles, volume) {
        this.canvasctx.fillStyle = "rgb(10, 10, 30)";
        this.canvasctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.canvasctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < particles.length; i++) {
            const fftValue = dataArray[i % dataArray.length];
            this.update(particles[i], fftValue, volume, baseRadius);
            this.draw(particles[i]);
        }

        const barWidth = this.canvas.width / dataArray.length;
        let CtxX = 0;

        for (let i = 0; i < dataArray.length; i++) {
            const barHeight = dataArray[i] * (volume);
            const CtxR = dataArray[i] + 100;
            const CtxG = i * 2;
            const CtxB = 255;
            this.canvasctx.fillStyle = `rgb(${CtxR}, ${CtxG}, ${CtxB})`;
            this.canvasctx.fillRect(CtxX, this.canvas.height - barHeight, barWidth, barHeight);
            CtxX += barWidth + 1;
        }
    }
    startVisualizerLoop() {

    if (!this.AudioElement) return;

    const id = this.AudioElement.id;

    // Create once
    if (!this.TfSoundsContextBufferLength[id]) {
        this.TfSoundsContextBufferLength[id] =
            this.TfSoundAnalyser[id].frequencyBinCount;
    }

    if (!this.TfSoundsContextDataArray[id]) {
        this.TfSoundsContextDataArray[id] =
            new Uint8Array(
                this.TfSoundsContextBufferLength[id] / 4
            );
    }

    const dataArray = this.TfSoundsContextDataArray[id];

    const loop = () => {

        // Keep animation frame alive
        this.visualizerFrame = requestAnimationFrame(loop);

        if (
            !this.AudioElement ||
            this.AudioElement.paused ||
            this.AudioElement.ended
        ) {
            return;
        }

        this.TfSoundAnalyser[id].getByteFrequencyData(dataArray);

        this.RadioVisualizer(
            dataArray,
            this.baseRadius,
            this.particles,
            this.AudioElement.volume
        );
    };

    cancelAnimationFrame(this.visualizerFrame);
    loop();
}

stopVisualizerLoop() {
    if (this.visualizerFrame) {
        cancelAnimationFrame(this.visualizerFrame);
        this.visualizerFrame = null;
    }
}
}