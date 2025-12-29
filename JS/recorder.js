export class TfRecorder {
    constructor({
        fps = 30,
        mimeType = 'video/webm; codecs=vp8,opus',
        videoBitrate = 4_000_000,
        chunkMs = 1000
    } = {}) {
        this.fps = fps;
        this.mimeType = mimeType;
        this.videoBitrate = videoBitrate;
        this.chunkMs = chunkMs;

        this.stream = null;
        this.mediaRecorder = null;
        this.audioDest = null;
        this.recording = false;
    }

    buildStream({ canvas, audioContext = null, analyser = null }) {
        if (!canvas) {
            throw new Error("Recorder requires a canvas");
        }

        const stream = canvas.captureStream(this.fps);

        if (audioContext && analyser) {
            this.audioDest =
                audioContext.createMediaStreamDestination();

            analyser.connect(this.audioDest);

            const audioTrack =
                this.audioDest.stream.getAudioTracks()[0];

            if (audioTrack) {
                stream.addTrack(audioTrack);
            }
        }

        this.stream = stream;
        return stream;
    }

    start({
        canvas,
        audioContext = null,
        analyser = null,
        websocket = null
    }) {
        if (this.recording) return;

        if (!this.stream) {
            this.buildStream({ canvas, audioContext, analyser });
        }

        this.mediaRecorder = new MediaRecorder(this.stream, {
            mimeType: this.mimeType,
            videoBitsPerSecond: this.videoBitrate
        });

        this.mediaRecorder.ondataavailable = (e) => {
            if (!e.data || e.data.size === 0) return;
            if (websocket?.isOpen()) {
                websocket.sendBinary(e.data);
            }
        };

        this.mediaRecorder.start(this.chunkMs);
        this.recording = true;
    }

    stop() {
        if (!this.recording) return;

        this.mediaRecorder?.stop();
        this.mediaRecorder = null;
        this.recording = false;
    }

    reset() {
        this.stop();
        this.stream = null;
        this.audioDest = null;
    }

    toJson() {
        return {
            recording: this.recording,
            fps: this.fps,
            mimeType: this.mimeType
        };
    }
}