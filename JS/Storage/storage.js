export class TFStorage {
    constructor() {
        try {// Use the navigator.storage.persisted() method to know whether an origin's storage is presistent or not.
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
        } catch (TFStorageBucketTest) {
            console.error()
        }
    }
    estimates() {
        // To determine the estimated quota and usage values for a given origin, use the navigator.storage.estimate() method, which returns a promise that when resolved, receives an object that contains the code below for example
        try {
            navigator.storage.estimate().then((estimate) => {
                console.log(estimate.quota) // estimate.quota is the estimated quota
                console.log(estimate.usage) // is the estimated number of bytes used
            });
        } catch { TFStorageBucketTest } (
            console.error()
            // navigator.storage.getDirectory(); do more research on this. 

        )
    }
    // Changing an origin's storage bucket mode
    // navigator.storage.getDirectory(); do more research on this. 
    checkSessionStorage() {
        if (typeof (Storage) !== "undefined") {
            if (TFguestCookie.username) {
                if (TFguestCookie.username == TFstorage.getItem("username")) {
                    // delete cookie
                } else {
                    TFstorage.setItem("username", TFguestCookie.username);
                    // TFstorage.removeItem to delete the localStorage username
                }
                // ask if the user wants to log in.
            } else {
                if (TFsession.getItem("username")) {
                    alert("You are currently logged in as a guest name:" + TFsession.getItem("username"));
                } else {
                    var Guest = prompt("You are currently a guest who has never subscribed to the Tycadome. What do you want your temp password to be? (Once you have registered the username you created might not work.)");
                    TFsession.setItem("username", Guest);
                }
            }
        } else {
            console.log("You cannot use web storage");
        }
    }
}