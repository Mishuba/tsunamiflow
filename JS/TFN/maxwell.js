import { gameComponent } from "./N/Games/Class/planetuniverse.js";
import { letsDoIt } from "./N/Games/Class/gamemechanics.js";
import { HeaderWeather } from "./T/Class/weather.js";
import { tfIframe } from "./../../Iframe/Js/TfIframe.js";
import { HomepageUpdates, FirstGame } from "./N/Games/sprite.js";
import { TfPrintful } from "./T/Class/Tycadome.js";
import { TsunamiFlowImageEngine } from "./T/Class/Elder/Img.js";
import { Studio } from "./T/Class/Studio.js";
import { TsunamiLiveVideoController } from "./T/Class/LiveVidController.js";
import { AiInterface } from "./T/Class/Elder/Adult/Teen/Child/Toddler/Infant/Fetus/ai.js";

export class maxwell {
    listeners = {};
    domListeners = new Map();
    isItOk = null;
    worker = null;
    sharedWorker = null;
    wsUrl = null;
    tsunamisocket = null;
    tsunamisocketlink = "wss://world.tsunamiflow.club/ws";
    mainSection = null;
    site = new HeaderWeather();
    iframe = new tfIframe(document.createElement("iframe"), HomepageUpdates, FirstGame);
    user = new TfPrintful({
        stripePublicKey: "pk_live_51LEZXZDEt62FFVusTpTno0riC4cY20IoRtuiM2UnA3AHUdwAAxRj3qaev1RUwonD1pSzOOLmDYUXg9NiOBngYfUy005Tw1msUZ",
        backendUrl: "https://world.tsunamiflow.club/StripeStuff.php"
    });
    imageEngine = new TsunamiFlowImageEngine();
    //soundEngine = null;
    radiodock = null;
    radiotoggle = null;
    radioheader = null;
    RadioCanvas = null;
    audioTitle = null;
    audioSystem = null;
    audioLast = null;
    audioRestart = null;
    audioStart = null;
    audioSkip = null;
    videoEngine = new TsunamiLiveVideoController();
    mediaBin = {
        webcams: {},
        videos: {},
        images: {},
        screens: {}
    };
    ackmaHawk = new gameComponent(
        30,
        30,
        "https://www.tsunamiflow.club/Pictures/Games/Sprites/Stickman/Sheets/standingNwalking.png",
        60,
        160,
        "sprite",
        0,
        0,
        120,
        120,
        "30px",
        "Consolas",
        280,
        40,
        "center",
        "alphabetic",
        "inherit",
        0,
        "auto",
        "normal",
        "normal",
        "auto",
        0,
        undefined,
        [],
        "stand",
        "https://www.tsunamiflow.club/Pictures/Logo/Tsunami Flow Logo.png",
        "Hubert",
        "Maxwell",
        "StickMan",
        [
            { name: "health", points: 1 },
            { name: "stamina", points: 1 },
            { name: "weight", points: 1 },
            { name: "strength", points: 1 },
            { name: "agility", points: 1 }
        ],
        [
            { name: "Science", level: 0, experience: 0 },
            { name: "Creativity", level: 0, experience: 0 },
            { name: "Math", level: 0, experience: 0 },
            { name: "Memory", level: 0, experience: 0 },
            { name: "Awareness", level: 0, experience: 0 }
        ],
        [
            { name: "Reflection", level: 0, experience: 0 },
            { name: "honesty", level: 0, experience: 0 },
            { name: "deception", level: 0, experience: 0 },
            { name: "manipulation", level: 0, experience: 0 },
            { name: "charisma", level: 0, experience: 0 }
        ],
        [
            { name: "feelings", level: 0, experience: 0 },
            { name: "mood", level: 0, experience: 0 },
            { name: "temper", level: 0, experience: 0 },
            { name: "attitude", level: 0, experience: 0 },
            { name: "perspective", level: 0, experience: 0 }
        ],
        [
            { name: "consciousness", level: 0, experience: 0 },
            { name: "time", level: 0, experience: 0 },
            { name: "dimension", level: 0, experience: 0 },
            { name: "space", level: 0, experience: 0 },
            { name: "defense", level: 0, experience: 0 }
        ],
        [
            { name: "fire", level: 0, experience: 0 },
            { name: "water", level: 0, experience: 0 },
            { name: "air", level: 0, experience: 0 },
            { name: "lightning", level: 0, experience: 0 },
            { name: "earth", level: 0, experience: 0 }
        ],
        [
            { name: "magic", level: 0, experience: 0 },
            { name: "ESP", level: 0, experience: 0 },
            { name: "dexterity", level: 0, experience: 0 },
            { name: "genetic", level: 0, experience: 0 },
            { name: "personal", level: 0, experience: 0 }
        ],
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
    );
    game = new letsDoIt(
        "Homepage Game", this.ackmaHawk
    );
    ai = new AiInterface({
        inputSize: 4,
        outputSize: 2,
        actions: ['left', 'right'],
        alpha: 0.1,
        gamma: 0.99,
        epsilon: 0.1,
    });
    aiWorkerPromises = new Map(); // Track worker promises by ID
    aiMessageId = 0;
    TimerTimes = ["00:00", "00:05", "00:10", "00:15", "00:20", "00:30", "00:40", "00:45", "00:50", "01:00", "01:05", "01:10", "01:15", "01:20", "01:30", "01:40", "01:45", "01:50", "02:00", "02:05", "02:10", "02:15", "02:20", "02:30", "02:40", "02:45", "02:50", "03:00", "03:05", "03:10", "03:15", "03:20", "03:30", "03:40", "03:45", "03:50", "04:00", "04:05", "04:10", "04:15", "04:20", "04:30", "04:40", "04:45", "04:50", "05:00", "05:05", "05:10", "05:15", "05:20", "05:30", "05:40", "05:45", "05:50", "06:00", "06:05", "06:10", "06:15", "06:20", "06:30", "06:40", "06:45", "06:50", "07:00", "07:05", "07:10", "07:15", "07:20", "07:30", "07:40", "07:45", "07:50", "08:00", "08:05", "08:10", "08:15", "08:20", "08:30", "08:40", "08:45", "08:50", "09:00", "09:05", "09:10", "09:15", "09:20", "09:30", "09:40", "09:45", "09:50", "10:00", "10:05", "10:10", "10:15", "10:20", "10:30", "10:40", "10:45", "10:50", "11:00", "11:05", "11:10", "11:15", "11:20", "11:30", "11:40", "11:45", "11:50", "12:00", "12:05", "12:10", "12:15", "12:20", "12:30", "12:40", "12:45", "12:50", "13:00", "13:05", "13:10", "13:15", "13:20", "13:30", "13:40", "13:45", "13:50", "14:00", "14:05", "14:10", "14:15", "14:20", "14:30", "14:40", "14:45", "14:50", "15:00", "15:05", "15:10", "15:15", "15:20", "15:30", "15:40", "15:45", "15:50", "16:00", "16:05", "16:10", "16:15", "16:20", "16:30", "16:40", "16:45", "16:50", "17:00", "17:05", "17:10", "17:15", "17:20", "17:30", "17:40", "17:45", "17:50", "18:00", "18:05", "18:10", "18:15", "18:20", "18:30", "18:40", "18:45", "18:50", "19:00", "19:05", "19:10", "19:15", "19:20", "19:30", "19:40", "19:45", "19:50", "20:00", "20:05", "20:10", "20:15", "20:20", "20:30", "20:40", "20:45", "20:50", "21:00", "21:05", "21:10", "21:15", "21:20", "21:30", "21:40", "21:45", "21:50", "22:00", "22:05", "22:10", "22:15", "22:20", "22:30", "22:40", "22:45", "22:50", "23:00", "23:05", "23:10", "23:15", "23:20", "23:30", "23:40", "23:45", "23:50"];

    constructor(option = {}) {
        if (option.tsunamisocket) {
            this.tsunamisocket = option.tsunamisocket;
        }
        if (option.tsunamisocketlink) {
            this.tsunamisocketlink = option.tsunamisocketlink;
        }
        if (option.offscreencanvas) {
            this.offscreencanvas = option.offscreencanvas;
        }
        if (option.user) {
            this.user = option.user;
        }
        if (option.image) {
            this.imageEngine = option.image;
        }
        if (option.MasterSoundsContext) {
            if (option.masterAudioWorklet) {
                this.soundEngine = new Studio({
                    AudioElement: document.getElementById("TFradioPlayer"),
                    MasterSoundsContext: option.MasterSoundsContext,
                    masterAudioWorklet: option.masterAudioWorklet
                });
            } else {
                this.soundEngine = new Studio({
                    AudioElement: document.getElementById("TFradioPlayer"),
                    MasterSoundsContext: option.MasterSoundsContext
                });
            }
        } else {
            //const SoundsContext = new (window.AudioContext || window.webkitAudioContext)();
            this.soundEngine = new Studio({
                AudioElement: document.getElementById("TFradioPlayer")
            });
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
        if (option.worker) {
            this.worker = option.worker;
        }
        if (option.sharedWorker) {
            this.sharedWorker = option.sharedWorker;
        }
    }
    log(element, msg) {
        let logBox = this.find(element);
        if (!logBox) return;

        logBox.innerText += msg + "\n";
        logBox.scrollTop = logBox.scrollHeight;
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
    removeEventListener(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(fn => fn !== callback);
    }
    onMe(id, eventName, callback = null, preventDefault = false, iframe = null) {
        const el = this.find(id, iframe);

        if (!el) {
            console.warn(`Element not found: ${id}`);
            return;
        }

        const isForm =
            el instanceof HTMLFormElement;

        const isSubmitButton =
            (el instanceof HTMLButtonElement && el.type === "submit") ||
            (el instanceof HTMLInputElement &&
                ["submit", "image"].includes(el.type));

        const supportsPointer = "PointerEvent" in window;
        const supportsTouch = "ontouchstart" in window;

        const runHandler = (event) => {
            console.log("handler readyj");
            if (isForm || isSubmitButton || preventDefault) {
                event.preventDefault();
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
            const eventType = isForm ? "submit" : "click";

            //console.log("element " + el);
            //console.log("event type" + eventType);
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

    }

    onIframeEvent(event) {
        switch (event) {
            case "load":

                break;
        }
    }
    onClipboard(id, eventName, type = "copy", preventDefault = false, iframe = null) {
        let el = this.find(id, iframe);
        if (!el) return;

        const validEvents = ["copy", "cut", "paste"];
        if (!validEvents.includes(type)) {
            console.warn(`Invalid clipboard event: ${type}`);
            return;
        }

        const handler = (event) => {
            if (preventDefault) {
                event.preventDefault();
            }

            this.emit(eventName, {
                event,
                element: el,
                type,
                clipboardData: event.clipboardData
            });
        };

        el.addEventListener(type, handler);

        this._storeDomListener(id, el, handler, type);
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

        this.onMe("tfNetwork", "change", async (e) => {
            let playlist = {
                Music: {
                    studio_sessions: "PLyt4VU_WgIQOqaIEGXD0dNTddI0BRyCMx",
                    videos: "PLyt4VU_WgIQM_8UE1n3H03ymT8IAAg6SU",

                },
                Live: "Iframe/Pages/news.html",
                Tv: "Iframe/Pages/tfNetwork.html",
                documentary: {
                    all: "",
                    case_study: "PLyt4VU_WgIQPtl62SJ0lX6U4SwdTsR-rU"
                },
                Video_Games: {
                    all: "PLyt4VU_WgIQOquMVvzdZlUakV3jmO9Y0A",
                    skyrim: "PLyt4VU_WgIQNw20PRrK98BC0g-2Zuq434",
                    project_nimbus: "PLyt4VU_WgIQMyJAW3qitfWOgr9Fvtwsd_",
                    devil_may_cry: {
                        1: "1.html",
                        2: "2.html",
                        3: "3.html",
                        4: "4.html",
                        5: "PLyt4VU_WgIQMs8lH7FR4jS0xZCqSkFY7R"
                    },
                    lord_of_the_rings: {
                        shadow_of_mordor: "",
                        shadow_of_war: "PLyt4VU_WgIQOOM5XVo0FZqm4In3N3rJEP"
                    },
                    watchdogs: {
                        1: "",
                        2: "",
                        Legion: "PLyt4VU_WgIQPRMHCLTKdzyYkBKCJ6t3QA"
                    },
                    legend_of_the_dragoon: "PLyt4VU_WgIQM1z_4fItJGGDGgKb9nPN4H",
                    dark_souls: {
                        1: "",
                        2: "",
                        3: "",
                    },
                    elden_ring: "PLyt4VU_WgIQMIC9i6Zwzf_nKsssiZMn2m",
                    kindom_deliverance: {
                        1: "PLyt4VU_WgIQM6LT2E1xVDaMK40_eTvURq",
                        2: ""
                    }
                },
                Movies: "movies.html",
                Podcast: "podcast.html"
            };
            console.log(this.find("tfNetwork").value);
            switch (this.find("tfNetwork").value) {
                case "Live":
                    this.iframe.frame.src = playlist.Live;
                    this.isItOk = true;
                    break;
                case "Studio Sessions":
                    this.iframe.frame.src = `https://www.youtube.com/embed/videoseries?list=${playlist.Music.studio_sessions}`;
                    this.isItOk = false;
                    break;
                case "Music Videos":
                    this.iframe.frame.src = `https://www.youtube.com/embed/videoseries?list=${playlist.Music.videos}`;
                    this.isItOk = false;
                    break;
                case "TV":
                    this.iframe.frame.src = playlist.Tv;
                    this.isItOk = false;
                    break;

                case "Movies":
                    this.iframe.frame.src = `https://www.youtube.com/embed/videoseries?list=${playlist.Movies}`;
                    this.isItOk = false;
                    break;
                case "Case Study":
                    this.iframe.frame.src = `https://www.youtube.com/embed/videoseries?list=${playlist.documentary.case_study}`;
                    this.isItOk = false;
                    break;
                case "documentary":
                    this.iframe.frame.src = `https://www.youtube.com/embed/videoseries?list=${playlist.documentary.all}`;
                    this.isItOk = false;
                    break;
                case "Podcast":
                    this.iframe.frame.src = `https://www.youtube.com/embed/videoseries?list=${playlist.Video_Games.all}`;
                    this.isItOk = false;
                    break;
                case "Video Games":
                    this.iframe.frame.src = `https://www.youtube.com/embed/videoseries?list=${playlist.Video_Games.all}`;
                    this.isItOk = false;
                    break;
                case "Kingdom Deliverance":
                    this.iframe.frame.src = `https://www.youtube.com/embed/videoseries?list=${playlist.Video_Games.kindom_deliverance[1]}`;
                    break;

                case "Elden Ring":
                    this.iframe.frame.src = `https://www.youtube.com/embed/videoseries?list=${playlist.Video_Games.legend_of_the_dragoon}`;
                    break;

                case "Watchdogs Legion":
                    this.iframe.frame.src = `https://www.youtube.com/embed/videoseries?list=${playlist.Video_Games.watchdogs.Legion}`;
                    break;
                case "Lord of the Rings: Middle Earth Shadow Of War":
                    this.iframe.frame.src = `https://www.youtube.com/embed/videoseries?list=${playlist.Video_Games.lord_of_the_rings.shadow_of_war}`;
                    break;
                case "Devil May Cry V":
                    this.iframe.frame.src = `https://www.youtube.com/embed/videoseries?list=${playlist.Video_Games.devil_may_cry[5]}`;
                    break;
                case "Project Nimbus":
                    this.iframe.frame.src = `https://www.youtube.com/embed/videoseries?list=${playlist.Video_Games.project_nimbus}`;
                    break;
                case "Skyrim":
                    this.iframe.frame.src = `https://www.youtube.com/embed/videoseries?list=${playlist.Video_Games.skyrim}`;
                    break;
                default:
                    this.iframe.frame.src = playlist.Live;
                    this.isItOk = false;
                    break;
            };

            this.iframe.MenuSwitch(this.iframe.frame);
        }, true);

        this.onMe("tfCommunity", "click", () => {
            this.iframe.frame.src = "Iframe/Pages/Community.html";
            this.iframe.MenuSwitch(this.iframe.frame)

        }, true);

        this.onMe("NavLoginButton", "submit", () => {
            this.user.login();
        }, true);
    }
    async bindPayments() {
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
        this.onMe("TFMembershipLevel", "click", async () => {
            this.user.updateMembership(this.membershipSelect, this.sections, this.membershipCostEl, this.paymentTypeEl, this.hiddenMC, this.hiddenPT);
        }, true, null);
        this.onMe("TFCompleteForm", "submit", async () => {
            this.user.signup(this.userFields, this.extraFields);
        }, true, null);
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
    updateRadioState() {
        if (!this.radiodock || !this.radiotoggle) return;
        this.radiocollapsed = this.radiodock.classList.contains("collapsed");
        this.radiotoggle.textContent = this.radiocollapsed ? "▼" : "▲";
    }
    toggleRadioDock() {
        if (!this.radiodock) return;
        this.radiodock.classList.toggle("collapsed");
        this.updateRadioState();
    }
    RadioReady() {
        this.audioTitle.innerHTML = "Welcome to TFN Radio";

        this.audioLast.id = "TFradioPreviousButton";
        this.audioLast.innerHTML = "Previous";
        //this.audioSystem.appendChild(last);

        this.audioRestart.id = "TFRadioRestartButton";
        this.audioRestart.innerHTML = "Restart";
        //this.audioSystem.appendChild(restart);

        this.audioStart.id = "TFradioButton";
        this.audioStart.innerHTML = "Start Radio";
        //this.audioSystem.appendChild(start);

        this.audioSkip.id = "TFradioSkipButton";
        this.audioSkip.innerHTML = "Next";
        //this.audioSystem.appendChild(this.audioSkip);

        this.onMe("TFradioPreviousButton", () => {
            this.soundEngine.previousSong();
        });

        this.onMe("TFRadioRestartButton", () => {
            this.soundEngine.AudioElement.currentTime = 0;
            this.soundEngine.startMusic();
            start.innerHTML = "Pause Tsunami Radio";
        });

        this.onMe("TFradioButton", () => {
            if (this.soundEngine.AudioElement.paused) {
                this.soundEngine.playAudio();
                start.innerHTML = "Pause Tsunami Radio";
            } else {
                this.soundEngine.stopMusic();
                start.innerHTML = "Play Tsunami Radio";
            }
        });

        this.onMe("TFradioSkipButton", () => {
            this.soundEngine.AudioElement.removeAttribute("src");;
        });
    }
    bindAudio() {
        this.soundEngine.initAudioContext(this.worker, this.soundEngine.AudioElement, { type: "radio", element: "audio" }, "audio");
        this.RadioReady();
        this.soundEngine.RadioEventListeners(this.worker, this.soundEngine.MasterSoundsContext);
        this.soundEngine.loadaudio(this.soundEngine.AudioFile(null));
    }
    bindVideoGame() {

    }
    bindVidSystem() {
        if (this.videoEngine._videoBound) return;
        this.videoEngine._videoBound = true;
        const iframe = this.iframe.frame;
        this.onMe("RemoveCameraStream", async () => {
            this.videoEngine.detachVideoStream();
        })
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
                    /*
                                        if (!this.soundEngine._webcamWired) {
                                            this.soundEngine.webcamAudioStream.addMixerMediaElement(this.videoEngine.videoElement, this.videoEngine.videoElement.id, false);
                                            this.soundEngine._webcamWired = true;
                                        }
                                        */
                    /*
                                        //this.effects.isPlaying = true;
        
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

        this.onMe("CaptureScreen", () => {
            this.screenStream = this.videoEngine.startScreenShare();
            this.videoEngine.attachVideoStream(this.screenStream);;
        })
        // START / STOP RECORDING if recorder exists
        this.onMe("TfStartRecPlz", () => {
            //this.videoEngine.startStream();
            if (this.videoEngine.canvas === null) {
                this.videoEngine.canvas = this.find("TFcanvas", true);
            }
            if (this.videoEngine.videoElement === null) {
                this.videoEngine.videoElement = this.find("TsunamiFlowVideoStuff", true);
            }
            if (!this.videoEngine.webcamstream) {
                try {
                    this.videoEngine.startwebcam();            // get MediaStream
                    this.videoEngine.attachwebcam();
                    /*
                        if (!this.soundEngine._webcamWired) {
                        this.soundEngine.webcamAudioStream.addMixerMediaElement(this.videoEngine.videoElement, this.videoEngine.videoElement.id, false);
                        this.soundEngine._webcamWired = true;
                    }
                    */
                    /*
                        //this.effects.isPlaying = true;
        
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
            this.videoEngine.startRecorder({
                stream: this.videoEngine.webcamstream,
                fps: 30
            });

            //this.videoEngine.startRecorder({ stream: this.screenStream, fps: 30});
            // or

            /*
            this.videoEngine.createVideoEncoder({
                width: 600,
                height: 480,
                codec: "vp8",
                bitrate: 2_000_000,
                framerate: 30
            });
            
            await this.videoEngine.VideoWebCodecs(flow.webcamvideoTrack);
                        */
        }, false, iframe);

        this.onMe("TfStopRecPlz", () => {
            this.videoEngine.stopRecorder();
        }, false, iframe);

        this.onMe("GoLive", () => {
            this.videoEngine.isLive = true;

            if (!this.videoEngine.Videorecorderstream) {
                this.videoEngine.startStream();
                this.videoEngine.startRecorder({
                    stream: this.videoEngine.stream,
                    fps: 30
                });
            } else {

                //ws.send(JSON.stringify({ type: 'start_stream' }));
            }
            //this.videoEngine.sendToSharedWorker("stream", this.videoEngine.Videorecorderstream);
        }, false, iframe);

        this.onMe("StopLive", () => {
            this.videoEngine.isLive = false;
            this.videoEngine.stopRecorder();
            this.videoEngine.stopStream();
        }, false, iframe);

        this.onMe("Download Recording", () => {
            this.VideoDownload = this.videoEngine.downloadRecorder();
            console.log(this.VideoDownload);
        })
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
            console.log(`Gamepad connected: ${gamepad.id} `);
        } else {
            this.game.controllerIndex = null;
            this.game.controllerType = null;
            console.log(`Gamepad disconnected: ${gamepad.id} `);
        }
    }
    aiChooseAction(state) {
        if (!this.ai) return null;
        return this.ai.chooseAction(state);
    }

    aiGetQ(state, action) {
        if (!this.ai) return 0;
        return this.ai.getQ(state, action);
    }

    aiSetQ(state, action, value) {
        if (!this.ai) this.ai.setQ(state, action, value);
    }

    aiPredict(state) {
        if (!this.ai) return null;
        return this.ai.predict(state);
    }

    aiRemember(state, action, reward, nextState, done = false) {
        if (!this.ai) return;
        this.ai.remember({ state, action, reward, nextState, done });
    }

    aiUpdate(state, action, reward, nextState) {
        if (!this.ai) return;
        this.ai.update(state, action, reward, nextState);
    }

    async aiAction(method, ...args) {
        if (!this.worker) {
            console.warn('Worker not available for AI operation');
            return null;
        }

        const id = this.user?.tycadome() ? this.user?.tycadome().id : `ai_${++this.aiMessageId}`;

        return new Promise((resolve, reject) => {
            // Store promise handler
            this.aiWorkerPromises.set(id, { resolve, reject, method });

            // Send to worker
            this.worker.postMessage(this.user?.tycadome?.(
                id,
                'ai',
                method,
                {
                    source: 'Controller',
                    target: 'device:web-001',
                    layer: 'compute',
                    worker: 'ai'
                },
                {
                    status: 'pending',
                    priority: 'normal'
                },
                'async',
                {
                    method,
                    args,
                    result: null,
                    error: null
                }
            ) || {
                id,
                type: 'ai',
                action: method,
                meta: { source: 'maxwell', worker: 'ai' },
                state: { status: 'pending', priority: 'normal' },
                mode: 'async',
                payload: { method, args, result: null, error: null }
            });

            // Timeout safety (30 seconds)
            setTimeout(() => {
                if (this.aiWorkerPromises.has(id)) {
                    this.aiWorkerPromises.delete(id);
                    reject(new Error(`AI action "${method}" timed out`));
                }
            }, 30000);
        });
    }
    async aiKMeans(data, k = 2, iterations = 10) {
        return this.aiAction('kMeans', data, k, iterations);
    }

    // ===== SLOW OPERATIONS (async, worker thread) =====

    async aiTrainDQN(env, episodes = 1000, maxSteps = 200) {
        return this.aiAction('trainDQN', env, episodes, maxSteps);
    }

    async aiTrainStep() {
        return this.aiAction('trainStep');
    }

    aiSampleBatch() {
        if (!this.ai) return [];
        return this.ai.sampleBatch();
    }

    aiDecayEpsilon() {
        if (!this.ai) return;
        this.ai.decayEpsilon();
    }
    saveAiModel(key = 'maxwell_ai_model') {
        if (!this.ai) return;
        const json = this.ai.q ? JSON.stringify(Array.from(this.ai.q.entries())) : null;
        if (json) localStorage.setItem(key, json);
    }

    loadAiModel(key = 'maxwell_ai_model') {
        if (!this.ai) return;
        const json = localStorage.getItem(key);
        if (json) {
            try {
                this.ai.q = new Map(JSON.parse(json));
            } catch (err) {
                console.error('Load failed:', err);
            }
        }
    }

    resetAi() {
        if (!this.ai) return;
        if (typeof this.ai.reset === 'function') this.ai.reset();
        this.ai.q = new Map();
    }
    createSafeWorker(modulePath, classicPath, shared = false) {
        try {
            if (shared === false) {
                if (window.Worker) {
                    console.log("worker " + new URL(modulePath, import.meta.url) + " created.");
                    return new Worker(
                        new URL(modulePath, import.meta.url),
                        { type: "module" });

                }
            } else {
                console.log("shared worker " + new URL(modulePath, import.meta.url) + " created.");
                return new SharedWorker(
                    new URL(modulePath, import.meta.url),
                    { type: "module" }
                );

            }
        } catch (err) {
            console.warn("Module worker failed. Falling back:", err);
            if (shared === false) {
                if (window.Worker) {
                    return new Worker(classicPath);
                }
            } else {
                if (window.SharedWorker) {
                    return new SharedWorker(classicPath);
                }
            }
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
            else {

            }
        }
        //this.ensureRadioPlaying(audio);
    }
    async handleWorkerMessage(event, worker) {
        const data = event.data || {};
        const payload = data.payload || {};

        switch (data.type) {
            case "timer":
                this.find("TFtime").innerHTML = payload.time;

                if (payload.system === "Tf Schedule") {
                    await this.handleSchedule(payload.time);
                } else if (payload.system === "Tf Time") {
                    this.find("TFweather").innerHTML = this.site.requestLocation();
                    this.soundEngine.AudioNetworkState(worker);
                } else {
                    this.site.UpdateNews();
                    this.site.requestLocation();
                    this.soundEngine.AudioNetworkState(worker);
                }
                break;
            case 'radio':
                switch (data.action) {
                    case 'receive.radio.file':
                        this.soundEngine.initAudioContext(this.worker, this.soundEngine.AudioElement, { type: "radio", element: "audio" }, "audio");
                        this.soundEngine.loadaudio(this.soundEngine.AudioFile(event));
                        break;

                    default:
                        console.log(data);
                        break;
                }
                break;
            case "ai":
                switch (event.data.action) {
                    case "ai_result":
                        const { id, result, error } = data;
                        const handler = this.aiWorkerPromises.get(id);

                        if (!handler) return;
                        this.aiWorkerPromises.delete(id);

                        if (error) {
                            handler.reject(new Error(error));
                        } else {
                            handler.resolve(result);
                        }
                        break;
                    default:
                        const { i, res, err } = data;
                        const hand = this.aiWorkerPromises.get(i);

                        if (!hand) return;
                        this.aiWorkerPromises.delete(i);

                        if (err) {
                            hand.reject(new Error(err));
                        } else {
                            hand.resolve(res);
                        }
                        break;
                }
                break;
            default:
                if (payload.system === "error") {
                    console.error("Worker error:", payload);

                } else {
                    if (data.meta.message) {
                        console.warn("Unknown message type:", data.type, "Message:", data.meta.message);

                        console.warn("Type:", data.type);
                        console.warn("Payload:", payload);
                        console.warn("Full Data:", data);
                        console.warn("Event:", event);
                        console.warn("error: ", payload.error);

                        if (data.meta?.message) {
                            console.warn("Meta Message:", data.meta.message);
                        }

                        console.trace();

                        console.groupEnd();
                    } else {
                        console.warn("Unknown message type:", data.type, "Message:", data, "payload", payload);

                        console.warn("Type:", data.type);
                        console.warn("Payload:", payload);
                        console.warn("Full Data:", data);
                        console.warn("Event:", event);

                        if (data.meta?.message) {
                            console.warn("Meta Message:", data.meta.message);
                        }

                        console.trace();

                        console.groupEnd();
                    }

                    this.handleSchedule(this.find("TFtime").innerHTML);
                }
        }
    }
    handleError(source, error) {
        if (this.soundEngine.AudioElement.src === "") {
            this.soundEngine.initAudioContext(this.worker, this.soundEngine.AudioElement, { type: "radio", element: "audio" }, "audio");
            this.soundEngine.loadaudio(this.soundEngine.AudioFile(null));
        }
        console.error("RAW WORKER ERROR:", error);
        console.error(`[${source}]message: `, error.message);
        console.error(`[${source}]filename: `, error.filename);
        console.error(`[${source}]lineno: `, error.lineno);
        console.error(`[${source}]colno: `, error.colno);
        this.emit("error", { source, error });
    }
    connectWS(key = "viewer", role = "viewer") {
        this.wsUrl = `${this.tsunamisocketlink}?key=${encodeURIComponent(key)}&role=${encodeURIComponent(role)}`;
        this.tsunamisocket = new WebSocket(this.wsUrl);
        this.tsunamisocket.binaryType = "arraybuffer";

        this.tsunamisocket.onopen = () => {
            log("🌐 WebSocket connected.");
            document.getElementById("startBtn").disabled = true;
            document.getElementById("stopBtn").disabled = false;
            /*
            if (reconnectTimer) clearTimeout(reconnectTimer);
            */
        };

        this.tsunamisocket.onclose = () => {
            log("⚠️ WebSocket closed.");
            document.getElementById("startBtn").disabled = false;
            document.getElementById("stopBtn").disabled = true;
        };

        this.tsunamisocket.onerror = (err) => {
            log("❌ WebSocket error: " + err);
        };

        this.tsunamisocket.onmessage = event => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "ffmpeg_stderr") log("[FFmpeg] " + data.message);
            } catch {
                // ignore non-JSON
            }
        };
    }

    receiveSharedWorkerMessage(e) {
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

            default:
                break;
        }
    }

    async initTsunamiWorkers() {
        if (typeof Worker === "undefined") {
            console.warn("No Web Worker support");
            this.soundEngine.loadaudio(this.soundEngine.AudioFile(null));
            return;
        } else {
            if (this.worker === null) {
                this.worker = this.createSafeWorker("T/Worker/WebWorker/TaskWebWorker.js", "https://www.tsunamiflow.club/JS/TFN/T/Worker/WebWorker/TaskWebWorker.js", false);
                this.worker.onmessage = async (e) => {
                    await this.handleWorkerMessage(e, this.worker);
                }
                this.worker.onerror = (e) => this.handleError(this.worker, e);
                this.worker.postMessage(
                    this.soundEngine.tycadome(
                        "tycadome-guest" + Date.now(),
                        "canvas",
                        "load.radio.canvas",
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
                            system: "loading",
                            canvas: this.RadioOffscreenCanvas,
                        },
                        [
                            this.RadioOffscreenCanvas
                        ]
                    ),
                    [this.RadioOffscreenCanvas]);
            }

            if (this.sharedworker === null) {
                this.sharedWorker = this.createSafeWorker("TFN/T/Worker/Shared.js", "https://www.tsunamiflow.club/JS/TFN/T/Worker/Shared.js", true);

                this.sharedWorker.port.start();
            }
        }

        if (typeof EventSource === "undefined") {
            console.warn("Server Sent Events not supported");
            return;
        }

        this.bindAudio();
    }
    bindFrameEvent(event) {
        switch (event) {
            case "load":
                try {
                    this.iframe.frame.contentWindow.controller = maxwell;
                    this.iframe.MenuSwitch(this.iframe.frame);
                } catch (e) {
                    console.error("Cross-origin block:", e);
                }
                break;
        }
    }
    async onDomEvent(event) {
        switch (event) {
            case "DOMContentLoaded":

                this.mainSection = this.find("mainTsectionFdiv");
                this.mainSectionWidth = this.mainSection ? (this.mainSection.clientWidth || this.mainSection.offsetWidth || 800) : 800;
                this.mainSectionHeight = this.mainSection ? (this.mainSection.clientHeight || this.mainSection.offsetHeight || 600) : 600;

                this.radiodock = document.getElementById("radioDock");
                this.radiotoggle = document.getElementById("toggleRadio");
                this.radioheader = document.getElementById("radioHeader");
                this.RadioCanvas = document.getElementById("TFradioCanvas");

                if (this.radioheader) {
                    this.radioheader.addEventListener("click", () => {
                        this.toggleRadioDock();
                    });
                }

                this.audioSkip = document.createElement("button");
                this.audioTitle = find("TfRadioStuff") || document.createElement('div');
                this.audioLast = document.createElement('button');
                this.audioSystem = document.createElement('div');
                this.audioRestart = document.createElement('button');
                this.audioStart = document.createElement('button');
                this.audioSkip = document.createElement('button');

                this.videoCanvas = document.createElement("canvas");

                if (this.mainSection) {
                    this.iframe.allow = "camera; microphone; geolocation";
                    this.iframe.allowFullscreen = true;
                    this.iframe.sandbox = "allow-scripts allow-same-origin allow-popups allow-downloads allow-modals";
                    this.mainSection.appendChild(this.iframe.frame);
                    this.iframe.frame.title = "Main Website Content";
                    this.iframe.frame.id = "TsunamiContent";
                    this.iframe.frame.name = "TsunamiMainFlowContent";
                    this.iframe.frame.style.width = `${Math.max(0, this.mainSectionWidth - 1)}px`;
                    this.iframe.frame.style.height = `${Math.max(0, this.mainSectionHeight - 1)}px`;
                    this.iframe.frame.style.background = "white";
                    this.iframe.frame.style.touchAction = "manipulation";
                    this.iframe.frame.style.pointerEvents = "auto";
                    this.iframe.frame.src = "Iframe/Pages/homepage.html";

                    this.iframe.frame.addEventListener("load", () => {
                        this.bindFrameEvent("load");
                    });

                    this.updateRadioState();

                    this.user.showProducts().then(() => {
                        this.bindPayments();
                        this.user.bindCart();
                        this.bindNavBar();
                        this.bindUsers();
                        if (window.Worker) {
                            try {
                                this.VideooOffscreenCanvas = this.videoCanvas.transferControlToOffscreen();
                                this.RadioOffscreenCanvas = this.RadioCanvas.transferControlToOffscreen();
                                this.initTsunamiWorkers();
                            } catch (err) {
                                console.warn("Offscreen canvas transfer failed:", err);
                            }
                        } else {
                            this.bindAudio();
                        }
                        this.site.requestLocation();
                        console.log("TFN");
                    }).catch(err => {
                        console.error("Cart binding error:", err);
                    });
                }
                break;

            default:
                break;
        }
    }
}