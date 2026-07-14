/*
|--------------------------------------------------------------------------
| shared.worker.js
|--------------------------------------------------------------------------
| Backend System Bus (Execution Layer Only)
|
| Responsibilities:
| - WebSocket connection (single global instance)
| - Backend API / XML requests
| - Broadcasting to all connected tabs
| - Receiving pre-routed tasks from task.worker.js
|
| IMPORTANT:
| This worker does NOT decide logic.
| It ONLY executes instructions from Task Worker.
|--------------------------------------------------------------------------
*/

import { TsharedWorker } from "./../Class/Elder/Adult/Teen/Child/Base/F.js";

const ports = [];

function disconnectPort(port) {
    const index = ports.indexOf(port);
    if (index !== -1) {
        ports.splice(index, 1);
    }
}

self.onconnect = (event) => {
    const [port] = event.ports;
    if (!port) return;

    ports.push(port);

    port.onmessage = (e) => {
        try {
            handleBackendTask(e.data, port);
        } catch (err) {
            port.postMessage(
                tycadome(
                    crypto.randomUUID(),
                    "system",
                    "shared.error",
                    { reason: "port message handler failed", error: err?.message || String(err) },
                    "failed",
                    "async",
                    { message: err?.message || String(err), stack: err?.stack || null }
                )
            );
        }
    };

    port.onmessageerror = (err) => {
        port.postMessage(
            tycadome(
                crypto.randomUUID(),
                "system",
                "shared.error",
                { reason: "message error from port" },
                "failed",
                "async",
                { detail: err }
            )
        );
    };

    if (typeof port.start === "function") {
        port.start();
    }

    port.postMessage(
        tycadome(
            crypto.randomUUID(),
            "system",
            "shared.connected",
            { source: "shared.worker" },
            "completed",
            "async",
            { message: "shared worker connected" }
        )
    );
};

/*
|--------------------------------------------------------------------------
| Core Backend Controller
|--------------------------------------------------------------------------
*/

const core = new TsharedWorker({
    role: "viewer"
});

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
| Broadcast to all connected tabs
|--------------------------------------------------------------------------
*/

function broadcast(data) {
    ports.forEach((port) => {
        try {
            port.postMessage(data);
        } catch (err) {
            console.warn("Broadcast failed:", err);
        }
    });
}

/*
|--------------------------------------------------------------------------
| WebSocket → Global event fan-out
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
| SharedWorker Connection Handler
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Backend Execution Router
|--------------------------------------------------------------------------
| ONLY executes actions, no decision-making
|--------------------------------------------------------------------------
*/

function handleBackendTask(task, port) {
    if (!task?.action) {
        port.postMessage(
            tycadome(
                crypto.randomUUID(),
                "system",
                "backend.error",
                {
                    reason: "Missing action"
                },
                "failed",
                "async",
                task
            )
        );
        return;
    }

    switch (task.action) {

        /*
        ------------------------------------------------------
        WebSocket Control
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
        Unknown backend action
        ------------------------------------------------------
        */

        default:
            port.postMessage(
                tycadome(
                    task.id || crypto.randomUUID(),
                    "system",
                    "backend.error",
                    {
                        reason: "Unsupported backend action",
                        action: task.action
                    },
                    "failed",
                    "async",
                    task
                )
            );
    }
}