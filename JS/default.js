export class MishubaController {
  constructor(user = null, iframe = null, effects = null, websocket = null, audio = null, mixer = null, AudioElement = null, AudioCanvas = null, AudioTitle = null, AudioButtonSpot = null, AudioPrevious = null, AudioOver = null, AudioStart = null, AudioSkip = null, video = null, VideoElement = null, VideoCanvas = null, game = null, store = null, pay = null, worker = null, webcam = null, webrtc = null, recorder = null, streamer = null, screenshare = null) {
    this.user = user;
    this.iframe = iframe;
    this.effects = effects;
    this.websocket = websocket;
    this.audio = audio;
    this.audioElem = AudioElement;
this.audioCanv = AudioCanvas;
this.audioCtx = this.audioCanv.getContext("2d", { colorSpace: "srgb", willReadFrequently: true });
this.audioTitle = AudioTitle;
this.audioSystem = AudioButtonSpot;
this.audioLast = AudioPrevious;
this.audioRestart = AudioOver;
this.audioStart = AudioStart;
this.audioSkip = AudioSkip;
    this.mixer = mixer;
    this.worker = worker;
    this.video = video;
    this.videoElem = VideoElement;
    this.videoCanv = VideoCanvas;
    this.TfWebcam = webcam;
    this.webrtc = webrtc;
    this.recorder = recorder;
    this.streamer = streamer;
    this.game = game;
    this.store = store;
    this.payment = pay;
    this.extraElem = null;
    this.MyScreen = screenshare;
  }
  find(elem, frame = null) {
if (frame === true) {
return this.iframe.frame.contentDocument.getElementById(elem);
} else {
      return document.getElementById(elem);
   } 
}
  on(id, handler, preventDefault = false, iframe = null) {
    let el;
    if (iframe === null) {
        el = document.getElementById(id);
    } else {
        el = iframe?.contentDocument?.getElementById(id);
    }
    if (!el) return;

    const isForm = el instanceof HTMLFormElement;
    const isSubmitButton =
        (el instanceof HTMLButtonElement && el.type === "submit") ||
        (el instanceof HTMLInputElement &&
            ["submit", "image"].includes(el.type));

    const runHandler = (event) => {
        if (isForm || isSubmitButton || preventDefault) {
            event.preventDefault();
            event.stopPropagation();
        }
        handler(event);
    };

    // Desktop click / form submit
    const eventType = isForm ? "submit" : "click";
    el.addEventListener(eventType, runHandler);

    // Mobile touch: prevent scrolling / double-tap zoom
    el.addEventListener(
        "touchend",
        (e) => {
            runHandler(e);
            if (!isForm && !isSubmitButton && preventDefault) e.preventDefault();
        },
        { passive: false }
    );

    // Pointer events for stylus / hybrid devices
    el.addEventListener("pointerdown", (e) => {
        runHandler(e);
        if (!isForm && !isSubmitButton && preventDefault) e.preventDefault();
    });
}
  bindNavBar() {
    // navigation menu
    this.on("tfRoster", () => {
      //i have a function for this already.
      this.iframe.frame.src = "roster.html";
      this.iframe.MenuSwitch(this.iframe.frame);
    }
    );
    this.on("tfNews", () => {
      this.iframe.frame.src = "news.html";
      this.iframe.MenuSwitch(this.iframe.frame);
    }
    );

    this.on("tfCompetitions", () => {
      this.iframe.frame.src = "Competitions.html";
      this.iframe.MenuSwitch(this.iframe.frame);
    }
    );

    this.on("tfNetwork", () => {
      this.iframe.frame.src = "TFnetwork.html";
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
      this.iframe.frame.src = "Community.html";
      this.iframe.MenuSwitch(this.iframe.frame)

});

    this.on("NavLoginButton", () => {
      this.user.login();
    }, true);
  }
  
  TsunamiRadioReady(RadioWorker, element, title, buttonSpot, last, restart, start, skip) {
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
      this.audio.previousSong();
      //RadioWorker.postMessage({type: "radio",system: "previous"});
    }
    );

    this.on("TFRadioRestartButton", () => {
element.currentTime = 0;
      this.audio.startMusic(element);
      start.innerHTML = "Pause Tsunami Radio";
    }
    );

    this.on("TFradioButton", () => {
      if (element.paused) {
        this.audio.playAudio(element);
        start.innerHTML = "Pause Tsuanmi Radio";
      } else {
        this.audio.stopMusic(element);
        start.innerHTML = "Play Tsunami Radio";
      //this.audio.startMusic();
      //this.audio.stopMusic();
    }}
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
  TfRadioEventListeners() {
if (this._radioBound) return;
this._radioBound = true;
   this.audioElem.addEventListener("emptied", async (emptied) => {
      this.audio.emptiedAudio(emptied);  cancelAnimationFrame(this.effects.visualizatorController);
    }); //this event is sent if the media has already been loaded( or partially loaded), and the HTMLMediaElement.load method is called to reload it.

    this.audioElem.addEventListener("loadstart", async () => {
      this.audio.loadstartAudio(this.audioElem);
      //this.MusicNetworkState(this.worker.radioWorker, element);
    }); // Fired when the browser has started to load the resource.

    this.audioElem.addEventListener("loadedmetadata", async () => {
      this.audio.loadedmetadataAudio(this.audioElem);
    }); //The metadata has been loaded.

    this.audioElem.addEventListener("loadeddata", (data) => {
      this.audio.loadeddataAudio(this.audioElem);
    });

    this.audioElem.addEventListener("canplay", () => {
      this.audio.canplayAudio(this.audioElem);
    }); // The browser can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content.

    this.audioElem.addEventListener("canplaythrough", async () => {
      if (!this.audio._wired) {
  this.audio.TsunamiRadioMedia.connect(this.audio.TsunamiAnalyser);
  this.audio.TsunamiAnalyser.connect(this.audio.TsunamiRadioAudio.destination);
  this.audio.TsunamiAnalyser.connect(this.audio.StreamDestination);
  this.audio._wired = true;
}
this.audio.canplaythroughAudio(this.audioElem);
    });

    this.audioElem.addEventListener("play", () => {
      this.audio.playAudio(this.audioElem);
    }); //Playback has begun.

    this.audioElem.addEventListener("pause", () => {
      this.audio.pauseAudio(this.audioElem); cancelAnimationFrame(this.effects.visualizatorController);
    }); // Playback has been paused.

    this.audioElem.addEventListener("ended", async (ended) => {
      this.audio.endedAudio(this.audioElem, this.worker.radioWorker); cancelAnimationFrame(this.effects.visualizatorController);
    }); //Playback has stopped because of the end of the media was reached.

    this.audioElem.addEventListener("waiting", (waiting) => {
      console.log("The audio has been waiting because: " + waiting);
      this.audio.waitingAudio(this.audioElem);
    }); //Playback has stopped because of a temporary lack of data.

    this.audioElem.addEventListener("playing", () => {
      this.audio.playingAudio(this.audioElem, this.audioCanv); 
this.effects.hereDude(this.audioCanv, this.audioCtx, this.audio.TsunamiAnalyser, this.audio.TsunamiRadioDataArray, this.audio.TsunamiRadioBufferLength, this.audio.baseRadius, this.audio.particles);
    }); // Playback is ready to start after having been paused or delayed due to lack of data.

    this.audioElem.addEventListener("stalled", (stalled) => {
      console.log("the audio has stalled because: " + stalled);
      this.audio.stalledAudio(stalled).then(() => {
        cancelAnimationFrame(this.effects.visualizatorController);
      });
    }); //The user agent is trying to fetch media data, but data is unexpectedly not forthcoming.

    this.audioElem.addEventListener("suspended", (suspend) => {
      console.log("The audio has suspened because:" + suspend);
      this.audio.suspendAudio(suspend).then(() => {
        cancelAnimationFrame(this.effects.visualizatorController);
      });
    }); //Media data loading has been suspended.

    this.audioElem.addEventListener("timeupdate", () => {
      this.audio.timeupdateAudio(this.audioElem);
    }); //The time indicated by the currentTime attribute has been updated.

    this.audioElem.addEventListener("volumechange", (volumechange) => {
      this.audio.volumechangeAudio();
    });
  }
  bindAudio() {
this.TsunamiRadioReady(this.worker.radioWorker, this.audioElem, this.audioTitle, this.audioSystem, this.audioLast, this.audioRestart, this.audioStart, this.audioSkip);
this.TfRadioEventListeners();
  }
  usePickedColor(useChroma) {
    this.effects.useChromaKey = true;
    useChroma.style.display = "inline";
  }
  
  VideoEventListeners(engine, element, canvas) {
    if (element === null) {
      element = document.createElement("video");
    }
    element.id = "TsunamiFlowVideoStuff";
    element.controls = true;
    element.autoplay = false;
    element.loop = false;
    element.muted = false;
    element.poster = "";
    element.addEventListener("emptied", async () => {
      console.log("The Tsunami Community Video has been emptied.");
      engine.emptiedVideo(element);
    });

    element.addEventListener("load", async () => {
      engine.loadVideo(element);
    });

    element.addEventListener("loadstart", async () => {
      console.log("The Tsunami Community Video has started loading.");

    });

    element.addEventListener("loadedmetadata", async (metadata) => {
      console.log("The Tsunami COmmunity Video metadata has started to load. " + metadata);
      engine.loadedVideoMetadata(element, canvas);
    });

    element.addEventListener("loadeddata", async (data) => {
      console.log("The data has loaded " + data);
      engine.loadedVideoData(element, null);
    }); // The first frame of the mdeia has finished loading.

    element.addEventListener("canplay", async () => {
      console.log("The Tsunami Video Community can play this part.");
      //create canvas for audio and video
      engine.canPlayVideo(element, null);
    });

    element.addEventListener("canplaythrough", async () => {
      engine.canPlayVideoThrough(element, null);
    }); //The browser estimates it can play the media up to its ends without stopping for content buffering.

    element.addEventListener("play", () => {
      console.log("The Video should be playing");
      //this.playVideo();
      //Capture processed canvas as MediaStream with button
      //this.processedStream = canvas.captureStream(30);
      engine.playVideo(element, null);
    });

    element.addEventListener("pause", async () => {
      //this.pauseVideo();
      engine.pauseVideo(element, null);
    }); //playback has been paused.

    element.addEventListener("ended", async () => {
      console.log("The video should have ended");
      //this.VideoEnded();
      engine.VideoEnded(element, null);
    });

    element.addEventListener("waiting", async (waiting) => {
      console.log("The Video should be waiting" + " " + waiting);
      engine.VideoWaiting(element, null);
    });

    element.addEventListener("playing", async () => {
      console.log("The video should be playing");
      engine.VideoPlaying(element, null);
    });

    element.addEventListener("stalled", async (stalled) => {
      console.log(`The Tsunami Community Video has stalled for some reason. ${stalled} <br /> here is the supposed song path: input the real path here later.`);
      engine.VideoStalled();
    });

    element.addEventListener("suspended", async (suspend) => {
      engine.VideoSuspended(element);
      console.log(suspend);
    });

    element.addEventListener("timeupdate", () => {
      //function 
      engine.UpdateVideoTime(element);
    });

    element.addEventListener("volumechange", async () => {
      engine.VideoVolumeChange();
    });
  }
  
  bindVidSystem() {
    this.on("TfControlShit", () => {
      this.bindVideo();
      //webcam now
    }, false, this.iframe.frame);
  }
  
  bindVideo() {
if (this._videoBound) return;
this._videoBound = true;
    const iframe = this.iframe.frame;

    const post = (type, payload = {}) => {
        iframe.contentWindow.postMessage({ type, ...payload }, "*");
    };

    // START WEBCAM + DRAW LOOP
    this.on("TfStartShit", async () => {
        if (this.videoCanv === null) {

        }
        if (!this.TfWebcam.stream) {
            try {
                await this.TfWebcam.start();            // get MediaStream
                this.effects.isPlaying = true;

let webcamAudioStream = new MediaStream();
webcamAudioStream.addTrack(this.TfWebcam.audioTrack);
let sourceNode = this.audio.TsunamiRadioAudio.createMediaStreamSource(webcamAudioStream);

sourceNode.connect(this.audio.TsunamiAnalyser);
sourceNode.connect(this.audio.StreamDestination);
                // FRAME DRAW LOOP
                const drawLoop = () => {
                    if (!this.effects.isPlaying) return;
                    this.effects.drawingFrame(this.videoCanv, this.TfWebcam.videoTrack);
                    requestAnimationFrame(drawLoop);
                };
                drawLoop();
            } catch (err) {
                console.error("Webcam start failed:", err);
            }
        }
    }, false, iframe);

    // STOP WEBCAM
    this.on("TfStopShit", () => {
        this.TfWebcam.stop();
        this.effects.isPlaying = false;
    }, false, iframe);

    // ENABLE CHROMA KEY
    this.on("TuseFthisKeycolor", () => {
        const keyInput = this.find("TFchromaKey", true); // color input inside iframe
        this.effects.ColorPickerChromaKey(keyInput);
        this.effects.useChromaKey = true;
    }, false, iframe);

    // DISABLE CHROMA KEY
    this.on("rmvTFchromakey", () => {
        this.effects.disableChromaKey();
    }, false, iframe);

    // UPLOAD / REMOVE BACKGROUND IMAGE
    this.on("TFuploadImage", (e) => this.effects.UploadImage(e), false, iframe);
    this.on("rmvTFimg", () => this.effects.RemoveImage(this.videoCanv, this.videoCanv.width, this.videoCanv.height), false, iframe);

    // UPLOAD / REMOVE BACKGROUND VIDEO
    this.on("TFuploadVideo", (e) => this.effects.UploadVideo(e), false, iframe);
    this.on("rmvTFvid", () => this.effects.RemoveVideo(this.videoCanv, this.videoCanv.height, this.videoCanv.width), false, iframe);

    // START / STOP RECORDING if recorder exists
        this.on("TfStartRecPlz", () => {
this.recorder.streamKey = "anything";

this.recorder.useExternalAudioStream(
    this.audio.StreamDestination.stream
);
       let tStream = this.recorder.start(this.videoCanv);

//this.webrtc.localStream = tStream.stream; // or tStream.recorder;
//this.webrtc.websocket = this.websocket;
//this.webrtc.startStreaming({ streamKey: "anything" });
}, false, iframe);

        this.on("TfStopRecPlz", () => {
            this.recorder.stop();
this.webrtc.stopStreaming();
        }, false, iframe);
    }
  getControllerType(gamepad) {
        // Detect controller type based on button layout
        if (gamepad.buttons[0].value === 1) {
            return 'playstation';
        } else if (gamepad.buttons[1].value === 1) {
            return 'xbox';
        } else if (gamepad.buttons[0].value === 1 && gamepad.buttons[3].value === 1) {
            return 'switch';
        } //else {return pcControls();}; 
    };
    gamepadHandler(event, connected) {
        const gamepad = event.gamepad;
        if (connected) {
            this.game.controllerIndex = gamepad.index;
            console.log("Controller connected at index:", this.controllerIndex);
            this.game.controllerType = this.getControllerType(gamepad);
            console.log("Controller type detected:", this.game.controllerType);
            gamepads[gamepad.index] = gamepad;
            console.log(`Gamepad connected: ${gamepad.id}`);
        } else {
            this.game.controllerIndex = null;
            this.game.controllerType = null;
            delete gamepads[gamepad.index];
            console.log(`Gamepad disconnected: ${gamepad.id}`);
        }
    }
    
  bindGame() {
    //game butfons.
  }
  
  bindSignUp() {
  this.on("TFCompleteForm", () => {
    this.user.signup(this.userFields, this.extraFields);
  }, true);
}

  bindUsers() {
  this.userFields = {
    tfFN: document.getElementById("TfFirstName"),
    tfLN: document.getElementById("TfLastName"),
    tfNN: document.getElementById("TfNickName"),
    tfGen: document.getElementById("TfGender"),
    tfEM: document.getElementById("TfEmail"),
    tfBirth: document.getElementById("TfBirthday"),
    tfUN: document.getElementById("TFuserName"),
    tfPsw: document.getElementById("TFpassword"),
    tfMembershipLevel: document.getElementById("TFMembershipLevel"),
  };
  this.extraFields = {
    ChineseZodiacSign: document.getElementById("ChineseZodiacSign"),
    WesternZodiacSign: document.getElementById("WesternZodiacSign"),
    SpiritAnimal: document.getElementById("SpiritAnimal"),
    CelticTreeZodiacSign: document.getElementById("CelticTreeZodiacSign"),
    NativeAmericanZodiacSign: document.getElementById("NativeAmericanZodiacSign"),
    VedicAstrologySign: document.getElementById("VedicAstrologySign"),
    GuardianAngel: document.getElementById("GuardianAngel"),
    ChineseElement: document.getElementById("ChineseElement"),
    EyeColorMeaning: document.getElementById("EyeColorMeaning"),
    GreekMythologyArchetype: document.getElementById("GreekMythologyArchetype"),
    NorseMythologyPatronDeity: document.getElementById("NorseMythologyPatronDeity"),
    EgyptianZodiacSign: document.getElementById("EgyptianZodiacSign"),
    MayanZodiacSign: document.getElementById("MayanZodiacSign"),
    LoveLanguage: document.getElementById("LoveLanguage"),
    Birthstone: document.getElementById("Birthstone"),
    BirthFlower: document.getElementById("BirthFlower"),
    BloodType: document.getElementById("BloodType"),
    AttachmentStyle: document.getElementById("AttachmentStyle"),
    CharismaType: document.getElementById("CharismaType"),
    BusinessPersonality: document.getElementById("BusinessPersonality"),
    DISC: document.getElementById("DISC"),
    SocionicsType: document.getElementById("SocionicsType"),
    LearningStyle: document.getElementById("LearningStyle"),
    FinancialPersonalityType: document.getElementById("FinancialPersonalityType"),
    PrimaryMotivationStyle: document.getElementById("PrimaryMotivationStyle"),
    CreativeStyle: document.getElementById("CreativeStyle"),
    ConflictManagementStyle: document.getElementById("ConflictManagementStyle"),
    TeamRolePreference: document.getElementById("TeamRolePreference")
  };
  this.membershipSelect = document.getElementById("TFMembershipLevel");
  this.membershipCostEl = document.getElementById("membershipCost");
  this.paymentTypeEl = document.getElementById("paymentType");
  this.hiddenMC = document.getElementById("hiddenMC");
  this.hiddenPT = document.getElementById("hiddenPT");
  this.sections = {
    free: document.getElementById("freeLevelInputs"),
    regular: document.getElementById("regularLevelInputs"),
    vip: document.getElementById("vipLevelInputs"),
    team: document.getElementById("teamLevelInputs"),
    address: document.getElementById("AddressDetailsSubscribers"), // if present
    costInfo: document.getElementById("membershipCostInfo"),
  };
  this.bindSignUp();
  }
  
  async bindStore() {
    await this.store.showProducts();
}
  
  bindPayments() {
      this.payment.mountCard("UniqueOriginal");
      
      document.getElementById("UniqueOriginalBtn").addEventListener("click", async () => {
  const email = emailInput.value || null;
  try {
    const result = await this.payment.donate(20, 'usd', true, email); // $20 item
    if (result.payment && result.payment.status === 'succeeded') {
      alert("Purchase successful! Thank you.");
      // Optionally, you can trigger your order fulfillment logic here
    }
  } catch (err) {
    alert("Purchase failed: " + err.message);
  }
});
      this.payment.mountCard("SubscribeUsers");
      
      document.getElementById("FreeLevelSubmit").addEventListener("click", async () => {
  const email = emailInput.value || null;
  const priceId = "price_123456789"; // Stripe Price ID for subscription
  try {
    const result = await this.payment.subscribe(email, priceId, true);
    if (result.status === 'success') {
      alert("Subscription successful!");
    } else if (result.payment && result.payment.status === 'succeeded') {
      alert("Subscription payment successful!");
    }
  } catch (err) {
    alert("Subscription failed: " + err.message);
  }
});
    
    this.payment.mountCard("TfDonation"); //div
    
    document.getElementById("TfDonateBtn").addEventListener("click", async () => {
        try {
          const result = await this.payment.donate(10, 'usd', true, email); // $10 donation
          if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
              alert("Donation successful! Thank you.");
          }
        } catch (err) {
          alert("Donation failed: " + err.message);
        }
      }
    );
  }
  
  bindWorker() {
    this.worker.init(this.audioElem);
  }
  
}