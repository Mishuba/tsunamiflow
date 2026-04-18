import { TsharedWorker } from "./../Class/Elder/Adult/Teen/Child/Base/F.js";

const ports = [];

const core = new TsharedWorker({
    role: "viewer"
});


/*
|--------------------------------------------------------------------------
| Standard packet builder
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
| Broadcast incoming websocket events to all tabs
|--------------------------------------------------------------------------
*/

core.setMessageHandler((data) => {
    broadcast(
        tycadome(
            crypto.randomUUID(),
            "backend",
            "ws.message",
            {
                source: "shared.worker"
            },
            "completed",
            "async",
            data
        )
    );
});


/*
|--------------------------------------------------------------------------
| Shared Worker Connection
|--------------------------------------------------------------------------
*/

onconnect = (e) => {
    const port = e.ports[0];

    ports.push(port);
    port.start();

    port.onmessage = (event) => {
        const task = event.data;

        routeTask(task, port);
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
| Broadcast helper
|--------------------------------------------------------------------------
*/

function broadcast(data) {
    ports.forEach((port) => {
        port.postMessage(data);
    });
}


/*
|--------------------------------------------------------------------------
| Central task router
|--------------------------------------------------------------------------
*/

function routeTask(task, port) {
    switch (task.action) {
        /*
        --------------------------------------------------------------
        WebSocket connection control
        --------------------------------------------------------------
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
        --------------------------------------------------------------
        API / XML requests
        --------------------------------------------------------------
        */

        case "api.xml.request":
            core.requestXml(
                task.meta.method || "GET",
                task.meta.url,
                task.payload,
                task.meta.headers || {}
            );
            break;

        /*
        --------------------------------------------------------------
        Unknown action
        --------------------------------------------------------------
        */

        default:
            port.postMessage(
                tycadome(
                    task.id || crypto.randomUUID(),
                    "system",
                    "routing.error",
                    {
                        reason: "Unknown action"
                    },
                    "failed",
                    "async",
                    task
                )
            );
    }
}