export class TfWebRTCRecorder {
    constructor({ localVideo = null, remoteVideo = null, websocket = null } = {}) {
        this.peerConnection = null;
        this.localStream = null;
        this.remoteStream = null;
        this.websocket = websocket; // TfWebsocket instance
        this.localVideo = localVideo;
        this.remoteVideo = remoteVideo;
        this.listeners = {};
        this.streamKey = null;
    }

    async initLocalStream({ video = true, audio = true } = {}) {
        // Prefer TfWebcam.stream if available
        if (window.TfWebcam?.stream) {
            this.localStream = window.TfWebcam.stream;
            if (this.localVideo) this.localVideo.srcObject = this.localStream;
            this.emit("localStreamReady", this.localStream);
            return this.localStream;
        }

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

        // Add local tracks
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => this.peerConnection.addTrack(track, this.localStream));
        }

        // Prepare remote stream
        this.remoteStream = new MediaStream();
        if (this.remoteVideo) this.remoteVideo.srcObject = this.remoteStream;

        // Handle incoming tracks
        this.peerConnection.ontrack = (event) => {
            event.streams[0].getTracks().forEach(track => this.remoteStream.addTrack(track));
            this.emit("remoteStreamUpdated", this.remoteStream);
        };

        // Send ICE candidates via WebSocket
        this.peerConnection.onicecandidate = (event) => {
            if (event.candidate && this.websocket?.isOpen()) {
                this.websocket.send(JSON.stringify({ type: "ice", candidate: event.candidate }));
            }
        };

        return this.peerConnection;
    }

    async call(remoteId = null, streamKey = null) {
        await this.createPeerConnection();

        this.streamKey = streamKey; // Optional: link this call to a specific stream key

        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);

        if (this.websocket?.isOpen()) {
            this.websocket.send(JSON.stringify({
                type: "offer",
                offer,
                target: remoteId,
                streamKey: this.streamKey
            }));
        }
    }

    async handleSignalingMessage(message) {
        const data = JSON.parse(message);
        if (!this.peerConnection) await this.createPeerConnection();

        switch (data.type) {
            case "offer":
                await this.peerConnection.setRemoteDescription(data.offer);
                const answer = await this.peerConnection.createAnswer();
                await this.peerConnection.setLocalDescription(answer);
                this.websocket?.send(JSON.stringify({
                    type: "answer",
                    answer,
                    target: data.source
                }));
                break;
            case "answer":
                await this.peerConnection.setRemoteDescription(data.answer);
                break;
            case "ice":
                if (data.candidate) {
                    try {
                        await this.peerConnection.addIceCandidate(data.candidate);
                    } catch (e) {
                        console.warn("Failed to add ICE candidate:", e);
                    }
                }
                break;
        }
    }

    async startStreaming({ video = true, audio = true, remoteId = null, streamKey = null } = {}) {
        await this.initLocalStream({ video, audio });
        await this.call(remoteId, streamKey);

        // If a stream key is provided, start PHP-based FFmpeg restream
        if (streamKey) {
            fetch(`https://world.tsunamiflow.club/mishubaRestream.php?key=${encodeURIComponent(streamKey)}`)
                .then(res => console.log("Restream triggered:", res.status))
                .catch(err => console.error("Restream error:", err));
        }
    }

    stopStreaming() {
        this.close();
    }

    on(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }

    emit(event, data) {
        (this.listeners[event] || []).forEach(fn => fn(data));
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
}