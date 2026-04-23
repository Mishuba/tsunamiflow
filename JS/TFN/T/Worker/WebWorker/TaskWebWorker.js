/*
|--------------------------------------------------------------------------
| Task Worker (Orchestrator Layer)
|--------------------------------------------------------------------------
| Responsibilities:
| 1. Route compute tasks → dedicated workers
| 2. Normalize all messages using Tycadome
| 3. Return unified responses to Main Thread
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Worker Pool (Compute Layer)
|--------------------------------------------------------------------------
*/

const workers = {
    input: new Worker(
        new URL("./kid/GameInputWebWorker.js", import.meta.url),
        { type: "module" }
    ),

    media: new Worker(
        new URL("./kid/MediaWebWorker.js", import.meta.url),
        { type: "module" }
    ),

    world: new Worker(
        new URL("./kid/GameWorldWebWorker.js", import.meta.url),
        { type: "module" }
    ),

    ai: new Worker(
        new URL("./kid/AiWebWorker.js", import.meta.url),
        { type: "module" }
    )
};

/*
|--------------------------------------------------------------------------
| Packet Standard (Tycadome)
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
| Worker Response Handler
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
                    priority: "low"
                },
                "async",
                {}
            )
        );
    };
});

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
    Validate routing target
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

    /*
    ----------------------------------------------------------------------
    Forward task to compute worker
    ----------------------------------------------------------------------
    */

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