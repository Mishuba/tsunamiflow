import { TsunamiFlowAudio } from "./Adult/Audio.js";
export class TsunamiFlowRadio extends TsunamiFlowAudio {
  visualizatorController = null;
  _radioBound = false;
  _wired = false;
  radioTypes = ["video/webm", "audio/webm", "video/webm;codecs=vp8", "video/webm;codecs=daala", "video/webm;codecs=h264", "audio/webm;codecs=opus", "video/mp4", "audio/mp3"
  ];
  RadioTimes = ["00:00", "01:00", "01:05", "01:15", "01:30", "02:00", "03:00", "03:20", "03:40", "04:00", "04:20", "04:40", "05:00", "05:20", "05:40", "06:00", "06:20", "06:40", "07:00", "07:20", "07:40", "08:00", "08:10", "08:20", "08:30", "08:40", "08:50", "09:00", "09:20", "09:40", "10:00", "11:00", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "18:00", "18:10", "18:20", "18:30", "18:40", "18:50", "19:00", "19:20", "19:40", "20:00", "20:15", "20:30", "20:45", "21:00", "22:00", "23:00"
  ];
  DefaultPlaylist = [
    "https://radio.tsunamiflow.club/Music/Afterparty/06 - Mishuba - One of them days.mp3",
    "https://radio.tsunamiflow.club/Music/Business/FE/RMM.mp3",
    "https://radio.tsunamiflow.club/Music/Business/TE/I Go In.mp3",
    "https://radio.tsunamiflow.club/Music/Business/TOB/Pandemoium.mp3",
    "https://radio.tsunamiflow.club/Music/Comedy/02 - (Unknown Artist) - 02 - Mishuba - Intro.mp3",
    "https://radio.tsunamiflow.club/Music/Comedy/04 - Mishuba - They Do It To Themselves Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Comedy/06 - Mishuba - Lame Guy Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Comedy/11 - (Unknown Artist) - 11 - Mishuba Off Dat (Sex & Love).mp3",
    "https://radio.tsunamiflow.club/Music/Comedy/Bitch Dependence.mp3",
    "https://radio.tsunamiflow.club/Music/Comedy/Freestyle 107.mp3",
    "https://radio.tsunamiflow.club/Music/Comedy/Freestyle 118.mp3",
    "https://radio.tsunamiflow.club/Music/Comedy/Freestyle 66.mp3",
    "https://radio.tsunamiflow.club/Music/Comedy/Freestyle 68.mp3",
    "https://radio.tsunamiflow.club/Music/Comedy/Mic Check #2 Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Comedy/Whatever (New Black Kid).mp3",
    "https://radio.tsunamiflow.club/Music/DJshuba/04 - (Unknown Artist) - 04 - Mishuba - Who Am I.mp3",
    "https://radio.tsunamiflow.club/Music/DJshuba/Me.mp3",
    "https://radio.tsunamiflow.club/Music/DJshuba/Tallahassee Super Sayian.mp3",
    "https://radio.tsunamiflow.club/Music/Dance/Battle/03 - (Unknown Artist) - 03 Mishuba - What I Do.mp3",
    "https://radio.tsunamiflow.club/Music/Dance/Battle/10 - (Unknown Artist) - 10 - Mishuba - Too Much.mp3",
    "https://radio.tsunamiflow.club/Music/Dance/How We Ride Ft Marcus and Dhamari.mp3",
    "https://radio.tsunamiflow.club/Music/Dance/Battle/This That.mp3",
    "https://radio.tsunamiflow.club/Music/Drinking/03 - MG Blackhall, Mishuba - Awesome Ft MG Blackhall.mp3",
    "https://radio.tsunamiflow.club/Music/Drinking/Freestyle 159 Ft Tugg.mp3",
    "https://radio.tsunamiflow.club/Music/Drinking/Freestyle 18 Ft ShawnOnDaBlock & Lee003.mp3",
    "https://radio.tsunamiflow.club/Music/Drinking/Freestyle 20 Ft Lee003 & ShawnOnDaBlock.mp3",
    "https://radio.tsunamiflow.club/Music/Drinking/Freestyle 25 Ft Dj Naj.mp3",
    "https://radio.tsunamiflow.club/Music/Drinking/Frrestyle 31 Feat Skeet Skirt & ShawnOnDaBlock.mp3",
    "https://radio.tsunamiflow.club/Music/Drinking/Freestyle 6 ft Chief Keese(Know Tyme).mp3",
    "https://radio.tsunamiflow.club/Music/Drinking/Freestyle 80 Feat. Skeet Skirt.mp3",
    "https://radio.tsunamiflow.club/Music/Drinking/Freestyle 96 Feat ShawnOnDaBlock.mp3",
    "https://radio.tsunamiflow.club/Music/Drinking/Step Your Game Up Ft. Cash.mp3",
    "https://radio.tsunamiflow.club/Music/Family/Kids/Morning Lovely Ft Bre and CaeJay.mp3",
    "https://radio.tsunamiflow.club/Music/Family/Lifestyle/We Can Ride (No Time Mishuba Lock Down).mp3",
    "https://radio.tsunamiflow.club/Music/Family/Values/Start (New Black Kid).mp3",
    "https://radio.tsunamiflow.club/Music/Family/Values/Take Off (No Time Mishuba Lock Down).mp3",
    "https://radio.tsunamiflow.club/Music/Family/Values/Time Travel.mp3",
    "https://radio.tsunamiflow.club/Music/Fashion/FH/02 - Mishuba - Rock Star.mp3",
    "https://radio.tsunamiflow.club/Music/Fashion/LD/03 - Mishuba - Cool Guy.mp3",
    "https://radio.tsunamiflow.club/Music/Fashion/LD/04 - Mishuba - Fall Back Please.mp3",
    "https://radio.tsunamiflow.club/Music/Fashion/PD/04 - Mishuba - Lala.mp3",
    "https://radio.tsunamiflow.club/Music/Fashion/PD/05 - Mishuba - Hooped Up On Ft. ShawnOnDaBlock.mp3",
    "https://radio.tsunamiflow.club/Music/Fashion/SM/07 - Mishuba - Supa Fly.mp3",
    "https://radio.tsunamiflow.club/Music/Gaming/Fighters/08 - Mishuba - 08 - Mishuba - Try To Stop Me.mp3",
    "https://radio.tsunamiflow.club/Music/Gaming/Instrumentals/01 - Mishuba - 01 - Mishuba - Intro.mp3",
    "https://radio.tsunamiflow.club/Music/Gaming/Instrumentals/03 - Mishuba - We.mp3",
    "https://radio.tsunamiflow.club/Music/Gaming/Instrumentals/05 - Mishuba - Questions.mp3",
    "https://radio.tsunamiflow.club/Music/Gaming/Instrumentals/07 - Mishuba - Life.mp3",
    "https://radio.tsunamiflow.club/Music/Gaming/Instrumentals/09 - Mishuba - 09 Mishuba - 2019-09-12 Mishuba.mp3",
    "https://radio.tsunamiflow.club/Music/Gaming/Instrumentals/10 - Mishuba - fin.mp3",
    "https://radio.tsunamiflow.club/Music/Gaming/Instrumentals/14 - Mishuba - 14 - Mishuba - Outro.mp3",
    "https://radio.tsunamiflow.club/Music/History/DH/Where To Go Freestyle Ft. Skeet Skirt.mp3",
    "https://radio.tsunamiflow.club/Music/Hustlin/02 - Mishuba - Entry Rookie Year.mp3",
    "https://radio.tsunamiflow.club/Music/Hustlin/02 - Mishuba - My LIne.mp3",
    "https://radio.tsunamiflow.club/Music/Hustlin/03 - Mishuba - 03 - Mishuba - Need More.mp3",
    "https://radio.tsunamiflow.club/Music/Hustlin/05 - Mishuba - Wake Up Run Up.mp3",
    "https://radio.tsunamiflow.club/Music/Hustlin/06 - Mishuba - Bankroll Ft. Levon.mp3",
    "https://radio.tsunamiflow.club/Music/Hustlin/06 - Mishuba - Hustle.mp3",
    "https://radio.tsunamiflow.club/Music/Hustlin/07 - Mishuba - 07 Mishuba - Ambition.mp3",
    "https://radio.tsunamiflow.club/Music/Hustlin/08 - (Unknown Artist) - 08 - Mishuba - Gotta Get It.mp3",
    "https://radio.tsunamiflow.club/Music/Hustlin/Belief (New Black Kid).mp3",
    "https://radio.tsunamiflow.club/Music/Inspiration/Meditation/01 - Mishuba - Asseerate.mp3",
    "https://radio.tsunamiflow.club/Music/Inspiration/Meditation/05 - Mishuba - 05 Mishuba - Meditation.mp3",
    "https://radio.tsunamiflow.club/Music/Inspiration/Meditation/15 - Mishuba - 3_28.mp3",
    "https://radio.tsunamiflow.club/Music/Inspiration/Movitation/07 - Mishuba - Protagonist.mp3",
    "https://radio.tsunamiflow.club/Music/Inspiration/Movitation/The Drop.mp3",
    "https://radio.tsunamiflow.club/Music/Inspiration/Something/03 - Mishuba- Crash.mp3",
    "https://radio.tsunamiflow.club/Music/Inspiration/Something/07 - Mishuba - Guitar Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Inspiration/Something/07 - Mishuba - Tonight Ft Tj and Note.mp3",
    "https://radio.tsunamiflow.club/Music/Inspiration/Something/09 - Mishuba - The Next Step.mp3",
    "https://radio.tsunamiflow.club/Music/Inspiration/Something/13 - Mishuba - Waking Thoughts.mp3",
    "https://radio.tsunamiflow.club/Music/Inspiration/Something/21 - Mishuba - 11_11 01_23.mp3",
    "https://radio.tsunamiflow.club/Music/Inspiration/Something/Peace (New Black Kid).mp3",
    "https://radio.tsunamiflow.club/Music/Literature/Instrumentals/06 - Mishuba - 06 - Mishuba - Eno.mp3",
    "https://radio.tsunamiflow.club/Music/Literature/Instrumentals/07 - (Unknown Artist) - 07 - Mishuba - Duwnen Lyric.mp3",
    "https://radio.tsunamiflow.club/Music/Literature/Instrumentals/14 - (Unknown Artist) - 14 - Mishuba - Dreaming.mp3",
    "https://radio.tsunamiflow.club/Music/Literature/Instrumentals/Journey (No Time Mishuba Lock Down).mp3",
    "https://radio.tsunamiflow.club/Music/Literature/Instrumentals/Zone.mp3",
    "https://radio.tsunamiflow.club/Music/Literature/Poems/01 - Mishuba - Preface.mp3",
    "https://radio.tsunamiflow.club/Music/Literature/Poems/02 - Mishuba - The Last Ride.mp3",
    "https://radio.tsunamiflow.club/Music/Literature/Poems/05 - Mishuba - Late Night Thoughts.mp3",
    "https://radio.tsunamiflow.club/Music/Literature/Poems/06 - Mishuba - Broken.mp3",
    "https://radio.tsunamiflow.club/Music/Literature/Poems/07 - Mishuba - Change.mp3",
    "https://radio.tsunamiflow.club/Music/Literature/Poems/16 - Mishuba - Miss Lady.mp3",
    "https://radio.tsunamiflow.club/Music/Literature/Poems/17 - Mishuba - Alone In The Castle.mp3",
    "https://radio.tsunamiflow.club/Music/Literature/Poems/22 - Mishuba - Proect Detha.mp3",
    "https://radio.tsunamiflow.club/Music/Love/Intimacy/04 - Mishuba - Her Name Is.mp3",
    "https://radio.tsunamiflow.club/Music/Love/Intimacy/08 - Mishuba - LGDF.mp3",
    "https://radio.tsunamiflow.club/Music/Love/Intimacy/09 - Mishuba - The Past.mp3",
    "https://radio.tsunamiflow.club/Music/Love/Intimacy/10 - Mishuba - Sex Game.mp3",
    "https://radio.tsunamiflow.club/Music/Love/Intimacy/13 - (Unknown Artist) - 13 - Mishuba - Thristin Over You (Sex $ Love).mp3",
    "https://radio.tsunamiflow.club/Music/Love/Intimacy/23 - Mishuba - Is This The Key.mp3",
    "https://radio.tsunamiflow.club/Music/Love/Memories/02 - Mishuba - My Heart.mp3",
    "https://radio.tsunamiflow.club/Music/Love/Memories/03 - Mishuba - 5 AM.mp3",
    "https://radio.tsunamiflow.club/Music/Love/Memories/08 - Mishuba - 2 AM.mp3",
    "https://radio.tsunamiflow.club/Music/Love/Memories/12 - (Unkwown Artist) - 12 - Mishuba - LaBae.mp3",
    "https://radio.tsunamiflow.club/Music/Love/Memories/12 - Mishuba - Nah Im A Fool In Love.mp3",
    "https://radio.tsunamiflow.club/Music/Love/Memories/18 - Mishuba - I Need To Do Better.mp3",
    "https://radio.tsunamiflow.club/Music/Love/Memories/19 - Mishuba - I Dont Even Know Anymore.mp3",
    "https://radio.tsunamiflow.club/Music/Love/Bachelor Pad (New Black Kid).mp3",
    "https://radio.tsunamiflow.club/Music/Love/Memories/Boo Thang Shawdy #1.mp3",
    "https://radio.tsunamiflow.club/Music/Love/love/04 - Mishuba - You.mp3",
    "https://radio.tsunamiflow.club/Music/Love/love/06 - (Unknown Artist) - 06 Mishuba - You Deserve More.mp3",
    "https://radio.tsunamiflow.club/Music/Love/love/06 - Mishuba - T&L.mp3",
    "https://radio.tsunamiflow.club/Music/Love/love/11 - Mishuba - The Simple Things.mp3",
    "https://radio.tsunamiflow.club/Music/Love/love/14 - Mishuba - Dear My Heart.mp3",
    "https://radio.tsunamiflow.club/Music/Love/love/20 - Mishuba - Dreaming About You.mp3",
    "https://radio.tsunamiflow.club/Music/Love/love/24 - Mishuba - Can You Hear Me.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/01 - Mishuba - 2904 Chatsworth Dodge Dart SXT Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/02 - Mishuba - 02 Mishuba - Mic Check #3 Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/02 - Mishuba - 3 AM Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/03 - Mishuba - 03 - Mishuba - Warming Up Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/03 - Mishuba - Regular Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/04 - Mishuba - 04 - Mishuba - Goin In Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Outisde/04 - Mishuba - The Interlude Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/05 - Mishuba - 05 - Mishuba - Random Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/05 - Mishuba - Hold Up Real QUick Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/05 - Mishuba - The Hell Wrong With Bruh Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/06 - Mishuba - 06 - Mishuba - 2019-12-21 Mishuba.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/06 - Mishuba - Freestyle 300.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/07 - Mishuba - 07 - Mishuba - Don't Forget Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/08 - Mishuba - 08 - Mishuba - Breaking Barriers Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/10 - Mishuba - 10 - All Time Freestyle ft Hayden Miles.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/11 - Mishuba - 11 - Mishuba - Letting Go Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/12 - Mishuba - 12 Mishuba - Watch Out Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/13 - Mishuba - 13 - Mishuba - Definition Musician Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/Freestyle 194.mp3",
    "https://radio.tsunamiflow.club/Music/Outside/I Stand On That Freestyle.mp3",
    "https://radio.tsunamiflow.club/Music/Politics/Neutral/01 - Mishuba - No More Gossip.mp3",
    "https://radio.tsunamiflow.club/Music/Politics/Neutral/05 - Mishuba - Rapture.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 125.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 126.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 161.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 171.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 179.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 185.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 189.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 190.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 195.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 196.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 200.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 202.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 205.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 225.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 27.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 62.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 67.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 71.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 89.mp3",
    "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 98.mp3",
    "https://radio.tsunamiflow.club/Music/Rizz/Flirting/05 - (Unknown Artist) - 05 - Mishuba - Interlude.mp3",
    "https://radio.tsunamiflow.club/Music/Rizz/IceBreakers/Dime (New Black Kid).mp3",
    "https://radio.tsunamiflow.club/Music/Rizz/Shots/Freestyle 72.mp3",
    "https://radio.tsunamiflow.club/Music/Sex/sex/I Feel It.mp3",
    "https://radio.tsunamiflow.club/Music/Sports/Disses/01 - Mishuba - Defintion Musician Punch In.mp3",
    "https://radio.tsunamiflow.club/Music/Sports/Disses/04 - Mishuba - Rollo In A 4 Doe.mp3",
    "https://radio.tsunamiflow.club/Music/Sports/Disses/Killing Me Softly Ft Jasmine.mp3",
    "https://radio.tsunamiflow.club/Music/Sports/Disses/No Reason.mp3",
    "https://radio.tsunamiflow.club/Music/Sports/Fans/07 - Mishuba - 2022 Hip Hop King.mp3",
    "https://radio.tsunamiflow.club/Music/Sports/Fans/09 - (Unknown Artist) - 09 - Mishuba - July 8th.mp3",
    "https://radio.tsunamiflow.club/Music/Sports/Reviews/02 - Mishuba - 02 Mishuba - Technical.mp3",
    "https://radio.tsunamiflow.club/Music/Sports/Reviews/02 - Mishuba - For The Critics Ft Dj Naj.mp3",
    "https://radio.tsunamiflow.club/Music/Sports/Reviews/03 - Mishuba - You Cant See Me.mp3",
    "https://radio.tsunamiflow.club/Music/Sports/Reviews/Word On The Street.mp3",
    "https://radio.tsunamiflow.club/Music/Sports/Updates/04 - Mishuba - 04 - MIshuba- Humble.mp3",
    "https://radio.tsunamiflow.club/Music/Sports/Updates/I Go In.mp3",
    "https://radio.tsunamiflow.club/Music/Sports/Updates/The Drop.mp3",
    "https://radio.tsunamiflow.club/Music/Tech/Instrumentals/01 - Mishuba - 01 - Mishuba - Nifage.mp3",
    "https://radio.tsunamiflow.club/Music/Tech/Instrumentals/01 - Mishuba - Intro.mp3",
    "https://radio.tsunamiflow.club/Music/Tech/Instrumentals/09 - Mishuba - 09 - Mishuba - Rote.mp3",
    "https://radio.tsunamiflow.club/Music/Tech/Instrumentals/Blank (New Black Kid).mp3",
    "https://radio.tsunamiflow.club/Music/Tech/Instrumentals/Lockdown.mp3",
    "https://radio.tsunamiflow.club/Music/Tech/Music/Freestyle 34.mp3"
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
    //  this.connectaudio();
    //  this.AudioState();
    try {
      if (this.AudioElement.paused || this.AudioElement.ended || this.AudioElement.currentTime === 0) {
        await this.AudioElement.play()
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
  /*
    stopaudio() {
      if (this.AudioElement) {
        this.AudioElement.pause();
        this.AudioElement.currentTime = 0;
        console.log("Audio playback is stopped");
      }
    }
  */
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
    this.startMusic();
    console.log("Audio playback is can play through");
  }
  playAudio() {
    this.playaudio();
    console.log("Audio playback is playing");
    //this.updateAnalyser();

    this.worker.postMessage(this.tycadome(
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
<<<<<<< HEAD
        bufferLength: this.TfSoundContextBufferLength,
        baseRadius: this.baseRadius,
=======
        bufferLength: this.TfSoundsContextDataArray.buffer, baseRadius: this.baseRadius,
>>>>>>> ab8d75059cabfd472aa40e222c9c113c5e565565
        particles: this.particles
      }),
      [this.visualizatorController, this.TfSoundsContextDataArray.buffer]);

  }
  endedAudio() {
    console.log("The audio should have ended");
    this.AudioElement.src = "";
    this.removeAudioContextSource(this.AudioCxtId);
    //  this.AudioState();
    this.AudioNetworkState();
  }
  waitingAudio() {
    //  this.AudioState();
    console.log("Audio playback is waiting");
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

    const loopAnalyzer = () => {
      if (!this._workerAnalyserRunning) return;


      setInterval(() => {
        this.TfSoundAnalyser.getByteFrequencyData(
          this.TfSoundsContextDataArray
        );

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
              dataArray: this.TfSoundsContextDataArray,
              bufferLength: this.TfSoundsContextDataArray.length,
              baseRadius: this.baseRadius
            }
          )
        );
      }, 33);
      requestAnimationFrame(loopAnalyzer);
    };

    loopAnalyzer();
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
  /*
  volumechangeAudio() {
    console.log("The volume has changed");
  }

  getCurrentaudioTime() {
    return this.AudioElement.currentTime;
  }

  getaudioDuration() {
    return this.AudioElement.duration;
  }

  isaudioPlaying() {
    return !this.AudioElement.paused;
  }
  */
  //element ends

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
          this.initAudioContext();
          this._wired = true;
        }
        this.canplaythroughAudio();
      });

      this._storeDomListener(this.AudioElement.id, this.AudioElement, this.canplaythroughAudio, "canplaythrough");

      this.AudioElement.addEventListener("play", () => {
        this.playAudio();
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
        //cancelAnimationFrame(this.visualizatorController);
        //this.stopAnalyserLoop();
        this.destroyRadioSource();
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