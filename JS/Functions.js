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