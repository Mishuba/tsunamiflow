export class TsunamiFlowRadio extends TsunamiFlowNation {
  constructor(options = {}) {
    super(options);
    this.TfAudio.crossOrigin = "anonymous";
    this.TfAudio.preload = "auto";
    this.TfAudio.controls = false;
    this.TfAudio.loop = false;
    this.TfAudio.muted = false;
    //this.TfAudio.volume = 1;
  }

  //element
connectaudio() {
    this.initAudioContext();

    if (!this.elementSourceMap.has(this.TfAudio)) {
        const source = this.TfSoundsContext.createMediaElementSource(this.TfAudio);
        const gain = this.TfSoundsContext.createGain();
        const analyser = this.TfSoundsContext.createAnalyser();

        Object.assign(analyser, this.TfSoundAnalyzerOptions);

        source
            .connect(gain)
            .connect(analyser)
            .connect(this.masterGain);

        this.elementSourceMap.set(this.TfAudio, source);

        this.AudioSource["radio"] = source;
        this.TfSoundsGain["radio"] = gain;
        this.TfSoundAnalyzer = analyser;
    }
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
  playingAudio() {
    this.MusicState();
    this.TfSoundsContextBufferLength = this.TfSoundAnalyser.frequencyBinCount;
    this.TfSoundsContextDataArray = new Uint8Array(this.TfSoundsContextBufferLength);
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
    this.AudioProcessBar = (this.TfAudio.currentTime / this.TfAudio.duration) * 100;
    this.TaudioFtime = `Time: ${this.FormatAudioTime(this.AudioTiming)} / ${this.FormatAudioTime(Math.floor(this.TfAudio.duration))}`;
  }
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
  //element ends
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
  StartLiveAudio() {
    if (this.WeLive) return;

    this.WeLive = true;
    this.connectaudio();

    const url = "https://world.tsunamiflow.club/hls/anything.m3u8";

    if (window.Hls && Hls.isSupported()) {
        if (this.hls) {
            this.hls.destroy();
        }

        this.hls = new Hls();
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
        this.hls.destroy();
        this.hls = null;
    }

    this.TfAudio.pause();
    this.TfAudio.src = "";
}
}