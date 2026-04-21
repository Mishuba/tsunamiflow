/*
|--------------------------------------------------------------------------
| Task Worker (Orchestrator Layer)
|--------------------------------------------------------------------------
| Responsibilities:
|
| 1. Route compute tasks → dedicated workers
| 2. Route system/backend tasks → SharedWorker
| 3. Normalize all messages using Tycadome
| 4. Return unified responses to Main Thread
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Worker Pool (Compute Layer)
|--------------------------------------------------------------------------
*/

const workers = {
    input: new Worker("./JS/TFN/T/Worker/WebWorker/kid/GameInputWebWorker.js", { type: "module" }),
    media: new Worker("./JS/TFN/T/Worker/WebWorker/kid/MediaWebWorker.js", { type: "module" }),
    world: new Worker("./JS/TFN/T/Worker/WebWorker/kid/GameWorldWebWorker.js", { type: "module" }),
    ai: new Worker("./JS/TFN/T/Worker/WebWorker/kid/AiWebWorker.js", { type: "module" })
};

/*
|--------------------------------------------------------------------------
| Shared Worker Bridge (Backend Layer)
|--------------------------------------------------------------------------
| This is your system bus (WebSocket, API, DB sync, etc)
|--------------------------------------------------------------------------
*/

const sharedWorker = new SharedWorker("./JS/TFN/T/Worker/Shared.js", {
    type: "module"
});

sharedWorker.port.start();

/*
|--------------------------------------------------------------------------
| Packet Standard
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Handle Compute Worker Responses
|--------------------------------------------------------------------------
*/

Object.entries(workers).forEach(([name, worker]) => {
    worker.onmessage = (e) => {
        postMessage(
            tycadome(
                e.data.id || crypto.randomUUID(),
                e.data.type || name,
                e.data.action || "completed",
                {
                    source: name,
                    layer: "compute",
                    worker: ""
                },
                {
                    status: "completed",
                    priority: "low"

                },
                "async",
                e.data.payload || e.data
            )
        );
    };

    worker.onerror = (err) => {
        postMessage(
            tycadome(
                crypto.randomUUID(),
                name,
                "worker.error",
                {
                    message: err.message
                },
                {
                    status: "failed",
                    priority: "low",
                },
                "async",
                {}
            )
        );
    };
});

/*
|--------------------------------------------------------------------------
| Handle SharedWorker (Backend Responses)
|--------------------------------------------------------------------------
*/

sharedWorker.port.onmessage = (e) => {
    postMessage(
        tycadome(
            e.data.id || crypto.randomUUID(),
            e.data.type || "backend",
            e.data.action || "completed",
            {
                source: "shared.worker",
                layer: "backend",
                worker: "shared"
            },
            {
                status: e.data.state || "completed",
                priority: "low"
            },
            "async",
            e.data.payload || e.data
        )
    );
};

/*
|--------------------------------------------------------------------------
| MAIN ROUTER (Brain of system)
|--------------------------------------------------------------------------
*/

onmessage = (e) => {
    const task = e.data;

    const target = task.meta?.worker;

    /*
    ----------------------------------------------------------------------
    1. BACKEND / SYSTEM TASKS → SharedWorker
    ----------------------------------------------------------------------
    */

    if (task.meta?.backend === true || task.type === "backend") {
        sharedWorker.port.postMessage(
            tycadome(
                task.id,
                task.type,
                task.action,
                task.meta,
                {
                    status: "processing",
                    priority: "low"
                },
                task.mode || "async",
                task.payload || {}
            )
        );
        return;
    }

    /*
    ----------------------------------------------------------------------
    2. COMPUTE TASKS → Dedicated Workers
    ----------------------------------------------------------------------
    */

    if (!target || !workers[target]) {
        postMessage(
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

    workers[target].postMessage(
        tycadome(
            task.id,
            task.type,
            task.action,
            task.meta,
            {
                status: "processing",
                priority: "low"
            },
            task.mode || "async",
            task.payload || {}
        )
    );
};