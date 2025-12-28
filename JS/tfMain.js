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
import { WorkerManager } from "./../WebWorker/workers.js";
import { MishubaController } from "./default.js";

let Socket = new TfWebsocket("");
let Effects = new TfEffects();
let TfWeather = new Weather();
let MyNewTFTime = document.getElementById("TFtime");
let TfWotd = document.getElementById("tfWordOfTheDay");

let TsunamiAudioCtx = new (window.AudioContext || window.webkitAudioContext)();

document.body.addEventListener("click", () => {
    if (TsunamiAudioCtx.state === "suspended") {
        TsunamiAudioCtx.resume();
    }
});

//Tsunami Radio Audio
// Buttons
let TsunamiRadio = document.getElementById("TFradioPlayer");
TsunamiRadio.crossOrigin = "anonymous";
let RadioTitle = document.getElementById("TfRadioStuff");
let RadioButtons = document.getElementById("CheckRadio");
let RadioLastButton = document.createElement("button");
let RadioRestartButton = document.createElement("button");
let RadioStartButton = document.createElement("button");
let RadioSkipButton = document.createElement("button");
//visualizer
let RadioCanvas = document.getElementById("TFradioCanvas");
//Radio
let RadioAnalyser = TsunamiAudioCtx.createAnalyser();
RadioAnalyser.fftSize = 2048;
let RadioMedia = TsunamiAudioCtx.createMediaElementSource(TsunamiRadio);
let Radio = new TfMusic(TsunamiRadio, RadioTitle, RadioButtons, RadioLastButton, RadioRestartButton, RadioStartButton, RadioSkipButton, RadioCanvas, TsunamiAudioCtx, RadioAnalyser, RadioMedia, Socket);

if (navigator.cookieEnabled) {
    //use cookies
    console.log("Cookies are enabled");
} else {
    //don't use cookies 
    console.log("Cookies are not enabled");
}

//The Frame
export const twoMore = document.getElementById("mainTsectionFdiv");

export const TFiframe = document.createElement("iframe");
TFiframe.title = "Main Website Content";
TFiframe.id = "TsunamiContent";
TFiframe.name = "TsunamiMainFlowContent";
TFiframe.allow = "camera; microphone; geolocation";
TFiframe.allowFullscreen = true;
TFiframe.width = 925;
TFiframe.height = 430;
TFiframe.src = "./../homepage.html";
TFiframe.style.background = "white";

if (twoMore) {
    twoMore.appendChild(TFiframe);
} else {
    console.error("Element with id 'mainTsectionFdiv' not found.");
}

let frameTF = new tfIframe(TFiframe)

//database. do database calculations.
//Tsunami Thoughts 
document.getElementById("TFthoughtsNow").addEventListener("submit", TsunamiThoughts => {
    TsunamiThoughts.preventDefault();
    //let tfUserThot = document.getElementById("TFthought");
    //TfPostThot(tfUserThot);
});

const workers = new WorkerManager({
    Radio,
    TfWeather,
    WordTimes,
    RadioTimes,
    WordOfTheDay,
    NewsTimer,
    TsunamiAudioCtx,
    MyNewTFTime,
    TfWotd
});

//Start functions
TfWeather.requestLocation();

//Nav Ended
let Live = new TfVideo(Socket, Radio, Effects);

//
let Controller = new MishubaController(null, frameTF, Effects, Socket, Radio, TsunamiRadio, RadioCanvas, RadioTitle, RadioButtons, RadioLastButton, RadioRestartButton, RadioStartButton, RadioSkipButton, Live, null, null, null, null, workers);

//Nav Begins
Controller.bindNavBar();
//DoTheThingMan(TFiframe);
for (const [key, button] of Object.entries(navButtons)) {
    button.addEventListener("click", () => {
        Controller.iframe.src = `${key}.html`;
        Controller.bindNavBar();
        //TFiframe.src = `${key}.html`;
        //DoTheThingMan(TFiframe);
    });
};
document.addEventListener("DOMContentLoaded", () => {
    //Controller.bindSignUp();
    //Controller.bindCart();
    Controller.bindWorker();
});