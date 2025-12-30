export class TfWebRTC {
  constructor({
    canvas,
    wsUrl,
    streamKey
  }) {
    this.canvas = canvas;
    this.wsUrl = wsUrl;
    this.streamKey = streamKey;

    this.pc = null;
    this.ws = null;
  }

  async start() {
    const stream = this.canvas.captureStream(60);

    this.pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    stream.getTracks().forEach(track => {
      this.pc.addTrack(track, stream);
    });

    this.ws = new WebSocket(
      `${this.wsUrl}?role=broadcaster&key=${this.streamKey}`
    );

    this.ws.onmessage = async e => {
      const msg = JSON.parse(e.data);

      if (msg.type !== "signal") return;

      const data = msg.data;

      if (data.answer) {
        await this.pc.setRemoteDescription(data.answer);
      }

      if (data.candidate) {
        await this.pc.addIceCandidate(data.candidate);
      }
    };

    this.pc.onicecandidate = e => {
      if (!e.candidate) return;

      this.ws.send(JSON.stringify({
        type: "signal",
        data: { candidate: e.candidate }
      }));
    };

    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({
        type: "signal",
        data: { offer }
      }));
    };
  }

  stop() {
    this.pc?.close();
    this.ws?.close();
  }
}