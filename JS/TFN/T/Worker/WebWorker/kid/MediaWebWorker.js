//import { mediaWorker } from "JS/TFN/T/Class/Elder/Adult/Teen/tfnation.js";

import { mediaWorker } from "./../../Class/Elder/Adult/Teen/tfnation.js";

let mediawk = null;

/*
|--------------------------------------------------------------------------
| Safe Worker Bootstrap
|--------------------------------------------------------------------------
| 1. Verify import worked
| 2. Create class instance safely
| 3. Return startup errors to orchestrator
|--------------------------------------------------------------------------
*/

try {
    console.log("Imported mediaWorker:", mediaWorker);

    if (!mediaWorker) {
        throw new Error("mediaWorker import is undefined");
    }

    mediawk = new mediaWorker();

self.onmessage = (e) => {
    mediawk.MessageReceived(e);
}

