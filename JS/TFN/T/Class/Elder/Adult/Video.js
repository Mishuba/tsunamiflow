import { TsunamiFlowFrames } from "./Teen/Frames.js";

export class TsunamiFlowVideo extends TsunamiFlowFrames {

    videoElement = null;
    remoteVideoElement = null;
    autoplay = true;
    muted = false;
    controls = false;
    onReady = null;
    streamVideo = null;
    constructor(option = {}) {
        super(option);
        if (option.videoElement) {
            this.videoElement = option.videoElement;
            this.videoElement.autoplay = this.autoplay;
            this.videoElement.muted = this.muted;
            this.videoElement.controls = this.controls;
        } else {
            //this.videoElement = document.createElement("video");
        }
        /*
        this.VideomediaSource = new MediaSource();
        this.VideomediaSource.addEventListener("sourceopen", () => this.emit("sourceopen"));
        this.VideomediaSource.addEventListener("sourceended", () => this.emit("sourceended"));
        this.VideomediaSource.addEventListener("sourceclose", () => this.emit("sourceclose"));
        */
    }
    attachVideoStream(stream) {
        if (!(stream instanceof MediaStream)) {
            throw new TypeError(
                "attachVideoStream requires a MediaStream"
            );
        }

        if (this.streamVideo) {
            this.detachVideoStream();
        }

        this.streamVideo = stream;

        this.videoElement.srcObject = stream;

        this.videoElement.play().catch(() => { });

        this.emit(
            "streamAttached",
            stream
        );

        if (this.onReady) {
            this.onReady(stream);
        }
    }
    detachVideoStream() {
        if (this.videoElement?.srcObject) {
            this.videoElement.srcObject = null;
        }

        this.streamVideo = null;

        this.emit("streamDetached");
    }
    stopVideoStream() {
        if (this.videoElement?.srcObject) {

            this.videoElement.srcObject
                .getTracks()
                .forEach(track => track.stop());

            this.videoElement.srcObject = null;
        }

        this.streamVideo = null;

        this.emit("streamDetached");
    }

    replaceVideoStream(newStream) {
        this.detachVideoStream();
        this.attachVideoStream(newStream);
    }

    VideoNetworkState(element = this.videoElement) {
        if (!element) {
            return;
        }

        switch (element.networkState) {

            case HTMLMediaElement.NETWORK_EMPTY:
                console.log(
                    "Video network: EMPTY"
                );
                break;

            case HTMLMediaElement.NETWORK_IDLE:
                console.log(
                    "Video network: IDLE"
                );
                break;

            case HTMLMediaElement.NETWORK_LOADING:
                console.log(
                    "Video network: LOADING"
                );
                break;

            case HTMLMediaElement.NETWORK_NO_SOURCE:
                console.warn(
                    "Video network: NO SOURCE"
                );
                break;
        }

        switch (element.readyState) {

            case HTMLMediaElement.HAVE_NOTHING:
                console.log(
                    "Video readyState: HAVE_NOTHING"
                );
                break;

            case HTMLMediaElement.HAVE_METADATA:
                console.log(
                    "Video readyState: HAVE_METADATA"
                );
                break;

            case HTMLMediaElement.HAVE_CURRENT_DATA:
                console.log(
                    "Video readyState: HAVE_CURRENT_DATA"
                );
                break;

            case HTMLMediaElement.HAVE_FUTURE_DATA:
                console.log(
                    "Video readyState: HAVE_FUTURE_DATA"
                );
                break;

            case HTMLMediaElement.HAVE_ENOUGH_DATA:
                console.log(
                    "Video readyState: HAVE_ENOUGH_DATA"
                );
                break;
        }

        if (element.ended) {
            console.log(
                "Video playback ended normally"
            );
            return;
        }

        if (element.paused) {

            if (element.currentTime === 0) {
                console.log(
                    "Video not started yet"
                );
            } else {
                console.log(
                    `Video paused at ${element.currentTime.toFixed(2)
                    }s`
                );
            }

            return;
        }

        console.log("Video is playing");
    }

    VideoState(context) {
        if (!context) {
            console.warn(
                "AudioContext missing"
            );
            return;
        }

        if (
            context.state === "suspended" &&
            !this.videoElement.paused
        ) {
            context.resume();

            console.log(
                "AudioContext resumed for video"
            );
        }

        if (
            context.state === "running" &&
            this.videoElement.paused &&
            this.videoElement.currentTime === 0
        ) {
            console.log(
                "Video idle, AudioContext left running"
            );
        }
    }
}
