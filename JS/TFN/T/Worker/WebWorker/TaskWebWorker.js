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
    input: new Worker("./kid/GameInputWebWorker.js", { type: "module" }),
    media: new Worker("./kid/MediaWebWorker.js", { type: "module" }),
    world: new Worker("./kid/GameWorldWebWorker.js", { type: "module" }),
    ai: new Worker("./kid/AiWebWorker.js", { type: "module" })
};

/*
|--------------------------------------------------------------------------
| Shared Worker Bridge (Backend Layer)
|--------------------------------------------------------------------------
| This is your system bus (WebSocket, API, DB sync, etc)
|--------------------------------------------------------------------------
*/



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