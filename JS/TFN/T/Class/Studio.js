import { Flow } from "./Elder/Flow.js";

export class Studio extends Flow {
    _wired = false;
    _radioBound = false;
    WeLive = null;
    hls = null;
    baseRadius = 2;
    particles = [];
    constructor(options = {}) {
        super(options);
    }
    update(p, fftValue, volume, baseRadius) {

        const energy = (fftValue / 255) * volume * 50;

        p.radius = baseRadius + energy;

        p.dx += (Math.random() - 0.5) * energy * 0.05;
        p.dy += (Math.random() - 0.5) * energy * 0.05;

        p.dx *= 0.97;
        p.dy *= 0.97;

        p.x += p.dx;
        p.y += p.dy;
    }
    draw(p) {
        this.canvasctx.save();
        this.canvasctx.beginPath();
        this.canvasctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
        this.canvasctx.fillStyle = p.color;
        this.canvasctx.shadowColor = p.color;
        this.canvasctx.shadowBlur = 20;
        this.canvasctx.fill();
        this.canvasctx.restore();
    }
    tfParticles(x, y, dx, dy, radius, color) {
        return { x, y, dx, dy, radius, color };
    }
    particle(particles) {
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const dx = (Math.random() - 0.5) * 0.5;
            const dy = (Math.random() - 0.5) * 0.5;
            const radius = Math.random() * 0.5 + 0.2;
            const color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, 0.8)`;
            particles.push(this.tfParticles(x, y, dx, dy, radius, color));
        }
    }
    RadioVisualizer(dataArray, baseRadius, particles, volume) {
        this.canvasctx.fillStyle = "rgb(10, 10, 30)";
        this.canvasctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.canvasctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < particles.length; i++) {
            const fftValue = dataArray[i % dataArray.length];
            this.update(particles[i], fftValue, volume, baseRadius);
            this.draw(particles[i]);
        }

        const barWidth = this.canvas.width / dataArray.length;
        let CtxX = 0;

        for (let i = 0; i < dataArray.length; i++) {
            const barHeight = dataArray[i] * (volume);
            const CtxR = dataArray[i] + 100;
            const CtxG = i * 2;
            const CtxB = 255;
            this.canvasctx.fillStyle = `rgb(${CtxR}, ${CtxG}, ${CtxB})`;
            this.canvasctx.fillRect(CtxX, this.canvas.height - barHeight, barWidth, barHeight);
            CtxX += barWidth + 1;
        }
    }
    startVisualizerLoop(event) {

        const loop = () => {

            this.RadioVisualizer([...this.TfSoundsContextDataArray[this.AudioElement.id]], this.baseRadius, this.particles, this.AudioElement.volume);
            this.renderFrame(loop());
        }
        loop();
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

                const loop = () => {
                    if (this.AudioElement.paused || this.AudioElement.ended) {
                        return;
                    }

                    this.TfSoundAnalyser[this.AudioElement.id].getByteFrequencyData(this.TfSoundsContextDataArray[this.AudioElement.id]);

                    this.RadioVisualizer([...this.TfSoundsContextDataArray[this.AudioElement.id]], this.baseRadius, this.particles, this.AudioElement.volume);

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