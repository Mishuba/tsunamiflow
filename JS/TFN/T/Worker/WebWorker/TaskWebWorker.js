const workers = {
    game: new Worker("./game.worker.js", { type: "module" }),
    audio: new Worker("./audio.worker.js", { type: "module" }),
    physics: new Worker("./physics.worker.js", { type: "module" }),
    ai: new Worker("./ai.worker.js", { type: "module" })
};


function tycadome(
    id,
    type,
    action,
    meta = {},
    state = "pending",
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
| Worker Responses
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
                    source: name
                },
                "completed",
                "async",
                e.data.payload || e.data
            )
        );
    };
});


/*
|--------------------------------------------------------------------------
| Main Router
|--------------------------------------------------------------------------
*/

onmessage = (e) => {
    const task = e.data;

    /*
    ----------------------------------------------------------------------
    Routing uses meta.worker
    ----------------------------------------------------------------------
    */

    const targetWorker = task.meta?.worker;

    if (!targetWorker || !workers[targetWorker]) {
        postMessage(
            tycadome(
                task.id || crypto.randomUUID(),
                "system",
                "routing.error",
                {
                    reason: "Invalid or missing meta.worker"
                },
                "failed",
                "async",
                task
            )
        );
        return;
    }

    /*
    ----------------------------------------------------------------------
    Forward task
    ----------------------------------------------------------------------
    */

    workers[targetWorker].postMessage(
        tycadome(
            task.id,
            task.type,
            task.action,
            task.meta,
            "processing",
            task.mode || "async",
            task.payload || {}
        )
    );
};