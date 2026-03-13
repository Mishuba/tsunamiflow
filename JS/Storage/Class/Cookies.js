// NOTES ON THE STORAGE BUCKET
/*
Web content's origin is defined by the scheme (protocol aka http or https), hostname (domain), and port of the URL used to access it. Two objects have the same origin only when the scheme, hostname, and port all match.
    #Some operations are restricted to same-origin content, and this restriction can be lifted using CORS.

Attempting to store more than an origin's quota using IndexedDB, Cache, or OPFS, for example, fails with a QuotaExceededError exception.
    Web developers should wrap JavaScript that writes to browser storage within try...catch blocks. Freeing up space by deleting data before storing new data is also recommended.

Data eviction is the process by which a browser deletes an origin's stored data.
    When the device is running low on storage space, also known as storage pressure.
    When all of the data stored in the browser (across all origins) exceeds the total amount of space the browser is willing to use on the device.
    Proactively, for origins that aren't used regularly, which happens only in Safari.

Storage pressure eviction
    When a device is running low on storage space, also known as storage pressure, there may come a point when the browser has less available space than it needs to store all of the origin's stored data.
    Browsers use a Least Recently Used (LRU) policy to deal with this scenario. The data from the least recently used origin is deleted. If storage pressure continues, the browser moves on to the second least recently used origin, and so on, until the problem is resolved.
    This eviction mechanism only applies to origins that are not persistent and skips over origins that have been granted data persistence by using navigator.storage.persist().

Fingerprinting is a practice in which websites identify a particular browser (and by extension, a particular user) by collecting and combining distinguishing features of the browser and underlying operating system. Elements of a fingerprint might include, for example:
    the browser version
    the timezone and preferred language
    the set of video or audio codecs that are available on the system
    the fonts installed on the system
    the state of the browser's settings
    the computer's display size and resolution
    A website can retrieve information like this by executing JavaScript and CSS on the device, and by combining this data can often create a unique fingerprint for a browser, which can then be used to track users across the web.

*/

// best-effort
/*

The user agent will try to retain the data contained in the bucket for as long as it can, but will not warn users if storage space runs low and it becomes necessary to clear the bucket in order to relieve the storage pressure.

*/
var TFStorageBucketTest;
// Changing an origin's storage bucket mode 
// navigator.storage.getDirectory(); do more research on this. 

try{
if (navigator.storage && navigator.storage.persist) {

    navigator.storage.persist().then((persistent) => {
        if (persistent) {
            console.log("Storage will not be cleared except by explicit user action.");
            // use sessionStorage for temporary stuff. 
        } else {
            console.log("Storage may be cleared by the UA under storage pressure.");
            // use localstorage for anything that doesnt need to be in the database and can be lost if needed.
        }
    });
} else {
    console.log("navigator.storage & navigator.storage.persist doesn't work.");
}
} catch{TFStorageBucketTest} (
    console.error()
)
// Use the navigator.storage.persisted() method to know whether an origin's storage is presistent or not.

try{
if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persisted().then((persistent) => {
        if (persistent) {
            console.log("Storage will not be cleared except by explicit user action");
            // use sessionStorage for temporary stuff. 
        } else {
            console.log("Storage may be cleared by the UA under storage pressure.");
            // use localstorage for anything that doesnt need to be in the database and can be lost if needed.
        }
    });
}
} catch{TFStorageBucketTest} (
    console.error()
)
// To determine the estimated quota and usage values for a given origin, use the navigator.storage.estimate() method, which returns a promise that when resolved, receives an object that contains the code below for example

try{
navigator.storage.estimate().then((estimate) => {
    console.log(estimate.quota) // estimate.quota is the estimated quota
    console.log(estimate.usage) // is the estimated number of bytes used
});
} catch{TFStorageBucketTest} (
    console.error()
    // navigator.storage.getDirectory(); do more research on this. 

)
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var Guest;
var TFsession = sessionStorage; // stays until the browser/window closes. only available in the same window.
var TFguest = document.cookie;
var TFguestCookie = TFguest.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }),{});
var TFstorage = localStorage; 
//session storage
function checkSessionStorage() {
if (typeof(Storage) !== "undefined") {
    if(TFguestCookie.username) {
        if (TFguestCookie.username == TFstorage.getItem("username")) {
            // delete cookie
        } else {
            TFstorage.setItem("username",TFguestCookie.username);
            // TFstorage.removeItem to delete the localStorage username
        }
        // ask if the user wants to log in.
    } else {
        if (TFsession.getItem("username")) {
            alert("You are currently logged in as a guest name:" + TFsession.getItem("username"));
        } else {
            var Guest = prompt("You are currently a guest who has never subscribed to the Tycadome. What do you want your temp password to be? (Once you have registered the username you created might not work.)");
            TFsession.setItem("username",Guest);
        }
    }
} else {
    console.log("You cannot use web storage");
}
}

//cookies should be used for 
    // Session Management
        // logins, shopping carts, game scores, or anthing the server should remember.

    // Personalization
        // User Preference, themes, and other settings. 

    //Tracking
        //Recording and analyzing user behavior

/*
//use this information as a user device fingerprint 
    the browser version
    the timezone and preferred language
    the set of video or audio codecs that are available on the system
    the fonts installed on the system
    the state of the browser's settings
    the computer's display size and resolution
use this as part of the guest cookie settings. 

After we figure out how to do it with the guest then we should create a (the list below) cookie for the users at the community level or subscriber level
    - andriod phone cookie
    - google phone cookie
    - iphone(apple) phone cookie
    - andriod laptop cookie
    - google chrome laptop cookie
    - macbook (mac laptop) cookie
    - linux (laptop) cookie (maybe)
    - desktop (andriod) cookie
    - desktop (apple/mac) cookie
    - desktop (linux) cookie

*/
checkSessionStorage();

console.log(TFguest);


