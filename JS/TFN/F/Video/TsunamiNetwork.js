// Unified TsunamiFlowNetwork class
import { TfWebcam } from './TfWebcam.js';
import { TfScreenShare } from './TfScreenShare.js';
import { TfWebRTC } from './TfWebRTC.js';
import { TfMediaSource } from './TfMediaSource.js';
import { TfMediaRecorder } from './TfMediaRecorder.js';
import { TsunamiFlowMediaStream } from './TsunamiFlowMediaStream.js';

export class TsunamiFlowNetwork {
    constructor() {
        // Core media modules
        this.webcam = new TfWebcam();
        this.screenShare = new TfScreenShare();
        this.webrtc = new TfWebRTC();
        this.mediaSource = new TfMediaSource();
        this.recorder = new TfMediaRecorder();
        this.canvasStream = new TsunamiFlowMediaStream();

        // Internal event system
        this.listeners = {};
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
       Start webcam
    ----------------------------*/
    async startWebcam() {
        const stream = await this.webcam.start();
        this.emit('webcamStarted', stream);
        return stream;
    }

    stopWebcam() {
        this.webcam.stop();
        this.emit('webcamStopped');
    }

    attachWebcam(videoElement) {
        this.webcam.attach(videoElement);
    }

    /* ----------------------------
       Start screen share
    ----------------------------*/
    async startScreenShare(constraints) {
        const stream = await this.screenShare.start(constraints);
        this.emit('screenShareStarted', stream);
        return stream;
    }

    stopScreenShare() {
        this.screenShare.stop();
        this.emit('screenShareStopped');
    }

    attachScreenShare(videoElement) {
        if (this.screenShare.getStream()) videoElement.srcObject = this.screenShare.getStream();
    }

    /* ----------------------------
       Canvas + Audio MediaStream
    ----------------------------*/
    startCanvasStream(options) {
        const stream = this.canvasStream.start(options);
        this.emit('canvasStreamStarted', stream);
        return stream;
    }

    stopCanvasStream() {
        this.canvasStream.stop();
        this.emit('canvasStreamStopped');
    }

    replaceCanvas(newCanvas, fps = 30) {
        const stream = this.canvasStream.replaceCanvas(newCanvas, fps);
        this.emit('canvasStreamReplaced', stream);
        return stream;
    }

    getCanvasStream() {
        return this.canvasStream.getStream();
    }

    /* ----------------------------
       WebRTC
    ----------------------------*/
    async startLocalWebRTC() {
        const stream = await this.webrtc.startLocal();
        this.emit('webrtcLocalReady', stream);
        return stream;
    }

    async initPeerWebRTC(iceServers) {
        const pc = await this.webrtc.initPeer(iceServers);
        this.emit('webrtcPeerReady', pc);
        return pc;
    }

    async handleSignalWebRTC(data) {
        await this.webrtc.handleSignal(data);
    }

    closePeerWebRTC() {
        this.webrtc.closePeer();
        this.emit('webrtcPeerClosed');
    }

    /* ----------------------------
       MediaSource
    ----------------------------*/
    attachMediaSource(videoElement) {
        this.mediaSource.attach(videoElement);
    }

    createSourceBuffer(mimeType) {
        return this.mediaSource.createSourceBuffer(mimeType);
    }

    appendMediaSourceBuffer(data) {
        this.mediaSource.appendBuffer(data);
    }

    endMediaSource() {
        this.mediaSource.endStream();
    }

    destroyMediaSource() {
        this.mediaSource.destroy();
    }

    /* ----------------------------
       MediaRecorder
    ----------------------------*/
    startRecording(stream, options = {}) {
        if (options.mimeType) this.recorder.mimeType = options.mimeType;
        if (options.videoBitsPerSecond) this.recorder.videoBitsPerSecond = options.videoBitsPerSecond;
        if (options.audioBitsPerSecond) this.recorder.audioBitsPerSecond = options.audioBitsPerSecond;
        if (options.chunkMs) this.recorder.chunkMs = options.chunkMs;

        this.recorder.onData = options.onData || null;
        this.recorder.onStart = options.onStart || null;
        this.recorder.onStop = options.onStop || null;

        this.recorder.start(stream);
        this.emit('recordingStarted', stream);
    }

    stopRecording() {
        this.recorder.stop();
        this.emit('recordingStopped');
    }

    pauseRecording() {
        this.recorder.pause();
    }

    resumeRecording() {
        this.recorder.resume();
    }

    resetRecording() {
        this.recorder.reset();
    }

    getRecordingBlob() {
        return this.recorder.getBlob();
    }

    downloadRecording(filename) {
        this.recorder.download(filename);
    }

    /* ----------------------------
       Quick status for all modules
    ----------------------------*/
    toJson() {
        return {
            webcam: this.webcam.toJson(),
            screenShare: this.screenShare.toJson(),
            webrtc: this.webrtc.toJson(),
            mediaSource: this.mediaSource.toJson(),
            recorder: this.recorder.toJson(),
            canvasStream: this.canvasStream ? this.canvasStream.getStream() ? { active: true } : { active: false } : null
        };
    }
}