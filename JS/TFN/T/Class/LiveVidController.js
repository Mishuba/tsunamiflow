export class TsunamiLiveVideoController extends TsunamiFlowVideoRecorder {
    localVideoStream = null;
    remoteVideoStream = new MediaStream();
    WebRtfcPc = null;
    constructor(option = {}) {

    }
    startStream({ audioStream = null, fps = 30 }) {
        if (!this.canvas) {
            //use video not canv
        } else {
            this.audioContext = audioContext;
            this.sourceNode = sourceNode;

            // Capture video from canvas
            this.videoStreamerStream = this.canvas.captureStream(fps);
            const tracks = [...this.videoStreamerStream.getVideoTracks()];

            // Capture audio from AudioContext if provided
            if (audioStream) {
                tracks.push(audioStream);
            }

            // Combine video + audio
            this.stream = new MediaStream(tracks);

            this.emit("start", this.stream);

            return this.stream;
        }
    }
    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }

        this.videoStream = null;
        this.stream = null;
        this.emit("stop");
    }
    replaceCanvas(newCanvas, audio, fps = 30) {
        if (!newCanvas) throw new Error("New canvas is required");
        this.canvas = newCanvas;
        if (this.stream) this.stop();
        return this.start({ audio, fps });
    }
}