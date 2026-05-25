import { TsunamiFlowAudio } from "./Adult/Noise.js";
export class Flow extends TsunamiFlowAudio {
    TfSoundsOscillator = null;
    TfSoundsWaveShaper = null;
    TfSoundsPeridocWave = null;

    constructor(options = {}) {
        super(options);
    }

}