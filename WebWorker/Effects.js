export class TfEffects {
    constructor() {
        this.Tfhex;
        this.rgb;
        this.chromaKeyColorWebcam = {
            r: 0,
            g: 255,
            b: 0
        };
        this.chromaFrame;
        this.chromaData;
        this.frameSkipCount = 2;
        this.frameCounter = 0;
        this.useChromaKey = false;
        this.visualizatorController;
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
    UploadVideo(e) {
        const file = e.target.files[0];
        if (file) {
            this.backgroundVideo = document.createElement('video');
            this.backgroundVideo.src = URL.createObjectURL(file);
            this.backgroundVideo.muted = true; // Mute the video
            this.backgroundVideo.loop = true; // Loop the video
            this.backgroundVideo.load();
        }
    }
    RemoveVideo(ctx, canvas_height, canvas_width) {
        console.log("Placeholder for remove video");
        if (this.backgroundVideo) {
            this.backgroundVideo.pause();
            this.backgroundVideo.currentTime = 0; // Reset the video to the beginning
            this.backgroundVideo = null; // Clear the video reference
            ctx.clearRect(0, 0, canvas_width, canvas_height); // Clear the canvas
        }
    }
    update(p, volume, baseRadius, canvas) {
        p.radius = baseRadius + volume / 80; // pulse based on volume
        p.x += p.dx;
        p.y += p.dy;

        // bounce off edges
        if (p.x + p.radius > canvas.width || p.x - p.radius < 0) {
            p.dx = -p.dx;
        }
        if (p.y + p.radius > canvas.height || p.y - p.radius < 0) {
            p.dy = -p.dy;
        }
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
    particle(canvas, x, y, dx, dy, radius, color, particles) {
        for (let i = 0; i < 100; i++) {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
            dx = (Math.random() - 0.5) * 0.5;
            dy = (Math.random() - 0.5) * 0.5;
            radius = Math.random() * 0.5 + 0.2;
            color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, 0.8)`;
            particles.push(this.tfParticles(x, y, dx, dy, radius, color));
        }
    }
    hereDude(canvas, ctx, analyser, dataArray, bufferLength, baseRadius, particles) {

        //ctx.clearRect(0, 0, canvas.width, canvas.height);

        //analyser.getFloatTimeDomainData(this.TsunamiRadioDataArray);
        //analyser.getByteTimeDomainData(this.TsunamiRadioDataArray);
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "rgb(10, 10, 30)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Get Average volume for particle reaction
        let CtxTotal = 0;
        for (let i = 0; i < dataArray.length; i++) {
            CtxTotal += dataArray[i];
        }
        let averageVolume = CtxTotal / dataArray.length;

        for (let i = 0; i < particles.length; i++) {
            this.update(particles[i], averageVolume, baseRadius, canvas);
            this.draw(ctx, particles[i]);
        }

        let barWidth = canvas.width / bufferLength;
        let barHeight;
        let CtxX = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            let CtxR = barHeight + 25 * (i / bufferLength);
            let CtxG = 250 * (i / bufferLength);
            let CtxB = 50;

            ctx.fillStyle = `rgb(${CtxR}, ${CtxG}, ${CtxB})`;
            ctx.fillRect(CtxX, canvas.height - barHeight, barWidth, barHeight);

            CtxX += barWidth + 1;
        }
        //particle(canvas, x, y, dx, dy, radius, color, particles);
        this.visualizatorController = requestAnimationFrame(() => {
            this.hereDude(canvas, ctx, analyser, dataArray, bufferLength, baseRadius, particles);
        }
        );
    }
    drawingFrame(vidCanv, vidElem) {
        const ctx = vidCanv.getContext("2d");
        const w = vidCanv.width;
        const h = vidCanv.height;

        // 1. background (user-uploaded assets)
        if (this.backgroundVideo) {
            ctx.drawImage(this.backgroundVideo, 0, 0, w, h);
        } else if (this.backgroundImg) {
            ctx.drawImage(this.backgroundImg, 0, 0, w, h);
        }

        // 2. webcam / video
        if (this.isPlaying) {
            ctx.drawImage(vidElem, 0, 0, w, h);
        }

        // 3. effects (pixel-level)
        if (this.useChromaKey) {
            const frame = ctx.getImageData(0, 0, w, h);
            const processed = this.webcam(frame);
            ctx.putImageData(processed, 0, 0);
        }
    }
    setChromaHex(hex) {
        this.rgb = parseInt(hex.slice(1), 16);
        this.chromaKeyColorWebcam.r = (this.rgb >> 16) & 255;
        this.chromaKeyColorWebcam.g = (this.rgb >> 8) & 255;
        this.chromaKeyColorWebcam.b = this.rgb & 255;
    }

    ColorPickerChromaKey(chroma) {
        this.Tfhex = chroma.value;
        this.setfChromaHex(this.Tfhex);
        this.useChromaKey = true;
    }
    isChromaMatch(r, g, b, key, tolerance = 40) {
        return (
            Math.abs(r - key.r) < tolerance && Math.abs(g - key.g) < tolerance && Math.abs(b - key.b) < tolerance
        );
    }
    disableChromaKey() {
        this.frameCounter = 0;
        this.useChromaKey = false;
    }
    webcam(frameData) {
        let chromaData = frameData.data;
        const key = this.chromaKeyColorWebcam;
        for (let i = 0; i < chromaData.length; i += 4) {

            if (this.isChromaMatch(chromaData[i], chromaData[i + 1], chromaData[i + 2], key)) {
                chromaData[i + 3] = 0;
            }
        }
        return frameData;
    }
}