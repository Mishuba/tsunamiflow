export class TsunamiFlowVideoRecorder extends TsunamiFlowVideo {
    webcamvideoTrack = null;
    webcamaudioTrack = null;
    webcamconstraints = {
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
        },
        video: {
            frameRate: {
                min: 15,
                ideal: 30,
                max: 60
            },
            width: 600,
            height: 480,
            resizeMode: "crop-and-scale"
            //aspectRatio:
            //facingMode: 
            //zoom:
            //torch:
            //focusMode:
        }
    };
    webcamstream = null;
    webcamonReady = null;
    backgroundVideo = null;
    backgroundImg = null;
    videoBitsPerSecond = 4000000;
    audioBitsPerSecond = 128000;
    ScreenSharestream = null;
    ScreenSharevideoTrack = null;
    ScreenShareaudioTrack = null;
    ScreenShareonReady = null;
    RecorderchunkMs = 1000;
    RecorderonData = null;
    RecorderonStart = null;
    RecorderonStop = null;
    Videorecorder = null;
    RecorderonStart = null;
    Videorecorderstream = null;
    Recorderchunks = [];
    Videorecording = false;
    constructor(option = {}) {
        this.blobtype = option.blobtype || "video/webm;codecs=vp8,opus";
    }
    async startScreenShare() {

        if (this.ScreenSharestream) return this.ScreenSharestream;

        this.ScreenSharestream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true
        });

        this.ScreenSharevideoTrack = this.ScreenSharestream.getVideoTracks()[0] || null;
        this.ScreenShareaudioTrack = this.ScreenSharestream.getAudioTracks()[0] || null;

        if (this.ScreenShareonReady) this.onReady(this.ScreenSharestream);

        return this.ScreenSharestream;
    }

    stopScreenShare() {

        if (!this.ScreenSharestream) return;

        this.ScreenSharestream.getTracks().forEach(t => t.stop());

        this.ScreenSharestream = null;
        this.ScreenSharevideoTrack = null;
        this.ScreenShareaudioTrack = null;
    }
    async startwebcam() {
        if (this.webcamstream) return this.webcamstream;

        try {
            this.webcamstream = await navigator.mediaDevices.getUserMedia(this.webcamconstraints);

            this.webcamvideoTrack = this.webcamstream.getVideoTracks()[0] || null;
            this.webcamaudioTrack = this.webcamstream.getAudioTracks()[0] || null;

            if (this.webcamonReady) this.webcamonReady(this.webcamstream);
            return this.webcamstream;
        } catch (err) {
            console.error("TfWebcam start failed:", err);
            throw err;
        }
    }
    attachwebcam() {
        if (!this.webcamstream) throw new Error("Webcam not started");

        if (this.videoElement.srcObject !== this.webcamstream) {
            this.videoElement.srcObject = this.webcamstream;
        }

        // Avoid autoplay race conditions
        if (this.videoElement.paused) {
            this.videoElement.play().catch(() => { });
        }
    }
    replacewebcamTrack(newTrack) {
        if (!this.webcamstream || !newTrack) return;

        const kind = newTrack.kind; // "video" or "audio"
        const oldTrack =
            kind === "video"
                ? this.webcamstream.getVideoTracks()[0]
                : this.webcamstream.getAudioTracks()[0];

        if (oldTrack) {
            this.webcamstream.removeTrack(oldTrack);
            oldTrack.stop();
        }

        this.webcamstream.addTrack(newTrack);

        if (kind === "video") this.webcamvideoTrack = newTrack;
        if (kind === "audio") this.webcamaudioTrack = newTrack;
    }
    stopwebcam() {
        if (!this.webcamstream) return;

        this.webcamstream.getTracks().forEach(track => {
            track.stop();
        });

        this.webcamstream = null;
        this.webcamvideoTrack = null;
        this.webcamaudioTrack = null;
    }
    UploadVideo(e) {
        const file = e.target.files[0];
        if (file) {
            this.backgroundVideo = document.createElement("video");
            this.backgroundVideo.src = URL.createObjectURL(file);
            this.backgroundVideo.muted = true;
            this.backgroundVideo.loop = true;
            this.backgroundVideo.playsInline = true;

            this.backgroundVideo.oncanplay = () => {
                this.backgroundVideo.play().catch(() => { });
            };

            this.backgroundVideo.load();
        }
    }

    RemoveVideo(ctx, canvas_width, canvas_height) {
        if (this.backgroundVideo) {
            this.backgroundVideo.pause();
            this.backgroundVideo.currentTime = 0;
            this.backgroundVideo = null;
            ctx.clearRect(0, 0, canvas_width, canvas_height);
        }
    }
    startRecorder(stream) {
        if (!stream) throw new Error("TfMediaRecorder requires a MediaStream");
        if (this.Videorecording) return;

        this.Videorecorderstream = stream;

        this.Videorecorder = new MediaRecorder(stream, {
            mimeType: this.blobtype,
            videoBitsPerSecond: this.videoBitsPerSecond,
            audioBitsPerSecond: this.audioBitsPerSecond
        });

        this.Videorecorder.onstart = () => {
            this.Videorecording = true;
            if (this.RecorderonStart) this.RecorderonStart();
        };

        this.Videorecorder.ondataavailable = (e) => {
            if (!e.data || e.data.size === 0) return;

            this.Recorderchunks.push(e.data);

            if (this.RecorderonData) {
                this.RecorderonData(e.data);
            }
        };

        this.Videorecorder.onstop = () => {
            this.Videorecording = false;
            if (this.RecorderonStop) this.RecorderonStop();
        };

        this.Videorecorder.start(this.RecorderchunkMs);
    }
    pauseRecorder() {
        if (this.Videorecorder?.state === "recording") {
            this.Videorecorder.pause();
        }
    }
    resumeRecorder() {
        if (this.Videorecorder?.state === "paused") {
            this.Videorecorder.resume();
        }
    }
    stopRecorder() {
        if (!this.Videorecorder) return;

        if (this.Videorecorder.state !== "inactive") {
            this.Videorecorder.stop();
        }
    }
    resetRecorder() {
        this.stopRecorder();
        this.Recorderchunks = [];
        this.Videorecorderstream = null;
        this.Videorecorder = null;
        this.Videorecording = false;
    }
    getRecorderBlob() {
        if (!this.Recorderchunks.length) return null;
        return new Blob(this.Recorderchunks, { type: this.blobtype });
    }
    downloadRecorder(filename = "Tsunami Flow Video.webm") {
        const blob = this.getRecorderBlob();
        if (!blob) return;

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
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