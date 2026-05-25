import { TsunamiFlowFrames } from "./Teen/Frames.js";

export class TsunamiFlowVideo extends TsunamiFlowFrames {
    videoElement = null;
    remoteVideoElement = null;
    VideoProcessor = null;
    VideoReader = null;
    autoplay = true;
    muted = false;
    controls = false;
    onReady = null;
    streamVideo = null;
    supportedVideomediaSource = "MediaSource" in window;
    VideomediaSource = new MediaSource();
    VideomediaSourceBuffer = null;
    VideoobjectUrl = null;
    queueVideo = [];
    constructor(option = {}) {
        super(option);
        if (!this.supportedVideomediaSource) {
            console.warn("MediaSource API not supported");
            this.VideomediaSource = null;
        }
        if (option.videoElement) {
            this.videoElement = option.videoElement;
        } else {
            this.videoElement = document.createElement("video");
        }
        this.videoElement.autoplay = this.autoplay;
        this.videoElement.muted = this.muted;
        this.videoElement.controls = this.controls;
        this.VideomediaSource = new MediaSource();
        this.VideomediaSource.addEventListener("sourceopen", () => this.emit("sourceopen"));
        this.VideomediaSource.addEventListener("sourceended", () => this.emit("sourceended"));
        this.VideomediaSource.addEventListener("sourceclose", () => this.emit("sourceclose"));
        if (option.canvas) {
            this.canvas = option.canvas;
        } else {
            this.canvas = document.createElement("video");
        }
    }
    attachVideoStream(stream) {
        if (!stream) throw new Error("No MediaStream provided");

        this.streamVideo = stream;
        this.videoElement.srcObject = stream;

        // Ensure playback starts
        this.videoElement.play().catch(() => { });

        this.emit("streamAttached", stream);
        if (this.onReady) this.onReady(stream);
    }
    detachVideoStream() {
        if (this.videoElement.srcObject) {
            this.videoElement.srcObject.getTracks().forEach(track => track.stop());
            this.videoElement.srcObject = null;
        }
        this.streamVideo = null;
        this.emit("streamDetached");
    }
    replaceVideoStream(newStream) {
        this.detachVideoStream();
        this.attachVideoStream(newStream);
    }
    VideoNetworkState(element) {
        if (element === null) {
            return;
        }
        // ---- NETWORK STATE ----
        switch (element.networkState) {
            case element.NETWORK_EMPTY:
                console.log("Video network: EMPTY (no source)");
                break;
            case element.NETWORK_IDLE:
                console.log("Video network: IDLE");
                break;
            case element.NETWORK_LOADING:
                console.log("Video network: LOADING");
                break;
            case element.NETWORK_NO_SOURCE:
                console.warn("Video network: NO SOURCE");
                break;
        }
        // ---- READY STATE ----
        switch (element.readyState) {
            case element.HAVE_NOTHING:
                console.log("Video readyState: HAVE_NOTHING");
                break;
            case element.HAVE_METADATA:
                console.log("Video readyState: HAVE_METADATA");
                break;
            case element.HAVE_CURRENT_DATA:
                console.log("Video readyState: HAVE_CURRENT_DATA");
                break;
            case element.HAVE_FUTURE_DATA:
                console.log("Video readyState: HAVE_FUTURE_DATA");
                break;
            case element.HAVE_ENOUGH_DATA:
                console.log("Video readyState: HAVE_ENOUGH_DATA");
                break;
        }
        // ---- PLAYBACK STATE ----
        if (element.ended) {
            console.log("Video playback ended normally");
            return;
        }
        if (element.paused) {
            if (element.currentTime === 0) {
                console.log("Video not started yet");
            } else {
                console.log(`Video paused at ${element.currentTime.toFixed(2)}s`);
            }
            return;
        }
        console.log("Video is playing");
    }
    VideoState(context) {
        if (!context) {
            console.warn("AudioContext missing");
            return;
        }

        if (context.state === "suspended" && !element.paused) {
            context.resume();
            console.log("AudioContext resumed for video");
        }

        if (context.state === "running" && element.paused && element.currentTime === 0) {
            console.log("Video idle, AudioContext left running");
        }
    }
}