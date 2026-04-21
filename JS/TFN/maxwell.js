export class maxwell {
    listeners = {};
    domListeners = new Map();
    worker = null;
    sharedWorker = null;
    sharedWorkerPort = null;
    site = null;
    iframe = null;
    user = null;
    imageEngine = null;
    soundEngine = null;
    audioTitle = null;
    audioSystem = null;
    audioLast = null;
    audioRestart = null;
    audioStart = null;
    audioSkip = null;
    videoEngine = null;
    mediaBin = {
        webcams: {},
        videos: {},
        images: {},
        screens: {}
    };
    game = null;
    //listeners = {};

    constructor(option = {}) {
        if (option.user) {
            this.user = option.user;
        }
        if (option.image) {
            this.imageEngine = option.image;
        }
        if (option.sound) {
            this.soundEngine = option.sound;
        }
        if (option.video) {
            this.videoEngine = option.video;
        }
        if (option.game) {
            this.game = option.game;
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
        if (option.site) {
            this.site = option.site;
        }
        if (option.iframe) {
            this.iframe = option.iframe;
        }
    }
    find(elem, frame = null) {
        if (frame !== null) {
            return frame.contentDocument.getElementById(elem);
        } else {
            return document.getElementById(elem);
        }
    }
    emit(event, data) {
        (this.listeners[event] || []).forEach((fn) => {
            try {
                fn(data);
            } catch (error) {
                console.error(`Error occurred while emitting event "${event}":`, error);
            }
        });
    }
    _storeDomListener(id, el, handler, eventType) {
        if (!this.domListeners.has(id)) {
            this.domListeners.set(id, []);
        }

        this.domListeners.get(id).push({
            el,
            handler,
            eventType
        });
    }
    on(id, eventName, preventDefault = false, iframe = null) {
        let el = this.find(id, iframe);
        if (!el) return;

        const isForm = el instanceof HTMLFormElement;
        const isSubmitButton =
            (el instanceof HTMLButtonElement && el.type === "submit") ||
            (el instanceof HTMLInputElement &&
                ["submit", "image"].includes(el.type));

        const supportsPointer = "PointerEvent" in window;
        const supportsTouch = "ontouchstart" in window;

        const runHandler = (event) => {
            if (isForm || isSubmitButton || preventDefault) {
                event.preventDefault();
                event.stopPropagation();
            }

            this.emit(eventName, {
                event,
                element: el,
                type: event.type
            });
        };

        // ===== POINTER (Primary) =====          
        if (supportsPointer) {
            const eventType = isForm ? "submit" : "pointerup";

            el.addEventListener(eventType, runHandler);

            this._storeDomListener(id, el, runHandler, eventType);
            return;
        }

        // ===== TOUCH (Fallback) =====          
        if (supportsTouch) {
            const start = (e) => {
                this._touchStart = e;
            };

            const end = (e) => {
                runHandler(e);
            };

            el.addEventListener("touchstart", start, { passive: false });
            el.addEventListener("touchend", end, { passive: false });

            this._storeDomListener(id, el, start, "touchstart");
            this._storeDomListener(id, el, end, "touchend");
            return;
        }

        // ===== CLICK (Fallback) =====          
        const clickType = isForm ? "submit" : "click";

        el.addEventListener(clickType, runHandler);

        this._storeDomListener(id, el, runHandler, clickType);
    }
    off(id) {
        const entries = this.domListeners.get(id);
        if (!entries) return;

        entries.forEach(({ el, handler, eventType }) => {
            el.removeEventListener(eventType, handler);
        });

        this.domListeners.delete(id);
    }
    bindNavBar() {
        // navigation menu
        this.on("tfRoster", () => {
            //i have a function for this already.
            this.iframe.frame.src = "./../Iframe/Pages/roster.html";
            this.iframe.MenuSwitch(this.iframe.frame);
        }, false, null);

        this.on("tfNews", () => {
            this.iframe.frame.src = "./../Iframe/Pages/news.html";
            this.iframe.MenuSwitch(this.iframe.frame);
        }, false, null);

        this.on("tfCompetitions", () => {
            this.iframe.frame.src = "./../Iframe/Pages/Competitions.html";
            this.iframe.MenuSwitch(this.iframe.frame);
        }, false, null);

        this.on("tfNetwork", () => {
            this.iframe.frame.src = "./../Iframe/Pages/TFnetwork.html";
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
        }, false, null);

        this.on("tfCommunity", () => {
            this.iframe.frame.src = "./../Iframe/Pages/Community.html";
            this.iframe.MenuSwitch(this.iframe.frame)

        }, false, null);

        this.on("NavLoginButton", () => {
            this.user.login();
        }, true);
    }
    bindPayments() {
        this.user.initMoney().then(() => {
            this.user.mountCard("UniqueOriginal");
            this.user.mountCard("SubscribeUsers");
            this.user.mountCard("TfDonation"); //div
        });
        const emailInput = this.userFields?.tfEM || this.find("TfEmail");

        this.on("UniqueOriginalBtn", async () => {
            const email = emailInput?.value || null;
            try {
                const result = await this.user.donate(20, 'usd', true, email); // $20 item
                if (result.payment && result.payment.status === 'succeeded') {
                    alert("Purchase successful! Thank you.");
                    // Optionally, you can trigger your order fulfillment logic here
                }
            } catch (err) {
                alert("Purchase failed: " + err.message);
            }
        });

        this.on("SubscribeUsersBtn", async () => {
            const email = emailInput?.value || null;
            const priceId = "price_123456789"; // Stripe Price ID for subscription
            try {
                const result = await this.user.subscribe(email, priceId, true);
                if (result.status === 'success') {
                    alert("Subscription successful!");
                } else if (result.payment && result.payment.status === 'succeeded') {
                    alert("Subscription payment successful!");
                }
            } catch (err) {
                alert("Subscription failed: " + err.message);
            }
        });

        this.on("TfDonateBtn", async () => {
            try {
                const result = await this.user.donate(10, 'usd', true, email); // $10 donation
                if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                    alert("Donation successful! Thank you.");
                }
            } catch (err) {
                alert("Donation failed: " + err.message);
            }
        }
        );
    }
    bindSignUp() {
        this.on("TFCompleteForm", () => {
            this.user.signup(this.userFields, this.extraFields);
        }, true);
    }
    bindUsers() {
        this.userFields = {
            tfFN: this.find("TfFirstName", null),
            tfLN: this.find("TfLastName", null),
            tfNN: this.find("TfNickName", null),
            tfGen: this.find("TfGender", null),
            tfEM: this.find("TfEmail", null),
            tfBirth: this.find("TfBirthday", null),
            tfUN: this.find("TFuserName", null),
            tfPsw: this.find("TFpassword", null),
            tfMembershipLevel: this.find("TFMembershipLevel", null),
        };
        this.extraFields = {
            ChineseZodiacSign: this.find("ChineseZodiacSign"),
            WesternZodiacSign: this.find("WesternZodiacSign"),
            SpiritAnimal: this.find("SpiritAnimal"),
            CelticTreeZodiacSign: this.find("CelticTreeZodiacSign"),
            NativeAmericanZodiacSign: this.find("NativeAmericanZodiacSign"),
            VedicAstrologySign: this.find("VedicAstrologySign"),
            GuardianAngel: this.find("GuardianAngel"),
            ChineseElement: this.find("ChineseElement"),
            EyeColorMeaning: this.find("EyeColorMeaning"),
            GreekMythologyArchetype: this.find("GreekMythologyArchetype"),
            NorseMythologyPatronDeity: this.find("NorseMythologyPatronDeity"),
            EgyptianZodiacSign: this.find("EgyptianZodiacSign"),
            MayanZodiacSign: this.find("MayanZodiacSign"),
            LoveLanguage: this.find("LoveLanguage"),
            Birthstone: this.find("Birthstone"),
            BirthFlower: this.find("BirthFlower"),
            BloodType: this.find("BloodType"),
            AttachmentStyle: this.find("AttachmentStyle"),
            CharismaType: this.find("CharismaType"),
            BusinessPersonality: this.find("BusinessPersonality"),
            DISC: this.find("DISC"),
            SocionicsType: this.find("SocionicsType"),
            LearningStyle: this.find("LearningStyle"),
            FinancialPersonalityType: this.find("FinancialPersonalityType"),
            PrimaryMotivationStyle: this.find("PrimaryMotivationStyle"),
            CreativeStyle: this.find("CreativeStyle"),
            ConflictManagementStyle: this.find("ConflictManagementStyle"),
            TeamRolePreference: this.find("TeamRolePreference")
        };
        this.membershipSelect = this.find("TFMembershipLevel");
        this.membershipCostEl = this.find("membershipCost");
        this.paymentTypeEl = this.find("paymentType");
        this.hiddenMC = this.find("hiddenMC");
        this.hiddenPT = this.find("hiddenPT");
        this.sections = {
            free: this.find("freeLevelInputs"),
            regular: this.find("regularLevelInputs"),
            vip: this.find("vipLevelInputs"),
            team: this.find("teamLevelInputs"),
            address: this.find("AddressDetailsSubscribers"), // if present
            costInfo: this.find("membershipCostInfo"),
        };
        this.bindSignUp();
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
        await this.videoEngine.startMediaSource("video", item.url);
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

    RadioReady() {
        const title = this.audioTitle || document.createElement('div');
        const last = this.audioLast || document.createElement('button');
        const buttonSpot = this.audioSystem || document.createElement('div');
        const restart = this.audioRestart || document.createElement('button');
        const start = this.audioStart || document.createElement('button');
        const skip = this.audioSkip || document.createElement('button');
        const element = document.querySelector('audio') || new Audio();
        const RadioWorker = this.worker || {};

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
        });

        this.on("TFRadioRestartButton", () => {
            element.currentTime = 0;
            this.soundEngine.startMusic(element);
            start.innerHTML = "Pause Tsunami Radio";
        });

        this.on("TFradioButton", () => {
            if (element.paused) {
                this.soundEngine.playAudio(element);
                start.innerHTML = "Pause Tsunami Radio";
            } else {
                this.soundEngine.stopMusic(element);
                start.innerHTML = "Play Tsunami Radio";
                //this.audio.startMusic();
                //this.audio.stopMusic();
            }
        });

        this.on("TFradioSkipButton", () => {
            element.src = "";
            //RadioWorker.postMessage({ type: "radio", system: "file"});
        });
    }
    bindAudio() {
        this.RadioReady();
        this.soundEngine.RadioEventListeners();
    }
    bindVidSystem() {
        if (this.videoEngine._videoBound) return;
        this.videoEngine._videoBound = true;
        const iframe = this.iframe.frame;

        // START WEBCAM + DRAW LOOP
        this.on("TfStartShit", async () => {
            if (this.videoEngine.canvas === null) {
                this.videoEngine.canvas = this.find("TFcanvas", true);
            }
            if (this.videoEngine.videoElement === null) {
                this.videoEngine.videoElement = this.find("TsunamiFlowVideoStuff", true);
            }
            if (!this.videoEngine.webcamstream) {
                try {
                    await this.videoEngine.startwebcam();            // get MediaStream
                    this.videoEngine.attachwebcam();

                    //this.effects.isPlaying = true;

                    if (!this.soundEngine._webcamWired) {
                        this.soundEngine.webcamAudioStream.addMixerMediaElement(this.videoEngine.videoElement, this.videoEngine.videoElement.id, false);
                        this.soundEngine._webcamWired = true;
                    }
                    /*
                    // FRAME DRAW LOOP
                    const drawLoop = async () => {
                    if (!this.effects.isPlaying) return;
                    await this.effects.drawingFrame(this.videoCanv, this.videoElem);
                    requestAnimationFrame(drawLoop);
                    };
                    drawLoop();
                    */
                } catch (err) {
                    console.error("Webcam start failed:", err);
                }
            }
        }, false, iframe);

        // STOP WEBCAM
        this.on("TfStopShit", () => {
            this.videoEngine.stopwebcam();
            //this.effects.isPlaying = false;
        }, false, iframe);

        // START Video From Bin
        this.on("TFplayFromBin", async () => {
            const id = this.find("TFmediaSelect", true).value;
            await this.playFromBin(id);
        }, false, iframe);

        // ENABLE CHROMA KEY
        this.on("TuseFthisKeycolor", () => {
            const keyInput = this.find("TFchromaKey", true); // color input inside iframe
            //this.effects.ColorPickerChromaKey(keyInput);
            //this.effects.useChromaKey = true;
        }, false, iframe);

        // DISABLE CHROMA KEY
        this.on("rmvTFchromakey", () => {
            //this.effects.disableChromaKey();
        }, false, iframe);

        // UPLOAD / REMOVE BACKGROUND IMAGE
        //this.on("TFuploadImage", (e) => this.effects.UploadImage(e), false, iframe);
        //this.on("rmvTFimg", () => this.effects.RemoveImage(this.videoCanv, this.videoCanv.width, this.videoCanv.height), false, iframe);

        // UPLOAD / REMOVE BACKGROUND VIDEO
        //this.on("TFuploadVideo", (e) => this.effects.UploadVideo(e), false, iframe);
        //this.on("rmvTFvid", () => this.effects.RemoveVideo(this.videoCanv, this.videoCanv.height, this.videoCanv.width), false, iframe);

        // START / STOP RECORDING if recorder exists
        this.on("TfStartRecPlz", () => {
            this.videoEngine.startStream();
            this.videoEngine.startRecorder({
                audioStream: this.soundEngine.getMixerStream(),
                fps: 30
            });
        }, false, iframe);

        this.on("TfStopRecPlz", () => {
            this.videoEngine.stopStream();
        }, false, iframe);

        this.on("GoLive", () => {
            this.videoEngine.isLive = true;
            this.videoEngine.startSharedWorker();
            this.videoEngine.sendToSharedWorker("stream", null);
        }, false, iframe);

        this.on("StopLive", () => {
            this.videoEngine.isLive = false;
        }, false, iframe);
    }
    async bindStore() {
        await this.user.showProducts();
    }

    getControllerType(gamepad) {
        // Detect controller type based on button layout
        if (gamepad.buttons[0].value === 1) {
            return 'playstation';
        } else if (gamepad.buttons[1].value === 1) {
            return 'xbox';
        } else if (gamepad.buttons[0].value === 1 && gamepad.buttons[3].value === 1) {
            return 'switch';
        }
        return 'generic';
    }
    gamepadHandler(event, connected) {
        const gamepad = event.gamepad;
        if (!this.game) this.game = {};
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

        if (connected) {
            this.game.controllerIndex = gamepad.index;
            console.log("Controller connected at index:", this.game.controllerIndex);
            this.game.controllerType = this.getControllerType(gamepad);
            console.log("Controller type detected:", this.game.controllerType);
            console.log(`Gamepad connected: ${gamepad.id}`);
        } else {
            this.game.controllerIndex = null;
            this.game.controllerType = null;
            console.log(`Gamepad disconnected: ${gamepad.id}`);
        }
    }

    async handleSchedule(time) {
        for (const word of this.site.WordTimes) {
            let TfWotd = this.find("tfWordOfTheDay");
            TfWotd.innerHTML = await this.site.WordOfTheDay(time);
            if (time === word) break;
        }

        this.site.UpdateNews();

        for (const tfRT of this.soundEngine.RadioTimes) {
            if (time === tfRT) {
                this.soundEngine.AudioNetworkState(this.soundEngine.AudioElement);
                return;
            }
        }
        this.ensureRadioPlaying(audio);
    }

    async handleWorkerMessage(event) {
        const data = event.data || {};
        const payload = data.payload || {};

        switch (data.type) {
            case "Timer":
                this.find("TFtime").innerHTML = payload.time;

                if (payload.system === "Tf Schedule") {
                    await this.handleSchedule(payload.time);
                } else if (payload.system === "Tf Time") {
                    this.site.UpdateNews();
                    this.find("TFweather").innerHTML = this.site.requestLocation();
                    this.soundEngine.AudioNetworkState(this.soundEngine.AudioElement);
                } else {
                    this.site.UpdateNews();
                    this.site.requestLocation();
                    this.soundEngine.AudioNetworkState(this.soundEngine.AudioElement);
                }
                break;

            case "radio":
                this.handleRadio(payload);
                break;

            default:
                if (payload.system === "error") {
                    console.error("Worker error:", payload);
                } else {
                    console.warn("Unknown message type:", data.type);

                    this.handleSchedule(this.find("TFtime").innerHTML);
                }
        }
    }


    handleError(source, error) {
        console.error("RAW WORKER ERROR:", error);
        console.error(`[${source}] message:`, error.message);
        console.error(`[${source}] filename:`, error.filename);
        console.error(`[${source}] lineno:`, error.lineno);
        console.error(`[${source}] colno:`, error.colno);
        this.emit("error", { source, error });
    }
    initTsunamiWorkers() {
        if (typeof Worker === "undefined") {
            console.warn("No Web Worker support");
            return;
        }

        if (typeof EventSource === "undefined") {
            console.warn("Server Sent Events not supported");
            return;
        }

        this.site.worker = this.worker;
        this.iframe.worker = this.worker;
        this.user.worker = this.worker;
        this.imageEngine.worker = this.worker;
        this.soundEngine.worker = this.worker;
        this.videoEngine.worker = this.worker;
        this.game.worker = this.worker;

        this.worker.onmessage = (e) => this.handleWorkerMessage(e);
        this.worker.onerror = (e) => this.handleError(this.worker, e);
    }
}