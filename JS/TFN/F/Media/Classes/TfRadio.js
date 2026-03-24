export class TsunamiFlowRadio extends TsunamiFlowNation {
  
  constructor(options = {}) {
    
  }
  
  //element
  connectaudio(context) {
    
    if (!context) return;
    
    this.TfSoundsContext = context;
    
    if (!this.AudioSource) {
      
      this.AudioSource = context.createMediaElementSource(this.TfAudio);
      this.TfSoundsGain = context.createGain();
      
      this.TfAudio.connect(this.TfSoundsGain);
      this.TfSoundsGain.connect(context.destination);
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
  
  /// context
  addAudioContextSource(element, id = null) {
    const sourceId = id || `source-${++this.TfSoundsidCounter}`;
    const source = this.TfSoundsContext.createMediaElementSource(element);
    const gain = this.TfSoundsContext.createGain();
    source.connect(gain).connect(this.TfSoundsOutput);
    
    this.AudioSource[sourceId] = source;
    this.TfSoundsGain[sourceId] = gain;
    
    this.emit("sourceAdded", { id: sourceId, source, gain });
    return sourceId;
  }
  
  /* ----------------------------
     Add MediaStreamSource
  -----------------------------*/
  addAudioStreamSource(stream, id = null) {
    const sourceId = id || `source-${++this.TfSoundsidCounter}`;
    const source = this.TfSoundsContext.createMediaStreamSource(stream);
    const gain = this.TfSoundsContext.createGain();
    source.connect(gain).connect(this.TfSoundsOutput);
    
    this.AudioSource[sourceId] = source;
    this.TfSoundsGain[sourceId] = gain;
    
    this.emit("sourceAdded", { id: sourceId, source, gain });
    return sourceId;
  }
  
  /* ----------------------------
     Control Gain
  -----------------------------*/
  setAudioContextGain(id, value = 1) {
    if (this.TfSoundsGain[id]) this.TfSoundsGain[id].gain.value = value;
  }
  
  /* ----------------------------
     Remove Source
  -----------------------------*/
  removeAudioContextSource(id) {
    if (this.AudioSource[id]) {
      this.AudioSource[id].disconnect();
      this.TfSoundsGain[id].disconnect();
      delete this.AudioSource[id];
      delete this.TfSoundsGain[id];
      this.emit("sourceRemoved", id);
    }
  }
  
  /* ----------------------------
     Close Context
  -----------------------------*/
  finishAudioContext() {
    if (this.TfSoundsContext) {
      this.TfSoundsContext.close();
      this.TfSoundsContext = null;
      this.AudioSource = {};
      this.TfSoundsGain = {};
      this.TfSoundsOutput = null;
      this.emit("closed");
    }
  }
  //content ends
  
  ///worklet
  connect(destination) {
    if (!this.TfSoundsWorkletNode) return;
    this.TfSoundsWorkletNode.connect(destination);
  }
  
  disconnect() {
    if (!this.TfSoundsWorkletNode) return;
    this.TfSoundsWorkletNode.disconnect();
  }
  
  /* ----------------------------
     Send message to processor
  -----------------------------*/
  postMessage(message) {
    if (!this.TfSoundsWorkletNode) return;
    this.TfSoundsWorkletNode.port.postMessage(message);
  }
  ///worklet ends
}