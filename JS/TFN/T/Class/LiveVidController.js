export class TsunamiLiveVideoController extends TsunamiFlowVideoRecorder {
    localVideoStream = null;
    remoteVideoStream = new MediaStream();
    remoteVideoElement = null;
    WebRtfcPc = null;
    isLive = false;
    constructor(option = {}) {

    }
    startStream({ audioStream = null, fps = 30 }) {
        if (!this.canvas) {
            //use video not canv
        } else {
            this.audioContext = audioContext;
            this.sourceNode = sourceNode;

            // Capture video from canvas
            this.videoStreamerStream = this.canvas.captureStream(fps);
            const tracks = [...this.videoStreamerStream.getVideoTracks()];

            // Capture audio from AudioContext if provided
            if (audioStream) {
                tracks.push(audioStream);
            }

            // Combine video + audio
            this.stream = new MediaStream(tracks);

            this.emit("start", this.stream);

            return this.stream;
        }
    }
    stopStream() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }

        this.videoStream = null;
        this.stream = null;
        this.emit("stop");
    }
    replaceCanvas(newCanvas, audio, fps = 30) {
        if (!newCanvas) throw new Error("New canvas is required");
        this.canvas = newCanvas;
        if (this.stream) this.stop();
        return this.start({ audio, fps });
    }
    async initPeer(iceServers = [{ urls: "stun:stun.l.google.com:19302" }]) {
        if (this.WebRtfcPc) return this.WebRtfcPc;

        this.WebRtfcPc = new RTCPeerConnection({ iceServers });

        if (this.stream) {
            this.stream.getTracks().forEach(track => this.WebRtfcPc.addTrack(track, this.stream));
        }

        this.WebRtfcPc.ontrack = (event) => {
            event.streams[0].getTracks().forEach(track => this.remoteVideoStream.addTrack(track));
            if (this.remoteVideoElement) this.remoteVideoElement.srcObject = this.remoteVideoStream;
            this.emit("remoteUpdated", this.remoteStream);
        };

        this.WebRtfcPc.onicecandidate = (event) => {
            if (event.candidate) this.emit("iceCandidate", event.candidate);
        };

        return this.WebRtfcPc;
    }

    async createOffer() {
        if (!this.WebRtfcPc) throw new Error("PeerConnection not initialized");
        const offer = await this.WebRtfcPc.createOffer();
        await this.WebRtfcPc.setLocalDescription(offer);
        return offer;
    }

    async createAnswer() {
        if (!this.WebRtfcPc) throw new Error("PeerConnection not initialized");
        const answer = await this.WebRtfcPc.createAnswer();
        await this.WebRtfcPc.setLocalDescription(answer);
        return answer;
    }

    async handleSignal(data) {
        if (!this.WebRtfcPc) await this.initPeer();

        switch (data.type) {
            case "offer":
                await this.WebRtfcPc.setRemoteDescription(data.offer);
                const answer = await this.createAnswer();
                this.emit("answerCreated", answer);
                break;

            case "answer":
                await this.WebRtfcPc.setRemoteDescription(data.answer);
                break;

            case "ice":
                if (data.candidate) await this.WebRtfcPc.addIceCandidate(data.candidate).catch(console.warn);
                break;
        }
    }

    closePeer() {
        if (this.WebRtfcPc) this.WebRtfcPc.close();
        this.WebRtfcPc = null;
        remoteVideoStream.getTracks().forEach(track => track.stop());
        remoteVideoStream = new MediaStream();
        if (this.remoteElement) this.remoteElement.srcObject = null;
    }

}