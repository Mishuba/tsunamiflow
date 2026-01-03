export class TfWebRTCRecorder {
  constructor({ remoteVideo = null, websocket = null, localVideo = null } = {}) {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.websocket = websocket;
    this.localVideo = localVideo;
    this.remoteVideo = remoteVideo;
    this.listeners = {};
  }

  async initLocalStream({ video = true, audio = true } = {}) {
    if (this.localStream) return this.localStream;

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video, audio });
      if (this.localVideo) this.localVideo.srcObject = this.localStream;
      this.emit("localStreamReady", this.localStream);
      return this.localStream;
    } catch (err) {
      console.error("Error accessing local media:", err);
      this.emit("error", err);
    }
  }

  async createPeerConnection(iceServers = null) {
    if (this.peerConnection) return this.peerConnection;

    this.peerConnection = new RTCPeerConnection({
      iceServers: iceServers || [{ urls: "stun:stun.l.google.com:19302" }]
    });

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection.addTrack(track, this.localStream);
      });
    }

    this.remoteStream = new MediaStream();
    if (this.remoteVideo) this.remoteVideo.srcObject = this.remoteStream;

    this.peerConnection.ontrack = event => {
      event.streams[0].getTracks().forEach(track => this.remoteStream.addTrack(track));
      this.emit("remoteStreamUpdated", this.remoteStream);
    };

    this.peerConnection.onicecandidate = event => {
      if (event.candidate) {
        this.websocket?.send(JSON.stringify({ type: "ice", candidate: event.candidate }));
      }
    };

    return this.peerConnection;
  }

  async call(remoteId = null) {
    await this.createPeerConnection();

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    this.websocket?.send(JSON.stringify({
      type: "offer",
      offer,
      target: remoteId
    }));
  }

  async handleSignalingMessage(message) {
    const data = JSON.parse(message);
    if (!this.peerConnection) await this.createPeerConnection();

    switch (data.type) {
      case "offer":
        await this.peerConnection.setRemoteDescription(data.offer);
        const answer = await this.peerConnection.createAnswer();
        await this.peerConnection.setLocalDescription(answer);
        this.websocket?.send(JSON.stringify({ type: "answer", answer, target: data.source }));
        break;
      case "answer":
        await this.peerConnection.setRemoteDescription(data.answer);
        break;
      case "ice":
        if (data.candidate) await this.peerConnection.addIceCandidate(data.candidate).catch(console.warn);
        break;
    }
  }

  async startStreaming({ streamKey = null } = {}) {
    await this.initLocalStream();

    // Trigger backend to start FFmpeg restream
    if (streamKey) {
      try {
        await fetch(`https://world.tsunamiflow.club/TfRtmp.php?key=${encodeURIComponent(streamKey)}`, {
          method: "GET",
          mode: "cors"
        });
        console.log("Backend FFmpeg restream triggered for:", streamKey);
      } catch (err) {
        console.warn("Failed to trigger backend restream:", err);
      }
    }

    await this.call();
  }

  stopStreaming() {
    this.close();
  }

  close() {
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => track.stop());
      this.remoteStream = null;
    }
  }

  on(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }

  emit(event, data) {
    (this.listeners[event] || []).forEach(fn => fn(data));
  }
}