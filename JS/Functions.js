import { HomepageUpdates, FirstGame } from "./sprite.js";

//Get browser info
async function getBrowserType() {
    const userAgent = navigator.userAgent;
    console.log(userAgent);

    if (userAgent.indexOf("Chrome") > -1) {
        return Promise.resolve("chrome");
    } else if (userAgent.indexOf("Firefox") > -1) {
        return Promise.resolve("firefox");
    } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
        return "safari";
    } else if (userAgent.indexOf("Edge") > -1) {
        return "edge";
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
        return "opera";
    } else if (userAgent.indexOf("Netscape") > -1) {
        return "netscape";
    } else {
        return "unknown";
    }
}

export function loadBrowserSpecificScript() {
    const browser = getBrowserType();

    let script = document.createElement("script");
    switch (browser) {
        case "chrome":
            script.src = "JS/chrome-specific.js";
            break;
        case "firefox":
            script.src = "JS/firefox-specific.js";
            break;
        case "safari":
            script.src = "JS/safari-specific.js";
            break;
        case "edge":
            script.src = "JS/edge-specific.js";
            break;
        case "opera":
            script.src = "JS/opera-specific.js";
            break;
        case "netscape":
            script.src = "JS/netscape-specific.js";
            break;
        default:
            script.src = "JS/default.js";
            break;
    }

    document.head.appendChild(script);
}
function doIframeThing(event, source) {
    switch (source.src) {
        case "homepage.html":
        case "https://tsunamiflow.club/homepage.html":
        case "https://www.tsunamiflow.club/homepage.html":
            console.log("iframe message received from the homepage");
            console.log("The event type is " + event.data.type);
            if (event.data.type === "Website Updates") {
                console.log("creating the json to send to the iframe");
                let HomePageJson = {
                    type: "start_updates",
                    info: HomepageUpdates.toJSON(),
                    message: "Starting the game",
                    username: "Mishuba",
                    error: "Nothing as of now"
                };
                console.log("sending the iframe message");
                source.contentWindow.postMessage(HomePageJson, "https://tsunamiflow.club/homepage.html");
            } else {

            }
            console.log("the end of that");
            break;
        case "roster.html":
        case "https://tsunamiflow.club/roster.html":
        case "https://www.tsunamiflow.club/roster.html":
            console.log("The iframe is from the roster page");
            let RosterJson = {
                type: "roster",
                info: "idk roster",
                message: "this is the roster message",
                username: "Mishuba",
                error: "ok no errors for the roster right now"
            };
            source.contentWindow.postMessage(RosterJson, "https://tsunamiflow.club/roster.html");
            break;
        case "news.html":
        case "https://tsunamiflow.club/news.html":
        case "https://www.tsunamiflow.club/news.html":
            console.log("The iframe is from the news page");
            let NewsJson = {
                type: "live",
                info: "live stream",
                message: "this is the live stream message",
                username: "Mishuba",
                error: "ok no errors for community right now"
            }
            source.contentWindow.postMessage(NewsJson, "https://tsunamiflow.club/news.html");
            break;
        case "Competitions.html":
        case "https://tsunamiflow.club/Competitions.html":
        case "https://www.tsunamiflow.club/Competitions.html":
            console.log("iframe competition message received");
            let CompetitionJson;
            console.log("checking the data type of the competitions iframe which is " + event.data.type);
            if (event.data.type === "start_game") {
                console.log("sending the game data over now");
                CompetitionJson = {
                    type: "game_begin",
                    info: FirstGame.toJSON(),
                    message: "start the first game once the page opens.",
                    username: "Mishuba",
                    error: "Nothing for competitions right now"
                };

                source.contentWindow.postMessage(CompetitionJson, "https://tsunamiflow.club/Competitions.html");
            } else if (event.data.type === "game") {
                CompetitionJson = {
                    type: "game",
                    info: FirstGame.toJSON(),
                    message: "this will be the first game message i send from outside of the game for some reason and to the game maybe",
                    username: "Mishuba",
                    error: "No errors as of now."
                };

                source.contentWindow.postMessage(CompetitionJson, "https://tsunamiflow.club/Competitions.html");
            } else {

            }
            break;
        case "TFnetwork.html":
        case "https://tsunamiflow.club/TFnetwork.html":
        case "https://www.tsunamiflow.club/TFnetwork.html":
            console.log("The iframe is from the TFnetwork page");
            let TfNetworkJson = {
                type: "network",
                info: "idk network",
                message: "this is the network message",
                username: "Mishuba",
                error: "ok no errors for network right now"
            };
            source.contentWindow.postMessage(TfNetworkJson, "https:/tsunamiflow.club/TFnetwork.html");
            break;
        case "Community.html":
        case "https://tsunamiflow.club/Community.html":
        case "https://www.tsunamiflow.club/Community.html":
            console.log("iframe commmunity message received");
            let CommunityJson = {
                type: "community",
                info: "idk community",
                message: "this is the community message",
                username: "Mishuba",
                error: "ok no errors for community right now"
            };

            source.contentWindow.postMessage(CommunityJson, "https://tsunamiflow.club/Community.html");
            break;
        default:
            console.log("The iframe is from the default page " + source.src);
            console.log("The event information is " + event);
            break;
    };
}


export async function VideoEventListeners(element, canvas, context) {
    if (element === null) {
        element = document.createElement("video");
    }
    element.id = "TsunamiFlowVideoStuff";
    element.controls = true;
    element.autoplay = false;
    element.loop = false;
    element.muted = false;
    element.poster = "";
    element.addEventListener("emptied", async () => {
        console.log("The Tsunami Community Video has been emptied.");
        element.emptiedVideo(element);
    });

    element.addEventListener("load", async () => {
        element.loadVideo(element);
    });

    element.addEventListener("loadstart", async () => {
        console.log("The Tsunami Community Video has started loading.");

    });

    element.addEventListener("loadedmetadata", async (metadata) => {
        console.log("The Tsunami COmmunity Video metadata has started to load.");
        element.loadedVideoMetadata(element);
    });

    element.addEventListener("loadeddata", async (data) => {
        console.log("The data has loaded");
        element.loadedVideoData(element, context);
    }); // The first frame of the mdeia has finished loading.

    element.addEventListener("canplay", async () => {
        console.log("The Tsunami Video Community can play this part.");
        //create canvas for audio and video
        element.canPlayVideo(element, context);
    });

    element.addEventListener("canplaythrough", async () => {
        element.canPlayVideoThrough(element, context);
    }); //The browser estimates it can play the media up to its ends without stopping for content buffering.

    element.addEventListener("play", () => {
        console.log("The Video should be playing");
        //this.playVideo();
        //Capture processed canvas as MediaStream with button
        this.processedStream = canvas.captureStream(30);
        element.playVideo(element, context);
    });

    element.addEventListener("pause", async () => {
        //this.pauseVideo();
        element.pauseVideo(element, context);
    }); //playback has been paused.

    element.addEventListener("ended", async () => {
        console.log("The video should have ended");
        //this.VideoEnded();
        element.VideoEnded(element, context);
    });

    element.addEventListener("waiting", async (waiting) => {
        console.log("The Video should be waiting");
        element.VideoWaiting(element, context);
    });

    element.addEventListener("playing", async () => {
        console.log("The video should be playing");
        element.VideoPlaying(element, context);
    });

    element.addEventListener("stalled", async (stalled) => {
        console.log(`The Tsunami Community Video has stalled for some reason. ${stalled} <br /> here is the supposed song path: input the real path here later.`);
        element.VideoStalled();
    });

    element.addEventListener("suspended", async (suspend) => {
        element.VideoSuspended(element);
    });

    element.addEventListener("timeupdate", () => {
        //function 
        element.UpdateVideoTime(element);
    });

    element.addEventListener("volumechange", async () => {
        element.VideoVolumeChange();
    });
}

function checkIframeOrigin(event, source) {
    console.log("the iframe origin is " + event.origin)
    switch (event.origin) {
        case "https://www.tsunamiflow.club":
        case "https://tsunamiflow.club":
            doIframeThing(event, source);
            break;
        case "https://world.tsunamiflow.club":

            break;
        case "https://m.stripe.com":

            break;
        default:
            console.log(event.origin);
            break;
    };
};

export async function DoTheThingMan(source) {
    console.log("starting the main page navigation system.");
    console.log("checking the iframe source");

    console.log("creating and using the add event listener");
    switch (source.src) {
        case "homepage.html":
        case "https://tsunamiflow.club/homepage.html":
        case "https://www.tsunamiflow.club/homepage.html":
            console.log("The iframe is from the homepage");
            window.addEventListener("message", async (event) => {
                checkIframeOrigin(event, source);
            });
            break;
        case "roster.html":
        case "https://tsunamiflow.club/roster.html":
        case "https://www.tsunamiflow.club/roster.html":
            console.log("The iframe is from the roster page");
            window.addEventListener("message", async (event) => {
                checkIframeOrigin(event, source);
            });
            break;
        case "news.html":
        case "https://tsunamiflow.club/news.html":
        case "https://www.tsunamiflow.club/news.html":
            console.log("The iframe is from the news page");
            window.addEventListener("message", async (event) => {
                checkIframeOrigin(event, source);
            });
            break;
        case "Competitions.html":
        case "https://tsunamiflow.club/Competitions.html":
        case "https://www.tsunamiflow.club/Competitions.html":
            console.log("The iframe is from the competitions page");
            window.addEventListener("message", async (event) => {
                checkIframeOrigin(event, source);
            });
            break;
        case "TFnetwork.html":
        case "https://tsunamiflow.club/TFnetwork.html":
        case "https://www.tsunamiflow.club/TFnetwork.html":
            console.log("The iframe is from the Tsunami Flow Network");
            window.addEventListener("message", async (event) => {
                checkIframeOrigin(event, source);
            });
            break;
        case "Community.html":
        case "https://tsunamiflow.club/Community.html":
        case "https://www.tsunamiflow.club/Community.html":
            console.log("The iframe is from the community page");
            window.addEventListener("message", async (event) => {
                checkIframeOrigin(event, source);
            });
            break;
        default:
            console.log(`Some outside source is trying to send my homepage a message. the origin is ${source.origin}`);
            break;
    }
};

// Fetch current cart items from server.php
export async function fetchCart() {
    try {
        const res = await fetch('https://www.tsunamiflow.club/Server/server.php?cart_action=view', {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data.items || [];
    } catch (err) {
        console.error('Error fetching cart:', err);
        return [];
    }
}

// Update subtotal and grand total
export function updateTotals() {
    let grandTotal = 0;
    document.querySelectorAll('.cartForm').forEach(form => {
        const variantSelect = form.querySelector('.variantSelect');
        const quantityInput = form.querySelector('.quantityInput');
        const itemSubtotalEl = form.querySelector('.itemSubtotal');

        const variant = variantSelect?.selectedOptions[0];
        const price = parseFloat(variant?.dataset.price || 0);
        const quantity = parseInt(quantityInput?.value || 1);

        const subtotal = price * quantity;

        if (itemSubtotalEl) itemSubtotalEl.textContent = subtotal.toFixed(2);
        form.dataset.price = subtotal.toFixed(2);

        grandTotal += subtotal;
    });

    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = grandTotal.toFixed(2);
}
// Game Mechanics
/* 
Air Division 
1.)
2.)
3.)
4.) Barn Owl
5.) Golden Eagle
Water Division
1.)
2.)
3.)
4.)
5.)
Land Division
1.)
2.)
3.)
4.)
5.)
*/