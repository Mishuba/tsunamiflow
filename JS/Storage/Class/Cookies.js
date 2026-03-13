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

/*use this information as a user device fingerprint 
    the browser version
    the timezone and preferred language
    the set of video or audio codecs that are available on the system
    the fonts installed on the system
    the state of the browser's settings
    the computer's display size and resolution
use this as part of the guest cookie settings.
*/

export class NamiCookies {
    constructor() {
        if (navigator.cookieEnabled) {
            this.cookies = true;
            console.log("Cookies are enabled");
            this.TFcookie = document.cookie;
            this.guest = this.TFcookie.split(';').map(cookie => cookie.split('=')).reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {});
        } else {
            this.cookies = false;
            console.log("Cookies are not enabled");
            this.TFcookie = null;
            this.guest = null;
        }
    }
    //cookies should be used for
    // Session Management
    // logins, shopping carts, game scores, or anthing the server should remember.

    // Personalization
    // User Preference, themes, and other settings.

    //Tracking
    //Recording and analyzing user behavior
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
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