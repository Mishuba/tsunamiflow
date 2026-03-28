export class TfLive {
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
        if (!this.supportedVideomediaSource) {
            console.warn("MediaSource API not supported");
            this.VideomediaSource = null;
        }
        if (option.videoElement) {
            this.videoElement = option.videoElement;
        } else {
            this.videoElement = document.createElement("video");
        }
        this.videoElement.autoplay = autoplay;
        this.videoElement.muted = muted;
        this.videoElement.controls = controls;
        this.VideomediaSource = new MediaSource();
        this.VideomediaSource.addEventListener("sourceopen", () => this.emit("sourceopen"));
        this.VideomediaSource.addEventListener("sourceended", () => this.emit("sourceended"));
        this.VideomediaSource.addEventListener("sourceclose", () => this.emit("sourceclose"));
    }

    emptiedVideo() {
        this.VideoNetworkState();
    }

    loadVideo() {
        this.VideoNetworkState();
    }
    loadedVideoMetadata(element, canvas) {
        this.VideoNetworkState();
        canvas = element.videoWidth;
        canvas = element.videoHeight;
    }
    loadedVideoData(context) {
        this.VideoState(context);
    }
    canPlayVideo(context) {
        this.VideoState(context);
    }
    canPlayVideoThrough(context) {
        this.VideoState(context);
    }
    playVideo(context) {
        this.VideoState(context);
    }
    pauseVideo(context) {
        this.VideoState(context);
    }
    FormatVideoTime(seconds) {
        let m = Math.floor(seconds / 60); let s = seconds % 60; return `${m}:${s.toString().padStart(2, "0")}`;
    }
    UpdateVideoTime(element) {
        //let TimingVideo = Math.floor(element.currentTime);
        //let UsingTfVidTk = `Time: ${this.FormatVideoTime(TimingVideo)}`;
        //let VideoProcessBar = (element.currentTime / element.duration) * 100;
    }
    VideoPlaying(context) {
        this.VideoState(context);
    }
    VideoVolumeChange() {
        console.log("The video volume has changed");
    }
    VideoEnded(context) {
        this.VideoState(context);
        console.log("The video has ended");
    }
    VideoWaiting(context) {
        this.VideoState(context);
    }
    VideoStalled() {
        console.log("The video has stalled");
    }
    VideoSuspended() {
        this.VideoNetworkState();
    }
}