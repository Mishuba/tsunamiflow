import { MyNewTFTime, TfUserLanguage, TfUserAgentInfo, TfOnlineStatus } from "./Variables.js";
import { navButtons } from "./Objects.js";
import { RadioTimes, WordTimes } from "./Arrays.js";
//import { } from "./Classes.js";
import { WordOfTheDay } from "./Words.js";
import { NewsTimer } from "./News.js";
import { TfMusic } from "./Audio.js";
import { Weather } from "./Weather.js";
import { DoTheThingMan } from "./Functions.js";
import { HomepageUpdates } from "./sprite.js";

let TfWeather = new Weather();
let TfWotd = document.getElementById("tfWordOfTheDay");
let TsunamiAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
//Tsunami Radio Audio
// Buttons
let TsunamiRadio = document.getElementById("TFradioPlayer");
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
//RadioMedia.connect(RadioAnalyser);
//RadioAnalyser.connect(TsunamiAudioCtx.destination);
let Radio = new TfMusic(TsunamiRadio, RadioTitle, RadioButtons, RadioLastButton, RadioRestartButton, RadioStartButton, RadioSkipButton, RadioCanvas, TsunamiAudioCtx, RadioAnalyser, RadioMedia);

//VideoGame Audio
let GameAudio = new TfMusic(TsunamiRadio, RadioTitle, RadioButtons, RadioLastButton, RadioRestartButton, RadioStartButton, RadioSkipButton, RadioCanvas);

if (navigator.cookieEnabled) {
    //use cookies
    console.log("Cookies are enabled");
} else {
    //don't use cookies 
    console.log("Cookies are not enabled");
}

console.log(TfUserAgentInfo);
console.log(`The user native human language setting on this computer is ${TfUserLanguage} we will put this in a variable called TFuserLanguage`);
console.log(`The current online status of this computer is ${TfOnlineStatus}`);

//The Frame
export let twoMore = document.getElementById("mainTsectionFdiv");

export let TFiframe = document.createElement("iframe");
TFiframe.title = "Main Website Content";
TFiframe.id = "TsunamiContent";
TFiframe.name = "TsunamiMainFlowContent";
TFiframe.allow = "camera;microphone;geolocation";
TFiframe.allowFullscreen = true;
TFiframe.width = 925;
TFiframe.height = 430;
TFiframe.style.background = "white";

if (twoMore === null) {

} else {
    twoMore.appendChild(TFiframe);
}

const oneMore = TFiframe;

document.getElementById("freeLevelInputs").style.display = "none";
document.getElementById("TFMembershipLevel").addEventListener("change", function () {
    var level = this.value;

    let cost, paymentType;
    // Hide all extra sections
    document.getElementById("freeLevelInputs").style.display = "none";
    document.getElementById("regularLevelInputs").style.display = "none";
    document.getElementById("vipLevelInputs").style.display = "none";
    document.getElementById("teamLevelInputs").style.display = "none";
    document.getElementById("membershipCostInfo").style.display = "none"; // Show cost info
    document.getElementById("AddressDetailsSubscibers").style.display = "none";

    // Clear previous cost and payment type
    document.getElementById("membershipCost").innerHTML = "";
    document.getElementById("paymentType").innerHTML = "";

    // Show fields based on selected membership level
    if (level === "none") {
        cost = 0;
        paymentType = "none";
        document.getElementById("membershipCost").innerHTML = "Please Select a Level";
        document.getElementById("paymentType").innerHTML = "";
    } else if (level === "free") {
        cost = 0;
        paymentType = "none";
        document.getElementById("freeLevelInputs").style.display = "block";
        document.getElementById("AddressDetailsSubscibers").style.display = "block";
        document.getElementById("membershipCostInfo").style.display = "block";
        document.getElementById("membershipCost").innerHTML = "$0.00";
        document.getElementById("paymentType").innerHTML = "No payment required";
    } else if (level === "regular") {
        cost = 4;
        paymentType = "monthly";
        document.getElementById("freeLevelInputs").style.display = "block";
        document.getElementById("AddressDetailsSubscibers").style.display = "block";
        document.getElementById("membershipCostInfo").style.display = "block";
        document.getElementById("regularLevelInputs").style.display = "block";
        document.getElementById("membershipCost").innerHTML = "$4.00";
        document.getElementById("paymentType").innerHTML = "Monthly payment";
    } else if (level === "vip") {
        cost = 7;
        paymentType = "monthly";
        document.getElementById("freeLevelInputs").style.display = "block";
        document.getElementById("AddressDetailsSubscibers").style.display = "block";
        document.getElementById("membershipCostInfo").style.display = "block";
        document.getElementById("regularLevelInputs").style.display = "block";
        document.getElementById("vipLevelInputs").style.display = "block";
        document.getElementById("membershipCost").innerHTML = "$7.00";
        document.getElementById("paymentType").innerHTML = "Monthly payment";
    } else if (level === "team") {
        cost = 10;
        paymentType = "none";
        document.getElementById("freeLevelInputs").style.display = "block";
        document.getElementById("AddressDetailsSubscibers").style.display = "block";
        document.getElementById("membershipCostInfo").style.display = "block";
        document.getElementById("regularLevelInputs").style.display = "block";
        document.getElementById("vipLevelInputs").style.display = "block";
        document.getElementById("teamLevelInputs").style.display = "block";
        document.getElementById("membershipCost").innerHTML = "$10.00";
        document.getElementById("paymentType").innerHTML = "Monthly payment";
    }
    document.getElementById("hiddenMC").value = cost;
    document.getElementById("hiddenPT").value = paymentType;
});
//Subscribers Ends

//Web Workers Starts
//News 
let timeWorker;
let RadioWorker;

if (typeof (Worker) !== "undefined") {
    console.log("type of worker is defined");

    if (typeof (EventSource) !== "undefined") {
        console.log("Server Sent Events are supported");

        if (typeof (timeWorker) == "undefined") {
            console.log("Time Worker is not Defined");
            timeWorker = new Worker("WebWorker/Timer.js", { type: "module" });
            console.log("Time Worker is now defined");
        }

        timeWorker.onmessage = async function (event) {
            const TimerTime = event.data.time;
            MyNewTFTime.innerHTML = TimerTime;
            if (typeof (RadioWorker) == "undefined") {
                console.log("Radio Worker is not defined");
                RadioWorker = new Worker("WebWorker/TsunamiRadio.js", { type: "module" });
                console.log("Radio Worker is now defined");
            }

            if (event.data.type === "Tf Schedule") {
                WordTimes.forEach(async (word) => {
                    if (TimerTime === word) {
                        console.log(`Word of the day received the time: ${TimerTime}`);
                        TfWotd.innerHTML = await WordOfTheDay(TimerTime);
                    } else {
                        TfWotd.innerHTML = await WordOfTheDay(TimerTime);
                    }
                });

                NewsTimer();

                RadioTimes.forEach(async (tfRT) => {
                    if (TimerTime === tfRT) {
                        Radio.MusicNetworkState(RadioWorker, Radio.TsunamiAudio);
                    } else {
                        console.log("No matching Radio Times as the moment");
                        if (Radio.TsunamiAudio.src === "" || Radio.TsunamiAudio.src === undefined || !Radio.TsunamiAudio.src) {
                            Radio.MusicNetworkState(RadioWorker, Radio.TsunamiAudio);
                        } else if (Radio.TsunamiAudio.ended) {
                            Radio.MusicNetworkState(RadioWorker, Radio.TsunamiAudio);
                        } else {
                            console.log("Radio is already playing or paused");
                        }
                    }
                });
            } else if (event.data.type === "Tf Time") {
                NewsTimer();
                document.getElementById("TFweather").innerHTML = TfWeather.requestLocation();
                Radio.MusicNetworkState(RadioWorker, Radio.TsunamiAudio);
            } else {
                console.log("No matching Times as the moment");
                NewsTimer();
                TfWeather.requestLocation();
                Radio.MusicNetworkState(RadioWorker, Radio.TsunamiAudio);
            }

            RadioWorker.onmessage = async function (event) {
                if (event.data.type === "radio") {
                    if (event.data.system === "file") {
                        let update = Radio.RadioWorkerReceivedMessage(event);
                        Radio.BeginRadio(update, RadioWorker);
                    } else if (event.data.system === "arraybuffer") {
                        Radio.TfScheduleBuffer(event.data.buffer, TsunamiAudioCtx);
                        let usebuffer = Radio.RadioWorkerArrayBuffer(event.data.buffer, TsunamiAudioCtx);
                        //Radio.TfRadioConnectNow();

                        //Radio.TfRadioEventListeners();

                        RadioWorker.postMessage({
                            type: "radio",
                            system: "pcm",
                            file: "playing now",
                            message: "the buffer",
                            buffer: usebuffer,
                            sampleRate: event.data.buffer.sampleRate
                        }, [usebuffer]);
                    } else if (event.data.system === "pcm") {

                    }
                } else {
                    let update = Radio.RadioWorkerReceivedMessage(event);
                }
            };

            RadioWorker.onerror = async function (error) {
                console.error(`error message: ${error.message} <br /> error filename: ${error.filename} <br /> error line: ${error.lineno}`);
                //document.createElement("script").src("JS/RadioBackup.js");
            }
        };

        timeWorker.onerror = async function (error) {
            console.error(`error message: ${error.message} <br /> error filename: ${error.filename} <br /> error line: ${error.lineno}`);
            //document.createElement("script").src("JS/RadioBackup.js");
        }
        // Do the news function from here.
    } else {
        console.log("Server Sent Events are not supported");
        //Do Xml, fetch or something.


    }
} else {
    console.log("No Web Worker Support");
}

TfWeather.requestLocation();
//Web Workers Ends

//Nav Begins
for (const [key, button] of Object.entries(navButtons)) {
    button.addEventListener("click", () => {
        TFiframe.src = `${key}.php`;
        DoTheThingMan(TFiframe);
    });
};
//Nav Ended

oneMore.onload = async () => {

console.log("Creating JSON to send to the iframe");

const HomePageJson = {
    type: "start_updates",
    info: HomepageUpdates.toJSON(),
    message: "Starting the game",
    username: "Mishuba",
    error: null
};

console.log("Sending message to iframe...");

// Make sure iframe is fully loaded before messaging
if (oneMore && oneMore.contentWindow) {
    oneMore.contentWindow.postMessage(HomePageJson, "*");
    console.log("Message sent successfully");
} else {
    console.error("Iframe not ready or missing contentWindow");
}

};

//Websocket Stuff maybe create a database. do database calculations.
//Tsunami Thoughts 
document.getElementById("TFthoughtsNow").addEventListener("submit", TsunamiThoughts => {
    TsunamiThoughts.preventDefault();
    //let tfUserThot = document.getElementById("TFthought");
    //TfPostThot(tfUserThot);
});
//Tsunami Thoughts Ends

//Start non web worker stuff