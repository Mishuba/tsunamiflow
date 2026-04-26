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
    async handleSchedule(time) {
        for (const word of this.site.WordTimes) {
            if (time === word) {
                let TfWotd = this.find("tfWordOfTheDay");
                TfWotd.innerHTML = this.site.WordOfTheDay(time);
            } break;
        }

        this.site.UpdateNews();

        for (const tfRT of this.soundEngine.RadioTimes) {
            if (time === tfRT) {
                this.soundEngine.AudioNetworkState();
                return;
            }
        }
        //this.ensureRadioPlaying(audio);
    }
    async handleWorkerMessage(event) {
        const data = event.data || {};
        const payload = data.payload || {};

        switch (data.type) {
            case "timer":
                this.find("TFtime").innerHTML = payload.time;

                if (payload.system === "Tf Schedule") {
                    await this.handleSchedule(payload.time);
                } else if (payload.system === "Tf Time") {
                    this.find("TFweather").innerHTML = this.site.requestLocation();
                    this.soundEngine.AudioNetworkState();
                } else {
                    this.site.UpdateNews();
                    this.site.requestLocation();
                    this.soundEngine.AudioNetworkState();
                }
                break;

            case "radio":
                try {
                    /*
                    if (!this.soundEngine.TfSoundsContext) {
                        console.log("The audio soundEngine context state does not exist");

                    } else if (this.soundEngine.TfSoundsContext.state === undefined) {
                        console.log("The audio soundEngine context state is undefined");
                    } else if (this.soundEngine.TfSoundsContext.state === null) {
                        console.log("The audio soundEngine context state is null");
                    } else {
                        switch (this.soundEngine.TfSoundsContext.state) {
                            case "suspended":
                                console.log("The audio soundEngine context state is suspended, resuming...");
                                this.soundEngine.TfSoundsContext.resume();
                                break;
                            case "running":
                                console.log("The audio soundEngine context state is running");
                                break;
                            case "closed":
                                console.log("The Audio soundEngine context state must be closed");
                                break;
                            default:
                                console.log("The audio soundEngine context state is unknown");
                                break;
                        }
                    }
                    */
                    console.log("did notf check contfextf");
                } catch (err) {
                    console.error("Error handling radio message:", err);
                    this.handleError("this.soundEngine.TfSoundsContext", err);
                } finally {
                    if (payload.system === "file") {
                        console.log("payload.file", payload.file);
                        switch (this.soundEngine.AudioElement.src) {
                            case "":
                                this.soundEngine.loadaudio(payload.file);
                                break;
                            case " ":
                                this.soundEngine.loadaudio(payload.file);
                                break;
                            case null:
                                this.soundEngine.loadaudio(payload.file);
                                break;
                            case undefined:
                                this.soundEngine.loadaudio(payload.file);
                                break;
                            case "about:blank":
                                this.soundEngine.loadaudio(payload.file);
                                break;
                            default:
                                console.log("audio already loaded or playing");
                                break;
                        }
                    } else if (payload.system === "previous") {
                        this.soundEngine.loadaudio(payload.file);
                    } else if (payload.system === "skip") {
                        this.soundEngine.loadaudio(payload.file);
                    } else {
                        this.soundEngine.loadaudio(payload.file);
                    }
                }
                break;
            default:
                if (payload.system === "error") {
                    console.error("Worker error:", payload);
                } else {
                    if (data.meta.message) {
                        console.warn("Unknown message type:", data.type, "Message:", data.meta.message);
                    } else {
                        console.warn("Unknown message type:", data.type, "Message:", data, "payload", payload);
                    }


                    this.handleSchedule(this.find("TFtime").innerHTML);
                }
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
    onMe(id, eventName, callback = null, preventDefault = false, iframe = null) {
        const el = this.find(id, iframe);

        if (!el) {
            console.warn(`Element not found: ${id}`);
            return;
        }

        const isForm =
            el instanceof HTMLFormElement ||
            el instanceof HTMLButtonElement;

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

            const payload = {
                event,
                element: el,
                type: event.type
            };

            // direct callback if provided
            if (typeof callback === "function") {
                callback(payload);
            }

            // also emit internal event if eventName exists
            if (eventName) {
                this.emit(eventName, payload);
            }
        };

        // POINTER
        if (supportsPointer) {
            const eventType = isForm ? "submit" : "pointerup";

            el.addEventListener(eventType, runHandler);
            this._storeDomListener(id, el, runHandler, eventType);
            return;
        }

        // TOUCH fallback
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

        // CLICK fallback
        const clickType = isForm ? "submit" : "click";

        el.addEventListener(clickType, runHandler);
        this._storeDomListener(id, el, runHandler, clickType);

        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(callback);
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
        this.onMe("tfRoster", "tfRoster", () => {
            //i have a function for this already.
            this.iframe.frame.src = "Iframe/Pages/roster.html";
            this.iframe.MenuSwitch(this.iframe.frame);
        }, true);
        this.onMe("tfNews", "click", () => {
            this.iframe.frame.src = "Iframe/Pages/news.html";
            this.iframe.MenuSwitch(this.iframe.frame);
        }, true);

        this.onMe("tfCompetitions", "click", () => {
            this.iframe.frame.src = "Iframe/Pages/Competitions.html";
            this.iframe.MenuSwitch(this.iframe.frame);
        }, true);

        this.onMe("tfNetwork", "click", () => {
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
        }, true);

        this.onMe("tfCommunity", "click", () => {
            this.iframe.frame.src = "Iframe/Pages/Community.html";
            this.iframe.MenuSwitch(this.iframe.frame)

        }, true);

        this.onMe("NavLoginButton", "submit", () => {
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

        this.onMe("UniqueOriginalBtn", async () => {
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

        this.onMe("SubscribeUsers", async () => {
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

        this.onMe("TfDonateBtn", async () => {
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
        this.onMe("TFCompleteForm", () => {
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

        this.onMe("TFradioPreviousButton", () => {
            this.soundEngine.previousSong();
            //RadioWorker.postMessage({type: "radio",system: "previous"});
        });

        this.onMe("TFRadioRestartButton", () => {
            element.currentTime = 0;
            this.soundEngine.startMusic(element);
            start.innerHTML = "Pause Tsunami Radio";
        });

        this.onMe("TFradioButton", () => {
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

        this.onMe("TFradioSkipButton", () => {
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
        this.onMe("TfStartShit", async () => {
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
        this.onMe("TfStopShit", () => {
            this.videoEngine.stopwebcam();
            //this.effects.isPlaying = false;
        }, false, iframe);

        // START Video From Bin
        this.onMe("TFplayFromBin", async () => {
            const id = this.find("TFmediaSelect", true).value;
            await this.playFromBin(id);
        }, false, iframe);

        // ENABLE CHROMA KEY
        this.onMe("TuseFthisKeycolor", () => {
            const keyInput = this.find("TFchromaKey", true); // color input inside iframe
            //this.effects.ColorPickerChromaKey(keyInput);
            //this.effects.useChromaKey = true;
        }, false, iframe);

        // DISABLE CHROMA KEY
        this.onMe("rmvTFchromakey", () => {
            //this.effects.disableChromaKey();
        }, false, iframe);

        // UPLOAD / REMOVE BACKGROUND IMAGE
        //this.onMe("TFuploadImage", (e) => this.effects.UploadImage(e), false, iframe);
        //this.onMe("rmvTFimg", () => this.effects.RemoveImage(this.videoCanv, this.videoCanv.width, this.videoCanv.height), false, iframe);

        // UPLOAD / REMOVE BACKGROUND VIDEO
        //this.onMe("TFuploadVideo", (e) => this.effects.UploadVideo(e), false, iframe);
        //this.onMe("rmvTFvid", () => this.effects.RemoveVideo(this.videoCanv, this.videoCanv.height, this.videoCanv.width), false, iframe);

        // START / STOP RECORDING if recorder exists
        this.onMe("TfStartRecPlz", () => {
            this.videoEngine.startStream();
            this.videoEngine.startRecorder({
                audioStream: this.soundEngine.getMixerStream(),
                fps: 30
            });
        }, false, iframe);

        this.onMe("TfStopRecPlz", () => {
            this.videoEngine.stopStream();
        }, false, iframe);

        this.onMe("GoLive", () => {
            this.videoEngine.isLive = true;
            this.videoEngine.startSharedWorker();
            this.videoEngine.sendToSharedWorker("stream", null);
        }, false, iframe);

        this.onMe("StopLive", () => {
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

    handleError(source, error) {
        console.error("RAW WORKER ERROR:", error);
        console.error(`[${source}] message:`, error.message);
        console.error(`[${source}] filename:`, error.filename);
        console.error(`[${source}] lineno:`, error.lineno);
        console.error(`[${source}] colno:`, error.colno);
        this.emit("error", { source, error });
    }
    startSharedWorker() {
        if (this.sharedWorker) {
            this.sharedWorkerPort = this.sharedWorker.port;

            this.sharedWorkerPort.start();
        } else {
            //this.sharedWorker = new SharedWorker("/SharedWorker.js");
            return
        }
    }

    receiveSharedWorkerMessage() {
        this.sharedWorker.port.postMessage.onmessage = (e) => {
            const msg = e.data;

            const swtf = tycadome(
                e.data.id || crypto.randomUUID(),
                e.data.type || "backend",
                e.data.action || "completed",
                {
                    source: "shared.worker",
                    layer: "backend",
                    worker: "shared"
                },
                {
                    status: e.data.state || "completed",
                    priority: "low"
                },
                "async",
                e.data.payload || e.data
            );
            switch (e.data.type) {
                case "ws_message":
                    console.log("WS:", e.data.payload);
                    break;

                case "radio.play":
                    //this.handleRadio(msg.data);
                    break;
            }
        };
    }

    sendToSharedWorker(data = null) {
        if (!this.sharedWorkerPort) return;

        this.sharedWorkerPort.postMessage(data);
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

        /*
        this.site.sharedWorker = this.sharedWorker;
        this.iframe.sharedWorker = this.sharedWorker;
        this.user.sharedWorker = this.sharedWorker;
        this.imageEngine.sharedWorker = this.sharedWorker;
        this.soundEngine.sharedWorker = this.sharedWorker;
        this.videoEngine.sharedWorker = this.sharedWorker;
        this.game.sharedWorker = this.sharedWorker;
*/
        this.worker.onmessage = (e) => this.handleWorkerMessage(e);
        this.worker.onerror = (e) => this.handleError(this.worker, e);

        console.log("starting radio");

        // this.startSharedWorker();
        // this.sendToSharedWorker("register");
        // this.sharedWorker.port.onmessage = (e) => {
        //     this.receiveSharedWorkerMessage(e)
        // };
    }
}