export class MishubaController {
  constructor(user = null, iframe = null, effects = null, websocket = null, audio = null, video = null, game = null) {
    this.user = user;
    this.iframe = iframe;
    if (document.getElementById("tfNavLoginForm")){
      this.bindNavBar();
    }
    if (document.getElementById("TFMembershipLevel")) {
      this.bindSignUp();
    }
    this.effects = effects;
    if (effects !== null) {
      this.bindEffects();
    }
    this.websocket = websocket;
    if (websocket !== null) {
      this.bindSocket();
    }
    this.audio = audio;
    if (audio !== null) {
      this.bindAudio();
    }
    this.video = video;
    if (video !== null) {
      this.bindVideo();
    }
    this.game = game;
    if (game !== null) {
      this.bindGame();
    }
  }
on(id, handler) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('click', handler);
}
  bindNavBar() {
    // navigation menu
    this.on("tfRoster", () => {
      //i have a function for this already.
      this.iframe.MenuSwitch(this.iframe.frame);
      }
    );
    this.on("tfNews", () => {
      this.iframe.MenuSwitch(this.iframe.frame);
      }
    );
    
    this.on("tfCompetitions", () => {
      this.iframe.MenuSwitch(this.iframe.frame);
      }
    );
    
    this.on("tfNetwork", () => {
      this.iframe.MenuSwitch(this.iframe.frame);
      }
    );
    
    this.on("tfCommunity", () => {
      this.iframe.MenuSwitch(this.iframe.frame);
      }
    );
    
    this.on("NavLoginButton", () => {
      this.iframe.MenuSwitch(this.iframe.frame);
      }
    );
  }
  bindSignUp() {
    this.on("", () => {
      this.user.signup();
    }
    )
  }
  bindEffects() {
    
  }
  bindSocket() {
    
  }
  bindAudio() {
    this.on("TFradioPreviousButton", () => {
      this.audio.previousSong();
      }
    );
    
    this.on("TFRadioRestartButton", () => {
      this.audio.restartSong();
      }
    );
    
    this.on("TFradioButton", () => {
      this.audio.startMusic();
      //this.audio.stopMusic();
      }
    );
    
    this.on("TFradioSkipButton", () => {
      
      }
    )
  }
  usePickedColor(useChroma) {
  this.VidEffects.useChromaKey = true;
  useChroma.style.display = "inline";
  }
  bindVideo() {
    this.on("", (color) => {
      this.usePickedColor(color);
    });
    this.on("", (image) => {
      this.UploadImage(image);
    });
    this.on("", (image) => {
      this.RemoveImage(image);
    });
    this.on("", (video) => {
      this.UploadVideo(video);
    });
    this.on("", (video) => {
      this.RemoveVideo(video);
    });
  }
  bindGame() {
    
  }
}