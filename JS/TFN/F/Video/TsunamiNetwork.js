import { TfWebcam } from "./TfWebcam.js";
import { TfCamera } from "./TfCamera.js";
import { TfScreenShare } from "./TfScreenShare.js";
import { TfRecorder } from "./TfRecorder.js";
import { TfMediaSource } from "./TfMediaSource.js";
import { TfMediaStream } from "./TfMediaStream.js";
import { TfWebRTCRecorder } from "./TfWebRTCRecorder.js";
import { TsunamiFlowVideo } from "./TsunamiFlowVideo.js";

export class TfVideo {

    constructor({
        videoElement = null
    } = {}) {

        /* Core Components */

        this.webcam = new TfWebcam();
        this.camera = new TfCamera();
        this.screen = new TfScreenShare();
        this.recorder = new TfRecorder();
        this.mediaSource = new TfMediaSource();
        this.mediaStream = new TfMediaStream();
        this.webrtc = new TfWebRTCRecorder({
            videoElement
        });

        this.video = new TsunamiFlowVideo({
            videoElement
        });

        this.stream = null;

        this.listeners = {};
    }

    /* -----------------------------
       Webcam
    -----------------------------*/

    async startWebcam() {

        const stream = await this.webcam.start();

        this.stream = stream;
        this.video.attachStream(stream);

        this.emit("webcamStarted", stream);

        return stream;
    }

    stopWebcam() {
        this.webcam.stop();
        this.video.detachStream();

        this.emit("webcamStopped");
    }

    /* -----------------------------
       Camera (video only)
    -----------------------------*/

    async startCamera() {

        const stream = await this.camera.start();

        this.stream = stream;
        this.video.attachStream(stream);

        this.emit("cameraStarted", stream);

        return stream;
    }

    stopCamera() {
        this.camera.stop();
        this.video.detachStream();

        this.emit("cameraStopped");
    }

    /* -----------------------------
       Screen Share
    -----------------------------*/

    async startScreen() {

        const stream = await this.screen.start();

        this.stream = stream;
        this.video.attachStream(stream);

        this.emit("screenStarted", stream);

        return stream;
    }

    stopScreen() {
        this.screen.stop();
        this.video.detachStream();

        this.emit("screenStopped");
    }

    /* -----------------------------
       Recording
    -----------------------------*/

    startRecording() {

        if (!this.stream) throw new Error("No active stream to record");

        this.recorder.start(this.stream);

        this.emit("recordingStarted");
    }

    stopRecording() {

        this.recorder.stop();

        this.emit("recordingStopped");
    }

    downloadRecording(name = "recording.webm") {
        this.recorder.download(name);
    }

    /* -----------------------------
       Canvas Stream
    -----------------------------*/

    startCanvasStream(canvas, audioContext = null, sourceNode = null) {

        const stream = this.mediaStream.start({
            canvas,
            audioContext,
            sourceNode
        });

        this.stream = stream;

        this.video.attachStream(stream);

        this.emit("canvasStreamStarted", stream);

        return stream;
    }

    stopCanvasStream() {

        this.mediaStream.stop();

        this.video.detachStream();

        this.emit("canvasStreamStopped");
    }

    /* -----------------------------
       WebRTC
    -----------------------------*/

    async startWebRTC() {

        await this.webrtc.startLocal();

        if (this.stream) {

            this.stream.getTracks().forEach(track => {
                this.webrtc.replaceTrack(track);
            });

        }

        await this.webrtc.initPeer();

        this.emit("webrtcReady");
    }

    closeWebRTC() {
        this.webrtc.closePeer();
        this.emit("webrtcClosed");
    }

    /* -----------------------------
       Video Controls
    -----------------------------*/

    play() {
        this.video.play();
    }

    pause() {
        this.video.pause();
    }

    /* -----------------------------
       Event System
    -----------------------------*/

    on(event, fn) {

        if (!this.listeners[event])
            this.listeners[event] = [];

        this.listeners[event].push(fn);
    }

    emit(event, data) {

        (this.listeners[event] || [])
            .forEach(fn => fn(data));
    }

    /* -----------------------------
       Debug
    -----------------------------*/

    toJson() {

        return {

            streamActive: !!this.stream,

            webcam: this.webcam.toJson(),
            recorder: this.recorder.toJson(),
            video: this.video.toJson(),

            webrtc: this.webrtc.toJson()
        };
    }

}