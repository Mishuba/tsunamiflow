import { TfCamera } from "./TfCamera.js";
import { TfMicrophone } from "./TfMicrophone.js";
import { TfScreenShare } from "./TfScreenShare.js";

export class TfMediaDevices {

    constructor() {

        this.camera = new TfCamera();
        this.microphone = new TfMicrophone();
        this.screen = new TfScreenShare();

        this.devices = [];
    }

    async enumerate() {

        this.devices = await navigator.mediaDevices.enumerateDevices();

        return this.devices;
    }

    getVideoDevices() {
        return this.devices.filter(d => d.kind === "videoinput");
    }

    getAudioDevices() {
        return this.devices.filter(d => d.kind === "audioinput");
    }

    async getCombinedStream() {

        const tracks = [];

        if (this.camera.stream)
            tracks.push(...this.camera.stream.getTracks());

        if (this.microphone.stream)
            tracks.push(...this.microphone.stream.getTracks());

        if (this.screen.stream)
            tracks.push(...this.screen.stream.getTracks());

        return new MediaStream(tracks);
    }

}