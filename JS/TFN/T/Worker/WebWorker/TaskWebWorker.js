console.log("Task Worker:" + import.meta.url);

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
// let tfTaskWorker = new TaskWorker({workers: workers});
//tfTaskWorker.workers

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

Object.entries(workers/*tfTaskWorker.workers*/).forEach(([name, worker]) => {
    worker.onmessage = (e) => {
        /* tfTaskWorker.OnWorkerMessage(e); */
        self.postMessage(
            tycadome(
                e.data.id || crypto.randomUUID(),
                e.data.type || name,
                e.data.action || "completed",
                {
                    source: name,
                    layer: "compute",
                    worker: worker
                },
                {
                    status: "pending",
                    priority: "low"
                },
                "async",
                e.data.payload || e.data
            )
        );
    };

    worker.onerror = (err) => {
        self.postMessage(
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

onmessage = (e) => {
    /* tfTaskWorker.OnMessage(e); */
    const task = e.data;
    const target = task.meta?.worker;

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