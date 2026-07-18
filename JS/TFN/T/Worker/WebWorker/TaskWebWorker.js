import { TaskWorker } from "../../Class/Elder/Adult/Teen/taskwk.js";
console.log("Task Worker:" + import.meta.url);
function createChildWorker(modulePath, classicPath, shared = false) {
    try {
        if (shared === false) {
            let ihj = new Worker(
                new URL(modulePath, import.meta.url),
                { type: "module" }
            );
            console.log("worker " + new URL(modulePath, import.meta.url) + " created.");
            return ihj;
        } else {
            let ihj = new SharedWorker(
                new URL(modulePath, import.meta.url),
                { type: "module" }
            );
            console.log("worker " + new URL(modulePath, import.meta.url) + " created.");
            return ihj;
        }
    } catch (err) {
        console.warn("Module worker failed. Falling back:", err);
        if (shared === false) {
            return new Worker(classicPath);
        } else {
            return new SharedWorker(classicPath);
        }
    }
}

const workers = {
    input: createChildWorker("./kid/GameInputWebWorker.js", "./JS/TFN/T/Worker/WebWorker/kid/GameInputWebWorker.js"),
    media: createChildWorker("./kid/MediaWebWorker.js", "./JS/TFN/T/Worker/WebWorker/kid/MediaWebWorker.js"),
    world: createChildWorker("./kid/GameWorldWebWorker.js", "./JS/TFN/T/Worker/WebWorker/kid/GameWorldWebWorker.js"),
    ai: createChildWorker("./kid/AiWebWorker.js", "./JS/TFN/T/Worker/WebWorker/kid/AiWebWorker.js")
};
let tfTaskWorker = new TaskWorker({ workers });


function tycadome(
    id,
    type,
    action,
    meta = {},
    state = {},
    mode = "async",
    payload = {}
) {
    return {
        id,
        type,
        action,
        meta,
        timestamp: Math.floor(Date.now() / 1000),
        state,
        mode,
        payload
    };
}

Object.entries(tfTaskWorker.workers).forEach(([name, worker]) => {
    if (!worker) {
        console.warn(`Child worker ${name} failed to start and will be skipped.`);
        return;
    }

    worker.onmessage = (e) => {
        tfTaskWorker.OnWorkerMessage(e);
    }



    worker.onerror = (errEvent) => {
        // ErrorEvent from worker.onerror can vary across browsers; extract safely.
        const message = errEvent?.message || errEvent?.type || null;
        const filename = errEvent?.filename || errEvent?.fileName || null;
        const lineno = errEvent?.lineno || errEvent?.lineNumber || null;
        const colno = errEvent?.colno || errEvent?.columnNumber || null;
        const stack = errEvent?.error?.stack || errEvent?.stack || null;

        self.postMessage(
            tycadome(
                crypto.randomUUID(),
                name,
                "worker.error",
                {
                    source: name,
                    message: message
                },
                {
                    status: "failed",
                    priority: "low"
                },
                "async",
                {
                    message,
                    filename,
                    lineno,
                    colno,
                    stack,
                    rawEvent: tfTaskWorker.safeStringify(errEvent)
                }
            )
        );
    };
});

onmessage = (e) => {
    tfTaskWorker.OnMessage(e);
};