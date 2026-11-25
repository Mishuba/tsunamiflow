import { AiInterface } from "./Fetus/ai";


export class AICore extends AiInterface {

    constructor() {

    }
    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    // Create a new Neuron instance (weights + bias) and return it
    activate(inputs) {
        let sum = this.bias;

        for (let i = 0; i < this.weights.length; i++) {
            sum += inputs[i] * this.weights[i];
        }

        return this.sigmoid(sum);
    }

    neuron(numInputs) {
        return {
            weights: Array.from({ length: numInputs }, () => Math.random() - 0.5),
            bias: Math.random() - 0.5,
            activate(inputs) {
                let sum = this.bias;
                for (let i = 0; i < this.weights.length; i++) {
                    sum += inputs[i] * this.weights[i];
                }
                return 1 / (1 + Math.exp(-sum));
            }
        };
    }

    // Build and return a layer object with its own neurons and forward()
    layer(numNeurons, inputsPerNeuron) {
        const neurons = Array.from({ length: numNeurons }, () => this.neuron(inputsPerNeuron));
        return {
            neurons,
            forward(inputs) {
                return this.neurons.map(n => n.activate(inputs));
            }
        };
    }

    // Initialize a simple 2-layer network. `a` and `b` are neuron counts.
    neuralnetwork(a, b, inputsPerNeuron = null) {
        // If inputsPerNeuron not provided, assume input size equals first layer neuron count
        const inp = inputsPerNeuron || a;
        this.layer1 = this.layer(a, inp);
        this.layer2 = this.layer(b, a);
        return this;
    }

    predict(input) {
        const out1 = this.layer1.forward(input);
        const out2 = this.layer2.forward(out1);
        return out2;
    }


    sigmoidDerivative(x) {
        return x * (1 - x);
    }
}