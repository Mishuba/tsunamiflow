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

let Nifage = new User();
let MyNewTFTime = document.getElementById("TFtime");
let TfWotd = document.getElementById("tfWordOfTheDay");
let TsunamiRadio = document.getElementById("TFradioPlayer");
TsunamiRadio.crossOrigin = "anonymous";
let RadioTitle = document.getElementById("TfRadioStuff");
let RadioButtons = document.getElementById("CheckRadio");
//The Frame
export const twoMore = document.getElementById("mainTsectionFdiv");
let RadioCanvas = document.getElementById("TFradioCanvas");

export const TFiframe = document.createElement("iframe");

let frameTF = new tfIframe(TFiframe, HomepageUpdates, FirstGame)

let RadioLastButton = document.createElement("button");
let RadioRestartButton = document.createElement("button");
let RadioStartButton = document.createElement("button");
let RadioSkipButton = document.createElement("button");

let Socket = new TfWebsocket("wss://world.tsunamiflow.club:8443");
let Effects = new TfEffects();
let TfWeather = new Weather();
let TsunamiAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
let RadioAnalyser = TsunamiAudioCtx.createAnalyser();
RadioAnalyser.fftSize = 2048;
let RadioMedia = TsunamiAudioCtx.createMediaElementSource(TsunamiRadio);
let Radio = new TfMusic(TsunamiAudioCtx, RadioAnalyser, RadioMedia);
let mixSounds = new TfAudioMixer(TsunamiAudioCtx);

let Live = new TfVideo(Socket, Effects);

let workers = new WorkerManager({ Radio, TfWeather, WordTimes, RadioTimes, WordOfTheDay, NewsTimer, TsunamiAudioCtx, MyNewTFTime, TfWotd });

let cam = new TfWebcam();
let recorder = new TfRecorder();
let Controller = new MishubaController(Nifage, frameTF, Effects, Socket, Radio, mixSounds, TsunamiRadio, RadioCanvas, RadioTitle, RadioButtons, RadioLastButton, RadioRestartButton, RadioStartButton, RadioSkipButton, Live, null, null, FirstGame, null, workers, cam, recorder);

document.addEventListener("DOMContentLoaded", () => {

TFiframe.title = "Main Website Content";
TFiframe.id = "TsunamiContent";
TFiframe.name = "TsunamiMainFlowContent";
TFiframe.allow = "camera; microphone; geolocation";
TFiframe.allowFullscreen = true;
TFiframe.width = 925;
TFiframe.height = 430;
TFiframe.sandbox = "allow-scripts allow-same-origin";
TFiframe.style.background = "white";

    if (twoMore) {
        twoMore.appendChild(TFiframe);

TFiframe.src = "homepage.html";

TFiframe.onload = () => {

frameTF.contentWindow.controller = Controller;

Controller.iframe.MenuSwitch(Controller.iframe.frame);
        Controller.bindNavBar();

}
    } else {
        console.error("Element with id 'mainTsectionFdiv' not found.");
    }

    for (const [key, button] of Object.entries(navButtons)) {
        button.addEventListener("click", () => {
            Controller.iframe.src = `${key}.html`;
Controller.iframe.contentWindow.controller = Controller;
            Controller.bindNavBar();
        });
    };

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
});