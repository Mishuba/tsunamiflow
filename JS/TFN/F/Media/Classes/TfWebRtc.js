export class TfWebRTC {

    constructor({
        websocket = null,
        localVideo = null,
        remoteVideo = null,
        iceServers = [{ urls: "stun:stun.l.google.com:19302" }]
    } = {}) {

        this.pc = null;
        this.stream = null;
        this.remoteStream = null;

        this.websocket = websocket;
        this.localVideo = localVideo;
        this.remoteVideo = remoteVideo;

        this.iceServers = iceServers;
        this.listeners = {};
    }

    async init(stream) {

        if (this.pc) return this.pc;

        if (!stream) throw new Error("TfWebRTC requires a MediaStream");

        this.stream = stream;

        this.pc = new RTCPeerConnection({
            iceServers: this.iceServers
        });

        /* attach local tracks */

        stream.getTracks().forEach(track => {
            this.pc.addTrack(track, stream);
        });

        /* show local video */

        if (this.localVideo) {
            this.localVideo.srcObject = stream;
        }

        /* remote stream */

        this.remoteStream = new MediaStream();

        if (this.remoteVideo) {
            this.remoteVideo.srcObject = this.remoteStream;
        }

        this.pc.ontrack = (event) => {

            event.streams[0].getTracks().forEach(track => {
                this.remoteStream.addTrack(track);
            });

            this.emit("remoteStream", this.remoteStream);
        };

        /* ICE */

        this.pc.onicecandidate = (event) => {

            if (!event.candidate) return;

            this.websocket?.send(JSON.stringify({
                type: "ice",
                candidate: event.candidate
            }));
        };

        return this.pc;
    }

    async createOffer(target = null) {

        const offer = await this.pc.createOffer();

        await this.pc.setLocalDescription(offer);

        this.websocket?.send(JSON.stringify({
            type: "offer",
            offer,
            target
        }));

        return offer;
    }

    async createAnswer(offer, source = null) {

        await this.pc.setRemoteDescription(offer);

        const answer = await this.pc.createAnswer();

        await this.pc.setLocalDescription(answer);

        this.websocket?.send(JSON.stringify({
            type: "answer",
            answer,
            target: source
        }));

        return answer;
    }

    async handleSignal(message) {

        const data = typeof message === "string"
            ? JSON.parse(message)
            : message;

        if (!this.pc) return;

        switch (data.type) {

            case "offer":
                await this.createAnswer(data.offer, data.source);
                break;

            case "answer":
                await this.pc.setRemoteDescription(data.answer);
                break;

            case "ice":
                if (data.candidate) {
                    await this.pc.addIceCandidate(data.candidate)
                        .catch(console.warn);
                }
                break;
        }
    }

    close() {

        if (this.pc) {
            this.pc.close();
            this.pc = null;
        }

        if (this.remoteStream) {
            this.remoteStream.getTracks().forEach(t => t.stop());
            this.remoteStream = null;
        }
    }

    on(event, fn) {

        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push(fn);
    }

    emit(event, data) {

        if (!this.listeners[event]) return;

        this.listeners[event].forEach(fn => fn(data));
    }

    toJson() {

        return {
            connected: !!this.pc,
            localTracks: this.stream?.getTracks().length || 0,
            remoteTracks: this.remoteStream?.getTracks().length || 0
        };
    }
}