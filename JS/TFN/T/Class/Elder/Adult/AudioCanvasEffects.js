

export class Tsun extends Tsu {
    visualizatorController;
    constructor(options = {}) {
        super(options);
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

    async RadioVisualizer(canvas, ctx, analyser, dataArray, bufferLength, baseRadius, particles) {
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
            this.RadioVisualizer(canvas, ctx, analyser, dataArray, bufferLength, baseRadius, particles);
        });
    }
    //////////////////End of Audio ////////////////////////////
}