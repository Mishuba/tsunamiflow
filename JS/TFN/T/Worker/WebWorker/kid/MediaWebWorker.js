// Use a relative module specifier so the worker resolves correctly in production.
//import { mediaWorker } from "https://tsunamiflow.club/JS/TFN/T/Class/Elder/Adult/Teen/tfnation.js";

console.log("Media Worker:" + import.meta.url);
/*
if (!mediaWorker) {
    throw new Error("mediaWorker import is undefined");
} else {
    let mediawk = new mediaWorker();
    console.log("Imported mediaWorker:", mediaWorker);
}
*/

var songList = null;
var CurrentSong = null;
var listeners = {};
function tycadome(id, type, action, meta, state, mode, payload, transfer = []) {
    let tf = {
        "id": id, //options.id
        "type": type, //command
        "action": action, // video.start
        "meta": meta, // {}
        "timestamp": Math.floor(Date.now() / 1000),
        "state": state, // {}
        "mode": mode, //"async"
        "payload": payload // {},
    };

    // Attach transferables only if valid
    const safeTransfer = [];

    if (Array.isArray(transfer) && transfer.length > 0) {
        for (const item of transfer) {
            if (
                item instanceof ArrayBuffer ||
                item instanceof MessagePort ||
                item instanceof ImageBitmap ||
                item instanceof OffscreenCanvas ||
                item instanceof AudioData ||
                item instanceof VideoFrame
            ) {
                safeTransfer.push(item);
            }
        }
    }

    tf.transfer = safeTransfer;

    return tf;
}
function getSize(payload) {
    if (typeof payload === "string") {
        return new TextEncoder().encode(payload).length;
    }
    if (payload instanceof Blob) {
        return payload.size;
    }
    return 0; // fallback (FormData/URLSearchParams not easily measurable)
}
function emit(event, data) {
    (listeners[event] || []).forEach((fn) => {
        try {
            fn(data);
        } catch (error) {
            console.error(`Error occurred while emitting event "${event}":`, error);
        }
    });
}
async function SendBeacon(url, data) {
    let payload = data;

    if (
        !(data instanceof Blob) &&
        !(data instanceof FormData) &&
        !(data instanceof URLSearchParams) &&
        typeof data !== "string"
    ) {
        payload = JSON.stringify(data);
    }

    const size = getSize(payload);

    if (size > this.maxBeaconSize) {
        emit("error", { url, data, reason: "Payload too large" });
        return false;
    }

    if ("sendBeacon" in navigator) {
        const accepted = navigator.sendBeacon(url, payload);

        emit(accepted ? "queued" : "rejected", { url, data, size });

        return accepted;
    }

    // 🔥 REAL fallback
    try {
        await fetch(url, {
            method: "POST",
            body: payload,
            keepalive: true,
            headers: { "Content-Type": "application/json" }
        });

        emit("queued", { url, data, size, fallback: true });
        return true;
    } catch (err) {
        emit("error", err);
        return false;
    }
}

async function requestWorld(method = "GET", url = "https://world.tsunamiflow.club/server.php", data = null, headers = {}, transport = "fetch") {
    switch (transport.toLowerCase()) {

        case "fetch":
            try {
                const options = {
                    method,
                    headers: { ...headers }
                };

                // Only attach body if needed
                if (
                    data !== null &&
                    method.toUpperCase() !== "GET" &&
                    method.toUpperCase() !== "HEAD"
                ) {
                    if (
                        typeof data === "object" &&
                        !(data instanceof FormData) &&
                        !(data instanceof Blob) &&
                        !(data instanceof URLSearchParams)
                    ) {
                        options.body = JSON.stringify(data);

                        if (!options.headers["Content-Type"]) {
                            options.headers["Content-Type"] = "application/json";
                        }
                    } else {
                        options.body = data;
                    }
                }

                const response = await fetch(url, options);

                if (!response.ok) {
                    emit("error", {
                        type: "fetch",
                        status: response.status,
                        statusText: response.statusText,
                        url
                    });

                    throw new Error(response.statusText);
                }

                const contentType = response.headers.get("content-type") || "";

                let result;

                if (contentType.includes("application/json")) {
                    result = await response.json();
                } else if (
                    contentType.includes("audio") ||
                    contentType.includes("video") ||
                    contentType.includes("application/octet-stream")
                ) {
                    result = await response.arrayBuffer();
                } else {
                    result = await response.text();
                }

                emit("success", {
                    type: "fetch",
                    url,
                    data: result
                });

                return result;

            } catch (error) {
                emit("error", {
                    type: "fetch",
                    url,
                    error: error.message
                });

                console.error("Fetch Error:", error);
                return null;
            }

        case "xml":
        case "xhr":
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.open(method, url, true);

                for (const [key, value] of Object.entries(headers)) {
                    xhr.setRequestHeader(key, value);
                }

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            emit("success", {
                                type: "xhr",
                                url,
                                data: xhr.responseText
                            });

                            resolve(xhr.responseText);
                        } else {
                            emit("error", {
                                type: "xhr",
                                status: xhr.status,
                                statusText: xhr.statusText,
                                url
                            });

                            reject(xhr.statusText);
                        }
                    }
                };

                xhr.onerror = () => {
                    emit("error", {
                        type: "xhr",
                        url,
                        error: "Network Error"
                    });

                    console.error("XHR Network Error");
                    reject("Network Error");
                };

                if (
                    data &&
                    typeof data === "object" &&
                    !(data instanceof FormData)
                ) {
                    xhr.send(JSON.stringify(data));
                } else {
                    xhr.send(data);
                }
            });

        case "beacon":
            return await SendBeacon(url, data);

        case "binary":
        case "arraybuffer":
            try {
                const response = await fetch(url, {
                    method,
                    headers
                });

                if (!response.ok) {
                    emit("error", {
                        type: "binary",
                        status: response.status,
                        url
                    });
                    return null;
                }

                const buffer = await response.arrayBuffer();

                emit("success", {
                    type: "binary",
                    url,
                    data: buffer
                });

                return buffer;

            } catch (err) {
                emit("error", {
                    type: "binary",
                    url,
                    error: err.message
                });

                return null;
            }
        case "audio":

            return;
        default:
            emit("error", {
                type: "transport",
                error: `Unknown transport: ${transport}`
            });

            console.error(`Unknown transport type: ${transport}`);
            return null;
    }
}

async function MessageReceived(event) {
    switch (event.data.type) {

        case "canvas":
            switch (event.data.action) {

                case "load.radio.canvas":
                    const offscreencanvas = event.data.payload.canvas;
                    break;
                default:
                    break;
            }
            break;

        case "radio":
            if (songList === null) {
                try {
                    songList = await this.requestWorld(
                        "GET", "https://world.tsunamiflow.club/RadioPlaylist.php",
                        null,
                        { "X-Request-Type": "fetchRadioSongs" },
                        "fetch"
                    );
                    //this.RadioTime(songList);
                    //this.nextRadioItem = songList;
                } catch (e) {
                    songList = null;
                    console.error("JSON parse error:", e);
                    //this.RadioTime(songList);
                }
            }

            switch (event.data.action) {
                case "get.radio.file":
                    this.visualizatorLoop = true;

                    switch (event.data.payload.system) {
                        case "files":
                            //CurrentSong = RadioTime(songList);
                            self.postMessage(tycadome(
                                "tycadome-guest" + Date.now(),
                                "radio",
                                "receive.radio.file",
                                {
                                    source: "web",
                                    target: "device:web-001",
                                    layer: "tf",
                                    worker: "media",
                                    backend: false
                                },
                                {
                                    status: "pending",
                                    priority: "low"
                                },
                                "async",
                                {
                                    system: "files",
                                    playlist: songList,
                                    file: "none",
                                    message: "the radio source is ''",
                                    buffer: "nothing should be buffering.",
                                })
                            );
                            break;

                        case "pcm":

                            break;
                        default:
                            break;
                    }
                    break;

                default:
                    //RadioTime(songList);
                    //TheLastSongUsed = CurrentSong;
                    break;
            }
        case "visualizator":

            switch (event.data.action) {
                case "update_visual_data":
                    this.dataArrayLength = event.data.payload.dataArrayLength;
                    this.volume = event.data.payload.volume;
                    break;

                case "start_visual_data":
                    this.visualizatorLoop = true;
                    this.dataArrayLength = event.data.payload.dataArrayLength;
                    this.baseRadius = event.data.payload.baseRadius;
                    this.particles = event.data.payload.particles;
                    this.volume = event.data.payload.volume;
                    this.startVisualizerLoop(this.dataArrayLength, this.baseRadius, this.particles, this.volume);
                    break;

                default:

                    break;
            }

        case "stream":

            switch (event.data.action) {
                case "audio array":
                    // console.log("Processing audio array:", event.data.audioArray);
                    break;
                default:
                    break;
            }
            break;

        case "downloads":

            break;

        case "calculations":

            switch (event.data.action) {
                case "fft":

                    break;
                case "RMS":

                    break;
                case "signaling":

                    break;
                case "Peak Detection":

                    break;
                default:
                    break;
            }
            break;

        case "processor":
            switch (event.data.action) {
                case "stereo":

                    break;

                case "amplitude":

                    break;
                case "volume peak Detection":
                    break;

                case "filtering":

                    break;
                case "Zero Crossing":

                    break;
                case "Pitch Detection":

                    break;
                case "decode":

                    break;
                case "encode":

                    break;
                default:

                    break;
            }
            break;

        case "game":

            break;

        default:

            break;
    }
}

try {
    //mediawk.startTime();
    self.onmessage = (e) => {
        MessageReceived(e);
    };

    self.onerror = (e) => {
        try {
            const err = e?.error || e;
            self.postMessage(mediawk.tycadome(
                "tycadome-guest" /*+ Date.now()*/,
                "error",
                "audio.worker.error",
                {
                    source: "web",
                    target: "device:web-001",
                    layer: "tf",
                    worker: "media"
                },
                {
                    status: "pending",
                    priority: "low"
                },
                "async",
                {
                    system: "Tf Schedule",
                    message: err?.message || String(err),
                    filename: err?.fileName || null,
                    lineno: err?.lineNumber || null,
                    colno: err?.columnNumber || null,
                    stack: err?.stack || null,
                    rawEvent: e
                }));

        } catch (postErr) {
            console.error("Worker onerror failed to post:", postErr);
            console.trace();
        }
        console.error("Worker error:", e);
        console.trace();
    };
} catch (error) {
    console.error("Error initializing mediaWorker:", error);
}

