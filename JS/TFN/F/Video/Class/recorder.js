export class TfRecorder {
    constructor({
        mimeType = "video/webm;codecs=vp8,opus",
        videoBitsPerSecond = 4000000,
        audioBitsPerSecond = 128000,
        chunkMs = 1000,
        onData = null,
        onStart = null,
        onStop = null
    } = {}) {

        this.stream = null;
        this.recorder = null;

        this.mimeType = mimeType;
        this.videoBitsPerSecond = videoBitsPerSecond;
        this.audioBitsPerSecond = audioBitsPerSecond;
        this.chunkMs = chunkMs;

        this.chunks = [];

        this.onData = onData;
        this.onStart = onStart;
        this.onStop = onStop;

        this.recording = false;
    }

    start(stream) {
        if (!stream) throw new Error("TfMediaRecorder requires a MediaStream");
        if (this.recording) return;

        this.stream = stream;

        this.recorder = new MediaRecorder(stream, {
            mimeType: this.mimeType,
            videoBitsPerSecond: this.videoBitsPerSecond,
            audioBitsPerSecond: this.audioBitsPerSecond
        });

        this.recorder.onstart = () => {
            this.recording = true;
            if (this.onStart) this.onStart();
        };

        this.recorder.ondataavailable = (e) => {
            if (!e.data || e.data.size === 0) return;

            this.chunks.push(e.data);

            if (this.onData) {
                this.onData(e.data);
            }
        };

        this.recorder.onstop = () => {
            this.recording = false;
            if (this.onStop) this.onStop();
        };

        this.recorder.start(this.chunkMs);
    }

    stop() {
        if (!this.recorder) return;

        if (this.recorder.state !== "inactive") {
            this.recorder.stop();
        }
    }

    pause() {
        if (this.recorder?.state === "recording") {
            this.recorder.pause();
        }
    }

    resume() {
        if (this.recorder?.state === "paused") {
            this.recorder.resume();
        }
    }

    reset() {
        this.stop();
        this.chunks = [];
        this.stream = null;
        this.recorder = null;
        this.recording = false;
    }

    getBlob() {
        if (!this.chunks.length) return null;
        return new Blob(this.chunks, { type: this.mimeType });
    }

    download(filename = "recording.webm") {
        const blob = this.getBlob();
        if (!blob) return;

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    }

    toJson() {
        return {
            recording: this.recording,
            mimeType: this.mimeType,
            videoBitsPerSecond: this.videoBitsPerSecond,
            audioBitsPerSecond: this.audioBitsPerSecond,
            chunkMs: this.chunkMs
        };
    }
}