import { ScreenShare } from "./ScreenSharer.js";
import { TfMediaStream } from "./Streamer.js";
import { TfWebRTCRecorder } from "./TfWebRtc.js";
import { navButtons } from "./Objects.js";
import { RadioTimes, WordTimes } from "./Arrays.js";
//import { } from "./Classes.js";
import { WordOfTheDay } from "./Words.js";
import { NewsTimer } from "./News.js";
import { Weather } from "./Weather.js";
import { TfWebsocket } from "./TfWebSocket.js";
import { TfEffects } from "./../WebWorker/Effects.js";
import { User } from "./Users.js";
import { TfMusic } from "./Audio.js";
import { TfVideo } from "./Video.js";
import { tfIframe } from "./TfIframe.js";
import { HomepageUpdates, FirstGame } from "./sprite.js";
import { WorkerManager } from "./../WebWorker/worker.js";
import { TfWebcam } from "./webcam.js";
import { TfRecorder } from "./recorder.js";
import { TfAudioMixer } from "./Mixer.js";
import { MishubaController } from "./default.js";

if (navigator.cookieEnabled) {
  //use cookies
  console.log("Cookies are enabled");
} else {
  //don't use cookies 
  console.log("Cookies are not enabled");
}

let MishubaScreen = new ScreenShare();
let TsunamiStream = new TfMediaStream();
let TfRTC = new TfWebRTCRecorder();
let Nifage = new User();
let Effects = new TfEffects();
let TfWeather = new Weather();
let cam = new TfWebcam();
let recorder = new TfRecorder();

document.addEventListener("DOMContentLoaded", () => {
  
  let MyNewTFTime = document.getElementById("TFtime");
  let TfWotd = document.getElementById("tfWordOfTheDay");
  let TsunamiRadio = document.getElementById("TFradioPlayer");
  TsunamiRadio.crossOrigin = "anonymous";
  let RadioTitle = document.getElementById("TfRadioStuff");
  let RadioButtons = document.getElementById("CheckRadio");
  //The Frame
  const twoMore = document.getElementById("mainTsectionFdiv");
  let RadioCanvas = document.getElementById("TFradioCanvas");
  
  const TFiframe = document.createElement("iframe");
  TFiframe.allow = "camera; microphone; geolocation";
  TFiframe.allowFullscreen = true;
  TFiframe.sandbox = "allow-scripts allow-same-origin";
  
  let frameTF = new tfIframe(TFiframe, HomepageUpdates, FirstGame)
  
  let RadioLastButton = document.createElement("button");
  let RadioRestartButton = document.createElement("button");
  let RadioStartButton = document.createElement("button");
  let RadioSkipButton = document.createElement("button");
  
  let Socket = new TfWebsocket("wss://world.tsunamiflow.club/ws");
  let TsunamiAudioCtx = new(window.AudioContext || window.webkitAudioContext)();
  let RadioAnalyser = TsunamiAudioCtx.createAnalyser();
  RadioAnalyser.fftSize = 2048;
  let RadioMedia = TsunamiAudioCtx.createMediaElementSource(TsunamiRadio);
  let StreamDestination = TsunamiAudioCtx.createMediaStreamDestination();
  let Radio = new TfMusic(TsunamiAudioCtx, RadioAnalyser, RadioMedia, StreamDestination);
  let mixSounds = new TfAudioMixer(TsunamiAudioCtx);
  
  let Live = new TfVideo(Socket, Effects);
  
  let workers = new WorkerManager({ Radio, TfWeather, WordTimes, RadioTimes, WordOfTheDay, NewsTimer, TsunamiAudioCtx, MyNewTFTime, TfWotd });
  let Controller = new MishubaController(Nifage, frameTF, Effects, Socket, Radio, mixSounds, TsunamiRadio, RadioCanvas, RadioTitle, RadioButtons, RadioLastButton, RadioRestartButton, RadioStartButton, RadioSkipButton, Live, null, null, FirstGame, null, workers, cam, TfRTC, recorder, TsunamiStream, MishubaScreen);
  
  Controller.iframe.frame.title = "Main Website Content";
  Controller.iframe.frame.id = "TsunamiContent";
  Controller.iframe.frame.name = "TsunamiMainFlowContent";
  Controller.iframe.frame.width = 925;
  Controller.iframe.frame.height = 430;
  Controller.iframe.frame.style.background = "white";
  Controller.iframe.frame.style.touchAction = "manipulation"; // prevent double-tap zoom and unwanted scrolling
  Controller.iframe.frame.style.pointerEvents = "auto"; // ensure pointer events fire
  
  if (twoMore) {
    twoMore.appendChild(Controller.iframe.frame);
  } else {
    console.error("Element with id 'mainTsectionFdiv' not found.");
  }
  
  Controller.iframe.frame.src = "homepage.html";
  
  Controller.iframe.MenuSwitch(Controller.iframe.frame);
  Controller.bindNavBar();
  
  Controller.iframe.frame.addEventListener("load", () => {
    console.log("Iframe loaded:", Controller.iframe.frame.src);
    
    try {
      console.log("contentWindow:", Controller.iframe.frame.contentWindow);
      if (Controller.iframe.frame.src.endsWith("Community.html")) {
        Controller.videoElem = Controller.find("TsunamiFlowVideoStuff", true);
        Controller.videoCanv = Controller.find("TFcanvas", true);
      }
      Controller.iframe.frame.contentWindow.controller = Controller;
      console.log("Controller injected into iframe");
      Controller.bindVidSystem();
    } catch (e) {
      console.error("Cross-origin block:", e);
    }
  });
  document.getElementById("TFthoughtsNow").addEventListener("submit", TsunamiThoughts => {
    TsunamiThoughts.preventDefault();
    //let tfUserThot = document.getElementById("TFthought");
    //TfPostThot(tfUserThot);
  });
  
  document.body.addEventListener("click", () => {
    if (TsunamiAudioCtx.state === "suspended") {
      TsunamiAudioCtx.resume();
    }
  });
  
  TfWeather.requestLocation();
  //Controller.bindSignUp();
  //Controller.bindCart();
  Controller.bindWorker();
  
  
  const xhr = new XMLHttpRequest();
  
  xhr.open(
    "GET",
    "https://world.tsunamiflow.club/tfMain.php?fetch_printful_items=1",
    true
  );
  
  xhr.withCredentials = true; // 🔑 REQUIRED for PHP sessions
  
  xhr.onload = () => {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      console.log("Printful items:", data.items);
    } else {
      console.error("Request failed:", xhr.status);
    }
  };
  
  xhr.onerror = () => {
    console.error("Network error");
  };
  
  xhr.send();
  
  const xhr1 = new XMLHttpRequest();
  
  xhr1.open(
    "POST",
    "https://world.tsunamiflow.club/tfMain.php",
    true
  );
  
  xhr1.withCredentials = true; // 🔑 REQUIRED
  xhr1.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  
  xhr1.onload = () => {
    const data = JSON.parse(xhr1.responseText);
    console.log("Cart response:", data);
  };
  
  xhr1.send(
    "addProductToCart=1" +
    "&product_id=12345" +
    "&StoreQuantity=2"
  );
  
  const xhr2 = new XMLHttpRequest();
  
  xhr2.open(
    "POST",
    "https://world.tsunamiflow.club/tfMain.php",
    true
  );
  
  xhr2.withCredentials = true; // 🔑 REQUIRED
  xhr2.setRequestHeader("Content-Type", "application/json");
  
  xhr2.onload = () => {
    const data = JSON.parse(xhr2.responseText);
    
    if (data.checkout_url) {
      window.location.href = data.checkout_url;
    } else {
      console.error("Stripe error:", data);
    }
  };
  
  xhr2.send(JSON.stringify({
    type: "Stripe Checkout"
  }));
});