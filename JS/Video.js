export class TfVideo {
    constructor(Socket = null, TfEffect = null) {
        //implemented classes
        this.VideoSocket = Socket;
        this.VidEffects = TfEffect;
        //buttons
        this.VideoSystemControllerButton;
        this.VideoSystemControllerStopButton;
        //ChromaKey
        this.animationId;
        //Image
        this.TfVidDrawFrame;
        this.VideoProcessor;
        this.VideoReader;
        this.isPlaying = false;
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
    VideoState(element, context) {
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
    emptiedVideo(element) {
        this.VideoNetworkState(element);
    }
    loadVideo(element) {
        this.VideoNetworkState(element);
    }
    loadedVideoMetadata(element, canvas) {
        this.VideoNetworkState(element);
        canvas = element.videoWidth;
        canvas = element.videoHeight;
    }
    loadedVideoData(element, context) {
        this.VideoState(element, context);
    }
    canPlayVideo(element, context) {
        this.VideoState(element, context);
    }
    canPlayVideoThrough(element, context) {
        this.VideoState(element, context);
    }
    playVideo(element, context) {
        this.VideoState(element, context);
    }
    pauseVideo(element, context) {
        this.VideoState(element, context);
    }
    VideoEnded(element, context) {
        this.VideoState(element, context);
        console.log("The video has ended");
    }
    VideoWaiting(element, context) {
        this.VideoState(element, context);
    }
    VideoPlaying(element, context) {
        this.VideoState(element, context);
    }
    VideoStalled() {
        console.log("The video has stalled");
    }
    VideoSuspended(element) {
        this.VideoNetworkState(element);
    }
    FormatVideoTime(seconds) {
        let m = Math.floor(seconds / 60); let s = seconds % 60; return `${m}:${s.toString().padStart(2, "0")}`;
    }
    UpdateVideoTime(element) {
        //let TimingVideo = Math.floor(element.currentTime);
        //let UsingTfVidTk = `Time: ${this.FormatVideoTime(TimingVideo)}`;
        //let VideoProcessBar = (element.currentTime / element.duration) * 100;
    }
    VideoVolumeChange() {
        console.log("The video volume has changed");
    }
    drawFrame(stream, canvas, video) {
        this.VidEffects.drawingFrame(canvas, video);

        this.animationId = requestAnimationFrame(() => this.drawFrame(stream));
    }
    RemoveChromaKeyColor(ctx, canvas_width, canvas_height) {
        ctx.clearRect(0, 0, canvas_width, canvas_height);
        this.VidEffects.disableChromaKey();
    }
    VideoSystemStart(element, stream) {
        if (this.isPlaying === true) {
            this.isPlaying = false;
            cancelAnimationFrame(this.animationId);
            element.pause();
            return;
        } else {
            this.isPlaying = true;
            if (stream) {
                element.play();
            }
        }
        this.drawFrame(stream);
    }
    VideoSystemStop(stopSystem, element, stream, ctx, canvas_height, canvas_width) {
        cancelAnimationFrame(this.animationId);
        ctx.clearRect(0, 0, canvas_width, canvas_height);
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            element.srcObject = null;
            stream = null;
        }
        stopSystem.style.display = "none";
    }
    VideoWebCodecs(stream) {
        const track = stream.getVideoTracks()[0];
        this.VideoProcessor = new MediaStreamTrackProcessor({ track });
        this.VideoReader = this.VideoProcessor.readable.getReader();
    }
    LetsBegin() {
        //videoElement.srcObject = stream;
    }
}