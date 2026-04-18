import { TsharedWorker } from "./../Class/Elder/Adult/Teen/Child/Base/F.js";

const ports = [];

const core = new TsharedWorker({
    role: "viewer"
});

/*
|--------------------------------------------------------------------------
| Packet Builder
|--------------------------------------------------------------------------
*/

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
| Broadcast helper
|--------------------------------------------------------------------------
*/

function broadcast(data) {
    ports.forEach((port) => port.postMessage(data));
}

/*
|--------------------------------------------------------------------------
| WebSocket → broadcast to all tabs
|--------------------------------------------------------------------------
*/

core.setMessageHandler((data) => {
    broadcast(
        tycadome(
            crypto.randomUUID(),
            "backend",
            "ws.message",
            { source: "shared.worker" },
            "completed",
            "async",
            data
        )
    );
});

/*
|--------------------------------------------------------------------------
| Shared Worker connection
|--------------------------------------------------------------------------
*/

onconnect = (e) => {
    const port = e.ports[0];

    ports.push(port);
    port.start();

    /*
    ----------------------------------------------------------
    ONLY accepts already-routed backend tasks
    ----------------------------------------------------------
    */

    port.onmessage = (event) => {
        const task = event.data;

        handleBackendTask(task, port);
    };

    port.postMessage(
        tycadome(
            crypto.randomUUID(),
            "system",
            "shared.ready",
            {},
            "ready",
            "async",
            {}
        )
    );
};

/*
|--------------------------------------------------------------------------
| Backend execution layer ONLY
|--------------------------------------------------------------------------
*/

function handleBackendTask(task, port) {
    if (!task?.action) return;

    switch (task.action) {

        /*
        ------------------------------------------------------
        WebSocket Control (already decided by Task Worker)
        ------------------------------------------------------
        */

        case "ws.connect":
            core.connectws();
            break;

        case "ws.disconnect":
            core.disconnectws();
            break;

        case "ws.send.json":
            core.sendwsJSON(task.payload);
            break;

        case "ws.send.binary":
            core.sendBinaryws(task.payload);
            break;

        /*
        ------------------------------------------------------
        API / XML Requests
        ------------------------------------------------------
        */

        case "api.xml.request":
            core.requestXml(
                task.meta?.method || "GET",
                task.meta?.url,
                task.payload,
                task.meta?.headers || {}
            );
            break;

        /*
        ------------------------------------------------------
        Backend unknown task
        ------------------------------------------------------
        */

        default:
            port.postMessage(
                tycadome(
                    task.id || crypto.randomUUID(),
                    "system",
                    "backend.error",
                    {
                        reason: "Unsupported backend action"
                    },
                    "failed",
                    "async",
                    task
                )
            );
    }
}