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

    bindPayments() {

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

    bindAudio() {
        this.RadioReady(this.audioTitle, this.audioSystem, this.audioLast, this.audioRestart, this.audioStart, this.audioSkip);
        this.soundEngine.RadioEventListeners();
    }
}