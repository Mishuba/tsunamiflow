export class TfMediaDevices {
    constructor({
        video = true,
        audio = true,
        screen = false,
        constraints = {},
        deviceId = {},
        onReady = null
    } = {}) {

        this.stream = null;

        this.videoTrack = null;
        this.audioTrack = null;
        this.screenTrack = null;

        this.devices = [];

        this.deviceId = {
            video: deviceId.video || null,
            audio: deviceId.audio || null
        };

        this.constraints = {
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            },
            video: {
                frameRate: { min: 15, ideal: 30, max: 60 },
                width: 600,
                height: 480,
                resizeMode: "crop-and-scale"
            },
            ...constraints
        };

        this.screen = screen;

        this.onReady = onReady;
    }

    async enumerate() {
        try {
            this.devices = await navigator.mediaDevices.enumerateDevices();
            return this.devices;
        } catch (err) {
            console.error("Device enumeration failed:", err);
            throw err;
        }
    }

    async start() {
        if (this.stream) return this.stream;

        try {

            let constraints = {
                video: this.constraints.video,
                audio: this.constraints.audio
            };

            if (this.deviceId.video)
                constraints.video.deviceId = { exact: this.deviceId.video };

            if (this.deviceId.audio)
                constraints.audio.deviceId = { exact: this.deviceId.audio };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);

            this.videoTrack = this.stream.getVideoTracks()[0] || null;
            this.audioTrack = this.stream.getAudioTracks()[0] || null;

            if (this.onReady) this.onReady(this.stream);

            return this.stream;

        } catch (err) {
            console.error("Media device start failed:", err);
            throw err;
        }
    }

    async startScreen() {
        try {

            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });

            this.screenTrack = screenStream.getVideoTracks()[0] || null;

            if (!this.stream) {
                this.stream = new MediaStream();
            }

            if (this.screenTrack)
                this.stream.addTrack(this.screenTrack);

            return this.stream;

        } catch (err) {
            console.error("Screen capture failed:", err);
            throw err;
        }
    }

    stop() {
        if (!this.stream) return;

        this.stream.getTracks().forEach(track => track.stop());

        this.stream = null;
        this.videoTrack = null;
        this.audioTrack = null;
        this.screenTrack = null;
    }

    attach(mediaElement) {
        if (!this.stream)
            throw new Error("Media stream not started");

        if (mediaElement.srcObject !== this.stream)
            mediaElement.srcObject = this.stream;

        if (mediaElement.paused)
            mediaElement.play().catch(()=>{});
    }

    replaceTrack(newTrack) {

        if (!this.stream || !newTrack) return;

        const kind = newTrack.kind;

        const oldTrack =
            kind === "video"
                ? this.stream.getVideoTracks()[0]
                : this.stream.getAudioTracks()[0];

        if (oldTrack) {
            this.stream.removeTrack(oldTrack);
            oldTrack.stop();
        }

        this.stream.addTrack(newTrack);

        if (kind === "video") this.videoTrack = newTrack;
        if (kind === "audio") this.audioTrack = newTrack;
    }

    async switchCamera(deviceId) {

        if (!deviceId) return;

        const newStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } }
        });

        const newTrack = newStream.getVideoTracks()[0];

        this.replaceTrack(newTrack);

        this.deviceId.video = deviceId;
    }

    async switchMicrophone(deviceId) {

        if (!deviceId) return;

        const newStream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: { exact: deviceId } }
        });

        const newTrack = newStream.getAudioTracks()[0];

        this.replaceTrack(newTrack);

        this.deviceId.audio = deviceId;
    }

    getDevicesByType(type) {
        return this.devices.filter(d => d.kind === type);
    }

    toJSON() {
        return {
            active: !!this.stream,
            video: !!this.videoTrack,
            audio: !!this.audioTrack,
            screen: !!this.screenTrack,
            devices: this.devices.length,
            constraints: this.constraints
        };
    }
}