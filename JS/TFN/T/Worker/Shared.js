import { Flo } from "./../Class/Elder/Adult/Teen/OffscreenCanvas.js"; // or bundle it

const ports = [];
const core = new Flo({
    role: "viewer"
});

core.setMessageHandler((data) => {
    ports.forEach(p => p.postMessage({
        type: "ws_message",
        data
    }));
});

onconnect = (e) => {
    const port = e.ports[0];
    ports.push(port);

    port.start();

    port.onmessage = (event) => {
        const msg = event.data;

        switch (msg.type) {
            case "connect":
                core.connectws();
                break;

            case "disconnect":
                core.disconnectws();
                break;

            case "send":
                core.sendwsJSON(msg.data);
                break;

            case "binary":
                core.sendBinaryws(msg.data);
                break;
            case "xml":
                core.requestXml(msg.method, msg.method, msg.data, msg.headers);
        }
    };

    port.postMessage({ type: "ready" });
};