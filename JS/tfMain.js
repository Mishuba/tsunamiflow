import { gameComponent } from "./TFN/N/Games/Class/planetuniverse.js";
import { letsDoIt } from "./TFN/N/Games/Class/gamemechanics.js";
import { HeaderWeather } from "./TFN/T/Class/weather.js";
import { tfIframe } from "./../Iframe/Js/TfIframe.js";
import { HomepageUpdates, FirstGame } from "./TFN/N/Games/sprite.js";
import { TfPrintful } from "./TFN/T/Class/Tycadome.js";
import { TsunamiFlowImageEngine } from "./TFN/T/Class/Elder/Img.js";
//import { TsunamiFlowDj } from "./TFN/T/Class/DjController.js";
import { Studio } from "./TFN/T/Class/Studio.js";
import { TsunamiLiveVideoController } from "./TFN/T/Class/LiveVidController.js";
import { maxwell } from "./TFN/maxwell.js";

function createSafeWorker(modulePath, classicPath) {
  try {
    return new Worker(
      new URL(modulePath, import.meta.url),
      { type: "module" }
    );

  } catch (err) {
    console.warn("Module worker failed. Falling back:", err);
    return new Worker(classicPath);
  }
}

const TFwordMishuba = {
  word: "Mishuba",
  definition: "A heterosexual North American entertainer.",
  quotes: [
    {
      text: "'My Inner Self Helps Unifies Beautiful Art' - Mishuba",
      history: {
        fact: {
          one: "Mishuba's parents were in the military which cause him to live in multiple places growing up. Mishuba lived in two countries(Germany and the United States of America), went to four elementary schools, four middle schools and two high schools; he also lived in six different states while living with his family.",
          two: "Outside of music Mishuba loves to play sports and video games, draw and write poetry."
        },
        myth: {
          one: "Mishuba is plotting on taking over the world.",
          two: "Mishuba has physic power."
        },
        legend: {
          one: "Mishuba was the first division one college athlete with a scholarship to also have a record deal.",
          two: "Mishuba is the reincarnation of ..."
        }
      }
    },
    {
      text: "You cannot stop greatness you can only prolong it. What is meant to be great will be great",
      history: {
        fact: {
          one: "His chinese name is 飞龙丁 (fei'long ding）, his first name means flying dragon and his last name is surname ding (the chinese people he was friends with in Xian, China gave him the last name 东风 （dong'feng）; but he wants to his last name to be Ding.",
          two: ""
        },
        myth: {
          one: "Mishuba has no idea what he is doing.",
          two: "Mishuba been lame his whole life."
        },
        legend: {
          one: "Mishuba went to china to fall in love with a woman",
          two: "Mishuba is able to see, feel, smell, and hear the people who have died in is life in his dreams in the spiritual plane."
        }
      }
    }
  ]
};

const linkToSpriteSheet = "./Pictures/Games/Sprites/Stickman/Sheets/standingNwalking.png";
const AckmaHawkBattleBackground = "./Pictures/Logo/Tsunami Flow Logo.png";

const StickMan = new Image();
StickMan.src = linkToSpriteSheet;

let tfSSCX = 0;
let tfSSCY = 0;
let tfSCW = 120;
let tfSCH = 120;

let tfSPX = 60;
let tfSPY = 160;

let tfSNW = 30;
let tfSNH = 30;

let PlayerState = "stand";

const PhysicalAbility = [
  { name: "health", points: 1 },
  { name: "stamina", points: 1 },
  { name: "weight", points: 1 },
  { name: "strength", points: 1 },
  { name: "agility", points: 1 }
];

const AckmaHawkIntellectualIntelligence = [
  { name: "Science", level: 0, experience: 0 },
  { name: "Creativity", level: 0, experience: 0 },
  { name: "Math", level: 0, experience: 0 },
  { name: "Memory", level: 0, experience: 0 },
  { name: "Awareness", level: 0, experience: 0 }
];

const AckmaHawkSocialIntelligence = [
  { name: "Reflection", level: 0, experience: 0 },
  { name: "honesty", level: 0, experience: 0 },
  { name: "deception", level: 0, experience: 0 },
  { name: "manipulation", level: 0, experience: 0 },
  { name: "charisma", level: 0, experience: 0 }
];

const AckmaHawkEmotionalIntelligence = [
  { name: "feelings", level: 0, experience: 0 },
  { name: "mood", level: 0, experience: 0 },
  { name: "temper", level: 0, experience: 0 },
  { name: "attitude", level: 0, experience: 0 },
  { name: "perspective", level: 0, experience: 0 }
];

const AckmaHawkExistentialIntelligence = [
  { name: "consciousness", level: 0, experience: 0 },
  { name: "time", level: 0, experience: 0 },
  { name: "dimension", level: 0, experience: 0 },
  { name: "space", level: 0, experience: 0 },
  { name: "defense", level: 0, experience: 0 }
];

const AckmaHawkEnergeticIntelligence = [
  { name: "fire", level: 0, experience: 0 },
  { name: "water", level: 0, experience: 0 },
  { name: "air", level: 0, experience: 0 },
  { name: "lightning", level: 0, experience: 0 },
  { name: "earth", level: 0, experience: 0 }
];

const AckmaHawkMetaCognitiveIntelligence = [
  { name: "magic", level: 0, experience: 0 },
  { name: "ESP", level: 0, experience: 0 },
  { name: "dexterity", level: 0, experience: 0 },
  { name: "genetic", level: 0, experience: 0 },
  { name: "personal", level: 0, experience: 0 }
];

document.addEventListener("DOMContentLoaded", async () => {
  const twoMore = document.getElementById("mainTsectionFdiv");
  const TsunamiRadio = document.getElementById("TFradioPlayer");
  const RadioTitle = document.getElementById("TfRadioStuff");
  const RadioButtons = document.getElementById("CheckRadio");

  const dock = document.getElementById("radioDock");
  const toggle = document.getElementById("toggleRadio");
  function updateRadioState() {
    if (!dock || !toggle) return;
    const collapsed = dock.classList.contains("collapsed");
    toggle.textContent = collapsed ? "▼" : "▲";
  }
  function toggleRadioDock() {
    if (!dock) return;
    dock.classList.toggle("collapsed");
    updateRadioState();
  }

  /* button click */
  if (toggle) {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleRadioDock();
    });
  }

  const header = document.getElementById("radioHeader");

  /* header click */
  if (header) {
    header.addEventListener("click", () => {
      toggleRadioDock();
    });
  }

  /* set initial state */
  updateRadioState();

  const RadioCanvas = document.getElementById("TFradioCanvas");

  try {
    const OffscreenCanvasRadio = document.createElement("canvas");
    const RadioOffscreenCanvas = OffscreenCanvasRadio.transferControlToOffscreen();
  } catch (err) {
    console.warn("Offscreen canvas transfer failed:", err);
  }

  const RadioLastButton = document.createElement("button");
  const RadioRestartButton = document.createElement("button");
  const RadioStartButton = document.createElement("button");
  const RadioSkipButton = document.createElement("button");

  const TFiframe = document.createElement("iframe");
  TFiframe.allow = "camera; microphone; geolocation";
  TFiframe.allowFullscreen = true;
  TFiframe.sandbox = "allow-scripts allow-same-origin allow-popups allow-downloads allow-modals";

  const safeWorker = createSafeWorker("./TFN/T/Worker/WebWorker/TaskWebWorker.js", "JS/TFN/T/Worker/WebWorker/TaskWebWorker.js");

  const safeSharedWorker = createSafeWorker("./TFN/T/Worker/Shared.js", "JS/TFN/T/Worker/Shared.js");

  const safeImageWorker = createSafeWorker("./TFN/T/Worker/WebWorker/kid/MediaWebWorker.js", "JS/TFN/T/Worker/WebWorker/kid/MediaWebWorker.js");

  const safeMediaWorker = createSafeWorker("./TFN/T/Worker/WebWorker/kid/MediaWebWorker.js", "JS/TFN/T/Worker/WebWorker/kid/MediaWebWorker.js");

  const safeVideoWorker = createSafeWorker("./TFN/T/Worker/WebWorker/kid/MediaWebWorker.js", "JS/TFN/T/Worker/WebWorker/kid/MediaWebWorker.js");

  const safeGameInputWorker = createSafeWorker("./TFN/T/Worker/WebWorker/kid/GameInputWebWorker.js", "JS/TFN/T/Worker/WebWorker/kid/GameInputWebWorker.js");

  const safeGameWorldWorker = createSafeWorker("./TFN/T/Worker/WebWorker/kid/GameWorldWebWorker.js", "JS/TFN/T/Worker/WebWorker/kid/GameWorldWebWorker.js");

  const safeAiWorker = createSafeWorker("./TFN/T/Worker/WebWorker/kid/AiWebWorker.js", "JS/TFN/T/Worker/WebWorker/kid/AiWebWorker.js");

  const Workletoptions = {
    numberOfInputs: 1, //0 oscillator
    numberOfOutputs: 1,
    //outputChannelCount: [2], //[1]mono [2]stereo [2,2]dual stereo outputs // for more outputs use array length and channelCountMode "max"
    /*
    parameterData: {
      gain: 0.5,
      frequency: 440,
      delayTime: 0.5,
      feedback: 0.5,
      distortionAmount: 0.5,
      pannerX: 0,
      pannerY: 0,
      pannerZ: 0
    },
    */
    /*
    processorOptions: {
      mode: "fft",
      bufferSize: 1024,
      customFlag: true
    },
    */
    channelCount: 2,
    channelCountMode: "max", // max(uses max possible channels) || clamped-max (clamps to channelCount) || explicit (uses channelCount)
    channelInterpretation: "speakers" //discrete (each channel is distinct) || speakers (maps to left/right for 2 channels, more channels follow standard surround sound mapping)
  }

  const TfSoundAnalyserOptions = {
    fftSize: 2048,
    maxDecibels: 0,
    minDecibels: -100,
    smoothingTimeConstant: 0.5,
    channelCountMode: "max"
  };

  const TfSite = new HeaderWeather();
  TfSite.NewsArray.push("Mishuba was born at 6 pounds 5 ounces...");
  TfSite.NewsArray.push("Mishuba played basketball from 7th to 10th grade.");
  TfSite.NewsArray.push("Mishuba received his BA in Sociology from the University of South Carolina in 2014.");
  TfSite.NewsArray.push("Mishuba received a Presidential Physical Fitness Award signed by Bill Clinton.");
  TfSite.NewsArray.push("Mishuba was a percussionist in school band.");
  TfSite.NewsArray.push("Mishuba attended multiple schools across states.");
  TfSite.NewsArray.push("Mishuba was a state 400m champion in 2008 and 2009.");
  TfSite.NewsArray.push("Mishuba graduated from Blythewood High School.");
  TfSite.NewsArray.push("Mishuba ran track at University of South Carolina.");
  TfSite.NewsArray.push("Mishuba received TEFL certification in 2017.");
  TfSite.NewsArray.push("Mishuba received MS in Entertainment Business from Full Sail University in 2020.");

  TfSite.EnHword(TFwordMishuba);
  for (let i = 0; i < TfSite.WordOfTheDayArray.length; i++) {
    console.log(`suppose tfo be word ${TfSite.WordOfTheDayArray[i]}`);
  };
  const frameTF = new tfIframe(TFiframe, HomepageUpdates, FirstGame);
  frameTF.frame.title = "Main Website Content";
  frameTF.frame.id = "TsunamiContent";
  frameTF.frame.name = "TsunamiMainFlowContent";
  // Use client sizes where available and set style widths/heights in px to avoid undefined .width/.height on elements
  const parentWidth = twoMore ? (twoMore.clientWidth || twoMore.offsetWidth || 800) : 800;
  const parentHeight = twoMore ? (twoMore.clientHeight || twoMore.offsetHeight || 600) : 600;
  frameTF.frame.style.width = `${Math.max(0, parentWidth - 1)}px`;
  frameTF.frame.style.height = `${Math.max(0, parentHeight - 1)}px`;
  frameTF.frame.style.background = "white";
  frameTF.frame.style.touchAction = "manipulation";
  frameTF.frame.style.pointerEvents = "auto";
  frameTF.frame.src = "Iframe/Pages/homepage.html";
  const nifage = new TfPrintful();
  nifage.stripePublicKey = "pk_live_51LEZXZDEt62FFVusTpTno0riC4cY20IoRtuiM2UnA3AHUdwAAxRj3qaev1RUwonD1pSzOOLmDYUXg9NiOBngYfUy005Tw1msUZ";
  nifage.backendUrl = "https://world.tsunamiflow.club/StripeStuff.php";
  const style = new TsunamiFlowImageEngine();
  const network = new TsunamiLiveVideoController();
  const TfStickMan = new gameComponent(tfSNW, tfSNH, linkToSpriteSheet, tfSPX, tfSPY, "sprite", tfSSCX, tfSSCY, tfSCW, tfSCH, "30px", "Consolas", 280, 40, "center", "alphabetic", "inherit", 0, "auto", "normal", "normal", "auto", 0, undefined, [], PlayerState, AckmaHawkBattleBackground, "Hubert", "Maxwell", "StickMan", PhysicalAbility, AckmaHawkIntellectualIntelligence, AckmaHawkSocialIntelligence, AckmaHawkEmotionalIntelligence, AckmaHawkExistentialIntelligence, AckmaHawkEnergeticIntelligence, AckmaHawkMetaCognitiveIntelligence, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1);
  const Stickman = new letsDoIt("Homepage Game", TfStickMan);
  /*
  const indexdb = {
    name: ,
    keyPath: ,
 
  }

  //dbstores: indexdb
*/

  const flowaudio = new (window.AudioContext || window.webkitAudioContext)();
  await flowaudio.audioWorklet.addModule("JS/TFN/T/Class/Elder/Adult/TfNationProcessor.js");

  const flowGain = flowaudio.createGain();
  flowGain.gain.value = 1;
  const flowAnalyser = flowaudio.createAnalyser();
  Object.assign(flowAnalyser, TfSoundAnalyserOptions);
  const flowCompressor = flowaudio.createDynamicsCompressor();
  const flowDelay = flowaudio.createDelay();
  const flowPanner = flowaudio.createPanner();
  const flowEq = flowaudio.createBiquadFilter();

  //tf sounds
  const flowOscillator = flowaudio.createOscillator();
  /*
  flowOscillator.type = "sine";
  flowOscillator.frequency.setValueAtTime(440, flowaudio.currentTime);
  flowOscillator.start();
  */
  //tf distfortfion 
  const flowDistortion = flowaudio.createWaveShaper();
  const MixerTF = flowaudio.createMediaStreamDestination();

  const flowWorklet = new AudioWorkletNode(flowaudio, "fft-processor", Workletoptions);
  const nation = new Studio({ audioElement: TsunamiRadio, MasterSoundsContext: flowaudio, masterGain: flowGain, masterAnalyser: flowAnalyser, masterCompressor: flowCompressor, masterDelay: flowDelay, masterPanner: flowPanner, TfSoundsWaveShaper: flowDistortion, TfSoundsOscillator: flowOscillator, MixerDestination: MixerTF, masterAudioWorklet: flowWorklet, canvas: RadioCanvas, offscreencanvas: RadioOffscreenCanvas });

  const Controller = new maxwell({
    site: TfSite,
    iframe: frameTF,
    user: nifage,
    image: style,
    sound: nation,
    video: network,
    game: Stickman,
    AudioTitle: RadioTitle,
    AudioButtonSpot: RadioButtons,
    AudioPrevious: RadioLastButton,
    AudioOver: RadioRestartButton,
    AudioStart: RadioStartButton,
    AudioSkip: RadioSkipButton,
  });
  Controller.worker = safeWorker;
  Controller.audioimageworker = safeImageWorker;
  Controller.audioworker = safeMediaWorker;
  Controller.videoworker = safeVideoWorker;
  Controller.gameinputworker = safeGameInputWorker;
  Controller.gameworldworker = safeGameWorldWorker;
  Controller.aiworker = safeAiWorker;
  //Controller.sharedWorker = safeSharedWorker;

  Controller.iframe.frame.addEventListener("load", () => {
    try {
      Controller.iframe.frame.contentWindow.controller = Controller;
      Controller.iframe.MenuSwitch(Controller.iframe.frame);
    } catch (e) {
      console.error("Cross-origin block:", e);
    }
  });

  Controller.site.requestLocation();

  if (twoMore) {
    twoMore.appendChild(Controller.iframe.frame)
    Controller.bindNavBar();
    Controller.bindUsers();
  }

  Controller.bindAudio();

  Controller.user.showProducts().then(() => {
    Controller.bindPayments();
    Controller.user.bindCart();
    Controller.initTsunamiWorkers();
    console.log("TFN");
  }).catch(err => {
    console.error("Cart binding error:", err);
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      navigator.serviceWorker.register("/service-worker.js")
        .then(reg => console.log("SW registered:", reg))
        .catch(err => console.error("SW registration failed:", err));
    });
  }
});