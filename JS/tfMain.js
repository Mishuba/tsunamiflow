import { navButtons } from "./Objects.js";
import { RadioTimes, WordTimes } from "./Arrays.js";
//import { } from "./Classes.js";
import { WordOfTheDay } from "./Words.js";
import { NewsTimer } from "./News.js";
import { Weather } from "./Weather.js";
import { DoTheThingMan, fetchCart, updateTotals } from "./Functions.js";
import { TfWebsocket } from "./TfWebSocket.js";
import { TfEffects } from "./../WebWorker/Effects.js";
import { User } from "./Users.js";
import { TfMusic } from "./Audio.js";
import { TfVideo } from "./Video.js";
import { tfIframe } from "./TfIframe.js";
import { MishubaController } from "./default.js";

let Socket = new TfWebsocket("");
let Effects = new TfEffects();
let TfWeather = new Weather();
let MyNewTFTime = document.getElementById("TFtime");
let TfWotd = document.getElementById("tfWordOfTheDay");

document.addEventListener("DOMContentLoaded", () => {

    // Attach events to forms
    document.querySelectorAll('.cartForm').forEach(form => {
        const quantityInput = form.querySelector('.quantityInput');
        const variantSelect = form.querySelector('.variantSelect');

        quantityInput?.addEventListener('input', updateTotals);
        variantSelect?.addEventListener('change', updateTotals);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!form.action) return console.warn('Form action is empty!');

            try {
                const formData = new FormData(form);
                const res = await fetch(form.action, { method: 'POST', body: formData, headers: { 'X-Requested-With': 'XMLHttpRequest' } });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const result = await res.json();
                if (result.success) {
                    // Refresh cart totals
                    const cartItems = await fetchCart();
                    let total = 0;
                    cartItems.forEach(item => {
                        total += (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1);
                    });

                    const totalEl = document.getElementById('cartTotal');
                    if (totalEl) totalEl.textContent = total.toFixed(2);

                    // Refresh item subtotals in DOM
                    updateTotals();
                } else {
                    console.warn('Cart error:', result.error);
                }
            } catch (err) {
                console.error('Form submission error:', err);
            }
        });
    });

    // Initialize totals on page load
    updateTotals();
});


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

document.addEventListener("DOMContentLoaded", () => {
    const membershipSelect = document.getElementById("TFMembershipLevel");

    // Sections
    const sections = {
        free: document.getElementById("freeLevelInputs"),
        regular: document.getElementById("regularLevelInputs"),
        vip: document.getElementById("vipLevelInputs"),
        team: document.getElementById("teamLevelInputs"),
        address: document.getElementById("AddressDetailsSubscribers"), // if present
        costInfo: document.getElementById("membershipCostInfo"),
    };

    // Output fields
    const membershipCostEl = document.getElementById("membershipCost");
    const paymentTypeEl = document.getElementById("paymentType");
    const hiddenMC = document.getElementById("hiddenMC");
    const hiddenPT = document.getElementById("hiddenPT");

    // Membership configurations
    const membershipLevels = {
        none: { cost: 0, payment: "none", show: [], displayText: "Please Select a Level", paymentText: "" },
        free: { cost: 0, payment: "none", show: ["free", "address", "costInfo"], displayText: "$0.00", paymentText: "No payment required" },
        regular: { cost: 4, payment: "monthly", show: ["free", "regular", "address", "costInfo"], displayText: "$4.00", paymentText: "Monthly payment" },
        vip: { cost: 7, payment: "monthly", show: ["free", "regular", "vip", "address", "costInfo"], displayText: "$7.00", paymentText: "Monthly payment" },
        team: { cost: 10, payment: "monthly", show: ["free", "regular", "vip", "team", "address", "costInfo"], displayText: "$10.00", paymentText: "Monthly payment" },
    };

    // Hide all sections
    const hideAllSections = () => {
        Object.values(sections).forEach(ele => {
            if (ele) {
                ele.style.display = "none";
            } else {
                console.log("subscibers stuff");
            }
        })
    };

    // Update membership display
    const updateMembership = () => {
        const level = membershipSelect.value;
        hideAllSections();

        const config = membershipLevels[level] || membershipLevels.none;

        // Show the necessary sections
        config.show.forEach(sectionName => {
            const el = sections[sectionName];
            if (el.style.display === "none") {
                el.style.display = "block";
            }
        });

        // Update cost/payment
        if (membershipCostEl) membershipCostEl.innerHTML = config.displayText;
        if (paymentTypeEl) paymentTypeEl.innerHTML = config.paymentText;
        if (hiddenMC) hiddenMC.value = config.cost;
        if (hiddenPT) hiddenPT.value = config.payment;
    };

    // Initialize on page load
    updateMembership();

    // Listen for changes
    membershipSelect.addEventListener("click", updateMembership);
});

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

//database. do database calculations.
//Tsunami Thoughts 
document.getElementById("TFthoughtsNow").addEventListener("submit", TsunamiThoughts => {
    TsunamiThoughts.preventDefault();
    //let tfUserThot = document.getElementById("TFthought");
    //TfPostThot(tfUserThot);
});

//Start functions
TfWeather.requestLocation();
//Web Workers Ends

DoTheThingMan(TFiframe);

//Nav Begins
for (const [key, button] of Object.entries(navButtons)) {
    button.addEventListener("click", () => {
        TFiframe.src = `${key}.html`;
        DoTheThingMan(TFiframe);
    });
};
//Nav Ended
let Live = new TfVideo(Socket, Radio, Effects);

document.addEventListener("DOMContentLoaded", () => {
    // Attach events to forms
    document.querySelectorAll('.cartForm').forEach(form => {
        const quantityInput = form.querySelector('.quantityInput');
        const variantSelect = form.querySelector('.variantSelect');

        quantityInput?.addEventListener('input', updateTotals);
        variantSelect?.addEventListener('change', updateTotals);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!form.action) return console.warn('Form action is empty!');

            try {
                const formData = new FormData(form);
                const res = await fetch(form.action, { method: 'POST', body: formData, headers: { 'X-Requested-With': 'XMLHttpRequest' } });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const result = await res.json();
                if (result.success) {
                    // Refresh cart totals
                    const cartItems = await fetchCart();
                    let total = 0;
                    cartItems.forEach(item => {
                        total += (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1);
                    });

                    const totalEl = document.getElementById('cartTotal');
                    if (totalEl) totalEl.textContent = total.toFixed(2);

                    // Refresh item subtotals in DOM
                    updateTotals();
                } else {
                    console.warn('Cart error:', result.error);
                }
            } catch (err) {
                console.error('Form submission error:', err);
            }
        });
    });

    // Initialize totals on page load
    updateTotals();
});

//
let Controller = new MishubaController(null, frameTF, Effects, Socket, Radio, TsunamiRadio, RadioCanvas, RadioTitle, RadioButtons, RadioLastButton, RadioRestartButton, RadioStartButton, RadioSkipButton, Live, null, null, null);