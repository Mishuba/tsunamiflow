import { TsunamiFlowVideo } from "./TsunamiFlowVideo.js";
import { TfWebcam } from "./TfWebcam.js";
import { TfScreenShare } from "./TfScreenShare.js";
import { TsunamiFlowMediaStream } from "./TsunamiFlowMediaStream.js";
import { TfWebRTC } from "./TfWebRTC.js";
import { TfMediaRecorder } from "./TfMediaRecorder.js";

export class TsunamiFlowNetwork {
    constructor() {
        // Core Media
        this.webcam = new TfWebcam();
        this.screenshare = new TfScreenShare();
        this.canvasStream = new TsunamiFlowMediaStream();
        this.webrtc = new TfWebRTC();
        this.recorder = new TfMediaRecorder();

        // Video Elements
        this.videoWebcam = new TsunamiFlowVideo({ autoplay: true, muted: true });
        this.videoScreen = new TsunamiFlowVideo({ autoplay: true, muted: true });
        this.videoCanvas = new TsunamiFlowVideo({ autoplay: true, muted: true });
        this.videoRemote = new TsunamiFlowVideo({ autoplay: true, muted: false });

        // Event System
        this.listeners = {};
    }

    /* ----------------------------
       Webcam
    ----------------------------*/
    async startWebcam() {
        const stream = await this.webcam.start();
        this.videoWebcam.attachStream(stream);
        this.emit("webcamStarted", stream);
        return stream;
    }

    stopWebcam() {
        this.webcam.stop();
        this.videoWebcam.detachStream();
        this.emit("webcamStopped");
    }

    /* ----------------------------
       Screen Share
    ----------------------------*/
    async startScreenShare() {
        const stream = await this.screenshare.start();
        this.videoScreen.attachStream(stream);
        this.emit("screenShareStarted", stream);
        return stream;
    }

    stopScreenShare() {
        this.screenshare.stop();
        this.videoScreen.detachStream();
        this.emit("screenShareStopped");
    }

    /* ----------------------------
       Canvas Stream
    ----------------------------*/
    startCanvas(canvas, audioContext = null, sourceNode = null, fps = 30) {
        const stream = this.canvasStream.start({ canvas, audioContext, sourceNode, fps });
        this.videoCanvas.attachStream(stream);
        this.emit("canvasStarted", stream);
        return stream;
    }

    stopCanvas() {
        this.canvasStream.stop();
        this.videoCanvas.detachStream();
        this.emit("canvasStopped");
    }

    /* ----------------------------
       WebRTC
    ----------------------------*/
    async startLocalWebRTC() {
        const stream = await this.webrtc.startLocal();
        this.videoWebcam.attachStream(stream); // optional: preview local
        this.emit("webrtcLocalStarted", stream);
        return stream;
    }

    async initPeer(iceServers) {
        const pc = await this.webrtc.initPeer(iceServers);
        return pc;
    }

    async handleSignal(data) {
        await this.webrtc.handleSignal(data);
        this.videoRemote.attachStream(this.webrtc.remoteStream);
    }

    closePeer() {
        this.webrtc.closePeer();
        this.videoRemote.detachStream();
        this.emit("webrtcClosed");
    }

    /* ----------------------------
       MediaRecorder
    ----------------------------*/
    startRecording(stream) {
        this.recorder.start(stream);
        this.emit("recordingStarted", stream);
    }

    stopRecording() {
        this.recorder.stop();
        this.emit("recordingStopped");
    }

    downloadRecording(filename = "recording.webm") {
        this.recorder.download(filename);
    }

    /* ----------------------------
       Event System
    ----------------------------*/
    on(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }

    emit(event, data) {
        (this.listeners[event] || []).forEach(fn => fn(data));
    }

    /* ----------------------------
       Status Summary
    ----------------------------*/
    toJson() {
        return {
            webcam: this.videoWebcam.toJson(),
            screenShare: this.videoScreen.toJson(),
            canvas: this.videoCanvas.toJson(),
            remote: this.videoRemote.toJson(),
            recorder: this.recorder.toJson()
        };
    }
}