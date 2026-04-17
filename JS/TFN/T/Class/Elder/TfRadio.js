import { TsunamiFlowAudio } from "./Adult/Audio.js";
export class TsunamiFlowRadio extends TsunamiFlowAudio {
  _radioBound = false;
  _wired = false;
  particles = [];
  constructor(options = {}) {
    super(options);
    this.TfAudio.crossOrigin = "anonymous";
    this.TfAudio.preload = "auto";
    this.TfAudio.controls = false;
    this.TfAudio.loop = false;
    this.TfAudio.muted = false;
    this.TfAudio.id = "TfRadio";
    //this.TfAudio.volume = 1;
  }

  //element

  connectaudio() {
    if (this.AudioSource["radio"]) return;
    this.addAudioContextSource(this.TfAudio, "radio");
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

    this.elementSourceMap.delete(this.TfAudio);
  }


  setaudioVolume(value = 1) {
    const gainNode = this.TfSoundsGain["radio"];

    if (gainNode) {
      gainNode.gain.value = value;
    } else {
      this.TfAudio.volume = value;
    }
  }

  /* -----------------------------
     Playback Controls
  ------------------------------*/

  loadaudio(src) {
    this.TfAudio.src = src;
    this.TfAudio.load();
  }

  async playaudio() {
    try {
      if (this.TfAudio.paused || this.TfAudio.ended || this.TfAudio.currentTime === 0) {
        await this.TfAudio.play()
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
    this.TfAudio.pause();
  }

  stopaudio() {
    if (this.TfAudio) {
      this.TfAudio.pause();
      this.TfAudio.currentTime = 0;
    }
  }
  previousaudio(music) {
    this.TfAudio.src = music;
    this.TfAudio.play();
  }
  restartSong() {
    this.TfAudio.currentTime = 0;
    this.TfAudio.play();
  }
  seekaudio(time) {
    this.TfAudio.currentTime = time;
  }

  setaudioLoop(loop = true) {
    this.TfAudio.loop = loop;
  }

  setaudioPlaybackRate(rate = 1) {
    this.TfAudio.playbackRate = rate;
  }

  muteaudio(state = true) {
    this.TfAudio.muted = state;
  }

  loadstartAudio() {
    this.tfRadioLoadStartTime = Date.now();
    console.log("Load start time recorded:", this.tfRadioLoadStartTime);
    if (this.canvas !== null) {
      if (!this.canvasctx) {
        this.canvasctx = this.canvas.getContext("2d");
      } else {

      }
      return this.canvasctx;
    } else {
      this.canvas = document.createElement("canvas");
      this.canvasctx = this.canvas.getContext("2d");
      return this.canvasctx;
    }
  }
  loadedmetadataAudio() {
    //create html data
    this.MusicState();
  }
  loadeddataAudio() {
    console.log("The audio data is loaded");
    this.MusicState();
  }
  canplayAudio() {
    this.MusicState();
  }
  canplaythroughAudio() {
    this.MusicState();

    //this.startMusic();
  }
  playAudio() {
    this.MusicState();
    this.startMusic();
    this.startAnalyserLoop();

    this.visualizatorController = this.canvas.transferControlToOffscreen();
    this.updateAnalyser();
    let tf = this.tycadome(
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
        system: "playing",
        canvas: this.visualizatorController,
        //        analyser: this.updateAnalyser(),
        dataArray: this.TfSoundsContextDataArray,
        bufferLength: this.TfSoundsContextDataArray.length, baseRadius: this.baseRadius,
        particles: this.particles
      });
    this.worker.postMessage(tf, [this.visualizatorController, this.TfSoundsContextDataArray.buffer]);
  }
  pauseAudio() {
    this.MusicState();
    this.stopMusic();
  }
  endedAudio() {
    console.log("The audio should have ended");
    this.TfAudio.src = "";
    this.postworkerMessage({ type: "radio", system: "file" });
  }
  waitingAudio() {
    this.MusicState();
  }
  startAnalyserLoop() {
    if (!this.TfSoundAnalyser || !this.TfSoundsContextDataArray) return;
    if (this._analyserLoopRunning) return;

    this._analyserLoopRunning = true;

    const loop = () => {
      if (!this._analyserLoopRunning) return;

      if (this.TfSoundAnalyser) {
        //this.getTrackAnalyserData(TfSoundAnalyser["radio"]);
        this.TfSoundAnalyser.getByteFrequencyData(this.TfSoundsContextDataArray);
        this.emit("visualizer", this.TfSoundsContextDataArray);
      }

      requestAnimationFrame(loop);
    };

    loop();
  }
  getTrackAnalyserData(id) {
    const analyser = this.TfTrackAnalyser[id];
    if (!analyser) return null;

    const buffer = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(buffer);
    return analyser.getByteFrequencyData(buffer); // or buffer
  }
  stopAnalyserLoop() {
    this._analyserLoopRunning = false;
  }
  updateAnalyser() {
    if (!this.TfSoundAnalyser) return;

    //this.getTrackAnalyserData(TfSoundAnalyser["radio"]);
    this.TfSoundAnalyser.getByteFrequencyData(this.TfSoundsContextDataArray);
  }

  playingAudio() {
    this.MusicState();
    this.updateAnalyser();

  }
  stalledAudio(stalled) {
    console.log("The Tsunami Audio has stalled for some reason" + stalled);
  }
  suspendedAudio(suspend) {
    console.log("The audio is suspended" + suspend);
  }

  FormatAudioTime(second) {
    this.AudioMinutes = Math.floor(second / 60);
    this.AudioSeconds = second % 60;
    return `${this.AudioMinutes}:${this.AudioSeconds.toString().padStart(2, "0")}`;
  }
  timeupdateAudio() {
    this.AudioTiming = Math.floor(this.TfAudio.currentTime);
    const duration = this.TfAudio.duration || 1;
    this.AudioProcessBar = (this.TfAudio.currentTime / duration) * 100;
    this.TaudioFtime = `Time: ${this.FormatAudioTime(this.AudioTiming)} / ${this.FormatAudioTime(Math.floor(this.TfAudio.duration))}`;
  }
  /*
  volumechangeAudio() {
    console.log("The volume has changed");
  }

  getCurrentaudioTime() {
    return this.TfAudio.currentTime;
  }

  getaudioDuration() {
    return this.TfAudio.duration;
  }

  isaudioPlaying() {
    return !this.TfAudio.paused;
  }
  */
  //element ends

  RadioEventListeners() {
    if (this._radioBound) {
      return;
    } else {
      this._radioBound = true;

      /*     this.TfAudio.AddEventListener("emptied", async (emptied) => {
              this.emptiedAudio(emptied);
              //cancelAnimationFrame(this.effects.visualizatorController);
            });
            this._storeDomListener(this.soundengine.TfAudio.id, this.soundengine.TfAudio, runHandler, "emptied");
      */

      this.TfAudio.AddEventListener("waiting", (waiting) => {
        this.waitingAudio();
      });
      this._storeDomListener(this.TfAudio.id, this.TfAudio, this.waitingAudio, "waiting");

      this.TfAudio.AddEventListener("stalled", (stalled) => {
        this.stalledAudio(stalled).then(() => {
          //cancelAnimationFrame 
          // (this.effects.visualizatorController);    
        });
      });
      this._storeDomListener(this.TfAudio.id, this.TfAudio, this.stalledAudio, "stalled");

      this.TfAudio.AddEventListener("loadstart", async () => {
        this.loadstartAudio();
      });
      this._storeDomListener(this.TfAudio.id, this.TfAudio, this.loadstartAudio, "loadstart");

      this.TfAudio.AddEventListener("suspended", (suspend) => {
        this.suspendAudio().then(() => {
          //cancelAnimationFrame(this.effects.visualizatorController);
        });
      });
      this._storeDomListener(this.TfAudio.id, this.TfAudio, this.suspendAudio, "suspended");

      this.TfAudio.AddEventListener("loadedmetadata", async () => {
        this.loadedmetadataAudio();
      });
      this._storeDomListener(this.TfAudio.id, this.TfAudio, this.loadedmetadataAudio, "loadedmetadata");

      this.TfAudio.AddEventListener("loadeddata", () => {
        this.loadeddataAudio();
      });
      this._storeDomListener(this.TfAudio.id, this.TfAudio, this.loadeddataAudio, "loadeddata");

      this.TfAudio.AddEventListener("canplay", () => {
        this.canplayAudio();
      });
      this._storeDomListener(this.TfAudio.id, this.TfAudio, this.canplayAudio, "canplay");

      this.TfAudio.AddEventListener("canplaythrough", async () => {
        if (!this._wired) {
          this.initAudioContext();
          this._wired = true;
        }
        this.canplaythroughAudio();
      });

      this._storeDomListener(this.TfAudio.id, this.TfAudio, this.canplaythroughAudio, "canplaythrough");

      this.TfAudio.AddEventListener("play", () => {
        this.playAudio();
      });
      this._storeDomListener(this.TfAudio.id, this.TfAudio, this.playAudio, "play");

      this.TfAudio.AddEventListener("playing", () => {
        this.playingAudio();

        //this.effects.hereDude(this.audioCanv, this.audioCtx, this.audio.TsunamiAnalyser, this.audio.TsunamiRadioDataArray, this.audio.TsunamiRadioBufferLength, this.audio.baseRadius, this.audio.particles);
      });
      this._storeDomListener(this.TfAudio.id, this.TfAudio, this.playingAudio, "playing");

      this.TfAudio.AddEventListener("pause", async () => {
        //this.TfAudio.pauseAudio(); cancelAnimationFrame(this.effects.visualizatorController);
      });
      this._storeDomListener(this.TfAudio.id, this.TfAudio, this.pauseAudio, "pause");

      this.TfAudio.AddEventListener("timeupdate", () => {
        this.timeupdateAudio();
      });
      this._storeDomListener(this.TfAudio.id, this.TfAudio, this.timeupdateAudio, "timeupdate");

      this.TfAudio.AddEventListener("volumechange", (volumechange) => {
        //this.volumechangeAudio();
      });
      this._storeDomListener(this.TfAudio.id, this.TfAudio, this.volumechangeAudio, "volumechange");

      this.TfAudio.AddEventListener("ended", async (ended) => {
        //this.endedAudio(); cancelAnimationFrame(this.effects.visualizatorController);
      });
      this._storeDomListener(this.TfAudio.id, this.TfAudio, this.endedAudio, "ended");

    }
  }
  handleSocketMessage(data) {
    if (data.type === "live_stream") {
      /*
      if (data.live) {
        this.StartLiveStream("wss://world.tsunamiflow.club/websocket");
      } else {
        this.stopLiveStream();
      }
      */
    } else if (data.type === "audio_stream") {
      // Handle audio stream data
      if (data.live) {
        this.StartLiveAudio("wss://world.tsunamiflow.club/websocket");
      } else {
        this.stopLiveAudio();
      }
    } else if (data.type === "metadata") {
      // Handle metadata data
    } else if (data.type === "audio_buffer") {
      // Handle audio buffer data
    } else if (data.type === "visualization_data") {
      // Handle visualization data
    } else if (data.type === "error") {
      // Handle error data
    } else {
      console.warn("Unknown message type:", data.type);
    }
  }
  attachSocketListeners() {
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleSocketMessage(data);
    };
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

  RadioReady(title, buttonSpot, last, restart, start, skip) {
    title.innerHTML = "Welcome to TFN Radio";

    last.id = "TFradioPreviousButton";
    last.innerHTML = "Previous";
    buttonSpot.appendChild(last);

    restart.id = "TFRadioRestartButton";
    restart.innerHTML = "Restart";
    buttonSpot.appendChild(restart);

    start.id = "TFradioButton";
    start.innerHTML = "Start Radio";
    buttonSpot.appendChild(start);

    skip.id = "TFradioSkipButton";
    skip.innerHTML = "Next";
    buttonSpot.appendChild(skip);

    this.on("TFradioPreviousButton", () => {
      this.TfAudio.previousaudio(link);
      //this.worker.postMessage({type: "radio",system: "previous"});
    }
    );

    this.on("TFRadioRestartButton", () => {
      this.TfAudio.restartSong();
      start.innerHTML = "Pause Tsunami Radio";
    }
    );

    this.on("TFradioButton", () => {
      if (this.TfAudio.paused) {
        this.TfAudio.playaudio();
        start.innerHTML = "Pause Tsuanmi Radio";
      } else {
        this.TfAudio.pauseaudio();
        start.innerHTML = "Play Tsunami Radio";
      }
    }
    );

    this.on("TFradioSkipButton", () => {
      //this.worker.postMessage({type: "radio", system: "file"});
    });
  }

  StartLiveAudio(url = "https://world.tsunamiflow.club/hls/anything.m3u8") {
    if (this.WeLive) return;

    this.WeLive = true;
    this.connectaudio();

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
      this.hls.attachMedia(this.TfAudio);
    } else {
      this.TfAudio.src = url;
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

    this.TfAudio.pause();
    this.TfAudio.src = "";
  }
}