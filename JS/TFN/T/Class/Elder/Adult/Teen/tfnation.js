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

    self.postMessage({
        id: crypto.randomUUID(),
        type: "worker",
        action: "media.ready",
        meta: {
            source: "media-worker",
            worker: "media",
            layer: "compute"
        },
        state: {
            status: "ready",
            priority: "low"
        },
        mode: "async",
        payload: {
            message: "Media worker initialized successfully"
        }
    });

} catch (error) {
    console.error("Media Worker Startup Error:", error);

    self.postMessage({
        id: crypto.randomUUID(),
        type: "startup.error",
        action: "media.init.failed",
        meta: {
            source: "media-worker",
            worker: "media",
            layer: "compute"
        },
        state: {
            status: "failed",
            priority: "high"
        },
        mode: "async",
        payload: {
            message: error.message,
            stack: error.stack
        }
    });
}


/*
|--------------------------------------------------------------------------
| Main Message Receiver
|--------------------------------------------------------------------------
| Receives normalized Tycadome packets
|--------------------------------------------------------------------------
*/

self.onmessage = async (event) => {
    if (!mediawk) {
        self.postMessage({
            id: crypto.randomUUID(),
            type: "runtime.error",
            action: "media.instance.missing",
            meta: {
                source: "media-worker",
                worker: "media",
                layer: "compute"
            },
            state: {
                status: "failed",
                priority: "high"
            },
            mode: "async",
            payload: {
                message: "mediaWorker instance was not created"
            }
        });

        return;
    }

    try {
        const data = event.data;

        if (!data) {
            throw new Error("Received empty worker message");
        }

        await mediawk.MessageReceived(data);

    } catch (error) {
        console.error("Media Worker Runtime Error:", error);

        self.postMessage({
            id: crypto.randomUUID(),
            type: "runtime.error",
            action: "media.execution.failed",
            meta: {
                source: "media-worker",
                worker: "media",
                layer: "compute"
            },
            state: {
                status: "failed",
                priority: "medium"
            },
            mode: "async",
            payload: {
                message: error.message,
                stack: error.stack
            }
        });
    }
};