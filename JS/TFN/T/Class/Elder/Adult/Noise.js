import { TsunamiFlowSound } from "./Teen/Sound.js";
export class TsunamiFlowAudio extends TsunamiFlowSound {
    TfSoundsOscillator = null;
    TfSoundsWaveShaper = null;
    TfSoundsPeridocWave = null;

    constructor(options = {}) {
        super(options);
    }


}