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
    setChromaHex(hex) {
        this.rgb = parseInt(hex.slice(1), 16);
        this.chromaKeyColorWebcam.r = (this.rgb >> 16) & 255;
        this.chromaKeyColorWebcam.g = (this.rgb >> 8) & 255;
        this.chromaKeyColorWebcam.b = this.rgb & 255;
    }
    
    ColorPickerChromaKey(chroma) {
        this.Tfhex = chroma.target.value;
        this.setChromaHex(this.Tfhex);
    }
    isChromaMatch(r, g, b, key, tolerance = 40) {
        return (
            Math.abs(r - key.r) < tolerance && Math.abs(g - key.g) < tolerance && Math.abs(b - key.b) < tolerance
        );
    }
    webcam(frameData, ctx, canvas_width, canvas_height) {
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