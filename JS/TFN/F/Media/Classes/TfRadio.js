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
    return this.TfAudio.play();
  }

  pauseaudio() {
    this.TfAudio.pause();
  }

  stopaudio() {
    this.TfAudio.pause();
    this.TfAudio.currentTime = 0;
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