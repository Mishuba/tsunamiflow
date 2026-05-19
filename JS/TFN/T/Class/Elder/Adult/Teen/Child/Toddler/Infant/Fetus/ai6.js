//basic training loop
function train(network, data, labels, lr = 0.1) {
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