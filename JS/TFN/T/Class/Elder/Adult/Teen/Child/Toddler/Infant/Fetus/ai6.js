//neural network
class NeuralNetwork {
  layer1 = null;
  layer2 = null;

  weights = null;
  bias = null;
  neurons = null;
  static dot(a, b) {
    return a.map((row, i) =>
      b[0].map((_, j) =>
        row.reduce((sum, val, k) => sum + val * b[k][j], 0)
      )
    );
  }

  static add(a, b) {
    return a.map((row, i) =>
      row.map((val, j) => val + b[i][j])
    );
  }

  static subtract(a, b) {
    return a.map((row, i) =>
      row.map((val, j) => val - b[i][j])
    );
  }

  static scale(m, scalar) {
    return m.map(row =>
      row.map(val => val * scalar)
    );
  }

  static concat(a, b) {
    return a.map((row, i) =>
      row.map((val, j) => String(val) + String(b[i][j]))
    );
  }

  static transpose(m) {
    return m[0].map((_, i) => m.map(row => row[i]));
  }

  neuron(numInputs) {
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

  layer(numNeurons, inputsPerNeuron) {
    this.neurons = Array.from(
      { length: numNeurons },
      () => neuron(inputsPerNeuron)
    );
  }

  forward(inputs) {
    return this.neurons.map(n => n.activate(inputs));
  }

  neuralnetwork(a, b) {
    this.layer1 = layer(a);
    this.layer2 = layer(b);
  }

  predict(input) {
    const out1 = this.layer1.forward(input);
    const out2 = this.layer2.forward(out1);
    return out2;
  }

  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  sigmoidDerivative(x) {
    return x * (1 - x);
  }

  train(network, data, labels, lr = 0.1) {
    for (let i = 0; i < data.length; i++) {
      const input = data[i];
      const target = labels[i];

      // forward
      const hidden = network.layer1.forward(input);
      const output = network.layer2.forward(hidden);

      // error
      const error = target - output[0];

      // backprop (simplified)
      const delta = error * sigmoidDerivative(output[0]);

      // update output layer weights
      network.layer2.neurons[0].weights = network.layer2.neurons[0].weights.map(
        (w, j) => w + lr * delta * hidden[j]
      );
    }
  }
}