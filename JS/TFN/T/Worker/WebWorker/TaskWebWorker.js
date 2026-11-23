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

const workers = {
    image: new Worker(new URL("./kid/ImageWebWorker.js", import.meta.url), { type: "module" }),
    input: new Worker(new URL("./kid/GameInputWebWorker.js", import.meta.url), { type: "module" }),
    media: new Worker(new URL("./kid/MediaWebWorker.js", import.meta.url), { type: "module" }),
    world: new Worker(new URL("./kid/GameWorldWebWorker.js", import.meta.url), { type: "module" }),
    ai: new Worker(new URL("./kid/AiWebWorker.js", import.meta.url), { type: "module" }),
    video: new Worker(new URL("./kid/VideoWebWorker.js", import.meta.url), { type: "module" }),
};

Object.entries(workers).forEach(([name, worker]) => {
    if (!worker) {
        console.warn(`Child worker ${name} failed to start.`);
        return;
    }

    worker.onmessage = (e) => {
        const message = e.data;

        // Internal worker-to-worker communication
        const target = message?.meta?.worker;

        if (
            message?.meta?.internal === true &&
            target &&
            workers[target]
        ) {
            workers[target].postMessage(
                message,
                message.transfer || []
            );

            return;
        }

        // External response: send it to the main thread
        self.postMessage(
            tycadome(
                message.id || crypto.randomUUID(),
                message.type || name,
                message.action || "completed",
                {
                    source: name,
                    layer: "compute",
                    worker: name
                },
                message.state || {
                    status: "completed",
                    priority: "low"
                },
                message.mode || "async",
                message.payload ?? message
            )
        );
    };

    worker.onerror = (errEvent) => {
        self.postMessage(
            tycadome(
                crypto.randomUUID(),
                name,
                "worker.error",
                {
                    source: name,
                    message: errEvent?.message || errEvent?.type || null
                },
                {
                    status: "failed",
                    priority: "low"
                },
                "async",
                {
                    message: errEvent?.message || null,
                    filename: errEvent?.filename || null,
                    lineno: errEvent?.lineno || null,
                    colno: errEvent?.colno || null,
                    stack: errEvent?.error?.stack || null
                }
            )
        );
    };
});

onmessage = (e) => {
    const task = e.data;
    const target = task?.meta?.worker;

    if (!target) {
        self.postMessage(
            tycadome(
                task?.id || crypto.randomUUID(),
                "system",
                "routing.error",
                { reason: "Missing meta.worker" },
                { status: "failed", priority: "low" },
                "async",
                task
            )
        );
        return;
    }

    // Task Worker handles its own commands
    if (target === "task") {
        if (
            task.type === "timer" &&
            task.action === "scheduled.timer"
        ) {
            startTime();
        }

        return;
    }

    // Route to child workers
    if (!workers[target]) {
        self.postMessage(
            tycadome(
                task.id || crypto.randomUUID(),
                "system",
                "routing.error",
                {
                    reason: "Invalid worker target",
                    received: target
                },
                { status: "failed", priority: "low" },
                "async",
                task
            )
        );
        return;
    }

    workers[target].postMessage(
        task,
        task.transfer || []
    );
};