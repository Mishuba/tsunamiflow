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

        this.wsUrl = wsUrl;
        this.streamKey = streamKey;

        this.stream = null;
        this.recorder = null;
        this.externalAudioStream = null;
        this.recording = false;
        this.ws = null;

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

    connectWebSocket() {
        if (!this.streamKey) throw new Error('streamKey required');
        this.ws = new WebSocket(`${this.wsUrl}?key=${this.streamKey}&role=broadcaster`);
        this.ws.binaryType = 'arraybuffer';

        this.ws.onopen = () => {
            // Tell the server to start FFmpeg
            this.ws.send(JSON.stringify({ type: 'start_stream' }));
        };

        this.ws.onclose = () => {
            console.log('WebSocket closed');
        };

        this.ws.onerror = (err) => {
            console.error('WebSocket error', err);
        };
    }

    start({ canvas }) {
        if (this.recording) return;

        if (!this.stream) this.buildStream({ canvas });
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) this.connectWebSocket();

        this.recorder = new MediaRecorder(this.stream, {
            mimeType: this.mimeType,
            videoBitsPerSecond: this.videoBitrate
        });

        this.recorder.ondataavailable = async (e) => {
            if (!e.data || e.data.size === 0) return;

            // Optional local copy
            this.chunks.push(e.data);

            // Send to WebSocket for FFmpeg
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                const arrayBuffer = await e.data.arrayBuffer();
                this.ws.send(arrayBuffer);
            }
        };

        this.recorder.start(this.chunkMs); // chunkMs controls chunk frequency
        this.recording = true;
return this.stream;
    }

    stop() {
        if (!this.recording) return;

        if (this.recorder && this.recorder.state !== 'inactive') {
            this.recorder.stop();
        }

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'stop_stream' }));
            this.ws.close();
        }

        this.recorder = null;
        this.ws = null;
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