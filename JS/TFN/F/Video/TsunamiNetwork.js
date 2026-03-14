import { DefaultVideoEffects } from "./VideoEffects.js"; // optional effects module
import { TfWebcam } from "./TfWebcam.js";
import { TfScreenShare } from "./TfScreenShare.js";
import { TsunamiFlowMediaStream } from "./TsunamiFlowMediaStream.js";
import { TfWebRTC } from "./TfWebRTC.js";
import { TfMediaRecorder } from "./TfMediaRecorder.js";

export class TsunamiFlowVideoNetwork {
    constructor(videoContext = null) {
        // Core Media
        this.webcam = new TfWebcam();
        this.screenshare = new TfScreenShare();
        this.canvasStream = new TsunamiFlowMediaStream();
        this.webrtc = new TfWebRTC();
        this.recorder = new TfMediaRecorder();

        // Video Elements
        this.videos = {}; // keyed by ID
        this.effects = {}; // keyed by ID

        // Event System
        this.listeners = {};

        // Optional shared canvas context for effects
        this.videoContext = videoContext || document.createElement("canvas").getContext("2d");

        // Playback / state
        this.currentVideoId = null;
    }

    /* ----------------------------
       Video Element Management
    ----------------------------*/
    addVideoElement(element, id = null, effect = null) {
        const vidId = id || `video-${Object.keys(this.videos).length + 1}`;
        this.videos[vidId] = element;
        this.effects[vidId] = effect || new DefaultVideoEffects();
        element.autoplay = true;
        element.muted = true;

        element.addEventListener("ended", () => this.emit("ended", vidId));
        element.addEventListener("play", () => this.emit("play", vidId));
        element.addEventListener("pause", () => this.emit("pause", vidId));

        return vidId;
    }

    attachStreamToVideo(id, stream) {
        const element = this.videos[id];
        if (!element) return;
        element.srcObject = stream;
        element.play().catch(() => console.warn("Video autoplay blocked"));
    }

    detachVideo(id) {
        const element = this.videos[id];
        if (!element) return;
        if (element.srcObject) {
            element.srcObject.getTracks().forEach(track => track.stop());
        }
        element.srcObject = null;
    }

    playVideo(id) {
        const element = this.videos[id];
        if (!element) return element.play().catch(() => {});
    }

    pauseVideo(id) {
        const element = this.videos[id];
        if (!element) return element.pause();
    }

    /* ----------------------------
       Webcam
    ----------------------------*/
    async startWebcam(id) {
        const stream = await this.webcam.start();
        this.attachStreamToVideo(id, stream);
        this.emit("webcamStarted", id);
        return stream;
    }

    stopWebcam(id) {
        this.webcam.stop();
        this.detachVideo(id);
        this.emit("webcamStopped", id);
    }

    /* ----------------------------
       Screen Share
    ----------------------------*/
    async startScreenShare(id) {
        const stream = await this.screenshare.start();
        this.attachStreamToVideo(id, stream);
        this.emit("screenShareStarted", id);
        return stream;
    }

    stopScreenShare(id) {
        this.screenshare.stop();
        this.detachVideo(id);
        this.emit("screenShareStopped", id);
    }

    /* ----------------------------
       Canvas Stream
    ----------------------------*/
    startCanvas(id, canvas, audioContext = null, sourceNode = null, fps = 30) {
        const stream = this.canvasStream.start({ canvas, audioContext, sourceNode, fps });
        this.attachStreamToVideo(id, stream);
        this.emit("canvasStarted", id);
        return stream;
    }

    stopCanvas(id) {
        this.canvasStream.stop();
        this.detachVideo(id);
        this.emit("canvasStopped", id);
    }

    /* ----------------------------
       WebRTC
    ----------------------------*/
    async startLocalWebRTC(id) {
        const stream = await this.webrtc.startLocal();
        this.attachStreamToVideo(id, stream);
        this.emit("webrtcLocalStarted", id);
        return stream;
    }

    async initPeer(iceServers) {
        return await this.webrtc.initPeer(iceServers);
    }

    async handleSignal(data, remoteId) {
        await this.webrtc.handleSignal(data);
        this.attachStreamToVideo(remoteId, this.webrtc.remoteStream);
    }

    closePeer(remoteId) {
        this.webrtc.closePeer();
        this.detachVideo(remoteId);
        this.emit("webrtcClosed", remoteId);
    }

    /* ----------------------------
       Media Recorder
    ----------------------------*/
    startRecording(stream, id = "recorder") {
        this.recorder.start(stream);
        this.emit("recordingStarted", id);
    }

    stopRecording(id = "recorder") {
        this.recorder.stop();
        this.emit("recordingStopped", id);
    }

    downloadRecording(filename = "recording.webm") {
        this.recorder.download(filename);
    }

    /* ----------------------------
       Video Effects / Drawing
    ----------------------------*/
    drawFrame(id) {
        const element = this.videos[id];
        const effect = this.effects[id];
        if (!element || !effect) return;

        effect.drawingFrame(this.videoContext, element);
        requestAnimationFrame(() => this.drawFrame(id));
    }

    /* ----------------------------
       Event System
    ----------------------------*/
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        (this.listeners[event] || []).forEach(cb => cb(data));
    }

    /* ----------------------------
       Status / JSON
    ----------------------------*/
    toJson() {
        const status = {};
        for (const id in this.videos) {
            const element = this.videos[id];
            status[id] = {
                paused: element.paused,
                ended: element.ended,
                muted: element.muted,
                srcObject: !!element.srcObject,
                effectAttached: !!this.effects[id]
            };
        }
        return {
            videos: status,
            videoIds: Object.keys(this.videos),
            recorderActive: !!this.recorder,
            class: "TsunamiFlowVideoNetwork"
        };
    }
}