class AudioDSP {
    constructor(size) {
        this.size = size;
        this.prevBass = 0;
    }

    process(pcm) {
        const N = pcm.length;

        // ===== VOLUME (RMS) =====
        let sum = 0;
        for (let i = 0; i < N; i++) sum += pcm[i] * pcm[i];
        const volume = Math.sqrt(sum / N);

        // ===== SIMPLE FFT (your version, optimized buckets) =====
        const bands = new Uint8Array(64);

        const step = Math.floor(N / bands.length);

        for (let i = 0; i < bands.length; i++) {
            let acc = 0;
            for (let j = 0; j < step; j++) {
                acc += Math.abs(pcm[i * step + j] || 0);
            }
            bands[i] = Math.min(255, acc * 300);
        }

        // ===== AUDIO REGIONS =====
        const bass = this.avg(bands, 0, 8);
        const mid = this.avg(bands, 8, 32);
        const treble = this.avg(bands, 32, 64);

        // ===== BEAT DETECTION =====
        const beat = bass > 0.6 && this.prevBass <= 0.6;
        this.prevBass = bass;

        return {
            volume,
            fft: bands,
            bass,
            mid,
            treble,
            beat
        };
    }

    avg(arr, a, b) {
        let sum = 0;
        for (let i = a; i < b; i++) sum += arr[i];
        return sum / (b - a) / 255;
    }
}