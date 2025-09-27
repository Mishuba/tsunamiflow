import { MyNewTFTime, TfUserLanguage, TfUserAgentInfo, TfOnlineStatus } from "./Variables.js";
import { navButtons } from "./Objects.js";
import { RadioTimes, WordTimes, DefaultPlaylist } from "./Arrays.js";
//import { } from "./Classes.js";
import { WordOfTheDay } from "./Words.js";
import { NewsTimer } from "./News.js";
import { HomepageUpdates, FirstGame, letsDoIt } from "./sprite.js";
import { TfMusic } from "./Audio.js";
import { Weather } from "./Classes.js";

let TsunamiWeather = document.getElementById("TFweather");

let TsunamiRadio = document.getElementById("TFradioPlayer");
let RadioTitle = document.getElementById("TfRadioStuff");
let RadioButtons = document.getElementById("CheckRadio");
let RadioLastButton = document.createElement("button");
let RadioRestartButton = document.createElement("button");
let RadioStartButton = document.createElement("button");
let RadioSkipButton = document.createElement("button");
let RadioCanvas = document.getElementById("TFradioCanvas");

let TfWeather = new Weather();
let TfWotd = document.getElementById("tfWordOfTheDay");
let Radio = new TfMusic(TsunamiRadio, RadioTitle, RadioButtons, RadioLastButton, RadioRestartButton, RadioStartButton, RadioSkipButton, RadioCanvas);
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

const oneMore = TFiframe.contentDocument || TFiframe.contentWindow.document;


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
                TfWeather.requestLocation();

                RadioTimes.forEach(async (tfRT) => {
                    if (TimerTime === tfRT) {
                        Radio.MusicNetworkState(RadioWorker);

                    } else {
                        console.log("No matching Radio Times as the moment");
                    }
                });
            } else if (event.data.type === "Tf Time") {
                NewsTimer();
                TfWeather.requestLocation();
                Radio.MusicNetworkState(RadioWorker);
            } else {
                console.log("No matching Times as the moment");
                NewsTimer();
                TfWeather.requestLocation();
                Radio.MusicNetworkState(RadioWorker);
            }

            RadioWorker.onmessage = async function (event) {
                Radio.RadioWorkerReceivedMessage(event);
            }

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
//Web Workers Ends

//Tsunami Thoughts 
document.getElementById("TFthoughtsNow").addEventListener("submit", TsunamiThoughts => {
    TsunamiThoughts.preventDefault();
    let tfUserThot = document.getElementById("TFthought");
    //TfPostThot(tfUserThot);
});
//Tsunami Thoughts Ends


async function DoTheThingMan() {
    console.log("checking the iframe source");
    if (TFiframe.src === "https://www.tsunamiflow.club/homepage.php" || TFiframe.src === "https://tsunamiflow.club/homepage.php" || TFiframe.src === "homepage.php") {
        console.log("creating and using the add event listener");

        window.addEventListener("message", async (ev) => {
            console.log("iframe message received from the homepage");

            console.log("the iframe origin is " + ev.origin);

            if (ev.origin === "https://www.tsunamiflow.club" || ev.origin === "https://tsunamiflow.club") {
                console.log("The event type is " + ev.data.type);
                if (ev.data.type === "Website Updates") {
                    console.l("creating the jsong to send to the iframe");
                    let HomePageJson = {
                        type: "start_updates",
                        info: HomepageUpdates.toJSON(),
                        message: "Starting the game",
                        username: "Mishuba",
                        error: "Nothing as of now"
                    };
                    console.log("sending the iframe message");
                    TFiframe.contentWindow.postMessage(HomePageJson, "https://www.tsunamiflow.club/homepage.php");
                }
                console.log("the end of that");
            } else if (ev.origin === "https://world.tsunamiflow.club") {
                console.log("I shouldn't be getting stuff from here");
            } else if (ev.origin === "https.js.stripe.com") {
                // console.log(ev.data)
            } else {
                return console.log(`Some outside source is trying to send my homepage a message. the origin is ${ev.origin}`);
            }
        });
    } else if (TFiframe.src === "https://www.tsunamiflow.club/Community.php" || "https://tsunamiflow.club/Community.php" || "Community.php") {
        window.addEventListener("message", async (ev) => {
            console.log("iframe commmunity message received");
            console.log(ev.origin);

            if (ev.origin === "https://www.tsunamiflow.club" || ev.origin === "https://tsunamiflow.club" || ev.origin === "https://world.tsunamiflow.club") {
                if (ev.data.type === "community") {
                    let CommunityJson = {
                        type: "community",
                        info: "idk community",
                        message: "this is the community message",
                        username: "Mishuba",
                        error: "ok no errors for community right now"
                    };

                    TFiframe.contentWindow.postMessage(CommunityJson, "https://www.tsunamiflow.club/Community.php");

                    console.log(CommunityJson);
                } else {
                    if (ev.data.error) {
                        let tfError = ev.data.error;
                        let CommunityJson = {
                            type: "community",
                            info: "idk community",
                            message: "this is the community message",
                            username: "Mishuba",
                            error: tfError
                        };
                        TFiframe.contentWindow.postMessage(CommunityJson, "https://www.tsunamiflow.club/Community.php");
                    } else {
                        let tfError = "nothing";
                        console.log("sending the game data over now");
                        CompetitionJson = {
                            type: "game_begin",
                            info: FirstGame.toJSON(),
                            message: "start the first game once the page opens.",
                            username: "Mishuba",
                            error: "Nothing for competitions right now"
                        };

                        TFiframe.contentWindow.postMessage(CompetitionJson, "https://www.tsunamiflow.club/Competitions.php");

                        console.log("the competitions iframe should have received the message");
                    }
                }
            } else if (ev.origin === "https.js.stripe.com") {
                //console.log(ev.data);
            } else {
                return console.log(`some outside source is trying to send my homepage a message. The origin is ${ev.origin}`);
            }
        });
    } else if (TFiframe.src === "https://www.tsunamiflow.club/news.php" || "https://tsunamiflow.club/news.php" || "news.php") {
        let NewsJson = {

        };
    } else if (TFiframe.src === "https://www.tsunamiflow.club/Competitions.php" || "https://tsunamiflow.club/Competitions.php" || "Competitions.php") {
        console.log("creating the event listener for the competitions iframe");
        window.addEventListener("message", async (ev) => {
            console.log("iframe competition message received");
            console.log(ev.origin);
            let CompetitionJson;

            console.log("checking the origin from the competitions iframe");
            if (ev.origin === "https://www.tsunamiflow.club" || ev.origin === "https://tsunamiflow.club" || ev.origin === "https://world.tsunamiflow.club") {
                console.log("checking the data type of the competitions iframe which is " + ev.data.type);
                if (ev.data.type === "start_game") {
                    console.log("sending the game data over now");
                    CompetitionJson = {
                        type: "game_begin",
                        info: FirstGame.toJSON(),
                        message: "start the first game once the page opens.",
                        username: "Mishuba",
                        error: "Nothing for competitions right now"
                    };

                    TFiframe.contentWindow.postMessage(CompetitionJson, "https://www.tsunamiflow.club/Competitions.php");

                    console.log("the competitions iframe should have received the message");
                } else if (ev.data.type === "game") {
                    CompetitionJson = {
                        type: "game",
                        info: FirstGame.toJSON(),
                        message: "this will be the first game message i send from outside of the game for some reason and to the game maybe",
                        username: "Mishuba",
                        error: "No errors as of now."
                    }
                } else {

                }
            } else if (ev.origin === "https.js.stripe.com") {
                // console.log(ev.data)
            } else {

            }
        });
    } else if (TFiframe.src === "https://www.tsunamiflow.club/roster.php" || "https://tsunamiflow.club/roster.php" || "roster.php") {
        let RosterJson = {
            type: "roster",
            info: "idk roster",
            message: "this is the roster message",
            username: "Mishuba",
            error: "ok no errors for the roster right now"
        };
    } else if (TFiframe.src === "https://www.tsunamiflow.club/TFnetwork.php" || "https://tsunamiflow.club/TFnetwork.php" || "TFnetwork.php") {
        let TfNetworkJson = {
            type: "network",
            info: "idk network",
            message: "this is the network message",
            username: "Mishuba",
            error: "ok no errors for network right now"
        };
    } else {
        let TfBasicJson = {
            type: "main",
            info: "final else option",
            message: "this is the fallback and default option if nothing is working",
            username: "Mishuba",
            error: "ok no errors for main stuff right now"
        };
        console.log("something is wrong with the javascript iframe navigation system.");
        HomepageUpdates.start();
    }
};
//Pages Ended

//Nav Begins
for (const [key, button] of Object.entries(navButtons)) {
    button.addEventListener("click", () => {
        TFiframe.src = `${key}.php`;
        DoTheThingMan();
    });
};
//Nav Ended