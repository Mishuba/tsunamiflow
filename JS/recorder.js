export class TfRecorder {
    constructor({
        fps = 30,
        mimeType = 'video/webm; codecs=vp8,opus',
        videoBitrate = 4_000_000,
        chunkMs = 1000,
        wsUrl = 'wss://world.tsunamiflow.club/ws',
        streamKey = null
    } = {}) {
        this.fps = fps;
        this.mimeType = mimeType;
        this.videoBitrate = videoBitrate;
        this.chunkMs = chunkMs;
        this.stream = null;
        this.recorder = null;
        this.externalAudioStream = null;
        this.recording = false;
        this.chunks = []; // optional local storage
    }

    useExternalAudioStream(audioStream) {
        this.externalAudioStream = audioStream;
    }

    buildStream({ canvas }) {
        const stream = canvas.captureStream(this.fps);

        if (this.externalAudioStream) {
            this.externalAudioStream.getAudioTracks()
                .forEach(track => stream.addTrack(track));
        }

        this.stream = stream;
        return stream;
    }
    start( canvas, ws ) {
        if (this.recording) return;

        if (!this.stream) this.buildStream({ canvas });

        this.recorder = new MediaRecorder(this.stream, {
            mimeType: this.mimeType,
            videoBitsPerSecond: this.videoBitrate
        });

        this.recorder.ondataavailable = async (e) => {
            if (!e.data || e.data.size === 0) return;

            // Optional local copy
            this.chunks.push(e.data);
                const arrayBuffer = await e.data.arrayBuffer();
                
}
        this.recorder.start(this.chunkMs); // chunkMs controls chunk frequency
        this.recording = true;
return this.stream;
    }

    stop() {
        if (!this.recording) return;

        if (this.recorder && this.recorder.state !== 'inactive') {
            this.recorder.stop();
        }
        this.recorder = null;
        this.recording = false;
    }

    reset() {
        this.stop();
        this.stream = null;
        this.externalAudioStream = null;
        this.chunks = [];
    }

    getBlob() {
        if (!this.chunks.length) return null;
        return new Blob(this.chunks, { type: this.mimeType });
    }

    download(filename = 'recording.webm') {
        const blob = this.getBlob();
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}