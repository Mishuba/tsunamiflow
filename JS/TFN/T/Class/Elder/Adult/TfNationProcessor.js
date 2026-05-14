class FFTProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    this.bufferSize = 2048;
    this.buffer = new Float32Array(this.bufferSize);
    this.writeIndex = 0;
  }

  process(inputs, outputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const channel = input[0];
    const output = outputs[0];

    // 1. pass-through audio (zero distortion graph behavior)
    if (output && output[0]) {
      output[0].set(channel);
    }

    // 2. collect samples ONLY
    for (let i = 0; i < channel.length; i++) {
      this.buffer[this.writeIndex++] = channel[i];

      if (this.writeIndex >= this.bufferSize) {

        // 🔥 SEND RAW AUDIO SNAPSHOT ONLY
        // NO FFT HERE
        this.port.postMessage(
          this.buffer,
          [this.buffer.buffer] // transfer ownership = zero copy
        );

        // recreate buffer (required after transfer)
        this.buffer = new Float32Array(this.bufferSize);
        this.writeIndex = 0;
      }
    }

    return true;
  }
}

registerProcessor("fft-processor", FFTProcessor);