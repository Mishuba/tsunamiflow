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
import { AiInterface } from "./TFN/T/Class/Elder/Adult/Teen/Child/Toddler/Infant/Fetus/ai.js";
//import { createSafeWorker } from "./TFN/T/Functions/Workers/beginning.js";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(reg => console.log("SW registered:", reg))
      .catch(err => console.error("SW registration failed:", err));
  });
}

function createSafeWorker(modulePath, classicPath, shared = false) {
  try {
    var ihj
    if (shared === false) {
      if (window.Worker) {
        ihj = new Worker(
          new URL(modulePath, import.meta.url),
          { type: "module" });
        console.log("worker " + new URL(modulePath, import.meta.url) + " created.");
      } else {

      }
    } else {
      let ihj = new SharedWorker(
        new URL(modulePath, import.meta.url),
        { type: "module" }
      );
      console.log("worker " + new URL(modulePath, import.meta.url) + " created.");
    }
  } catch (err) {
    console.warn("Module worker failed. Falling back:", err);
    if (shared === false) {
      if (window.Worker) {
        ihj = new Worker(classicPath);
      } else {

      }
    } else {
      if (window.SharedWorker) {
        ihj = new SharedWorker(classicPath);
      } else {

      }
    }
  } finally {
    return ihj;
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

let tfSSCX = 0;
let tfSSCY = 0;
let tfSCW = 120;
let tfSCH = 120;

let tfSPX = 60;
let tfSPY = 160;

let tfSNW = 30;
let tfSNH = 30;

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

  const Workletoptions = {
    numberOfInputs: 1, // 0
    numberOfOutputs: 1,

    processorOptions: {
      mode: "fft",
      fftSize: 2048,
      customFlag: true
    },
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
    channelCount: 2,
    channelCountMode: "max",
    channelInterpretation: "speakers"
  };

  const TfSoundAnalyserOptions = {
    fftSize: 2048,
    maxDecibels: 0,
    minDecibels: -100,
    smoothingTimeConstant: 0.5,
    channelCountMode: "max"
  };

  const safeSharedWorker = createSafeWorker("./TFN/T/Worker/Shared.js", "./JS/TFN/T/Worker/Shared.js", true);
  //safeSharedWorker.port.start();

  // Use client sizes where available and set style widths/heights in px to avoid undefined .width/.height on elements
  const parentWidth = twoMore ? (twoMore.clientWidth || twoMore.offsetWidth || 800) : 800;
  const parentHeight = twoMore ? (twoMore.clientHeight || twoMore.offsetHeight || 600) : 600;

  /*
  const indexdb = {
    name: ,
    keyPath: ,
 
  }
 
  //dbstores: indexdb

  if (flowaudio.state === 'suspended') {
    document.addEventListener('click', () => {
      flowaudio.resume().then(() => {
        console.log('✅ AudioContext resumed');
      }).catch(err => {
        console.error('❌ Resume failed:', err);
      });
    }, { once: true });
  }

  //await flowaudio.audioWorklet.addModule("JS/TFN/T/Class/Elder/Adult/TfNationProcessor.js");

  const flowEq = flowaudio.createBiquadFilter();
*/
  const safeWorker = createSafeWorker("./TFN/T/Worker/WebWorker/TaskWebWorker.js", "./JS/TFN/T/Worker/WebWorker/TaskWebWorker.js");

  //const MyWebSocketLink = "wss://world.tsunamiflow.club/ws";s
  const Controller = new maxwell({
    site: new HeaderWeather({
      sharedWorker: safeSharedWorker,
    }),
    iframe: new tfIframe(document.createElement("iframe"), HomepageUpdates, FirstGame),
    user: new TfPrintful({
      stripePublicKey: "pk_live_51LEZXZDEt62FFVusTpTno0riC4cY20IoRtuiM2UnA3AHUdwAAxRj3qaev1RUwonD1pSzOOLmDYUXg9NiOBngYfUy005Tw1msUZ",
      backendUrl: "https://world.tsunamiflow.club/StripeStuff.php"
    }),
    image: new TsunamiFlowImageEngine(),
    sound: new Studio({
      sharedworker: safeSharedWorker,
      AudioElement: document.getElementById("TFradioPlayer"),
      MasterSoundsContext: new (window.AudioContext || window.webkitAudioContext)(),
      ContextElement: Controller.soundEngine.MasterSoundsContext.createMediaElementSource(TsunamiRadio),
      masterGain: Controller.soundEngine.MasterSoundsContext.createGain(),
      masterAnalyser: Controller.soundEngine.MasterSoundsContext.createAnalyser(TfSoundAnalyserOptions),
      masterCompressor: Controller.soundEngine.MasterSoundsContext.createDynamicsCompressor(),
      masterDelay: Controller.soundEngine.MasterSoundsContext.createDelay(),
      masterPanner: Controller.soundEngine.MasterSoundsContext.createPanner(),
      TfSoundsWaveShaper: Controller.soundEngine.MasterSoundsContext.createWaveShaper(),
      TfSoundsOscillator: Controller.soundEngine.MasterSoundsContext.createOscillator(),
      /*
        flowOscillator.type = "sine";
        flowOscillator.frequency.setValueAtTime(440, Controller.soundEngine.MasterSoundsContext.currentTime);
        flowOscillator.start();
      */
      MixerDestination: Controller.soundEngine.MasterSoundsContext.createMediaStreamDestination(),
      masterAudioWorklet: new AudioWorkletNode(Controller.soundEngine.MasterSoundsContext, "fft-processor", Workletoptions)
    }),
    video: new TsunamiLiveVideoController(),
    game: new letsDoIt(
      "Homepage Game",
      new gameComponent(
        tfSNW,
        tfSNH,
        "./Pictures/Games/Sprites/Stickman/Sheets/standingNwalking.png",
        tfSPX,
        tfSPY,
        "sprite",
        tfSSCX,
        tfSSCY,
        tfSCW,
        tfSCH,
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
        "./Pictures/Logo/Tsunami Flow Logo.png",
        "Hubert",
        "Maxwell",
        "StickMan",
        PhysicalAbility,
        AckmaHawkIntellectualIntelligence,
        AckmaHawkSocialIntelligence,
        AckmaHawkEmotionalIntelligence,
        AckmaHawkExistentialIntelligence,
        AckmaHawkEnergeticIntelligence,
        AckmaHawkMetaCognitiveIntelligence,
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
      )
    ),
    AudioTitle: document.getElementById("TfRadioStuff"),
    AudioButtonSpot: document.getElementById("CheckRadio"),
    AudioPrevious: document.createElement("button"),
    AudioOver: document.createElement("button"),
    AudioStart: document.createElement("button"),
    AudioSkip: document.createElement("button"),
    ai: new AiInterface({
      sharedworker: safeSharedWorker
    })
  });

  Controller.site.NewsArray.push("Mishuba was born at 6 pounds 5 ounces...");
  Controller.site.NewsArray.push("Mishuba played basketball from 7th to 10th grade.");
  Controller.site.NewsArray.push("Mishuba received his BA in Sociology from the University of South Carolina in 2014.");
  Controller.site.NewsArray.push("Mishuba received a Presidential Physical Fitness Award signed by Bill Clinton.");
  Controller.site.NewsArray.push("Mishuba was a percussionist in school band.");
  Controller.site.NewsArray.push("Mishuba attended multiple schools across states.");
  Controller.site.NewsArray.push("Mishuba was a state 400m champion in 2008 and 2009.");
  Controller.site.NewsArray.push("Mishuba graduated from Blythewood High School.");
  Controller.site.NewsArray.push("Mishuba ran track at University of South Carolina.");
  Controller.site.NewsArray.push("Mishuba received TEFL certification in 2017.");
  Controller.site.NewsArray.push("Mishuba received MS in Entertainment Business from Full Sail University in 2020.");

  Controller.site.EnHword(TFwordMishuba);
  for (let i = 0; i < Controller.site.WordOfTheDayArray.length; i++) {
    console.log(`suppose tfo be word ${Controller.site.WordOfTheDayArray[i]}`);
  };

  //tf sounds
  /*
  Tradio.connect(flowGain);
  flowGain.connect(flowAnalyser);
  flowAnalyser.connect(flowWorklet);
  flowWorklet.connect(flowCompressor);
  flowCompressor.connect(flowaudio.destination);
  */

  if (twoMore) {
    Controller.iframe.allow = "camera; microphone; geolocation";
    Controller.iframe.allowFullscreen = true;
    Controller.iframe.sandbox = "allow-scripts allow-same-origin allow-popups allow-downloads allow-modals";
    twoMore.appendChild(Controller.iframe.frame);
    Controller.iframe.frame.title = "Main Website Content";
    Controller.iframe.frame.id = "TsunamiContent";
    Controller.iframe.frame.name = "TsunamiMainFlowContent";
    Controller.iframe.frame.style.width = `${Math.max(0, parentWidth - 1)}px`;
    Controller.iframe.frame.style.height = `${Math.max(0, parentHeight - 1)}px`;
    Controller.iframe.frame.style.background = "white";
    Controller.iframe.frame.style.touchAction = "manipulation";
    Controller.iframe.frame.style.pointerEvents = "auto";
    Controller.iframe.frame.src = "Iframe/Pages/homepage.html";
    Controller.iframe.frame.addEventListener("load", () => {
      try {
        Controller.iframe.frame.contentWindow.controller = Controller;
        Controller.iframe.MenuSwitch(Controller.iframe.frame);
      } catch (e) {
        console.error("Cross-origin block:", e);
      }
    });

    Controller.user.showProducts().then(() => {
      Controller.bindPayments();
      Controller.user.bindCart();
      Controller.bindNavBar();
      Controller.bindUsers();
      if (window.Worker) {
        try {
          let RadioOffscreenCanvas = RadioCanvas.transferControlToOffscreen();

          Controller.worker.postMessage(
            Controller.soundengine.tycadome(
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
                canvas: RadioOffscreenCanvas,
              },
              [
                RadioOffscreenCanvas
              ]
            ),
            [RadioOffscreenCanvas]);
          //flowWorklet.port.start();
          Controller.initTsunamiWorkers(safeWorker, safeSharedWorker);
        } catch (err) {
          console.warn("Offscreen canvas transfer failed:", err);
        } finally {
          Controller.bindAudio(Controller.worker, Controller.soundengine.MasterSoundsContext, Controller.soundengine.ContextElement, Controller.soundengine.masterGain, Controller.soundengine.masterAnalyser, Controller.soundengine.masterAudioWorklet);
        }
      } else {
        Controller.bindAudio(Controller.worker, Controller.soundengine.MasterSoundsContext, Controller.soundengine.ContextElement, Controller.soundengine.masterGain, Controller.soundengine.masterAnalyser, Controller.soundengine.masterAudioWorklet);
      }
      Controller.site.requestLocation();
      console.log("TFN");
    }).catch(err => {
      console.error("Cart binding error:", err);
    });
  }
});