// Use a relative module specifier so the worker resolves correctly in production.
import { mediaWorker } from "./../../../Class/Elder/Adult/Teen/tfnation.js";

const mediawk = null;

console.log("Imported mediaWorker:", mediaWorker);

if (!mediaWorker) {
    throw new Error("mediaWorker import is undefined");
}

mediawk = new mediaWorker();

try {


    //mediawk.startTime();
    console.log("MediaWebWorker initialized successfully");

    self.onmessage = (e) => {
        mediawk.MessageReceived(e);
    }
    self.onerror = (e) => {
        console.error("Worker error:", e);
    }
} catch (error) {
    console.error("Error initializing mediaWorker:", error);
    try {
        self.postMessage({ type: "error", action: "worker.error", payload: { message: error.message, stack: error.stack || null, detail: error } });
    } catch (e) {
        console.error("Failed to post worker init error:", e);
    }
    self.onerror = (e) => {
        try {
            const err = e?.error || e;
            self.postMessage({ type: "error", action: "worker.error", payload: { message: err?.message || String(err), filename: err?.fileName || null, lineno: err?.lineNumber || null, colno: err?.columnNumber || null, stack: err?.stack || null, rawEvent: e } });
        } catch (postErr) {
            console.error("Worker onerror failed to post:", postErr);
            console.trace();
        }
        console.error("Worker error:", e);
        console.trace();
    };
}

