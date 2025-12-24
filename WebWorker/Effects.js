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
        this.backgroundImg = null;
        //video
        this.backgroundVideo = null;
        this.isPlaying = false;
        this.frameSkipCount = 2;
        this.frameCounter = 0;
        this.useChromaKeyWebcam = false;
    }
    hereDude(canvas, ctx, analyser, dataArray, bufferLength, radius, baseRadius, x, y, dx, dy, color, particles) {
        async function update(volume, radius, baseRadius, x, y, dx, dy, canvas) {
            radius = baseRadius + volume / 80; // pulse based on volume
            x += dx;
            y += dy;

            // bounce off edges
            if (x + radius > canvas.width || x - radius < 0) {
                dx = -dx;
            }
            if (y + radius > canvas.height || y - radius < 0) {
                dy = -dy;
            }
        }
        async function draw(ctx, x, y, radius, color) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2, false);
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 20;
            ctx.fill();
        }
        async function tfParticles(x, y, dx, dy, radius, color) {
            return { x, y, dx, dy, radius, color };
        }
        async function particle(canvas, x, y, dx, dy, radius, color, particles) {
            for (let i = 0; i < 100; i++) {
                x = Math.random() * canvas.width;
                y = Math.random() * canvas.height;
                dx = (Math.random() - 0.5) * 0.5;
                dy = (Math.random() - 0.5) * 0.5;
                radius = Math.random() * 0.5 + 0.2;
                color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, 0.8)`;
                particles.push(tfParticles(x, y, dx, dy, radius, color));
            }
        }
        particle(canvas, x, y, dx, dy, radius, color, particles);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

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
            particles[i] = update(averageVolume, radius, baseRadius, x, y, dx, dy, canvas);
            particles[i] = draw(ctx, x, y, radius, color);
        }

        let barWidth = (100 / bufferLength) * 2.5;
        let barHeight;
        let CtxX = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            let CtxR = barHeight + 25 * (i / bufferLength);
            let CtxG = 250 * (i / bufferLength);
            let CtxB = 50;

            ctx.fillStyle = `rgb(${CtxR}, ${CtxG}, ${CtxB})`;
            ctx.fillRect(CtxX, 100 - barHeight, barWidth, barHeight);

            CtxX += barWidth + 1;
        }

        this.visualizatorController = requestAnimationFrame(async () => this.hereDude(canvas, ctx, analyser, dataArray, bufferLength, radius, baseRadius, x, y, dx, dy, color, particles));
}
    chromaKey(hex) {
        let trf = 0, tgf = 0, tbf = 0;
        if (hex.length === 4) {
            trf = parseInt(hex[1] + hex[1], 16);
            tgf = parseInt(hex[2] + hex[2], 16);
            tbf = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            trf = parseInt(hex[1] + hex[2], 16);
            tgf = parseInt(hex[3] + hex[4], 16);
            tbf = parseInt(hex[5] + hex[6], 16);
        }
        return { trf, tgf, tbf };
    }
    ColorPickerChromaKey(chroma) {
        this.Tfhex = chroma.target.value;
        this.rgb = parseInt(this.Tfhex.slice(1), 16);
        this.chromaKeyColorWebcam.r = (this.rgb >> 16) & 255;
        this.chromaKeyColorWebcam.g = (this.rgb >> 8) & 255;
        this.chromaKeyColorWebcam.b = this.rgb & 255;
    }
    webcam() {
        this.chromaFrame = ctx.getImageData(0, 0, canvas_width, canvas_height);
        this.chromaData = this.chromaFrame.data;
        for (let i = 0; i < this.chromaData.length; i += 4) {
            const r = this.chromaData[i];
            const g = this.chromaData[i + 1];
            const b = this.chromaData[i + 2];
            // Check if pixel matches the chroma key color for webcam
            if (r === this.chromaKeyColorWebcam.r && g === this.chromaKeyColorWebcam.g && b === this.chromaKeyColorWebcam.b) {
                this.chromaData[i + 3] = 0; // Set alpha to 0
            }
        }
    }
    canvas(canvas_width, canvas_height) {
        const imageData = ctx.getImageData(0, 0, canvas_width, canvas_height);
        this.chromaData = imageData.data;
        const chromaColor = this.chromaKey(this.Tfhex);
        for (let i = 0; i < this.chromaData.length; i += 4) {
            if (this.chromaData[i] === chromaColor.r && this.chromaData[i + 1] === chromaColor.g && this.chromaData[i + 2] === chromaColor.b) {
                this.chromaData[i + 3] = 0; // Set alpha to 0 for transparency
            }
        }
    }
    background(stream, canvas_height) {
        // Draw the uploaded background video or image
        if (this.backgroundVideo) {
            ctx.drawImage(this.backgroundVideo, 0, 0, canvas_width, canvas_height);
        } else if (this.backgroundImg) {
            ctx.drawImage(this.backgroundImg, 0, 0, canvas_width, canvas_height);
        }
        // Draw the webcam feed if it's active
        if (this.isPlaying === true) {
            ctx.drawImage(stream, 0, 0, canvas_width, canvas_height);
        }
        // Apply chroma key for webcam, video, and image based on flags
        if (this.frameCounter % this.frameSkipCount === 0) {
            if (this.useChromaKeyWebcam) {
                this.ColorPickerChromaKey(this.Tfhex);
            } else {

            }
        }
        this.frameCounter++;
    }
}