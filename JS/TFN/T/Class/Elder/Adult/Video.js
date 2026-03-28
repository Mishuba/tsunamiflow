export class TsunamiFlowVideo extends Tsu {
    constructor() {

    }
    VideoWebCodecs(stream) {
        const track = stream.getVideoTracks()[0];
        this.VideoProcessor = new MediaStreamTrackProcessor({ track });
        this.VideoReader = this.VideoProcessor.readable.getReader();
    }
}