// Use a relative module specifier so the worker resolves correctly in production.
import { mediaWorker } from "./../../../Class/Elder/Adult/Teen/tfnation.js";

if (!mediaWorker) {
    throw new Error("mediaWorker import is undefined");
} else {
    let mediawk = new mediaWorker();
    console.log("Imported mediaWorker:", mediaWorker);
}

try {
    //mediawk.startTime();
    self.onmessage = (e) => {
        mediawk.MessageReceived(e);
    };

    self.onerror = (e) => {
        try {
            const err = e?.error || e;
            self.postMessage(mediawk.tycadome(
                "tycadome-guest" /*+ Date.now()*/,
                "error",
                "audio.worker.error",
                {
                    source: "web",
                    target: "device:web-001",
                    layer: "tf",
                    worker: "media"
                },
                {
                    status: "pending",
                    priority: "low"
                },
                "async",
                {
                    system: "Tf Schedule",
                    message: err?.message || String(err),
                    filename: err?.fileName || null,
                    lineno: err?.lineNumber || null,
                    colno: err?.columnNumber || null,
                    stack: err?.stack || null,
                    rawEvent: e
                }));

        } catch (postErr) {
            console.error("Worker onerror failed to post:", postErr);
            console.trace();
        }
        console.error("Worker error:", e);
        console.trace();
    };
} catch (error) {
    console.error("Error initializing mediaWorker:", error);
}

