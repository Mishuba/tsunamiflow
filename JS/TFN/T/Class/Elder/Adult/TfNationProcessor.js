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
    tycadome(id, type, action, meta, state, mode, payload, transfer = []) {
        let tf = {
            "id": id, //options.id
            "type": type, //command
            "action": action, // video.start
            "meta": meta, // {}
            "timestamp": Math.floor(Date.now() / 1000),
            "state": state, // {}
            "mode": mode, //"async"
            "payload": payload // {},
        };

        // Attach transferables only if valid
        const safeTransfer = [];

        if (Array.isArray(transfer) && transfer.length > 0) {
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
                /*
                                sample =
                                    Math.tanh(
                                        sample * this.drive
                                    );
                */
                outData[i] = sample;
            }
        }

        this.port.postMessage(
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
                sample: sample,
                channel: channel,
                output: outData,
            }
        );

        return true;
    }
}

registerProcessor("fft-processor", FFTProcessor);