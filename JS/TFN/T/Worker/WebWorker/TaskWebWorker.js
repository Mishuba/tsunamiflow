import { TaskWorker } from "../../Class/Elder/Adult/Teen/taskwk.js";
console.log("Task Worker:" + import.meta.url);

let tfTaskWorker = new TaskWorker();


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