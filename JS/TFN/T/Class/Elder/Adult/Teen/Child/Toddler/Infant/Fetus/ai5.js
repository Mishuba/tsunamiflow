//backpropagation/ learning

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function sigmoidDerivative(x) {
  return x * (1 - x);
}