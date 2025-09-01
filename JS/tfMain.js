import { MyNewTFTime, TfWotd, TsunamiRadioAudio, TsunamiRadio, TfUserLanguage, TfUserAgentInfo, TfOnlineStatus, RadioCanvas } from "./Variables.js";
import { TfAudioVisualizer, StopTheVisualizator, requestLocation, TfPostThot, TsunamiRadioReady, startMusic } from "./Functions.js";
import { navButtons } from "./Objects.js";
import { RadioTimes, WordTimes, DefaultPlaylist } from "./Arrays.js";
//import { } from "./Classes.js";
import { WordOfTheDay } from "./Words.js";
import { NewsTimer } from "./News.js";
import { HomepageUpdates, FirstGame, letsDoIt } from "./sprite.js";

if (navigator.cookieEnabled) {
    //use cookies
} else {
    //don't use cookies 
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
document.getElementById("AddressDetailsSubscibers").style.display = "none";
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

            async function gettingRadioRight() {
                if (TsunamiRadio.readyState === 0) {
                    console.log("Radio readyState is HAVE_NOTHING aka no data yet.");
                    if (TsunamiRadio.networkState == 0) {
                        console.log("Radio networkState has NETWORK_EMPTY");
                        if (TsunamiRadio.src == "") {
                            console.log("The radio source is ''");
                            RadioWorker.postMessage({ type: "radio", system: "start" });
                        } else if (!TsunamiRadio.src) {
                            ("The radio source does not exist");
                            RadioWorker.postMessage({ type: "radio", system: "start" });
                        } else if (TsunamiRadio.src == " ") {
                            console.log("The radio source is ' '");
                            RadioWorker.postMessage({ type: "radio", system: "start" });
                        } else if (TsunamiRadio.src == "about:blank") {
                            console.log("The radio source is about:blank");
                            RadioWorker.postMessage({ type: "radio", system: "start" });
                        }
                        else {
                            console.log("Something else is going on and I dont know what it is.");
                        }
                    } else if (TsunamiRadio.networkState == 2) {
                        console.log("Radio networkState is NETWORK_LOADING");
                        //Actively fetching the audio from the network.
                        //Show loading or buffering user interface.
                    } else if (TsunamiRadio.networkState == 3) {
                        console.log("Radio networkState has NETWORK_NO_SOURCE");
                        //No valid source
                        RadioWorker.postMessage({ type: "radio", system: "start" });
                    }
                } else if (TsunamiRadio.readyState === 1) {
                    console.log("Radio readyState is HAVE_METADATA");
                    if (TsunamiRadio.networkState == 1) {
                        console.log("Radio networkState is NETWORK_IDLE");
                    } else if (TsunamiRadio.networkState == 2) {
                        console.log("Radio networkState is NETWORK_LOADING");
                        //Actively fetching the audio from the network.
                        //Show loading or buffering user interface.
                    } else if (TsunamiRadio.networkState == 3) {
                        console.log("Radio networkState has NETWORK_NO_SOURCE (but during the have metadata point.");
                        //No valid source
                    }
                } else if (TsunamiRadio.readyState === 2) {
                    console.log("Radio readyState is HAVE_CURRENT_DATA");
                    if (TsunamiRadio.networkState == 1) {
                        console.log("Radio networkState is NETWORK_IDLE");
                    } else if (TsunamiRadio.networkState == 2) {
                        console.log("Radio networkState is NETWORK_LOADING");
                        //Actively fetching the audio from the network.
                        //Show loading or buffering user interface.
                    } else if (TsunamiRadio.networkState == 3) {
                        console.log("Radio networkState has NETWORK_NO_SOURCE but during the have ;loading point.");
                        //No valid source
                    }
                } else if (TsunamiRadio.readyState === 3) {
                    console.log("Radio readyState is HAVE_FUTURE_DATA");
                    if (TsunamiRadio.networkState == 1) {
                        console.log("Radio networkState is NETWORK_IDLE");
                    } else if (TsunamiRadio.networkState == 3) {
                        console.log("Radio networkState has NETWORK_NO_SOURCE during the canplay point.");
                        //No valid source
                    }
                } else if (TsunamiRadio.readyState === 4) {
                    console.log("Radio readyState is HAVE_ENOUGH_DATA");
                    if (TsunamiRadio.networkState == 1) {
                        console.log("Radio networkState is NETWORK_IDLE");
                    } else if (TsunamiRadio.networkState == 2) {
                        console.log("Radio networkState is NETWORK_LOADING");
                        //Actively fetching the audio from the network.
                        //Show loading or buffering user interface.
                    } else if (TsunamiRadio.networkState == 3) {
                        console.log("Radio networkState has NETWORK_NO_SOURCE during the canplaythrough point.");
                        //No valid source
                    }

                    if (TsunamiRadio.ended) {
                        if (TsunamiRadio.src = "") {

                        } else if (TsunamiRadio.src = undefined) {

                        } else if (!TsunamiRadio.src) {

                        } else {
                            RadioWorker.postMessage({ type: "radio", system: "skip" });
                        }
                    } else {
                        if (TsunamiRadio.paused) {
                            if (TsunamiRadio.currentTime === 0) {
                                console.log("Tsunami Radio has not started yet.");
                            } else {
                                console.log("Paused at " + TsunamiRadio.currentTime);
                            }
                        } else {
                            console.log("A song is still playing. Make the next song play using the functions");
                        }
                    }
                } else {
                    if (TsunamiRadio.networkState === 3) {
                        console.log("The network could not find the source.");
                        RadioWorker.postMessage({ type: "radio", system: "start" });
                    } else {
                        console.log("Some unknown error is going on with the Radio");
                    }
                }
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
                requestLocation();

                RadioTimes.forEach(async (tfRT) => {
                    if (TimerTime === tfRT) {
                        gettingRadioRight();

                    } else {
                        console.log("No matching Radio Times as the moment");
                    }
                });
            } else if (event.data.type === "Tf Time") {
                NewsTimer();
                requestLocation();
                gettingRadioRight();
            } else {
                console.log("No matching Times as the moment");
                NewsTimer();
                requestLocation();
                gettingRadioRight();
            }

            RadioWorker.onmessage = async function (event) {
                TsunamiRadioReady();
                let SongList1st;
                let RadioLoadStartTime;
                let RadioAnalyser;
                let RadioSrc;
                let TsunamiRadioBufferLength;
                let TsunamiRadioDataArray;

                function checkRealQuick() {
                    let randomMusicDefault;
                    let SongList;
                    if (event.data.file == "undefined") {
                        randomMusicDefault = Math.floor(Math.random() * (DefaultPlaylist.length - 1));
                        SongList = DefaultPlaylist[randomMusicDefault];
                        console.log(`This should be a song from the default playlist in javascript <br />: ${SongList}`);
                    } else if (event.data.file == undefined) {
                        randomMusicDefault = Math.floor(Math.random() * (DefaultPlaylist.length - 1));
                        SongList = DefaultPlaylist[randomMusicDefault];
                        console.log(`This should be a song from the default playlist in javascript <br /> ${SongList}`);
                    } else if (event.data.file == "") {
                        randomMusicDefault = Math.floor(Math.random() * (DefaultPlaylist.length - 1));
                        SongList = DefaultPlaylist[randomMusicDefault];
                        console.log(`This should be a song from the default playlist in javascript <br /> ${SongList}`);
                    } else if (event.data.file == "null") {
                        randomMusicDefault = Math.floor(Math.random() * (DefaultPlaylist.length - 1));
                        SongList = DefaultPlaylist[randomMusicDefault];
                        console.log(`This should be a song from the default playlist in javascript <br /> ${SongList}`);
                    } else if (event.data.file == null) {
                        randomMusicDefault = Math.floor(Math.random() * (DefaultPlaylist.length - 1));
                        SongList = DefaultPlaylist[randomMusicDefault];
                        console.log(`This should be a song from the default playlist in javascript <br /> ${SongList}`);
                    } else {
                        SongList = event.data.file;
                        console.log(`This should be a song from php ${SongList} <br /> typeof: ${typeof SongList}`);
                    }
                    return SongList;
                }

                if (typeof event.data.file == undefined) {
                    SongList1st = checkRealQuick();
                } else if (typeof event.data.file == null) {
                    SongList1st = checkRealQuick();
                } else if (typeof event.data.file == "string") {
                    SongList1st = checkRealQuick();
                } else {
                    SongList1st = checkRealQuick();
                }

                console.log(SongList1st + " is the source of the current song.");
                TsunamiRadio.src = SongList1st; //SongList.trim();
                TsunamiRadio.load();

                TsunamiRadio.addEventListener("emptied", () => {
                    console.log("The radio has become emptied");
                }); //The media has become empty; for example, this event is sent if the media has already been loaded( or partially loaded), and the HTMLMediaElement.load method is called to reload it.

                TsunamiRadio.addEventListener("loadstart", async () => {
                    console.log("The radio has started to load.")
                    //Put a loading icon or something here.
                    RadioLoadStartTime = Date.now();
                    console.log("Starting loading at " + RadioLoadStartTime);
                }); // Fired when the browser has started to load the resource.

                TsunamiRadio.addEventListener("loadedmetadata", async () => {
                    console.log("The radio metadata has started to load.")
                    //Do Visualization Processing Here.
                    //SongSample = TsunamiRadio.sampleRate;// This for the visualizator

                    //Attach the audio to the Audio Context.

                    RadioSrc = TsunamiRadioAudio.createMediaElementSource(TsunamiRadio);
                    // Initialize frequency analyzer nodes or waveform processors.
                    RadioAnalyser = TsunamiRadioAudio.createAnalyser();
                    RadioAnalyser.fftSize = 2048;
                    TsunamiRadioBufferLength = RadioAnalyser.frequencyBinCount;
                    TsunamiRadioDataArray = new Uint8Array(TsunamiRadioBufferLength);

                    //Connect Stuff
                    RadioSrc.connect(RadioAnalyser);
                    RadioAnalyser.connect(TsunamiRadioAudio.destination);

                    //Check audioContext
                    if (TsunamiRadioAudio.state === "suspended") {
                        TsunamiRadioAudio.resume();
                    } else if (TsunamiRadioAudio.state === "running") {

                    } else {
                        console.log("The Audio Context state must be closed");
                    }
                }); //The metadata has been loaded.

                TsunamiRadio.addEventListener("loadeddata", () => {
                    console.log("The data has loaded.");
                    if (TsunamiRadioAudio.state === "suspended") {
                        TsunamiRadioAudio.resume();
                    } else if (TsunamiRadioAudio.state === "running") {
                        console.log("The audio Context state is running");
                    } else {
                        console.log("The Audio Context state must be closed");
                    }
                    //Set up your canvas
                }); //The first frame of the media has finished loading.

                TsunamiRadio.addEventListener("canplay", () => {
                    console.log("Tsunami Radio is at the can play part.");
                    if (TsunamiRadioAudio.state === "suspended") {
                        console.log("The audio Context state is suspened");
                        TsunamiRadioAudio.resume();
                    } else if (TsunamiRadioAudio.state === "running") {
                        console.log("The audio Context state is running");
                    } else {
                        console.log("The Audio Context state must be closed");
                    }
                    //Start Audio Timer Here

                    //Start Visualizater here 
                    if (RadioCanvas !== null) {
                        let newctxok = RadioCanvas.getContext("2d");
                        TfAudioVisualizer(RadioCanvas, TsunamiRadioDataArray, TsunamiRadioBufferLength, RadioAnalyser);
                    } else {
                        console.log("The canvas so null so i am getting it again.");
                        RadioCanvas = document.getElementById("TFradioCanvas");
                        TfAudioVisualizer(RadioCanvas, TsunamiRadioDataArray, TsunamiRadioBufferLength, RadioAnalyser);
                    }
                }); // The browser can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content.

                TsunamiRadio.addEventListener("canplaythrough", async () => {
                    if (TsunamiRadioAudio.state === "suspended") {
                        TsunamiRadioAudio.resume();
                    } else if (TsunamiRadioAudio.state === "running") {
                        console.log("The audio Context state is running");
                    } else {
                        console.log("The Audio Context state must be closed");
                    }
                    startMusic();
                }); //The browser estimates it can play the media up to its ends without stopping for content buffering.

                TsunamiRadio.addEventListener("play", () => {
                    console.log("The radio should be playing");
                    if (TsunamiRadioAudio.state === "suspended") {
                        TsunamiRadioAudio.resume();
                    } else if (TsunamiRadioAudio.state === "running") {
                        console.log("The audio Context state is running");
                    } else {
                        console.log("The Audio Context state must be closed");
                    }
                    //Measure audio latency after user presses play.
                }); //Playback has begun.

                TsunamiRadio.addEventListener("pause", () => {
                    console.log("The radio should be paused");
                    if (TsunamiRadioAudio.state === "suspended") {
                        StopTheVisualizator()
                    } else if (TsunamiRadioAudio.state === "running") {
                        console.log("The audio Context state is running");

                    } else {
                        console.log("The Audio Context state must be closed");
                        StopTheVisualizator()
                    }
                    // Pause visualizator or have a idle frame.

                }); // Playback has been paused.

                TsunamiRadio.addEventListener("ended", async () => {
                    console.log("The radio should have ended.");
                    //TsunamiRadioAudio.suspend();
                    //StopTheVisualizator()
                    //RadioWorker.postMessage({ type: "radio", system: "ended" });
                }); //Playback has stopped because of the end of the media was reached.

                TsunamiRadio.addEventListener("waiting", (waiting) => {
                    console.log("The radio should be waiting");
                    if (TsunamiRadioAudio.state === "suspended") {
                        console.log(`Tsunami Radio is waiting for some reason. ${waiting}`);
                        console.log("The audio Context state is suspended");
                        TsunamiRadioAudio.resume();
                    } else if (TsunamiRadioAudio.state === "running") {
                        console.log("The audio Context state is running");
                        console.log(`Tsunami Radio is waiting for some reason. ${waiting}`);
                        TsunamiRadioAudio.suspend();
                    } else {
                        console.log("The Audio Context state must be closed");
                    }

                }); //Playback has stopped because of a temporary lack of data.

                TsunamiRadio.addEventListener("playing", () => {
                    console.log("the radio should be playing");
                    //Ensure Sound is actively rendering before enabling interactions
                    if (TsunamiRadioAudio.state === "suspended") {
                        TsunamiRadioAudio.resume();
                    }

                }); // Playback is ready to start after having been paused or delayed due to lack of data.

                TsunamiRadio.addEventListener("stalled", (stalled) => {
                    console.log(`The Tsunami Radio has stalled for something reason. ${stalled} <br /> here is the supposed song path ${event.data.file}`);

                });//The user agent is trying to fetch media data, but data is unexpectedly not forthcoming.

                TsunamiRadio.addEventListener("suspended", (suspend) => {
                    if (TsunamiRadio.networkState === TsunamiRadio.NETWORK_IDLE) {
                        console.log(`Tsunami Radio has been suspended ${suspend}`);
                    } else if (TsunamiRadio.readyState < TsunamiRadio.HAVE_ENOUGH_DATA) {
                        //TsunamiRadio.load();
                    }
                }); //Media data loading has been suspended.

                TsunamiRadio.addEventListener("timeupdate", () => {

                    function FormatRadioTime(seconds) {
                        let m = Math.floor(seconds / 60);
                        let s = seconds % 60;
                        return `${m}:${s.toString().padStart(2, "0")}`;
                    }

                    let TfTimingOk = Math.floor(TsunamiRadio.currentTime);
                    let UsingTfTk = `Time: ${FormatRadioTime(TfTimingOk)}`;
                    let TfRadioProcessBar = (TsunamiRadio.currentTime / TsunamiRadio.duration) * 100;
                    //document.getElementById("TFradioCurrentTime").innerHTML = `elapsed time: ${FormatRadioTime(TsunamiRadio.currentTime)}`;
                    //document.getElementById("TFradioTimeLeft").innerHTML = `Remaing time: ${FormatRadioTime(TsunamiRadio.duration)}`;
                    //document.getElementById("RadioTimeFr").innerHTML = UsingTfTk;
                    //document.getElementById("TFradioProcessBar").innerHTML = TfRadioProcessBar;
                }); //The time indicated by the currentTime attribute has been updated.

                TsunamiRadio.addEventListener("volumechange", () => {
                    // Do something cool with the screen and colors and come when this happens.
                }); //The Volume has changed.
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
    TfPostThot(tfUserThot);
});
//Tsunami Thoughts Ends


async function DoTheThingMan() {
    if (TFiframe.src === "https://www.tsunamiflow.club/homepage.php" || TFiframe.src === "https://tsunamiflow.club/homepage.php" || TFiframe.src === "homepage.php") {
        window.addEventListener("message", async (ev) => {
            console.log("iframe message received");
            console.log(ev.origin);

            if (ev.origin === "https://www.tsunamiflow.club" || "https://tsunamiflow.club") {
                if (ev.data.type === "Website Updates") {
                    let HomePageJson = {
                        type: "start_updates",
                        info: HomepageUpdates.toJSON(),
                        message: "Starting the game",
                        username: "Mishuba",
                        error: "Nothing as of now"
                    };

                    TFiframe.contentWindow.postMessage(HomePageJson, "https://www.tsunamiflow.club/homepage.php");
                }

            } else if (ev.origin === "https://world.tsunamiflow.club") {

            } else if (ev.origin === "https.js.stripe.com") {
                // console.log(ev.data)
            } else {
                return console.log(`Some outside source is trying to send my homepage a message. the origin is ${ev.origin}`);
            }
        });

        console.log("just making sure this works like i want so i can really start having fun and programing.");
    } else if (TFiframe.src === "https://www.tsunamiflow.club/Community.php" || "https://tsunamiflow.club/Community.php" || "Community.php") {
        window.addEventListener("message", async (ev) => {
            console.log("iframe message received");
            console.log(ev.origin);

            if (ev.origin === "https://www.tsunamiflow.club" || "https://tsunamiflow.club" || "https://world.tsunamiflow.club") {
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
                        let CommunityJson = {
                            type: "community",
                            info: "idk community",
                            message: "this is the community message",
                            username: "Mishuba",
                            error: tfError
                        };
                        TFiframe.contentWindow.postMessage(CommunityJson, "https://www.tsunamiflow.club/Community.php");
                    }
                }
            } else if (ev.origin === "https.js.stripe.com") {
                //console.log(ev.data);
            } else {
                return console.log(`some outside source is trying to send my homepage a message. The origin is ${ev.origin}`);
            }

            /*
                    TFcolorPicker.addEventListener('input', (e) => {
                        const hex = e.target.value;
                        const rgb = parseInt(hex.slice(1), 16);
                        chromaKeyColorWebcam.r = (rgb >> 16) & 255;
                        chromaKeyColorWebcam.g = (rgb >> 8) & 255;
                        chromaKeyColorWebcam.b = rgb & 255;
                    });
            
                    // Use chroma key color for webcam
                    TfCpBtn.addEventListener('click', () => {
                        useChromaKeyWebcam = true; // Set flag to true
                        TframeStBtn.style.display = 'inline'; // Show start button after choosing color
                    });
            
                    // Remove chroma key color button
                    TfCpRm.addEventListener('click', () => {
                        hpCC.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear the canvas
                        frameCounter = 0; // Reset frame counter
                        useChromaKeyWebcam = false; // Reset flags
                    });
            
                    //Green Screen Ends
            
                    TframeSpBtn.addEventListener('click', () => {
                        isPlaying = false;
                        cancelAnimationFrame(animationId);
                        hpCC.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                        if (webcamStream) {
                            const tracks = webcamStream.getTracks();
                            tracks.forEach(track => track.stop());
                            tfVidStuff.srcObject = null;
                            webcamStream = null;
                        }
                        TframeSpBtn.style.display = 'none'; // Hide stop button
                    });
            
                    TframeStRec.addEventListener('click', () => {
                        recordedChunks = [];
                        const stream = canvas.captureStream(30); // Capture at 30 FPS
                        mediaRecorder = new MediaRecorder(stream);
            
                        mediaRecorder.ondataavailable = (event) => {
                            if (event.data.size > 0) {
                                recordedChunks.push(event.data);
                            }
                        };
            
                        mediaRecorder.onstop = () => {
                            const blob = new Blob(recordedChunks, { type: 'video/webm' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.style.display = 'none';
                            a.href = url;
                            a.download = 'recording.webm';
                            document.body.appendChild(a);
                            a.click();
                            URL.revokeObjectURL(url);
                        };
            
                        mediaRecorder.start();
                        TframeStRec.style.display = 'none';
                        TframeSpRec.style.display = 'inline';
                    });
            
                    TframeSpRec.addEventListener('click', () => {
                        mediaRecorder.stop();
                        TframeStRec.style.display = 'inline';
                        TframeSpRec.style.display = 'none';
                    });
            
                    Tframe4u.addEventListener('click', () => {
                        const link = document.createElement('a');
                        link.download = 'canvas-video.webm'; // make this a variable like prompot or something 
                        link.href = hpCC.toDataURL('video/webm');
                        link.click();
                    });
            
                    TframeULimg.addEventListener('change', (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            TbackgroundFImage = new Image();
                            TbackgroundFImage.src = URL.createObjectURL(file);
                            TframeStBtn.style.display = 'inline'; // Show start button
                            TframeByeImg.style.display = 'inline'; // Show remove image button
                        }
                    });
            
                    TframeULvid.addEventListener('change', (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            TbackgroundFVideo = document.createElement('video');
                            TbackgroundFVideo.src = URL.createObjectURL(file);
                            TbackgroundFVideo.muted = true; // Mute the video
                            TbackgroundFVideo.loop = true; // Loop the video
                            TbackgroundFVideo.load(); // Load the video
                            TframeStBtn.style.display = 'inline'; // Show start button
                            TframeByeVid.style.display = 'inline'; // Show remove video button
                        }
                    });
            
                    TframeByeImg.addEventListener('click', () => {
                        TbackgroundFImage = null;
                        hpCC.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear the canvas
                        TframeStBtn.style.display = 'none'; // Hide start button
                        TframeByeImg.style.display = 'none'; // Hide remove button
                    });
            
                    TframeByeVid.addEventListener('click', () => {
                        if (TbackgroundFVideo) {
                            TbackgroundFVideo.pause();
                            TbackgroundFVideo.currentTime = 0; // Reset the video to the beginning
                            TbackgroundFVideo = null; // Clear the video reference
                            hpCC.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear the canvas
                        }
                        TframeStBtn.style.display = 'none'; // Hide start button
                        TframeByeVid.style.display = 'none'; // Hide remove button
                    });
            
                    document.getElementById("TcameraFlipButton").onclick = () => {
                        whichCamera = !whichCamera;
                    }
            
                    TframeCtrBtn.addEventListener('click', () => {
                        if (isPlaying) {
                            isPlaying = false;
                            cancelAnimationFrame(animationId);
                            tfVidStuff.pause();
                            if (TbackgroundFVideo) {
                                TbackgroundFVideo.pause();
                            }
                        } else {
                            isPlaying = true;
            
                            // Play the webcam feed if it's active
                            if (webcamStream) {
                                tfVidStuff.play();
                            }
            
                            // Always play the background video if it exists
                            if (TbackgroundFVideo) {
                                TbackgroundFVideo.play();
                            }
            
                            animate();
                        }
                    });
            */
        });
    } else if (TFiframe.src === "https://www.tsunamiflow.club/news.php" || "https://tsunamiflow.club/news.php" || "news.php") {
        let NewsJson = {

        };
    } else if (TFiframe.src === "https://www.tsunamiflow.club/Competitions.php" || "https://tsunamiflow.club/Competitions.php" || "Competitions.php") {
        CompetitionJson = {
            type: "start_game",
            info: FirstGame.toJSON(),
            message: "start the first game once the page opens.",
            username: "Mishuba",
            error: "Nothing for competitions right now"
        };

        TFiframe.contentWindow.postMessage(CompetitionJson, "https://tsunamiflow.club/Competitions.php");
        window.addEventListener("message", async (ev) => {
            console.log("iframe message received");
            console.log(ev.origin);
            let CompetitionJson;

            if (ev.origin === "https://www.tsunamiflow.club" || "https://tsunamiflow.club" || "https://world.tsunamiflow.club") {
                if (ev.data.type === "start_game") {
                    CompetitionJson = {
                        type: "start_game",
                        info: FirstGame.toJSON(),
                        message: "start the first game once the page opens.",
                        username: "Mishuba",
                        error: "Nothing for competitions right now"
                    };

                    TFiframe.contentWindow.postMessage(CompetitionJson, "https://www.tsunamiflow.club/Competitions.php");
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
        //The character essence is created here. 
        // The character become a physical being in the digital realm.
        //const Mishuba = new tfVGC("Mishuba", "Feilong", "2-Fly", 10, 10, 10, 10, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 4, 5, 2, 1, 1, 1, 1, 1, 1, 1, 1);
        //const KnowTyme = new tfVGC("Shadow", "Lockdown", "The Musician", 10, 10, 10, 10, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 4, 5, 2, 1, 1, 1, 1, 1, 1, 1, 1);
        //const Duwen = new tfVGC("Duwen", "Lyric", "The Protector", 10, 10, 10, 10, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 4, 5, 2, 1, 1, 1, 1, 1, 1, 1, 1);
        //const AgentMaxwell = new tfVGC("Hubert", "Maxwell", "Chris", 10, 10, 10, 10, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 4, 5, 2, 1, 1, 1, 1, 1, 1, 1, 1);
        //const Cletum = new tfVGC("Cletum", "Laph", "Mr. Writer", 10, 10, 10, 10, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 4, 5, 2, 1, 1, 1, 1, 1, 1, 1, 1);
        //const Kiwo = new tfVGC("Kiwu", "Detha", "The Artist", 10, 10, 10, 10, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 4, 5, 2, 1, 1, 1, 1, 1, 1, 1, 1);
        //const Halu = new tfVGC("Halu", "Unknown", "Anatagonist", 10, 10, 10, 10, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 4, 5, 2, 1, 1, 1, 1, 1, 1, 1, 1);
        //const Ackma = new tfVGC("Ackma", "Hawk", "The Protagonist", 10, 10, 10, 10, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 3, 4, 5, 2, 1, 1, 1, 1, 1, 1, 1, 1);

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

//Base Non-playable Characters
//Base Non-playable Characters Ends

//Custom Characters
//Customer Characters End
//Characters Ends
//HomepageUpdates.start();