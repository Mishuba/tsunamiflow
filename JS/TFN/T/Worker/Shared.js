importScripts("F.js"); // or bundle it

const ports = [];
const core = new F({
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
        }
    };

    port.postMessage({ type: "ready" });
};