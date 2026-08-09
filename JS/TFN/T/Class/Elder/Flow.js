import { TsunamiFlowAudio } from "./Adult/Noise.js";
export class Flow extends TsunamiFlowAudio {
    _wired = false;
    _radioBound = false;
    WeLive = null;
    hls = null;

    constructor(options = {}) {
        super(options);
    }


}