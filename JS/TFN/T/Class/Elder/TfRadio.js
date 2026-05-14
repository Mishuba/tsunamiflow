import { TsunamiFlowAudio } from "./Adult/Audio.js";
export class TsunamiFlowRadio extends TsunamiFlowAudio {
  visualizatorController = null;
  _radioBound = false;
  _wired = false;
  radioTypes = ["video/webm", "audio/webm", "video/webm;codecs=vp8", "video/webm;codecs=daala", "video/webm;codecs=h264", "audio/webm;codecs=opus", "video/mp4", "audio/mp3"
  ];
  RadioTimes = ["00:00", "01:00", "01:05", "01:15", "01:30", "02:00", "03:00", "03:20", "03:40", "04:00", "04:20", "04:40", "05:00", "05:20", "05:40", "06:00", "06:20", "06:40", "07:00", "07:20", "07:40", "08:00", "08:10", "08:20", "08:30", "08:40", "08:50", "09:00", "09:20", "09:40", "10:00", "11:00", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "18:00", "18:10", "18:20", "18:30", "18:40", "18:50", "19:00", "19:20", "19:40", "20:00", "20:15", "20:30", "20:45", "21:00", "22:00", "23:00"
  ];
  particles = [];
  constructor(options = {}) {
    super(options);
    if (options.visualizatorController) {
      this.visualizatorController = options.visualizatorController;
    }
  }

  //element

  connectaudio() {
    if (this.AudioSource["radio"]) return;
    this.addAudioContextSource(this.AudioElement, "radio");
  }
  destroyRadioSource() {
    const source = this.AudioSource["radio"];
    const gain = this.TfSoundsGain["radio"];
    const analyser = this.TfTrackAnalyser["radio"];
    const compressor = this.TfTrackCompressor["radio"];

    if (source) source.disconnect();
    if (gain) gain.disconnect();
    if (analyser) analyser.disconnect();
    if (compressor) compressor.disconnect();

    delete this.AudioSource["radio"];
    delete this.TfSoundsGain["radio"];
    delete this.TfTrackAnalyser["radio"];
    delete this.TfTrackCompressor["radio"];

    this.elementSourceMap.delete(this.AudioElement);
  }


  setaudioVolume(value = 1) {
    const gainNode = this.TfSoundsGain["radio"];

    if (gainNode) {
      gainNode.gain.value = value;
    } else {
      this.AudioElement.volume = value;
    }
  }

  /* -----------------------------
     Playback Controls
  ------------------------------*/

  loadaudio(src) {
    this.AudioElement.src = src;
    this.AudioElement.load();
  }

  async playaudio() {
    try {
      //this.connectaudio();
      //  this.AudioState();
      if (this.AudioElement.paused || this.AudioElement.ended || this.AudioElement.currentTime === 0) {
        if (this.AudioElement.paused) {
          /*
                    this.worker.postMessage(this.tycadome(
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
                        system: "playing",
                        canvas: this.visualizatorController,
                        dataArray: TfSoundsContextDataArray,
                        baseRadius: this.baseRadius,
                        particles: this.particles
                      }),
                      [this.visualizatorController, TfSoundsContextDataArray]);
                    */
          await this.AudioElement.play();
        }
      }
    } catch (error) {
      if (error.name === "NotAllowedError") {
        console.log("Autoplay is blocked. Please interact with the page to start the radio.");
      } else {
        console.error("Error playing audio:", error);
      }
    }
  }

  pauseaudio() {
    this.AudioElement.pause();
    console.log("Audio playback is paused");
  }
  restartAudio() {
    if (this.AudioElement) {
      this.AudioElement.pause();
      this.AudioElement.currentTime = 0;
      console.log("Audio playback is stopped");
    }
  }
  previousaudio(music) {
    this.AudioElement.src = music;
    this.AudioElement.play();
  }
  restartSong() {
    this.AudioElement.currentTime = 0;
    this.AudioElement.play();
  }
  seekaudio(time) {
    this.AudioElement.currentTime = time;
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

  loadstartAudio() {
    this.tfRadioLoadStartTime = Date.now();
    console.log("Load start time recorded:", this.tfRadioLoadStartTime);
    if (this.canvas !== null) {
      /*
            if (!this.canvasctx) {
              this.canvasctx = this.canvas.getContext("2d");
            } else {
      
            }
            return this.canvasctx;
      */
    } else {
      /*
            this.canvas = document.createElement("canvas");
            this.canvasctx = this.canvas.getContext("2d");
            return this.canvasctx;
      */
    }
  }
  loadedmetadataAudio() {
    //create html data

    //this.AudioState();
    console.log("Audio playback is metadata loaded");
  }
  loadeddataAudio() {
    console.log("The audio data is loaded");
  }
  canplayAudio() {
    //  this.AudioState();
    console.log("Audio playback is can play");
  }
  canplaythroughAudio() {
    //  this.AudioState();
    this.playaudio();
    console.log("Audio playback is can play through");
  }

  endedAudio() {
    console.log("The audio should have ended");
    this.AudioElement.src = "";

    //  this.AudioState();
    this.AudioNetworkState();
  }
  waitingAudio() {
    //  this.AudioState();
    console.log("Audio playback is waiting");
  }
  getTrackAnalyserData(id) {
    const analyser = this.TfTrackAnalyser[id];
    if (!analyser) return null;

    const buffer = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(buffer);
    return buffer;
  }
  stopAnalyserLoop() {
    this._analyserLoopRunning = false;
    this._workerAnalyserRunning = false;
  }

  updateAnalyser() {
    if (this._workerAnalyserRunning) return;
    if (!this.TfSoundAnalyser) return;

    this._workerAnalyserRunning = true;

    const dataArray = this.TfSoundAnalyser.getByteFrequencyData(this.TfSoundsContextDataArray);

    if (!this._workerAnalyserRunning) return;
    // setInterval(() => { }, 33);
    this.worker.postMessage(
      this.tycadome(
        "tycadome-guest" + Date.now(),
        "visualizator",
        "radio.playing",
        {
          source: "web",
          target: "device:web-001"
        },
        {
          status: "pending",
          priority: "low"
        },
        "async",
        {
          system: "visual_data",
          Analyser: this.TfSoundAnalyser,
          baseRadius: this.baseRadius,
          particles: this.particles
        }
      )
    );
    requestAnimationFrame(loopAnalyzer);
  }

  playingAudio() {
    //this.AudioState();
    //this.updateAnalyser();
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
  async HandleArrayBuffer(buffer) {
    this.initAudioContext();

    try {
      const audioBuffer = await this.TfSoundsContext.decodeAudioData(buffer);
      return new Float32Array(audioBuffer.getChannelData(0));
    } catch (error) {
      console.error("Error decoding audio data:", error);
      return null;
    }
  }
  playDecodedBuffer(float32Array) {
    this.initAudioContext()
    const buffer = this.TfSoundsContext.createBuffer(
      1,
      float32Array.length,
      this.TfSoundsContext.sampleRate
    );

    buffer.copyToChannel(float32Array, 0);

    const source = this.TfSoundsContext.createBufferSource();
    source.buffer = buffer;

    const chain = this.createTrackChain();

    source
      .connect(chain.gain)
      .connect(chain.compressor)
      .connect(chain.analyser)
      .connect(this.masterGain);

    source.start();
    source.onended = () => {
      source.disconnect();
      chain.gain.disconnect();
      chain.analyser.disconnect();
      chain.compressor.disconnect();
    };
  }

  StartLiveAudio(url = "https://world.tsunamiflow.club/hls/anything.m3u8") {
    if (this.WeLive) return;

    this.WeLive = true;
    //this.connectaudio();

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
    } else {
      this.AudioElement.src = url;
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
    this.AudioElement.removeAttribute("src");;
  }
}