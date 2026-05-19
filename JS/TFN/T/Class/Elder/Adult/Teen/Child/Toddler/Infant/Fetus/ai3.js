class Layer {
  constructor(numNeurons, inputsPerNeuron) {
    this.neurons = Array.from(
      { length: numNeurons },
      () => new Neuron(inputsPerNeuron)
    );
  }

  forward(inputs) {
    return this.neurons.map(n => n.activate(inputs));
  }
}