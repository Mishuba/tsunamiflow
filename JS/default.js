export class MishubaController {
  constructor(user = null, iframe = null, effects = null, websocket = null, audio = null, mixer = null, AudioElement = null, AudioCanvas = null, AudioTitle = null, AudioButtonSpot = null, AudioPrevious = null, AudioOver = null, AudioStart = null, AudioSkip = null, video = null, VideoElement = null, VideoCanvas = null, game = null, store = null, worker = null, webcam = null, recorder = null) {
    this.user = user;
    this.iframe = iframe;
    if (document.getElementById("TFMembershipLevel")) {
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
    this.effects = effects;
    this.websocket = websocket;
    this.audio = audio;
    this.mixer = mixer;
    if (audio !== null) {
      this.audioElem = AudioElement;
      this.audioCanv = AudioCanvas;
      this.audioTitle = AudioTitle;
      this.audioSystem = AudioButtonSpot;
      this.audioLast = AudioPrevious;
      this.audioRestart = AudioOver;
      this.audioStart = AudioStart;
      this.audioSkip = AudioSkip;
      this.bindAudio();
    }
    this.video = video;
    if (this.video !== null) {
      this.VidElem = VideoElement;
      if (this.VidElem !== null) {
        this.VidCanv = VideoCanvas;
        if (this.VidElem === document.getElementById("TsunamiFlowVideoStuff")) {
          //check existfences

          if (this.VidCanv !== null) {
            if (this.VidCanv === document.getElementById("TFcanvas")) {
              //community or live here.
            } else {
              //Do live or sometfhing here.
            }
          }
        }
      } else {
        /// creatfe video eementf
        // tfhen check canvas\, notf tfhere tfhen make c\anvas tfo.

        //now do sometfhing.
      }
      this.VideoEventListeners(this.video, this.VidElem, this.VidCanv);
      this.bindVideo();
    }
    this.TfWebcam = webcam;
    this.recorder = recorder;
    this.game = game;
    if (this.game !== null) {
      this.bindGame();
    }
    this.store = store;
    if (this.store !== null) {
      this.bindStore();
      //this.bindCart();
    }
    this.worker = worker;
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
      this.iframe.MenuSwitch(this.iframe.frame);
    }
    );

    this.on("NavLoginButton", () => {
      //this.user.login(this.user.username, this.user.password);
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
  TsunamiRadioReady(RadioWorker, element, title, buttonSpot, last, restart, start, skip) {
    title.innerHTML = "Welcome to TFN Radio";

    last.id = "TFradioPreviousButton";
    last.innerHTML = "Previous";
    last.addEventListener("click", async () => {
      RadioWorker.postMessage({
        type: "radio",
        system: "previous",
      });
      //this.previousSong(element, oldSong);
    });
    buttonSpot.appendChild(last);

    restart.id = "TFRadioRestartButton";
    restart.innerHTML = "Restart";
    restart.addEventListener("click", async () => {
      element.currentTime = 0;
      this.startMusic(element);
      start.innerHTML = "Pause Tsunami Radio";
    });
    buttonSpot.appendChild(restart);

    start.id = "TFradioButton";
    start.innerHTML = "Start Radio";
    start.addEventListener("click", async () => {
      if (element.paused) {
        this.startMusic(element);
        start.innerHTML = "Pause Tsuanmi Radio";
      } else {
        this.stopMusic(element);
        start.innerHTML = "Play Tsunami Radio";
      }
    });
    buttonSpot.appendChild(start);

    skip.id = "TFradioSkipButton";
    skip.innerHTML = "Next";
    skip.addEventListener("click", async () => {
      element.src = "";
      RadioWorker.postMessage({
        type: "radio",
        system: "skip",
      })
    });
    buttonSpot.appendChild(skip);
  }
  TfRadioEventListeners() {
    this.TsunamiRadioReady(this.worker.radioWorker, this.audioElem, this.audioTitle, this.audioSystem, this.audioLast, this.audioRestart, this.audioStart, this.audioSkip);
    this.audioElem.addEventListener("emptied", async (emptied) => {
      this.audio.emptiedAudio(emptied).then(() => {
        cancelAnimationFrame(this.effects.visualizatorController);
      });
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
      this.audio.TsunamiRadioMedia.connect(this.audio.TsunamiAnalyser);
      this.audio.TsunamiAnalyser.connect(this.audio.TsunamiRadioAudio.destination).then(() => {
        this.audio.canplaythroughAudio(this.audioElem);
      });
    });

    this.audioElem.addEventListener("play", () => {
      this.audio.playAudio(this.audioElem);
    }); //Playback has begun.

    this.audioElem.addEventListener("pause", () => {
      this.audio.pauseAudio(this.audioElem).then(() => {
        cancelAnimationFrame(this.effects.visualizatorController);
      });
    }); // Playback has been paused.

    this.audioElem.addEventListener("ended", async (ended) => {
      this.audio.endedAudio(this.audioElem, this.worker.radioWorker).then(() => {
        cancelAnimationFrame(this.effects.visualizatorController);
      });
    }); //Playback has stopped because of the end of the media was reached.

    this.audioElem.addEventListener("waiting", (waiting) => {
      console.log("The audio has been waiting because: " + waiting);
      this.audio.waitingAudio(this.audioElem);
    }); //Playback has stopped because of a temporary lack of data.

    this.audioElem.addEventListener("playing", () => {
      this.audio.playingAudio(this.audioElem, this.audioCanv).then((ctx) => {
        this.effects.hereDude(this.audioCanv, ctx, this.audio.TsunamiAnalyser, this.audio.TsunamiRadioDataArray, this.audio.TsunamiRadioBufferLength, this.audio.baseRadius, this.audio.particles);
      });
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
    });
  }
  bindVideo() {
    this.on("TfStartShit", () => {
      //start webcam
      this.TfWebcam.start();
      this.TfWebcam.attach(this.VidElem);
    });
    this.on("TfStopShit", () => {
      this.TfWebcam.stop();
    });
    this.on("TuseFthisKeycolor", () => {
      this.effects.ColorPickerChromaKey(document.getElementById("TFchromaKey").value);
      this.effects.drawingFrame(this.VidCanv, this.VidElem);
    });
    this.on("rmvTFchromakey", () => {
      this.effects.disableChromaKey()
    });
    this.on("TFuploadImage", (image) => {
      this.effects.UploadImage(image);
    });
    this.on("rmvTFimg", (image) => {
      this.effects.RemoveImage(image);
    });
    this.on("TFuploadVideo", (video) => {
      this.effects.UploadVideo(video);
    });
    this.on("rmvTFvid", (video) => {
      this.effects.RemoveVideo(video);
    });
    this.on("TfStartRecPlz", () => {
      this.websocket.connect();
      this.websocket.on("open", () => {
        this.recorder.start({
          canvas: this.VidCanv,
          audioContext: this.audio?.TsunamiRadioAudio,
          sourceNode: this.audio?.TsunamiRadioMedia,
          websocket: this.websocket
        });
      });
    });

    this.on("TfStopRecPlz", () => {
      this.recorder.stop();
      this.websocket.close();
    });
  }
  bindGame() {
    //game butftfons.
  }
  fetchCart() {
    try {
      const res = fetch('https://www.tsunamiflow.club/Server/server.php?cart_action=view', {
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = res.json();
      return data.items || [];
    } catch (err) {
      console.error('Error fetching cart:', err);
      return [];
    }
  }
  updateTotals() {
    let grandTotal = 0;
    document.querySelectorAll('.cartForm').forEach(form => {
      const variantSelect = form.querySelector('.variantSelect');
      const quantityInput = form.querySelector('.quantityInput');
      const itemSubtotalEl = form.querySelector('.itemSubtotal');

      const variant = variantSelect?.selectedOptions[0];
      const price = parseFloat(variant?.dataset.price || 0);
      const quantity = parseInt(quantityInput?.value || 1);

      const subtotal = price * quantity;

      if (itemSubtotalEl) itemSubtotalEl.textContent = subtotal.toFixed(2);
      form.dataset.price = subtotal.toFixed(2);

      grandTotal += subtotal;
    });

    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = grandTotal.toFixed(2);
  }
  bindCart() {
    document.querySelectorAll('.cartForm').forEach(form => {
      const quantityInput = form.querySelector('.quantityInput');
      const variantSelect = form.querySelector('.variantSelect');

      quantityInput?.addEventListener('input', updateTotals);
      variantSelect?.addEventListener('change', updateTotals);

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!form.action) return console.warn('Form action is empty!');

        try {
          const formData = new FormData(form);
          const res = fetch(form.action, { method: 'POST', body: formData, headers: { 'X-Requested-With': 'XMLHttpRequest' } });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          const result = res.json();
          if (result.success) {
            // Refresh cart totals
            const cartItems = this.fetchCart();
            let total = 0;
            cartItems.forEach(item => {
              total += (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1);
            });

            const totalEl = document.getElementById('cartTotal');
            if (totalEl) totalEl.textContent = total.toFixed(2);

            // Refresh item subtotals in DOM
            this.updateTotals();
          } else {
            console.warn('Cart error:', result.error);
          }
        } catch (err) {
          console.error('Form submission error:', err);
        }
      });
    });
    // Initialize totals on page load
    this.updateTotals();
  }
  bindStore() {

  }
  bindWorker() {
    this.worker.init(this.audioElem);
  }
}