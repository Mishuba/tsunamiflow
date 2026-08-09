class FFTProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super();

        if (options.processorOptions) {
            this.mode = options.processorOptions.mode;
            this.fftSize = options.processorOptions.fftSize;
            this.customFlag = options.processorOptions.customFlag;
        } else {
            this.fftSize = 1024;
        }
        this.drive = 1.5;

        // FFT configuration

        this.fftBuffer = new Float32Array(this.fftSize);
        this.fftWriteIndex = 0;

        this.fftReal = new Float32Array(this.fftSize);
        this.fftImag = new Float32Array(this.fftSize);

        this.dataArray = new Uint8Array(this.fftSize / 2);

        // Beat detection
        this.previousBass = 0;
        this.beatThreshold = 1.35;
        this.beatCooldown = 0;

        this.port.onmessage = (e) => {
            if (e.data?.drive !== undefined) {
                this.drive = e.data.drive;
            }

            if (e.data?.fftSize !== undefined) {
                const size = Number(e.data.fftSize);

                if (
                    size >= 32 &&
                    size <= 32768 &&
                    (size & (size - 1)) === 0
                ) {
                    this.fftSize = size;

                    this.fftBuffer = new Float32Array(this.fftSize);
                    this.fftReal = new Float32Array(this.fftSize);
                    this.fftImag = new Float32Array(this.fftSize);
                    this.dataArray = new Uint8Array(this.fftSize / 2);

                    this.fftWriteIndex = 0;
                }
            }
        };
    }

    tycadome(
        id,
        type,
        action,
        meta,
        state,
        mode,
        payload,
        transfer = []
    ) {
        const tf = {
            id: id,
            type: type,
            action: action,
            meta: meta,
            timestamp: Math.floor(Date.now() / 1000),
            state: state,
            mode: mode,
            payload: payload
        };

        const safeTransfer = [];

        if (Array.isArray(transfer)) {
            for (const item of transfer) {
                if (
                    item instanceof ArrayBuffer ||
                    item instanceof MessagePort ||
                    item instanceof ImageBitmap ||
                    item instanceof OffscreenCanvas ||
                    item instanceof AudioData ||
                    item instanceof VideoFrame
                ) {
                    safeTransfer.push(item);
                }
            }
        }

        tf.transfer = safeTransfer;

        return tf;
    }

    process(inputs, outputs) {
        const input = inputs[0];
        const output = outputs[0];

        if (!input || !input.length) {
            return true;
        }

        /*
         * Copy audio to output
         */
        for (let channel = 0; channel < input.length; channel++) {
            const inData = input[channel];
            const outData = output[channel];

            for (let i = 0; i < inData.length; i++) {
                let sample = inData[i];

                /*
                 * Optional soft saturation
                 *
                 * sample = Math.tanh(sample * this.drive);
                 */

                outData[i] = sample;
            }
        }

        /*
         * Mix all channels to mono for analysis.
         */
        const channelCount = input.length;
        const frameLength = input[0].length;

        for (let i = 0; i < frameLength; i++) {
            let mono = 0;

            for (let channel = 0; channel < channelCount; channel++) {
                mono += input[channel][i];
            }

            mono /= channelCount;

            this.fftBuffer[this.fftWriteIndex] = mono;

            this.fftWriteIndex++;

            if (this.fftWriteIndex >= this.fftSize) {
                this.fftWriteIndex = 0;

                const features = this.calculateFeatures();

                /*
                 * IMPORTANT:
                 *
                 * Copy the data before sending it.
                 * The worklet will reuse its buffers.
                 */
                const dataArray = new Uint8Array(
                    features.dataArray
                );

                this.port.postMessage(this.tycadome(
                    "user-id",
                    "audio-worklet",
                    "audio.visual.data",

                    {
                        worker: "media"
                    },

                    {
                        process: "working"
                    },

                    "async",

                    {
                        dataArray: dataArray,
                        volume: features.volume,
                        bass: features.bass,
                        mid: features.mid,
                        treble: features.treble,
                        beat: features.beat
                    }
                ));
            }
        }

        return true;
    }

    calculateFeatures() {
        const N = this.fftSize;

        /*
         * Copy the circular buffer into FFT arrays
         * so that the oldest sample comes first.
         */
        for (let i = 0; i < N; i++) {
            const index =
                (this.fftWriteIndex + i) % N;

            /*
             * Hann window
             */
            const window =
                0.5 *
                (
                    1 -
                    Math.cos(
                        (2 * Math.PI * i) / (N - 1)
                    )
                );

            this.fftReal[i] =
                this.fftBuffer[index] * window;

            this.fftImag[i] = 0;
        }

        /*
         * Calculate FFT.
         */
        this.fft(this.fftReal, this.fftImag);

        const binCount = N / 2;
        const dataArray = this.dataArray;

        /*
         * Convert FFT magnitude to 0-255.
         */
        const magnitudes = new Float32Array(binCount);

        let maxMagnitude = 0;

        for (let i = 0; i < binCount; i++) {
            const real = this.fftReal[i];
            const imag = this.fftImag[i];

            const magnitude =
                Math.sqrt(
                    real * real +
                    imag * imag
                );

            magnitudes[i] = magnitude;

            if (magnitude > maxMagnitude) {
                maxMagnitude = magnitude;
            }
        }

        /*
         * Frequency resolution.
         */
        const binHz =
            sampleRate / N;

        /*
         * Calculate frequency bands.
         *
         * Bass:   20 - 250 Hz
         * Mid:    250 - 2000 Hz
         * Treble: 2000 - 16000 Hz
         */
        let bassEnergy = 0;
        let midEnergy = 0;
        let trebleEnergy = 0;

        let bassCount = 0;
        let midCount = 0;
        let trebleCount = 0;

        for (let i = 0; i < binCount; i++) {
            const frequency = i * binHz;
            const magnitude = magnitudes[i];

            if (
                frequency >= 20 &&
                frequency < 250
            ) {
                bassEnergy += magnitude;
                bassCount++;
            }
            else if (
                frequency >= 250 &&
                frequency < 2000
            ) {
                midEnergy += magnitude;
                midCount++;
            }
            else if (
                frequency >= 2000 &&
                frequency <= 16000
            ) {
                trebleEnergy += magnitude;
                trebleCount++;
            }
        }

        /*
         * Normalize band energy.
         */
        const bass =
            bassCount > 0
                ? bassEnergy / bassCount
                : 0;

        const mid =
            midCount > 0
                ? midEnergy / midCount
                : 0;

        const treble =
            trebleCount > 0
                ? trebleEnergy / trebleCount
                : 0;

        /*
         * Convert to a relative 0-1 range.
         *
         * This uses logarithmic scaling because
         * raw FFT magnitude is usually very small.
         */
        const normalize = (value) => {
            if (value <= 0) {
                return 0;
            }

            return Math.min(
                1,
                Math.log10(1 + value * 1000) / 4
            );
        };

        const normalizedBass = normalize(bass);
        const normalizedMid = normalize(mid);
        const normalizedTreble = normalize(treble);

        /*
         * Create AnalyserNode-style Uint8 FFT data.
         */
        for (let i = 0; i < binCount; i++) {
            if (maxMagnitude <= 0) {
                dataArray[i] = 0;
            }
            else {
                const normalized =
                    magnitudes[i] / maxMagnitude;

                /*
                 * Logarithmic visualization scaling.
                 */
                const db =
                    20 *
                    Math.log10(
                        Math.max(normalized, 0.00001)
                    );

                const value =
                    (db + 100) / 100;

                dataArray[i] =
                    Math.max(
                        0,
                        Math.min(
                            255,
                            Math.round(value * 255)
                        )
                    );
            }
        }

        /*
         * Calculate RMS volume.
         */
        let sumSquares = 0;

        for (let i = 0; i < N; i++) {
            const sample = this.fftBuffer[i];

            sumSquares += sample * sample;
        }

        const rms =
            Math.sqrt(sumSquares / N);

        /*
         * Convert RMS to approximately 0-1.
         */
        const volume =
            Math.min(
                1,
                rms * 3
            );

        /*
         * Beat detection.
         *
         * Compare current bass energy against
         * previous bass energy.
         */
        let beat = false;

        if (this.beatCooldown > 0) {
            this.beatCooldown--;
        }

        if (
            this.previousBass > 0 &&
            normalizedBass >
            this.previousBass *
            this.beatThreshold &&
            normalizedBass > 0.15 &&
            this.beatCooldown <= 0
        ) {
            beat = true;

            /*
             * Prevent multiple beats from firing
             * on adjacent FFT windows.
             */
            this.beatCooldown = 3;
        }

        /*
         * Smooth previous bass value.
         */
        this.previousBass =
            this.previousBass * 0.8 +
            normalizedBass * 0.2;

        return {
            dataArray: this.dataArray,
            volume: Math.sqrt(sumSquares / this.fftSize),
            bass: normalizedBass,
            mid: normalizedMid,
            treble: normalizedTreble,
            beat: this.previousBass < this.beatThreshold && normalizedBass >= this.beatThreshold
        };
    }

    /*
     * In-place radix-2 FFT.
     */
    fft(real, imag) {
        const N = real.length;

        /*
         * Bit reversal.
         */
        let j = 0;

        for (let i = 0; i < N - 1; i++) {
            if (i < j) {
                let temp = real[i];
                real[i] = real[j];
                real[j] = temp;

                temp = imag[i];
                imag[i] = imag[j];
                imag[j] = temp;
            }

            let bit = N >> 1;

            while (j & bit) {
                j ^= bit;
                bit >>= 1;
            }

            j ^= bit;
        }

        /*
         * FFT butterfly stages.
         */
        for (
            let length = 2;
            length <= N;
            length <<= 1
        ) {
            const halfLength = length >> 1;

            const angle =
                -2 * Math.PI / length;

            const wReal =
                Math.cos(angle);

            const wImag =
                Math.sin(angle);

            for (
                let i = 0;
                i < N;
                i += length
            ) {
                let currentReal = 1;
                let currentImag = 0;

                for (
                    let k = 0;
                    k < halfLength;
                    k++
                ) {
                    const evenIndex = i + k;
                    const oddIndex =
                        evenIndex + halfLength;

                    const oddReal =
                        real[oddIndex];

                    const oddImag =
                        imag[oddIndex];

                    const tempReal =
                        currentReal * oddReal -
                        currentImag * oddImag;

                    const tempImag =
                        currentReal * oddImag +
                        currentImag * oddReal;

                    real[oddIndex] =
                        real[evenIndex] -
                        tempReal;

                    imag[oddIndex] =
                        imag[evenIndex] -
                        tempImag;

                    real[evenIndex] +=
                        tempReal;

                    imag[evenIndex] +=
                        tempImag;

                    const nextReal =
                        currentReal * wReal -
                        currentImag * wImag;

                    const nextImag =
                        currentReal * wImag +
                        currentImag * wReal;

                    currentReal = nextReal;
                    currentImag = nextImag;
                }
            }
        }

        /*
         * Normalize FFT.
         */
        for (let i = 0; i < N; i++) {
            real[i] /= N;
            imag[i] /= N;
        }
    }
}

registerProcessor(
    "fft-processor",
    FFTProcessor
);