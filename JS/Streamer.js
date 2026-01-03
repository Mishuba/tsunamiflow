export class TfMediaStream {
  constructor() {
    this.canvas = null;
    this.audioContext = null;
    this.sourceNode = null;

    this.videoStream = null;
    this.audioStream = null;
    this.stream = null;
  }

  start({
    canvas,
    audioContext = null,
    sourceNode = null,
    fps = 30
  }) {
    if (!canvas) {
      throw new Error("Canvas is required to create MediaStream");
    }

    this.canvas = canvas;
    this.audioContext = audioContext;
    this.sourceNode = sourceNode;

    // ---- VIDEO (canvas is king)
    this.videoStream = canvas.captureStream(fps);

    const tracks = [...this.videoStream.getVideoTracks()];

    // ---- AUDIO (optional, but correct)
    if (audioContext && sourceNode) {
      const dest = audioContext.createMediaStreamDestination();
      sourceNode.connect(dest);

      this.audioStream = dest.stream;
      tracks.push(...this.audioStream.getAudioTracks());
    }

    // ---- FINAL STREAM
    this.stream = new MediaStream(tracks);

    return this.stream;
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
    }

    this.videoStream = null;
    this.audioStream = null;
    this.stream = null;
  }
}