//import { TaskWorker } from "../../Class/Elder/Adult/Teen/taskwk.js";
console.log("Task Worker:" + import.meta.url);

var TimerLoop = null;
var TimerTrigger = new Set();
const now = new Date();

const hour = now.getHours();
const minute = now.getMinutes();

const key = `${hour}:${minute}`;

if (minute % 5 === 0 && !TimerTrigger.has(key)) {
    TimerTrigger.add(key);

    // trigger
}

function tycadome(id, type, action, meta, state, mode, payload, transfer = []) {
    let tf = {
        "id": id, //options.id
        "type": type, //command
        "action": action, // video.start
        "meta": meta, // {}
        "timestamp": Math.floor(Date.now() / 1000),
        "state": state, // {}
        "mode": mode, //"async"
        "payload": payload // {},
    };

    // Attach transferables only if valid
    const safeTransfer = [];

    if (Array.isArray(transfer) && transfer.length > 0) {
        for (const item of transfer) {
            if (
                item instanceof ArrayBuffer ||
                item instanceof MessagePort ||
                item instanceof ImageBitmap ||
                item instanceof OffscreenCanvas ||
                item instanceof AudioData ||
                item instanceof VideoFrame
            ) {
                safeTransfer.push(item);
            }
        }
    }

    tf.transfer = safeTransfer;

    return tf;
}
function safeStringify(obj) {
    try {
        return JSON.stringify(obj);
    } catch (e) {
        try {
            return String(obj);
        } catch (e2) {
            return null;
        }
    }
}
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

async function startTime() {
    let TheTimeIGuess = new Promise((resolve) => {
        let currentTime = new Date();
        let TsunamiTimes = currentTime.toTimeString().slice(0, 5);// "HH:MM";

        if (TimerLoop === null) {
            TimerLoop = setInterval(() => {
                currentTime = new Date();
                TsunamiTimes = currentTime.toTimeString().slice(0, 5);
            }, 1000);
        } else {
            TsunamiTimes = currentTime.toTimeString().slice(0, 5);
        }
        resolve(TsunamiTimes);
    });

    let TheRealTime = await TheTimeIGuess;

    if (TimerTimes.includes(TheRealTime) && !TimerTrigger.has(TheRealTime)) {
        TimerTrigger.add(TheRealTime);
        console.log(`Triggering event for ${TheRealTime}`);


        let tf = tycadome(
            "tycadome-guest" /*+ Date.now()*/,
            "timer",
            "scheduled.timer",
            {
                source: "web",
                target: "device:web-001",
                layer: "tf",
                worker: "task",
                backend: false
            },
            {
                status: "pending",
                priority: "low"
            },
            "async",
            {
                system: "Tf Schedule",
                time: TheRealTime,
            });
        self.postMessage(tf);
    } else {
        let tf = tycadome(
            "tycadome-guest" /*+ Date.now()*/,
            "timer",
            "scheduled.timer",
            {
                source: "web",
                target: "device:web-001",
                layer: "tf",
                worker: "task",
                backend: false
            },
            {
                status: "pending",
                priority: "low"
            },
            "async",
            {
                system: "Tf Schedule",
                time: TheRealTime,
            });
        self.postMessage(tf);
    }

    if (TheRealTime === "23:59") {
        TimerTrigger.clear();
    }
}
/*
const workers = {
    input: createChildWorker("./kid/GameInputWebWorker.js", "./JS/TFN/T/Worker/WebWorker/kid/GameInputWebWorker.js"),
    media: createChildWorker("./kid/MediaWebWorker.js", "./JS/TFN/T/Worker/WebWorker/kid/MediaWebWorker.js"),
    world: createChildWorker("./kid/GameWorldWebWorker.js", "./JS/TFN/T/Worker/WebWorker/kid/GameWorldWebWorker.js"),
    ai: createChildWorker("./kid/AiWebWorker.js", "./JS/TFN/T/Worker/WebWorker/kid/AiWebWorker.js")
};
*/
const workers = {
    input: new Worker("https://tsunamiflow.club/JS/TFN/T/Worker/WebWorker/kid/GameInputWebWorker.js"),
    media: new Worker("https://tsunamiflow.club/JS/TFN/T/Worker/WebWorker/kid/MediaWebWorker.js"),
    world: new Worker("https://tsunamiflow.club/JS/TFN/T/Worker/WebWorker/kid/GameWorldWebWorker.js"),
    ai: new Worker("https://tsunamiflow.club/JS/TFN/T/Worker/WebWorker/kid/AiWebWorker.js")
};

Object.entries(workers).forEach(([name, worker]) => {
    if (!worker) {
        console.warn(`Child worker ${name} failed to start and will be skipped.`);
        return;
    }

    worker.onmessage = (e) => {
        self.postMessage(
            tycadome(
                e.data.id || crypto.randomUUID(),
                e.data.type || name,
                e.data.action || "completed",
                {
                    source: name,
                    layer: "compute",
                    worker: name
                },
                {
                    status: "pending",
                    priority: "low"
                },
                "async",
                e.data.payload || e.data
            )
        );
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
                    rawEvent: safeStringify(errEvent)
                }
            )
        );
    };
});

onmessage = (e) => {
    const task = e.data;
    const target = task.meta?.worker;

    /*
    ----------------------------------------------------------------------
    Validate routing target
    ----------------------------------------------------------------------
    */

    if (!target || !workers[target]) {
        self.postMessage(
            tycadome(
                task.id || crypto.randomUUID(),
                "system",
                "routing.error",
                {
                    reason: "Invalid or missing meta.worker",
                    received: target
                },
                {
                    status: "failed",
                    priority: "low"
                },
                "async",
                task
            )
        );
        return;
    }

    /*
    ----------------------------------------------------------------------
    Forward task to compute worker
    ----------------------------------------------------------------------
    */

    switch (target) {
        case "task":
            if (task.type === "timer") {
                if (event.data.payload.system === "Tf Schedule") {
                    if (!TimerLoop) {
                        startTime();
                    }
                }
            }

            break;
        default:
            workers[target].postMessage(task, task.transfer || []);
            break;
    }
};