export class TfEffects {
    constructor() {
        this.Tfhex;
        this.rgb;
        this.chromaKeyColorWebcam = { r: 0, g: 255, b: 0 };
        this.frameSkipCount = 2;
        this.frameCounter = 0;
        this.useChromaKey = false;
        this.visualizatorController;
        this.webcamCanvas = document.createElement("canvas");
        this.webcamCtx = this.webcamCanvas.getContext("2d");
        this.backgroundVideo = null;
        this.backgroundImg = null;
    }

    UploadImage(e) {
        const file = e.target.files[0];
        if (file) {
            this.backgroundImg = new Image();
            this.backgroundImg.src = URL.createObjectURL(file);
        }
    }

    RemoveImage(ctx, canvas_width, canvas_height) {
        this.backgroundImg = null;
        ctx.clearRect(0, 0, canvas_width, canvas_height);
    }

    UseImage(ctx, w, h, corner = false) {
        if (corner) {
            const logoW = w / 4;
            const logoH = h / 4;
            ctx.drawImage(this.backgroundImg, w - logoW - 10, 10, logoW, logoH);
        } else {
            ctx.drawImage(this.backgroundImg, 0, 0, w, h);
        }
    }

    UploadVideo(e) {
        const file = e.target.files[0];
        if (file) {
            this.backgroundVideo = document.createElement("video");
            this.backgroundVideo.src = URL.createObjectURL(file);
            this.backgroundVideo.muted = true;
            this.backgroundVideo.loop = true;
            this.backgroundVideo.playsInline = true;

            this.backgroundVideo.oncanplay = () => {
                this.backgroundVideo.play().catch(() => {});
            };

            this.backgroundVideo.load();
        }
    }

    RemoveVideo(ctx, canvas_width, canvas_height) {
        if (this.backgroundVideo) {
            this.backgroundVideo.pause();
            this.backgroundVideo.currentTime = 0;
            this.backgroundVideo = null;
            ctx.clearRect(0, 0, canvas_width, canvas_height);
        }
    }

    UseVideo(ctx, w, h) {
        if (this.backgroundVideo) ctx.drawImage(this.backgroundVideo, 0, 0, w, h);
    }

    update(p, volume, baseRadius, canvas) {
        p.radius = baseRadius + volume / 80;
        p.x += p.dx;
        p.y += p.dy;

        if (p.x + p.radius > canvas.width || p.x - p.radius < 0) p.dx = -p.dx;
        if (p.y + p.radius > canvas.height || p.y - p.radius < 0) p.dy = -p.dy;
    }

    draw(ctx, p) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.restore();
    }

    tfParticles(x, y, dx, dy, radius, color) {
        return { x, y, dx, dy, radius, color };
    }

    particle(canvas, particles) {
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const dx = (Math.random() - 0.5) * 0.5;
            const dy = (Math.random() - 0.5) * 0.5;
            const radius = Math.random() * 0.5 + 0.2;
            const color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, 0.8)`;
            particles.push(this.tfParticles(x, y, dx, dy, radius, color));
        }
    }

    hereDude(canvas, ctx, analyser, dataArray, bufferLength, baseRadius, particles) {
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "rgb(10, 10, 30)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let CtxTotal = 0;
        for (let i = 0; i < dataArray.length; i++) {
            CtxTotal += dataArray[i];
        }
        const averageVolume = CtxTotal / dataArray.length;

        for (let i = 0; i < particles.length; i++) {
            this.update(particles[i], averageVolume, baseRadius, canvas);
            this.draw(ctx, particles[i]);
        }

        const barWidth = canvas.width / bufferLength;
        let CtxX = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i];
            const CtxR = barHeight + 25 * (i / bufferLength);
            const CtxG = 250 * (i / bufferLength);
            const CtxB = 50;
            ctx.fillStyle = `rgb(${CtxR}, ${CtxG}, ${CtxB})`;
            ctx.fillRect(CtxX, canvas.height - barHeight, barWidth, barHeight);
            CtxX += barWidth + 1;
        }

        this.visualizatorController = requestAnimationFrame(() => {
            this.hereDude(canvas, ctx, analyser, dataArray, bufferLength, baseRadius, particles);
        });
    }

    async drawingFrame(vidCanv, TfWebcam) {
        const ctx = vidCanv.getContext("2d");
        const w = 600;
        const h = 480;

        vidCanv.width = w;
        vidCanv.height = h;
        ctx.clearRect(0, 0, w, h);

        // Draw background
        if (this.backgroundVideo) {
            this.UseVideo(ctx, w, h);
            if (this.backgroundImg) this.UseImage(ctx, w, h, true); // corner logo
        } else if (this.backgroundImg) {
            this.UseImage(ctx, w, h);
        }

        // Capture webcam
        const imageCapture = new ImageCapture(TfWebcam);
        const bitmap = await imageCapture.grabFrame();

        // Draw to offscreen for chroma key
        this.webcamCanvas.width = w;
        this.webcamCanvas.height = h;
        this.webcamCtx.drawImage(bitmap, 0, 0, w, h);

        if (this.useChromaKey) {
            const frame = this.webcamCtx.getImageData(0, 0, w, h);
            const processed = this.webcam(frame);
            this.webcamCtx.putImageData(processed, 0, 0);
        }

        // Composite webcam over background
        ctx.drawImage(this.webcamCanvas, 0, 0, w, h);
    }

    setChromaHex(hex) {
        this.rgb = parseInt(hex.slice(1), 16);
        this.chromaKeyColorWebcam.r = (this.rgb >> 16) & 255;
        this.chromaKeyColorWebcam.g = (this.rgb >> 8) & 255;
        this.chromaKeyColorWebcam.b = this.rgb & 255;
    }

    ColorPickerChromaKey(chroma) {
        this.Tfhex = chroma.value;
        this.setChromaHex(this.Tfhex);
        this.useChromaKey = true;
    }

    disableChromaKey() {
        this.frameCounter = 0;
        this.useChromaKey = false;
    }

    webcam(frameData) {
        const chromaData = frameData.data;
        const key = this.chromaKeyColorWebcam;

        for (let i = 0; i < chromaData.length; i += 4) {
            const r = chromaData[i], g = chromaData[i + 1], b = chromaData[i + 2];
            const diff = Math.abs(r - key.r) + Math.abs(g - key.g) + Math.abs(b - key.b);
            if (diff < 120) chromaData[i + 3] = 255 - Math.min(diff, 120) / 120 * 255;
        }
        return frameData;
    }
}
