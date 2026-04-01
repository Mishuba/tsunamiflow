export class maxwell {
    iframe = null
    soundEngine = null;
    audioTitle = null;
    audioSystem = null;
    audioLast = null;
    audioRestart = null;
    audioStart = null;
    audioSkip = null;
    videoEngine
    mediaBin = {
        webcams: {},
        videos: {},
        images: {},
        screens: {}
    };
    constructor(option = {}) {
        if (option.iframe) {
            this.iframe = option.iframe;
        }
        if (option.sound) {
            this.soundEngine = option.sound;
        }
        if (option.AudioTitle) {
            this.audioTitle = option.AudioTitle;
        }
        if (option.AudioButtonSpot) {
            this.audioSystem = option.AudioButtonSpot;
        }
        if (option.AudioPrevious) {
            this.audioLast = option.AudioPrevious;
        }
        if (option.AudioOver) {
            this.audioRestart = option.AudioOver;
        }
        if (option.AudioStart) {
            this.audioStart = option.AudioStart;
        }
        if (option.AudioSkip) {
            this.audioSkip = option.AudioSkip;
        }
    }
<<<<<<< HEAD
    async bindAudio() {
=======
  bindNavBar() {
    // navigation menu
    this.on("tfRoster", () => {
      //i have a function for this already.
      this.iframe.frame.src = "Iframe/Pages/roster.html";
      this.iframe.MenuSwitch(this.iframe.frame);
    }
    );
    this.on("tfNews", () => {
      this.iframe.frame.src = "Iframe/Pages/news.html";
      this.iframe.MenuSwitch(this.iframe.frame);
    }
    );

    this.on("tfCompetitions", () => {
      this.iframe.frame.src = "Iframe/Pages/Competitions.html";
      this.iframe.MenuSwitch(this.iframe.frame);
    }
    );

    this.on("tfNetwork", () => {
      this.iframe.frame.src = "Iframe/Pages/TFnetwork.html";
      this.iframe.MenuSwitch(this.iframe.frame);
      /*
         <video
             controls
  autoplay
  muted
  playsinline
  width="925"
>
  <source src="https://media.tsunamiflow.club/videos/tftv.mp4" type="video/mp4">
</video>
      */
    }
    );

    this.on("tfCommunity", () => {
      this.iframe.frame.src = "Iframe/Pages/Community.html";
      this.iframe.MenuSwitch(this.iframe.frame)

    });

    this.on("NavLoginButton", () => {
      this.user.login();
    }, true);
  }
>>>>>>> 5fe71a463b3ce40f7ce36cac98fac91dc0b814e2

        this.audioEngine.RadioEventListeners();
    }
    async addVideoToBin(file) {
        const id = crypto.randomUUID();
        const url = URL.createObjectURL(file);

        this.mediaBin.videos[id] = {
            id,
            type: "video",
            url,
            created: Date.now()
        };

        return id;
    }

    async playFromBin(id) {
        const item = this.mediaBin.videos[id];
        if (!item) return;
        await this.startMediaSource("video", item.url);
    }

    removeFromBin(id) {
        const item = this.mediaBin.videos[id];
        if (!item) return;

        URL.revokeObjectURL(item.url);
        delete this.mediaBin.videos[id];
    }

    listBinVideos() {
        return Object.values(this.mediaBin.videos)
            .sort((a, b) => b.created - a.created);
    }

    async bindStore() {

    }

    RadioReady() {
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
      this.soundEngine.previousSong();
      //RadioWorker.postMessage({type: "radio",system: "previous"});
    }
    );

    this.on("TFRadioRestartButton", () => {
      element.currentTime = 0;
      this.soundEngine.startMusic(element);
      start.innerHTML = "Pause Tsunami Radio";
    }
    );

    this.on("TFradioButton", () => {
      if (element.paused) {
        this.soundEngine.playAudio(element);
        start.innerHTML = "Pause Tsuanmi Radio";
      } else {
        this.soundEngine.stopMusic(element);
        start.innerHTML = "Play Tsunami Radio";
        //this.audio.startMusic();
        //this.audio.stopMusic();
      }
    }
    );

    this.on("TFradioSkipButton", () => {
      element.src = "";
      RadioWorker.postMessage({
        type: "radio",
        system: "file",
      });
    }
    );
    }
    bindAudio() {
        this.RadioReady();
        this.soundEngine.RadioEventListeners();
    }
    bindVidSystem() {

    }
}