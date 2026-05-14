class AnalyzerProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    const channel = input?.[0];

    if (!channel) return true;

    let sum = 0;

    for (let i = 0; i < channel.length; i++) {
      sum += channel[i] * channel[i];
    }

    const rms = Math.sqrt(sum / channel.length);

    this.port.postMessage({ rms });

    return true;
  }
}

class AnalyzerProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    const channel = input?.[0];

    if (!channel) return true;

    let sum = 0;

    for (let i = 0; i < channel.length; i++) {
      sum += channel[i] * channel[i];
    }

    const rms = Math.sqrt(sum / channel.length);

    this.port.postMessage({ rms });

    return true;
  }
}

registerProcessor("analyzer", AnalyzerProcessor);