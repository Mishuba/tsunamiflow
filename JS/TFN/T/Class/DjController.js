import { TsunamiFlowRadio } from "./Elder/TfRadio.js";
export class M extends TsunamiFlowRadio {
    audio = null;
    MixerDestination = this.TfSoundsContext.createMediaStreamDestination();
    constructor(option = {}) {

    }
    addMixerMediaElement(element, id = null, monitor = false) {
        this.initAudioContext();
        if (!element) throw new Error("MediaElement is required");
        const sourceId = id || `element-${++this.TfSoundsidCounter}`;
        let source;

        if (this.elementSourceMap.has(element)) {
            source = this.TfSoundsContext.createMediaElementSource(element);
        } else {
            source = this.TfSoundsContext.createMediaElementSource(element);
            this.elementSourceMap.set(element, source);
        }

        const chain = this.createTrackChain();

        source
            .connect(chain.gain)
            .connect(chain.analyser)
            .connect(chain.compressor)
            .connect(this.masterGain);


        if (monitor) source.connect(this.TfSoundsContext.destination); // local playback

        // ✅ STORE EVERYTHING (IMPORTANT)
        this.AudioSource[sourceId] = source;
        this.TfSoundsGain[sourceId] = chain.gain;

        if (!this.TfTrackAnalyser) this.TfTrackAnalyser = {};
        if (!this.TfTrackCompressor) this.TfTrackCompressor = {};

        this.TfTrackAnalyser[sourceId] = chain.analyser;
        this.TfTrackCompressor[sourceId] = chain.compressor;

        this.emit("sourceAdded", { id: sourceId, type: "media", source: source, gain: chain.gain });
        return sourceId;
    }
    removeMixerSource(id) {
        if (this.AudioSource[id]) {
            this.AudioSource[id].disconnect();
            this.TfSoundsGain[id].disconnect();
            delete this.AudioSource[id];
            delete this.TfSoundsGain[id];
            this.emit("sourceRemoved", id);
        }
    }
    getMixerStream() {
        return this.MixerDestination.stream;
    }
    resetMixer() {
        Object.values(this.AudioSource).forEach(src => src.disconnect());
        this.AudioSource = {};
        this.TfSoundsGain = {};
        this.emit("reset");
    }
}