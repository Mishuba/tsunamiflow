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