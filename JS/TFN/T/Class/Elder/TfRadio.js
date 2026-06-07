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
          dataArray: this.TfSoundContextDataArray,
          dataArrayLength: this.TfSoundContextDataArray.length,
          baseRadius: this.baseRadius,
          particles: this.particles,
          volume: this.TfSoundVolume
        }
      )
    );
    requestAnimationFrame(loopAnalyzer);
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
}