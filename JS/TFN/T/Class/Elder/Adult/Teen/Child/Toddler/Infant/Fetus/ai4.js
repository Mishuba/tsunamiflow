//neural network
class NeuralNetwork {
  constructor() {
    this.layer1 = new Layer(4, 2);
    this.layer2 = new Layer(1, 4);
  }

  predict(input) {
    const out1 = this.layer1.forward(input);
    const out2 = this.layer2.forward(out1);
    return out2;
  }
}