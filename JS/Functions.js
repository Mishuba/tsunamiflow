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

function checkIframeOrigin(event, source) {
    console.log("the iframe origin is " + event.origin);
    switch (event.origin) {
        case "homepage.php":
        case "https://tsunamiflowclub/homepage.php":
        case "https://www.tsunamiflowclub/homepage.php":
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
                source.contentWindow.postMessage(HomePageJson, "https://www.tsunamiflow.club/homepage.php");
            } else {

            }
            console.log("the end of that");
            break;
        case "roster.php":
        case "https://tsunamiflowclub/roster.php":
        case "https://www.tsunamiflowclub/roster.php":
            console.log("The iframe is from the roster page");
            let RosterJson = {
                type: "roster",
                info: "idk roster",
                message: "this is the roster message",
                username: "Mishuba",
                error: "ok no errors for the roster right now"
            };
            source.contentWindow.postMessage(RosterJson, "https://www.tsunamiflow.club/roster.php");
            break;
        case "news.php":
        case "https://tsunamiflowclub/news.php":
        case "https://www.tsunamiflowclub/news.php":
            console.log("The iframe is from the news page");
            let NewsJson = {
                type: "live",
                info: "live stream",
                message: "this is the live stream message",
                username: "Mishuba",
                error: "ok no errors for community right now"
            }
            source.contentWindow.postMessage(NewsJson, "https://www.tsunamiflow.club/news.php");
            break;
        case "Competitions.php":
        case "https://tsunamiflowclub/Competitions.php":
        case "https://www.tsunamiflowclub/Competitions.php":
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

                source.contentWindow.postMessage(CompetitionJson, "https://www.tsunamiflow.club/Competitions.php");
            } else if (ev.data.type === "game") {
                CompetitionJson = {
                    type: "game",
                    info: FirstGame.toJSON(),
                    message: "this will be the first game message i send from outside of the game for some reason and to the game maybe",
                    username: "Mishuba",
                    error: "No errors as of now."
                };

                source.contentWindow.postMessage(CompetitionJson, "https://www.tsunamiflow.club/Competitions.php");
            } else {

            }
            break;
        case "TFnetwork.php":
        case "https://tsunamiflow.club/TFnetwork.php":
        case "https://www.tsunamiflow.club/TFnetwork.php":
            console.log("The iframe is from the TFnetwork page");
            let TfNetworkJson = {
                type: "network",
                info: "idk network",
                message: "this is the network message",
                username: "Mishuba",
                error: "ok no errors for network right now"
            };
            source.contentWindow.postMessage(TfNetworkJson, "https://www.tsunamiflow.club/TFnetwork.php");
            break;
        case "Community.php":
        case "https://tsunamiflow.club/Community.php":
        case "https://www.tsunamiflow.club/Community.php":
            console.log("iframe commmunity message received");
            let CommunityJson = {
                type: "community",
                info: "idk community",
                message: "this is the community message",
                username: "Mishuba",
                error: "ok no errors for community right now"
            };

            source.contentWindow.postMessage(CommunityJson, "https://www.tsunamiflow.club/Community.php");
            break;
        default:
            console.log("The iframe is from the default page");

            break;
    };
}
export async function DoTheThingMan(source) {
    console.log("starting the main page navigation system.");
    console.log("checking the iframe source");

    console.log("creating and using the add event listener");
    switch (source.src) {
        case "homepage.php":
        case "https://tsunamiflow.club/homepage.php":
        case "https://www.tsunamiflow.club/homepage.php":
            console.log("The iframe is from the homepage");
            window.addEventListener("message", async (event) => {
                checkIframeOrigin(event, source);
            });
            break;
        case "roster.php":
        case "https://tsunamiflow.club/roster.php":
        case "https://www.tsunamiflow.club/roster.php":
            console.log("The iframe is from the roster page");
            window.addEventListener("message", async (event) => {
                checkIframeOrigin(event, source);
            });
            break;
        case "news.php":
        case "https://tsunamiflow.club/news.php":
        case "https://www.tsunamiflow.club/news.php":
            console.log("The iframe is from the news page");
            window.addEventListener("message", async (event) => {
                checkIframeOrigin(event, source);
            });
            break;
        case "Competitions.php":
        case "https://tsunamiflow.club/Competitions.php":
        case "https://www.tsunamiflow.club/Competitions.php":
            console.log("The iframe is from the competitions page");
            window.addEventListener("message", async (event) => {
                checkIframeOrigin(event, source);
            });
            break;
        case "TFnetwork.php":
        case "https://tsunamiflow.club/TFnetwork.php":
        case "https://www.tsunamiflow.club/TFnetwork.php":
            console.log("The iframe is from the Tsunami Flow Network");
            window.addEventListener("message", async (event) => {
                checkIframeOrigin(event, source);
            });
            break;
        case "Community.php":
        case "https://tsunamiflow.club/Community.php":
        case "https://www.tsunamiflow.club/Community.php":
            console.log("The iframe is from the community page");
            window.addEventListener("message", async (event) => {
                checkIframeOrigin(event, source);
            });
            break;
        default:
            console.log(`Some outside source is trying to send my homepage a message. the origin is ${source.src}`);
            break;
    }
};
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