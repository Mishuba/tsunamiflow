export class TsunamiFlowRadio extends TsunamiFlowNation {

  constructor(options = {}) {

  }

  //element
  connectaudio() {
    if (!this.AudioSource) {
      this.AudioSource = this.TfSoundsContext.createMediaElementSource(this.TfAudio);
      this.TfSoundsGain = this.TfSoundsContext.createGain();

      this.TfAudio.connect(this.TfSoundsGain);
      this.TfSoundsGain.connect(this.TfSoundsContext.destination);
    }
  }

  setaudioVolume(value = 1) {
    if (this.TfSoundsGain) {
      this.TfSoundsGain.gain.value = value;
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

  playaudio() {
    if (this.TfAudio.paused) {
      this.TfAudio.play().catch(async (error) => {
        if (error.name === "NotAllowedError") {
          console.log("Autoplay is blocked. Please interact with the page to start the radio.");
        } else {
          console.error("Error playing audio:", error);
        }
      });
    } else if (this.TfAudio.ended) {
      if (this.TfAudio.currentTime === 0) {
        this.TfAudio.play().catch(async (error) => {
          if (error.name === "NotAllowedError") {
            console.log("Autoplay is blocked. Please interact with the page to start the radio.");
          } else {
            console.error("Error playing audio:", error);
          }
        });
      } else {
        this.TfAudio.play().catch(async (error) => {
          if (error.name === "NotAllowedError") {
            console.log("Autoplay is blocked. Please interact with the page to start the radio.");
          } else {
            console.error("Error playing audio:", error);
          }
        });
      }
    } else {
      this.TfAudio.play().catch(async (error) => {
        if (error.name === "NotAllowedError") {
          console.log("Autoplay is blocked. Please interact with the page to start the radio.");
        } else {
          console.error("Error playing audio:", error);
        }
      });
    }
  }

  pauseaudio() {
    this.TfAudio.pause();
  }

  stopaudio() {
    if (!this.TfAudio) {
      this.TfAudio.pause();
      this.TfAudio.currentTime = 0;
    }
    this.TfAudio.currentTime = 0;
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
    let RadioLoadStartTime = Date.now();
    console.log("Load start time recorded:", RadioLoadStartTime);
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
    this.worker.postMessage({ type: "radio", system: "file" });
  }
  waitingAudio() {
    this.MusicState();
  }
  playingAudio() {
    this.MusicState();
    this.TsunamiRadioBufferLength = this.TsunamiAnalyser.frequencyBinCount;
    this.TsunamiRadioDataArray = new Uint8Array(this.TsunamiRadioBufferLength);
    if (this.canvas !== null) {
      this.canvasctx = this.canvas.getContext("2d");
      return this.canvasctx;
    } else {
      this.canvasctx = this.canvas.getContext("2d");
      return this.canvasctx;
    }
  }
  stalledAudio(stalled) {
    console.log("The Tsunami Audio has stalled for some reason" + stalled);
  }
  suspendedAudio(suspend) {
    console.log("The audio is suspended" + suspend);
  }
  FormatAudioTime(second) {
    let minutes = Math.floor(second / 60);
    let seconds = second % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
  timeupdateAudio() {
    this.Timing = Math.floor(this.TfAudio.currentTime);
    this.RadioProcessBar = (this.TfAudio.currentTime / this.TfAudio.duration) * 100;
    this.TaudioFtime = `Time: ${this.FormatAudioTime(this.Timing)}`
  }
  volumechangeAudio() {
    console.log("The volume has changed");
  }

  /* -----------------------------
     State
  ------------------------------*/

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
}