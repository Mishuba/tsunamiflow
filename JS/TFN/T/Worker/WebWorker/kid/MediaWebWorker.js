console.log("Media Worker:" + import.meta.url);

//variables
const maxBeaconSize = 64 * 1024;

var songList = null;

//boolean
var listeners = {};
let radioRandom = null;
let CurrentSong = null;
let rangeIndex = null;

class TsunamilowNation {
    offscreencanvas = null;
    canvasctx = null;
    canvastype = null;
    isoffscreenReady = false;
    baseRadius = 2;
    barWidth = null;
    barHeight = null;
    TfAudioVisualData = {
        dataArray: new Uint8Array(0),
        volume: 0,
        bass: 0,
        mid: 0,
        treble: 0,
        beat: false,
        timestamp: 0
    };
    fftEnergy = null;
    fftValue = null;
    energy = null;
    bassEnergy = null;
    beatEnergy = null;
    particles = [];
    visualizerUsingTimeout = null;
    visualizerRunning = false;
    visualizerFrame = null;
    constructor(options = {}) {
        if (options.offscreencanvas) {
            this.offscreencanvas = options.offscreencanvas;
        }
        if (options.canvastype) {
            this.initRadioOffscreen(options.canvastype);
        }
    }
    initRadioOffscreen(canvas, canvastype) {
        if (this.offscreencanvas !== null) {
            return;
        } else {
            try {
                this.offscreencanvas = canvas;
                this.canvasctx = this.offscreencanvas.getContext(canvastype);
                if (!this.canvasctx) throw new Error(`${canvastype} context not supported`);
                this.isoffscreenReady = true;
                console.log(`OffscreenCanvas initialized with ${canvastype} context`);
            } catch (err) {
                console.error("OffscreenCanvas init failed:", err);
                this.canvasctx = null;
            }
        }
    }
    draw(p) {
        this.canvasctx.beginPath();

        this.canvasctx.arc(
            p.x,
            p.y,
            p.radius,
            0,
            Math.PI * 2,
            false
        );

        this.canvasctx.fillStyle = p.color;

        this.canvasctx.shadowColor =
            p.color;

        this.canvasctx.shadowBlur =
            20 + this.volume * 30;

        this.canvasctx.fill();
    }
    tfParticles(x, y, dx, dy, radius, color) {
        return { x, y, dx, dy, radius, color };
    }
    particle() {
        // Clear existing particles
        for (let i = 0; i <= 100; i++) {
            const x = Math.random() * this.offscreencanvas.width;
            const y = Math.random() * this.offscreencanvas.height;
            const dx = (Math.random() - 0.5) * 0.5;
            const dy = (Math.random() - 0.5) * 0.5;
            const radius = Math.random() * 0.5 + 0.2;
            const color = `rgba(${Math.floor(Math.random() * 256)}, ` +
                `${Math.floor(Math.random() * 256)}, ` +
                `${Math.floor(Math.random() * 256)}, 0.8)`;
            this.particles.push(this.tfParticles(x, y, dx, dy, radius, color));
        }
    }
    update(
        p,
    ) {
        this.fftEnergy =
            (this.fftValue / 255) * this.TfAudioVisualData.volume;

        this.bassEnergy =
            this.TfAudioVisualData.bass * 30;

        this.energy =
            this.fftEnergy * 50 +
            this.bassEnergy;

        this.beatEnergy =
            this.TfAudioVisualData.beat ? 25 : 0;

        /*
         * Particle radius.
         */
        p.radius =
            this.baseRadius +
            this.energy +
            this.beatEnergy;

        /*
         * Movement.
         */
        p.dx +=
            (Math.random() - 0.5) *
            this.energy *
            0.05;

        p.dy +=
            (Math.random() - 0.5) *
            this.energy *
            0.05;

        /*
         * Bass makes movement stronger.
         */
        p.dx +=
            (Math.random() - 0.5) *
            this.TfAudioVisualData.bass *
            0.5;

        p.dy +=
            (Math.random() - 0.5) *
            this.TfAudioVisualData.bass *
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
        if (p.x < 0) p.x = this.offscreencanvas.width;
        if (p.x > this.offscreencanvas.width) p.x = 0;

        if (p.y < 0) p.y = this.offscreencanvas.height;
        if (p.y > this.offscreencanvas.height) p.y = 0;
    }
    scheduleVisualizerFrame(callback) {
        // Try requestAnimationFrame first
        try {
            if (typeof requestAnimationFrame === "function") {
                this.visualizerUsingTimeout = false;
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
            this.visualizerUsingTimeout = true;
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
    cancelVisualizerFrame(id) {
        if (id === null) {
            return;
        }

        if (this.visualizerUsingTimeout) {
            clearTimeout(id);
        } else {
            cancelAnimationFrame(id);
        }
    }
    RadioVisualizer() {
        if (
            !this.offscreencanvas ||
            !this.canvasctx ||
            !this.dataArray ||
            this.dataArray.length === 0
        ) {
            console.warn("⚠️ No audio data yet, skipping frame");
            return;
        }
        this.canvasctx.fillStyle = "rgb(239, 228, 14)";
        this.canvasctx.fillRect(
            0,
            0,
            this.offscreencanvas.width,
            this.offscreencanvas.height
        );

        for (let i = 0; i < this.particles.length; i++) {
            this.fftValue =
                this.dataArray[i % this.dataArray.length];

            this.update(this.particles[i]);

            this.draw(this.particles[i], features);
        }

        this.barWidth =
            this.offscreencanvas.width / this.dataArray.length;

        let CtxX = 0;

        for (let i = 0; i < this.dataArray.length; i++) {
            const fft = this.dataArray[i];

            this.barHeight =
                fft * this.volume;

            const CtxR =
                Math.min(255, fft + 100);

            const CtxG =
                Math.min(255, i * 2);

            const CtxB = 255;

            this.canvasctx.fillStyle =
                `rgb(${CtxR}, ${CtxG}, ${CtxB})`;

            this.canvasctx.fillRect(
                CtxX,
                this.offscreencanvas.height - this.barHeight,
                Math.max(0, this.barWidth - 1),
                this.barHeight
            );

            CtxX += this.barWidth;
        }
    }
    startVisualizerLoop() {
        if (!this.offscreencanvas) {
            console.error("❌ No canvas available");
            return;
        }

        if (this.visualizerRunning) {
            return;
        }

        this.visualizerRunning = true;
        console.log("✅ Visualizer loop started");

        const vizloop = () => {
            if (!this.visualizerRunning) {
                return;
            }

            this.RadioVisualizer();

            this.visualizerFrame = scheduleVisualizerFrame(vizloop);
        };

        vizloop();
    }
    stopVisualizerLoop() {
        visualizerRunning = false;

        if (visualizerFrame !== null) {
            cancelVisualizerFrame(visualizerFrame);
            visualizerFrame = null;
        }
    }
    tycadome(id, type, action, meta, state, mode, payload, transfer = []) {
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
}

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
                    self.postMessage(tycadome(
                        'tycadomeguest' + Date.now(),
                        'error',
                        'fetch.exception',
                        {
                            source: 'web',
                            target: 'device:web-001',
                            layer: 'tf',
                            worker: 'media',
                        },
                        {
                            status: 'failed',
                            priority: 'high'
                        },
                        'async',
                        {
                            type: "fetch",
                            status: response.status,
                            statusText: response.statusText,
                            url,
                            method,
                            body: data
                        }));

                    return null;
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

                            console.log("the radio xml responseType is " + xhr.responseType);

                            resolve(JSON.parse(xhr.responseText));
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

                xhr.onerror = (response) => {
                    self.postMessage(tycadome(
                        'tycadomeguest' + Date.now(),
                        'error',
                        'xml.exception',
                        {
                            source: 'web',
                            target: 'device:web-001',
                            layer: 'tf',
                            worker: 'media',
                        },
                        {
                            status: 'failed',
                            priority: 'high'
                        },
                        'async',
                        {
                            type: "xhr",
                            error: "Network Error",
                            status: xhr.status,
                            statusText: xhr.statusText,
                            url,
                            method,
                            body: data
                        }));

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
                    self.postMessage(tycadome(
                        'tycadomeguest' + Date.now(),
                        'error',
                        'binary.arraybuffer.exception',
                        {
                            source: 'web',
                            target: 'device:web-001',
                            layer: 'tf',
                            worker: 'media',
                        },
                        {
                            status: 'failed',
                            priority: 'high'
                        },
                        'async',
                        {
                            type: "binary.arraybuffer",
                            error: response,
                            status: response.status,
                            statusText: response.statusText,
                            url,
                            method,
                            body: data
                        }));

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
                self.postMessage(tycadome(
                    'tycadomeguest' + Date.now(),
                    'error',
                    'binary.arraybuffer.exception',
                    {
                        source: 'web',
                        target: 'device:web-001',
                        layer: 'tf',
                        worker: 'media',
                    },
                    {
                        status: 'failed',
                        priority: 'high'
                    },
                    'async',
                    {
                        type: "binary.arraybuffer",
                        error: err.message,
                        status: response.status,
                        statusText: response.statusText,
                        url,
                        method,
                        body: data
                    }));


                return null;
            }
        case "audio":

            return;
        default:
            self.postMessage(tycadome(
                'tycadomeguest' + Date.now(),
                'error',
                'binary.arraybuffer.exception',
                {
                    source: 'web',
                    target: 'device:web-001',
                    layer: 'tf',
                    worker: 'media',
                },
                {
                    status: 'failed',
                    priority: 'high'
                },
                'async',
                {
                    type: "transport",
                    error: `Unknown transport: ${transport}`
                }));


            console.error(`Unknown transport type: ${transport}`);
            return null;
    }
}

function NoSubFolder(PSL, tsu, response = null) {
    if (typeof PSL !== "undefined" && Array.isArray(PSL[tsu]) && PSL[tsu].length > 0) {
        if (PSL[tsu].length >= 20) {
            radioRandom = Math.floor(Math.random() * (PSL[tsu].length - 1));
            return CurrentSong = PSL[tsu][radioRandom];

        } else {
            radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
            return CurrentSong = PSL[11][radioRandom];


        }
    } else {

    }
}

function ThreeFolderSub(PSL, tsu, nami, response = null) {
    if (nami <= 19) {
        rangeIndex = 0;
    } else if (nami >= 20 && nami <= 39) {
        rangeIndex = 1;
    } else {
        rangeIndex = 2;
    }

    console.log(`Accessing PSL[${tsu}] with rangeIndex: ${rangeIndex}`);

    if (Array.isArray(PSL) && Array.isArray(PSL[tsu])) {
        if (PSL[tsu][rangeIndex] && PSL[tsu][rangeIndex].length > 7) {
            radioRandom = Math.floor(Math.random() * (PSL[tsu][rangeIndex].length - 1));
            return CurrentSong = PSL[tsu][rangeIndex][radioRandom];


        } else {
            console.log(`No valid data in PSL[${tsu}][${rangeIndex}], falling back to PSL[11]`);
            radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
            return CurrentSong = PSL[11][radioRandom];


        }
    } else {

    }
}

function FourFolderSub(PSL, tsu, nami, response = null) {
    if (nami <= 14) {
        rangeIndex = 0;
    } else if (nami >= 15 && nami <= 29) {
        rangeIndex = 1;
    } else if (nami >= 30 && nami <= 44) {
        rangeIndex = 2;
    } else {
        rangeIndex = 3;
    }

    console.log(`Accessing PSL[${tsu}] with rangeIndex: ${rangeIndex}`);

    if (Array.isArray(PSL) && Array.isArray(PSL[tsu])) {
        if (PSL[tsu][rangeIndex] && PSL[tsu][rangeIndex].length > 4) {
            radioRandom = Math.floor(Math.random() * (PSL[tsu][rangeIndex].length - 1));
            return CurrentSong = PSL[tsu][rangeIndex][radioRandom];


        } else {
            console.log(`No valid data in PSL[${tsu}][${rangeIndex}], falling back to PSL[11]`);
            radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
            return CurrentSong = PSL[11][radioRandom];


        }
    } else {

    }
}

function SixFolderSub(PSL, tsu, nami, response = null) {
    rangeIndex = Math.floor(nami / 10);

    console.log(`Accessing PSL[${tsu}] with rangeIndex: ${rangeIndex}`);

    if (Array.isArray(PSL) && Array.isArray(PSL[tsu])) {
        if (PSL[tsu][rangeIndex] && PSL[tsu][rangeIndex].length > 3) {
            radioRandom = Math.floor(Math.random() * (PSL[tsu][rangeIndex].length - 1));
            return CurrentSong = PSL[tsu][rangeIndex][radioRandom];


        } else {
            console.log(`No valid data in PSL[${tsu}][${rangeIndex}], falling back to PSL[11]`);
            radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
            return CurrentSong = PSL[11][rangeIndex][radioRandom];
        }
    } else {

    }
}

function RadioTime(PSL, response = null) {
    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();

    switch (hour) {
        case 0:
            return FourFolderSub(PSL, 0, minute, response);
            break;
        case 1:
            if (minute <= 4) {
                return NoSubFolder(PSL, 1, response);
            } else if (minute <= 14) {
                return ThreeFolderSub(PSL, 1, minute, response);
            } else if (minute <= 29) {
                return ThreeFolderSub(PSL, 1, minute, response);
            } else {
                return ThreeFolderSub(PSL, 1, minute, response);
            }
            break;
        case 2:
            return NoSubFolder(PSL, 2, response);
            break;
        case 3:
            return ThreeFolderSub(PSL, 3, minute, response);
            break;
        case 4:
            return ThreeFolderSub(PSL, 4, minute, response);
            break;
        case 5:
            return ThreeFolderSub(PSL, 5, minute, response);
            break;
        case 6:
            return ThreeFolderSub(PSL, 6, minute, response);
            break;
        case 7:
            return ThreeFolderSub(PSL, 7, minute, response);
            break;
        case 8:
            return SixFolderSub(PSL, 8, minute, response);
            break;
        case 9:
            return ThreeFolderSub(PSL, 9, minute, response);
            break;
        case 10:
            return NoSubFolder(PSL, 10, response);
            break;
        case 11:
            return CurrentSong = PSL[11][
                Math.floor(Math.random() * (PSL[11].length - 1))
            ];

            break;
        case 12:
            return FourFolderSub(PSL, 12, minute, response);
            break;
        case 13:
            return FourFolderSub(PSL, 13, minute, response);
            break;
        case 14:
            return FourFolderSub(PSL, 14, minute, response);
            break;
        case 15:
            return FourFolderSub(PSL, 15, minute, response);
            break;
        case 16:
            return FourFolderSub(PSL, 16, minute, response);
            break;
        case 17:
            return NoSubFolder(PSL, 17, response);
            break;
        case 18:
            return SixFolderSub(PSL, 18, minute, response);
            break;
        case 19:
            return FourFolderSub(PSL, 19, minute, response);
            break;
        case 20:
            return FourFolderSub(PSL, 20, minute, response);
            break;
        case 21:
            return NoSubFolder(PSL, 21, response);
            break;
        case 22:
            return NoSubFolder(PSL, 22, response);
            break;
        case 23:
            return NoSubFolder(PSL, 23, response);
            break;
        default:
            return CurrentSong = PSL[11][
                Math.floor(Math.random() * (PSL[11].length - 1))
            ];
            break;
    }
}

const TsunamiRadio = new TsunamilowNation();

async function MessageReceived(event) {
    console.log(`audio worker received ${event.data.type} data type.`);
    switch (event.data.type) {
        case "canvas":
            console.log(`the canvas sent to the audio worker has an data action to ${event.data.action}`);
            switch (event.data.action) {
                case "load.radio.canvas":
                    console.log(`this ${event.data.payload.canvas} should be an offscreencanvas`);
                    console.log(`attempting to create a 2d canvas context in the audio worker `);
                    TsunamiRadio.initRadioOffscreen(event.data.payload.canvas, "2d");
                    console.log(`success now doing particles.`);
                    TsunamiRadio.particles.length = 0;
                    //TsunamiRadio.particle();
                    break;
                default:
                    console.log(`the event data action was something i did not expect ${event.data.action}`);
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
                        "xml"
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
                            let tfrSong = RadioTime(songList);
                            console.log(tfrSong);
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
                                    file: tfrSong,
                                    message: "the radio source is ''",
                                    buffer: "nothing should be buffering.",
                                })
                            );
                            break;
                        default:
                            console.log(`the event data action was something i did not expect ${event.data.action}`);
                            break;
                    }
                    break;
                case "audio.paused":
                    TsunamiRadio.stopVisualizerLoop();
                    break;

                case "audio.ended":
                    TsunamiRadio.stopVisualizerLoop();
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
        case "audio.worklet": {
            const payload = event.data.payload || {};
            console.log("the audio worklet payload is " + payload);

            if (event.data.action === "audio.visual.data") {
                if (payload.dataArray) {
                    TsunamiRadio.TfAudioVisualData.dataArray =
                        payload.dataArray instanceof Uint8Array
                            ? payload.dataArray
                            : new Uint8Array(payload.dataArray);
                }

                TsunamiRadio.TfAudioVisualData.volume = Number(payload.volume) || 1;
                TsunamiRadio.TfAudioVisualData.bass = Number(payload.bass) || 0;
                TsunamiRadio.TfAudioVisualData.mid = Number(payload.mid) || 0;
                TsunamiRadio.TfAudioVisualData.treble = Number(payload.treble) || 0;
                TsunamiRadio.TfAudioVisualData.beat = Boolean(payload.beat);
                TsunamiRadio.TfAudioVisualData.timestamp = Date.now();

                if (!TsunamiRadio.visualizerRunning) {
                    TsunamiRadio.startVisualizerLoop();
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
                    console.log(`the event data action was something i did not expect ${event.data.action}`);
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
                    console.log(`the event data action was something i did not expect ${event.data.action}`);
                    break;
            }
            break;

        case "game":

            break;

        default:
            console.log(`the event data type was something i did not expect ${event.data.type}`);
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

