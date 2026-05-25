import { Flow } from "./Elder/Flow.js";

export class Studio extends Flow {
    _wired = false;
    _radioBound = false;
    WeLive = null;
    hls = null;
    constructor(options = {}) {
        super(options);
    }
    loadaudio(src) {
        this.AudioElement.src = src;
        this.AudioElement.load();
        this.tfRadioLoadStartTime = Date.now();
        console.log("Load start time recorded:", this.tfRadioLoadStartTime);
    }
    stalledAudio(stalled) {
        console.log("The Tsunami Audio has stalled for some reason" + stalled);
        console.log("The Tsunami Audio networkState " + this.AudioElement.networkState);
        console.log("The Tsunami Audio readyState " + this.AudioElement.readyState);
        console.log("The Tsunami Audio error " + this.AudioElement.error);
        console.log("The Tsunami Audio currentsrc " + this.AudioElement.currentsrc);
        console.log("The Tsunami Audio paused " + this.AudioElement.paused);
        console.log("The Tsunami Audio buffered " + this.AudioElement.buffered);
        this.AudioNetworkState();
    }
    suspendedAudio(suspend) {
        console.log("The audio is suspended" + suspend);
        //  this.AudioState();
    }
    setaudioLoop(loop = true) {
        this.AudioElement.loop = loop;
    }

    setaudioPlaybackRate(rate = 1) {
        this.AudioElement.playbackRate = rate;
    }

    muteaudio(state = true) {
        this.AudioElement.muted = state;
    }
    loadedmetadataAudio() {
        //create html data
        console.log("Audio playback is metadata loaded");
    }
    loadeddataAudio() {
        console.log("The audio data is loaded");
    }
    canplayAudio() {
        console.log("Audio playback is can play");
    }
    canplaythroughAudio() {
        this.connectaudio(this.AudioElement, this.AudioElement.id);
        console.log("Audio playback is can play through");
    }
    endedAudio() {
        console.log("The audio should have ended");
        this.AudioElement.src = "";
        this.removeSource(this.AudioElement.id);
        this.AudioNetworkState();
    }
    waitingAudio() {
        console.log("Audio playback is waiting");
    }
    async playaudio() {
        try {
            if (this.AudioElement.paused || this.AudioElement.ended || this.AudioElement.currentTime === 0) {
                if (this.AudioElement.paused) {
                    await this.AudioElement.play();
                    this.TfSoundsContextBufferLength[this.AudioElement.id] = this.TfSoundsContext[this.AudioElement.id].frequencyBinCount;
                    this.TfSoundsContextDataArray[this.AudioElement.id] = new Uint8Array(this.masterBufferLength / 4);
                } else {
                    await this.AudioElement.play();
                    this.TfSoundsContextBufferLength[this.AudioElement.id] = this.TfSoundsContext[this.AudioElement.id].frequencyBinCount;
                    this.TfSoundsContextDataArray[this.AudioElement.id] = new Uint8Array(this.masterBufferLength / 4);
                }

                this.worker.postMessage(tycadome(
                    "tycadome-guest" + Date.now(),
                    "visualizator",
                    "radio.playing",
                    {
                        source: "web",
                        target: "device:web-001",
                        worker: "media"
                    },
                    {
                        status: "pending",
                        priority: "low"
                    },
                    "async",
                    {
                        system: "start_visual_data",
                        bufferLength: this.TfSoundsContextBufferLength[this.AudioElement.id],
                        dataArray: [...this.TfSoundsContextDataArray[this.AudioElement.id]],
                        baseRadius: this.baseRadius,
                        particles: this.particles,
                        volume: this.AudioElement.volume,
                    }), [this.TfSoundsContextBufferLength[this.AudioElement.id]], this.TfSoundsContextDataArray[this.AudioElement.id].buffer);

                const loop = () => {
                    if (this.AudioElement.paused || this.AudioElement.ended) {
                        return;
                    }

                    this.TfSoundAnalyser[this.AudioElement.id].getByteFrequencyData(this.TfSoundsContextDataArray[this.AudioElement.id]);
                    this.worker.postMessage(tycadome(
                        "tycadome-guest" + Date.now(),
                        "visualizator",
                        "radio.playing",
                        {
                            source: "web",
                            target: "device:web-001",
                            worker: "media"
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "update_visual_data",
                            dataArray: [...this.TfSoundsContextDataArray[this.AudioElement.id]],
                            volume: this.AudioElement.volume,
                        }), [this.TfSoundsContextDataArray[this.AudioElement.id].buffer]);
                    requestAnimationFrame(loop);
                };
                loop();
            }
        } catch (error) {
            if (error.name === "NotAllowedError") {
                console.log("Autoplay is blocked. Please interact with the page to start the radio.");
            } else {
                console.error("Error playing audio:", error);
            }
        }

    }
    playingAudio() {

    }
    pauseaudio() {
        this.AudioElement.pause();
        console.log("Audio playback is paused");
    }
    previousaudio(music) {
        this.AudioElement.src = music;
        this.AudioElement.play();
    }
    restartaudio() {
        if (this.AudioElement) {
            this.AudioElement.pause();
            this.AudioElement.currentTime = 0;
            console.log("Audio playback is stopped");
        }
    }
    seekaudio(time) {
        this.AudioElement.currentTime = time;
    }
    FormatAudioTime(second) {
        this.AudioMinutes = Math.floor(second / 60);
        this.AudioSeconds = second % 60;
        return `${this.AudioMinutes}:${this.AudioSeconds.toString().padStart(2, "0")}`;
    }
    timeupdateAudio() {
        this.AudioTiming = Math.floor(this.AudioElement.currentTime);
        const duration = this.AudioElement.duration || 1;
        this.AudioProcessBar = (this.AudioElement.currentTime / duration) * 100;
        this.TaudioFtime = `Time: ${this.FormatAudioTime(this.AudioTiming)} / ${this.FormatAudioTime(Math.floor(this.AudioElement.duration))}`;
    }
    StartLiveAudio(url = "https://world.tsunamiflow.club/hls/anything.m3u8") {
        if (this.WeLive) return;

        this.WeLive = true;

        if (window.Hls && Hls.isSupported()) {
            if (this.hls) {
                this.hls.destroy();
            }

            this.hls = new Hls();

            this.hls.on(Hls.Events.ERROR, (event, data) => {
                console.error("HLS error:", data);

                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            this.hls.startLoad();
                            break;

                        case Hls.ErrorTypes.MEDIA_ERROR:
                            this.hls.recoverMediaError();
                            break;

                        default:
                            this.stopLiveAudio();
                            break;
                    }
                }
            });

            this.hls.loadSource(url);
            this.hls.attachMedia(this.AudioElement);
            this.addAudioContextSource(addAudioContextSource, "live talking");
        } else {
            this.AudioElement.src = url;
            this.addAudioContextSource(addAudioContextSource, "live talking");
        }

        this.playaudio();
    }

    stopLiveAudio() {
        if (!this.WeLive) return;

        this.WeLive = false;

        if (this.hls) {
            this.hls.detachMedia();
            this.hls.destroy();
            this.hls = null;
        }

        this.AudioElement.pause();
        this.removeSource("live talking");
        this.AudioElement.removeAttribute("src");
    }
    RadioEventListeners() {
        if (this._radioBound) {
            return;
        } else {
            this._radioBound = true;

            /*     this.AudioElement.addEventListener("emptied", async (emptied) => {
                    this.emptiedAudio(emptied);
                    //cancelAnimationFrame(this.effects.visualizatorController);
                  });
                  this._storeDomListener(this.soundengine.AudioElement.id, this.soundengine.AudioElement, runHandler, "emptied");
            */

            this.AudioElement.addEventListener("waiting", (waiting) => {
                this.waitingAudio();
            });
            this._storeDomListener(this.AudioElement.id, this.AudioElement, this.waitingAudio, "waiting");

            this.AudioElement.addEventListener("stalled", (stalled) => {
                this.stalledAudio(stalled);
            });
            this._storeDomListener(this.AudioElement.id, this.AudioElement, this.stalledAudio, "stalled");

            this.AudioElement.addEventListener("loadstart", async () => {
                this.loadstartAudio();
            });
            this._storeDomListener(this.AudioElement.id, this.AudioElement, this.loadstartAudio, "loadstart");

            this.AudioElement.addEventListener("suspended", (suspend) => {
                this.suspendedAudio();
            });
            this._storeDomListener(this.AudioElement.id, this.AudioElement, this.suspendAudio, "suspended");

            this.AudioElement.addEventListener("loadedmetadata", async () => {
                this.loadedmetadataAudio();
            });
            this._storeDomListener(this.AudioElement.id, this.AudioElement, this.loadedmetadataAudio, "loadedmetadata");

            this.AudioElement.addEventListener("loadeddata", () => {
                this.loadeddataAudio();
            });
            this._storeDomListener(this.AudioElement.id, this.AudioElement, this.loadeddataAudio, "loadeddata");

            this.AudioElement.addEventListener("canplay", () => {
                this.canplayAudio();
            });
            this._storeDomListener(this.AudioElement.id, this.AudioElement, this.canplayAudio, "canplay");

            this.AudioElement.addEventListener("canplaythrough", async () => {
                if (!this._wired) {
                    //this.initAudioContext();
                    //this.connectaudio();
                    this._wired = true;
                }
                this.canplaythroughAudio();
            });

            this._storeDomListener(this.AudioElement.id, this.AudioElement, this.canplaythroughAudio, "canplaythrough");

            this.AudioElement.addEventListener("play", () => {
                this.playaudio();
                //this.startAnalyserLoop();
            });
            this._storeDomListener(this.AudioElement.id, this.AudioElement, this.playAudio, "play");

            this.AudioElement.addEventListener("playing", () => {
                this.playingAudio();
            });
            this._storeDomListener(this.AudioElement.id, this.AudioElement, this.playingAudio, "playing");

            this.AudioElement.addEventListener("pause", async () => {
                this.pauseaudio();
                this.stopAnalyserLoop();
            });
            this._storeDomListener(this.AudioElement.id, this.AudioElement, this.pauseaudio, "pause");

            this.AudioElement.addEventListener("timeupdate", () => {
                this.timeupdateAudio();
            });
            this._storeDomListener(this.AudioElement.id, this.AudioElement, this.timeupdateAudio, "timeupdate");

            this.AudioElement.addEventListener("volumechange", (volumechange) => {
                //this.volumechangeAudio();
            });
            this._storeDomListener(this.AudioElement.id, this.AudioElement, this.volumechangeAudio, "volumechange");

            this.AudioElement.addEventListener("ended", async (ended) => {
                //  this.destroyRadioSource();
                this.endedAudio();
            });
            this._storeDomListener(this.AudioElement.id, this.AudioElement, this.endedAudio, "ended");

        }
    }
}