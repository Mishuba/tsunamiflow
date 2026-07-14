console.log("Task Worker:" + import.meta.url);

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

function createChildWorker(modulePath) {
    try {
        return new Worker(new URL(modulePath, import.meta.url), { type: "module" });
    } catch (err) {
        console.error(`Failed to create child worker ${modulePath}:`, err);
        return null;
    }
}

const workers = {
    input: createChildWorker("./kid/GameInputWebWorker.js"),
    media: createChildWorker("./kid/MediaWebWorker.js"),
    world: createChildWorker("./kid/GameWorldWebWorker.js"),
    ai: createChildWorker("./kid/AiWebWorker.js")
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

Object.entries(workers /*tfTaskWorker.workers*/).forEach(([name, worker]) => {
    if (!worker) {
        console.warn(`Child worker ${name} failed to start and will be skipped.`);
        return;
    }

    worker.onmessage = (e) => {
        /* tfTaskWorker.OnWorkerMessage(e); */
        const d = e.data || {};

        // If child worker posts an error-like message, forward as worker.error with details.
        if (d.type === "error" || d.action === "worker.error" || d.payload?.system === "error") {
            self.postMessage(
                tycadome(
                    d.id || crypto.randomUUID(),
                    name,
                    "worker.error",
                    {
                        source: name,
                        originalType: d.type || d.action || "error",
                        layer: "compute",
                        worker: name
                    },
                    {
                        status: "failed",
                        priority: "high"
                    },
                    "async",
                    {
                        message: d.message || d.payload?.message || null,
                        detail: d.payload || d,
                        raw: safeStringify(d)
                    }
                )
            );
            return;
        }

        self.postMessage(
            tycadome(
                d.id || crypto.randomUUID(),
                d.type || name,
                d.action || "completed",
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
                d.payload || d
            )
        );
    };

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
                task.payload || {}
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