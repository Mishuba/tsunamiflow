export class TfWebRTCRecorder {
    constructor({
        videoElement = null,
        remoteElement = null,
        constraints = { video: true, audio: true }
    } = {}) {
        this.localStream = null;
        this.remoteStream = new MediaStream();
        this.pc = null;

        this.videoElement = videoElement;
        this.remoteElement = remoteElement;

        this.constraints = constraints;
        this.listeners = {};
    }

    /* ----------------------------
       Local Media
    -----------------------------*/

    async startLocal() {
        if (this.localStream) return this.localStream;

        try {
            this.localStream = await navigator.mediaDevices.getUserMedia(this.constraints);

            if (this.videoElement) {
                this.videoElement.srcObject = this.localStream;
                this.videoElement.play().catch(() => { });
            }

            this.emit("localReady", this.localStream);
            return this.localStream;
        } catch (err) {
            console.error("TfWebRTC startLocal failed:", err);
            this.emit("error", err);
        }
    }

    stopLocal() {
        if (!this.localStream) return;

        this.localStream.getTracks().forEach(track => track.stop());
        this.localStream = null;

        if (this.videoElement) this.videoElement.srcObject = null;
        this.emit("localStopped");
    }

    replaceTrack(newTrack) {
        if (!this.localStream || !this.pc || !newTrack) return;

        const kind = newTrack.kind;
        const oldTrack = this.localStream.getTracks().find(t => t.kind === kind);

        if (oldTrack) {
            this.localStream.removeTrack(oldTrack);
            this.pc.getSenders().find(s => s.track === oldTrack)?.replaceTrack(newTrack);
            oldTrack.stop();
        }

        this.localStream.addTrack(newTrack);
    }

    /* ----------------------------
       Peer Connection
    -----------------------------*/

    async initPeer(iceServers = [{ urls: "stun:stun.l.google.com:19302" }]) {
        if (this.pc) return this.pc;

        this.pc = new RTCPeerConnection({ iceServers });

        if (this.localStream) {
            this.localStream.getTracks().forEach(track => this.pc.addTrack(track, this.localStream));
        }

        this.pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach(track => this.remoteStream.addTrack(track));
            if (this.remoteElement) this.remoteElement.srcObject = this.remoteStream;
            this.emit("remoteUpdated", this.remoteStream);
        };

        this.pc.onicecandidate = (event) => {
            if (event.candidate) this.emit("iceCandidate", event.candidate);
        };

        return this.pc;
    }

    async createOffer() {
        if (!this.pc) throw new Error("PeerConnection not initialized");
        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);
        return offer;
    }

    async createAnswer() {
        if (!this.pc) throw new Error("PeerConnection not initialized");
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);
        return answer;
    }

    async handleSignal(data) {
        if (!this.pc) await this.initPeer();

        switch (data.type) {
            case "offer":
                await this.pc.setRemoteDescription(data.offer);
                const answer = await this.createAnswer();
                this.emit("answerCreated", answer);
                break;

            case "answer":
                await this.pc.setRemoteDescription(data.answer);
                break;

            case "ice":
                if (data.candidate) await this.pc.addIceCandidate(data.candidate).catch(console.warn);
                break;
        }
    }

    closePeer() {
        if (this.pc) this.pc.close();
        this.pc = null;
        this.remoteStream.getTracks().forEach(track => track.stop());
        this.remoteStream = new MediaStream();
        if (this.remoteElement) this.remoteElement.srcObject = null;
    }

    /* ----------------------------
       Events
    -----------------------------*/

    on(event, fn) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(fn);
    }

    emit(event, data) {
        (this.listeners[event] || []).forEach(fn => fn(data));
    }

    toJson() {
        return {
            hasLocal: !!this.localStream,
            localTracks: this.localStream?.getTracks().length || 0,
            remoteTracks: this.remoteStream?.getTracks().length || 0,
            connected: !!this.pc
        };
    }
}