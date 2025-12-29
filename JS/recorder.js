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
        this.recorder = null;
        this.audioDest = null;
        this.recording = false;
    }
buildStream({ canvas, audioContext, analyser, sourceNode }) {
    const stream = canvas.captureStream(this.fps);

    if (audioContext && sourceNode) {
        this.audioDest = audioContext.createMediaStreamDestination();
        sourceNode.connect(this.audioDest);

        const track = this.audioDest.stream.getAudioTracks()[0];
        if (track) stream.addTrack(track);
    }

    this.stream = stream;
    return stream;
}

    start({
        canvas,
        audioContext = null,
        analyser = null,
        websocket
    }) {
        if (this.recording) return;
        if (!websocket?.isOpen()) {
            console.warn("Recorder: websocket not open");
            return;
        }

        if (!this.stream) {
            this.buildStream({ canvas, audioContext, analyser });
        }

        this.recorder = new MediaRecorder(this.stream, {
            mimeType: this.mimeType,
            videoBitsPerSecond: this.videoBitrate
        });

        this.recorder.ondataavailable = (e) => {
            if (!e.data || e.data.size === 0) return;
            websocket.sendBinary(e.data); // ← EXACT match to PHP
        };

        this.recorder.start(this.chunkMs);
        this.recording = true;
    }

    stop(websocket = null) {
        if (!this.recording) return;

        this.recorder.stop();
        this.recorder = null;
        this.recording = false;

        websocket?.send?.(JSON.stringify({
            type: "stop_stream"
        }));
    }

    reset() {
        this.stop();
        this.stream = null;
        this.audioDest = null;
    }
}