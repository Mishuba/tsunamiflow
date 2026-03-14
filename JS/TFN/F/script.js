//Get browser info
function getBrowserType() {
    const userAgent = navigator.userAgent;

    if (userAgent.indexOf("Chrome") > -1) {
        return "chrome";
    } else if (userAgent.indexOf("Firefox") > -1) {
        return "firefox";
    } else if (userAgent.indexOf("Safari") > -1) {
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

function loadBrowserSpecificScript() {
    const browser = getBrowserType();

    let script = document.createElement("script");
    switch (browser) {
        case "chrome":
            script.src = "JS/tfMain.js";
            break;
        case "firefox":
            script.src = "JS/tfMain.js";
            break;
        case "safari":
            script.src = "JS/tfMain.js";
            break;
        case "edge":
            script.src = "JS/tfMain.js";
            break;
        case "opera":
            script.src = "JS/tfMain.js";
            break;
        case "netscape":
            script.src = "JS/tfMain.js";
            break;
        default:
            script.src = "JS/tfMain.js";
            break;
    }

    document.head.appendChild(script);
}

// Call this function after the DOM is ready
loadBrowserSpecificScript();

