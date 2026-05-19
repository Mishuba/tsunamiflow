//neuron 

class Neuron {
  constructor(numInputs) {
    this.weights = Array.from({ length: numInputs }, () => Math.random() - 0.5);
    this.bias = Math.random() - 0.5;
  }

  activate(inputs) {
    let sum = this.bias;

    for (let i = 0; i < this.weights.length; i++) {
      sum += inputs[i] * this.weights[i];
    }

    return this.sigmoid(sum);
  }

  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }
}