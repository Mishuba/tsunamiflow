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

//variables
let offscreencanvas = null;
let canvasctx = null;
const maxBeaconSize = 64 * 1024;

let baseRadius = 2;
const particles = [];

var songList = null;
var CurrentSong = null;

//boolean
let visualizerRunning = false;
let visualizerFrame = null;
let visualizerUsingTimeout = false;

var listeners = {};

//objects
let TfAudioVisualData = {
    dataArray: new Uint8Array(0),
    volume: 0,
    bass: 0,
    mid: 0,
    treble: 0,
    beat: false,
    timestamp: 0
};
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

    if (size > maxBeaconSize) {
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
function draw(p, features) {
    canvasctx.beginPath();

    canvasctx.arc(
        p.x,
        p.y,
        p.radius,
        0,
        Math.PI * 2,
        false
    );

    const bass = features.bass;
    const mid = features.mid;
    const treble = features.treble;

    canvasctx.fillStyle = p.color;

    canvasctx.shadowColor =
        p.color;

    canvasctx.shadowBlur =
        20 + features.volume * 30;

    canvasctx.fill();
}
function update(
    p,
    fftValue,
    volume,
    baseRadius,
    bass,
    mid,
    treble,
    beat
) {
    /*
     * FFT energy for this particle.
     */
    const fftEnergy =
        (fftValue / 255) * volume;

    /*
     * Global bass energy.
     *
     * Bass drives the overall particle expansion.
     */
    const bassEnergy =
        bass * 30;

    /*
     * Combine FFT energy and bass.
     */
    const energy =
        fftEnergy * 50 +
        bassEnergy;

    /*
     * Beat gives an additional impulse.
     */
    const beatEnergy =
        beat ? 25 : 0;

    /*
     * Particle radius.
     */
    p.radius =
        baseRadius +
        energy +
        beatEnergy;

    /*
     * Movement.
     */
    p.dx +=
        (Math.random() - 0.5) *
        energy *
        0.05;

    p.dy +=
        (Math.random() - 0.5) *
        energy *
        0.05;

    /*
     * Bass makes movement stronger.
     */
    p.dx +=
        (Math.random() - 0.5) *
        bass *
        0.5;

    p.dy +=
        (Math.random() - 0.5) *
        bass *
        0.5;

    /*
     * Damping.
     */
    p.dx *= 0.97;
    p.dy *= 0.97;

    /*
     * Position.
     */
    p.x += p.dx;
    p.y += p.dy;

    /*
     * Keep particles on screen.
     */
    if (p.x < 0) p.x = offscreencanvas.width;
    if (p.x > offscreencanvas.width) p.x = 0;

    if (p.y < 0) p.y = offscreencanvas.height;
    if (p.y > offscreencanvas.height) p.y = 0;
}

function tfParticles(x, y, dx, dy, radius, color) {
    return { x, y, dx, dy, radius, color };
}
function particle() {
    // Clear existing particles
    for (let i = 0; i <= 100; i++) {
        const x = Math.random() * offscreencanvas.width;
        const y = Math.random() * offscreencanvas.height;
        const dx = (Math.random() - 0.5) * 0.5;
        const dy = (Math.random() - 0.5) * 0.5;
        const radius = Math.random() * 0.5 + 0.2;
        const color = `rgba(${Math.floor(Math.random() * 256)}, ` +
            `${Math.floor(Math.random() * 256)}, ` +
            `${Math.floor(Math.random() * 256)}, 0.8)`;
        particles.push(tfParticles(x, y, dx, dy, radius, color));
    }
}
function RadioVisualizer(features) {
    const dataArray = features?.dataArray;

    if (
        !offscreencanvas ||
        !canvasctx ||
        !dataArray ||
        dataArray.length === 0
    ) {

        console.warn("⚠️ No audio data yet, skipping frame");
        return;
    }

    const volume = features.volume;
    const bass = features.bass;
    const mid = features.mid;
    const treble = features.treble;
    const beat = features.beat;

    canvasctx.fillStyle = "rgb(10, 10, 30)";
    canvasctx.fillRect(
        0,
        0,
        offscreencanvas.width,
        offscreencanvas.height
    );

    for (let i = 0; i < particles.length; i++) {
        const fftValue =
            dataArray[i % dataArray.length];

        update(
            particles[i],
            fftValue,
            volume,
            baseRadius,
            bass,
            mid,
            treble,
            beat
        );

        draw(particles[i], features);
    }

    const barWidth =
        offscreencanvas.width / dataArray.length;

    let CtxX = 0;

    for (let i = 0; i < dataArray.length; i++) {
        const fft = dataArray[i];

        const barHeight =
            fft * volume;

        const CtxR =
            Math.min(255, fft + 100);

        const CtxG =
            Math.min(255, i * 2);

        const CtxB = 255;

        canvasctx.fillStyle =
            `rgb(${CtxR}, ${CtxG}, ${CtxB})`;

        canvasctx.fillRect(
            CtxX,
            offscreencanvas.height - barHeight,
            Math.max(0, barWidth - 1),
            barHeight
        );

        CtxX += barWidth;
    }
}

function scheduleVisualizerFrame(callback) {
    // Try requestAnimationFrame first
    try {
        if (typeof requestAnimationFrame === "function") {
            visualizerUsingTimeout = false;
            return requestAnimationFrame(callback);
        }
    } catch (error) {
        if (error.name === "NotSupportedError") {
            console.warn("❌ requestAnimationFrame not supported, falling back to setTimeout");
        } else {
            console.error("Error in requestAnimationFrame:", error);
        }
    }

    // Fall back to setTimeout
    try {
        visualizerUsingTimeout = true;
        return setTimeout(callback, 16);
    } catch (error) {
        if (error.name === "NotSupportedError") {
            console.warn("❌ setTimeout not supported");
        } else {
            console.error("Error in setTimeout:", error);
        }
    }

    console.error("❌ No viable scheduling method available");
    return null;
}
function startVisualizerLoop(audioFeatures) {
    if (!offscreencanvas) {
        console.error("❌ No canvas available");
        return;
    }

    if (visualizerRunning) {
        return;
    }

    visualizerRunning = true;
    console.log("✅ Visualizer loop started");

    const vizloop = () => {
        if (!visualizerRunning) {
            return;
        }

        RadioVisualizer(audioFeatures || TfAudioVisualData);

        visualizerFrame = scheduleVisualizerFrame(vizloop);
    };

    vizloop();
}

function cancelVisualizerFrame(id) {
    if (id === null) {
        return;
    }

    if (visualizerUsingTimeout) {
        clearTimeout(id);
    } else {
        cancelAnimationFrame(id);
    }
}

function stopVisualizerLoop() {
    visualizerRunning = false;

    if (visualizerFrame !== null) {
        cancelVisualizerFrame(visualizerFrame);
        visualizerFrame = null;
    }
}

async function MessageReceived(event) {

    switch (event.data.type) {

        case "canvas":
            switch (event.data.action) {

                case "load.radio.canvas":
                    offscreencanvas = event.data.payload.canvas;
                    canvasctx =
                        offscreencanvas.getContext("2d");
                    particles.length = 0;
                    particle();
                    break;
                default:
                    break;
            }
            break;

        case "radio":
            if (songList === null) {
                try {
                    songList = await requestWorld(
                        "GET", "https://world.tsunamiflow.club/RadioPlaylist.php",
                        null,
                        { "X-Request-Type": "fetchRadioSongs" },
                        "fetch"
                    );
                    //RadioTime(songList);
                    //nextRadioItem = songList;
                } catch (e) {
                    songList = null;
                    console.error("JSON parse error:", e);
                    //RadioTime(songList);
                }
            }

            switch (event.data.action) {
                case "get.radio.file":
                    switch (event.data.payload.system) {
                        case "files":
                            CurrentSong = RadioTime(songList);
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
                                    file: CurrentSong,
                                    message: "the radio source is ''",
                                    buffer: "nothing should be buffering.",
                                })
                            );
                            break;
                        default:
                            break;
                    }
                    break;
                case "audio.paused":
                    stopVisualizerLoop();
                    break;

                case "audio.ended":
                    stopVisualizerLoop();
                    break;
                case "audio.play":

                    //startVisualizerLoop(TfAudioVisualData);
                    break;
                default:
                    //RadioTime(songList);
                    //TheLastSongUsed = CurrentSong;
                    break;
            }
            break;
        case "audio-worklet": {
            const payload = event.data.payload || {};

            if (event.data.action === "audio.visual.data") {
                if (payload.dataArray) {
                    TfAudioVisualData.dataArray =
                        payload.dataArray instanceof Uint8Array
                            ? payload.dataArray
                            : new Uint8Array(payload.dataArray);
                }

                TfAudioVisualData.volume = Number(payload.volume) || 0;
                TfAudioVisualData.bass = Number(payload.bass) || 0;
                TfAudioVisualData.mid = Number(payload.mid) || 0;
                TfAudioVisualData.treble = Number(payload.treble) || 0;
                TfAudioVisualData.beat = Boolean(payload.beat);
                TfAudioVisualData.timestamp = Date.now();

                if (!visualizerRunning) {
                    startVisualizerLoop(TfAudioVisualData);
                }
            }
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
    self.onmessage = (e) => {
        MessageReceived(e);
    };

    self.onerror = (e) => {
        try {
            const err = e?.error || e;
            self.postMessage(tycadome(
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

