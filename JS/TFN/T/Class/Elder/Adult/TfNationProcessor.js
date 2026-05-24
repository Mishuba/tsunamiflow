class FFTProcessor extends AudioWorkletProcessor {

    constructor() {

        super();

        this.drive = 1.5;

        this.port.onmessage = (e) => {

            if (e.data.drive !== undefined) {

                this.drive = e.data.drive;
            }
        };
    }

    process(inputs, outputs) {

        const input = inputs[0];
        const output = outputs[0];

        if (!input.length) return true;

        for (let channel = 0;
             channel < input.length;
             channel++) {

            const inData = input[channel];
            const outData = output[channel];

            for (let i = 0;
                 i < inData.length;
                 i++) {

                let sample = inData[i];

                // SOFT SATURATION

                sample =
                    Math.tanh(
                        sample * this.drive
                    );

                outData[i] = sample;
            }
        }

        return true;
    }
}

registerProcessor("fft-processor", FFTProcessor);