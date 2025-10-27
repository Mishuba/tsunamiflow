<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set("session.cookie_secure", true);
ini_set("session.cookie_httponly", true);

// WebSocket endpoint fallback
$wsURL = getenv('Ec2Websocket') ?: 'wss://world.tsunamiflow.club:8443';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Mishuba Live Control</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body {
    background: #0a0a0a;
    color: #00ffe1;
    font-family: monospace;
    text-align: center;
    padding: 20px;
}
button, select {
    background: #00ffe1;
    border: none;
    color: #0a0a0a;
    font-weight: bold;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    margin: 5px;
}
video {
    border-radius: 12px;
    max-width: 100%;
    margin-top: 10px;
}
</style>
</head>
<body>

<h2>Mishuba Live Control</h2>
<select id="playlist"></select><br>
<button id="play">▶️ Play</button>
<button id="stop">⏹ Stop</button>
<button id="startStream">🔴 Start Stream</button>
<button id="stopStream">⚫ Stop Stream</button>
<video id="preview" autoplay muted playsinline></video>

<script type="module">
import { DefaultPlaylist } from "./JS/Arrays.js";

const playlist = document.getElementById("playlist");
const playBtn = document.getElementById("play");
const stopBtn = document.getElementById("stop");
const startStreamBtn = document.getElementById("startStream");
const stopStreamBtn = document.getElementById("stopStream");
const preview = document.getElementById("preview");

// ========== LOAD PLAYLIST ==========
DefaultPlaylist.forEach(path => {
    const option = document.createElement("option");
    const parts = path.split("/");
    option.value = path;
    option.textContent = parts[parts.length - 1]; // Display filename only
    playlist.appendChild(option);
});

// ========== AUDIO ELEMENTS ==========
const music = new Audio();
music.crossOrigin = "anonymous";
let fx = null;

// Audio Context + nodes
let audioCtx;
let fxGain;
let mixedStream;
let mediaRecorder;
let ws;

// Prevent reusing MediaElementSource on same element
const connected = new WeakSet();

function createMixedStream() {
    audioCtx = new AudioContext();
    fxGain = audioCtx.createGain();
    fxGain.gain.value = 0.8;
    const dest = audioCtx.createMediaStreamDestination();

    const link = (el) => {
        if (!connected.has(el)) {
            const src = audioCtx.createMediaElementSource(el);
            src.connect(fxGain).connect(dest);
            connected.add(el);
        }
    };

    link(music);
    if (fx) link(fx);

    return dest.stream;
}

// ========== BUTTON EVENTS ==========
playBtn.onclick = () => {
    const src = playlist.value;
    if (!src) return;
    music.src = src;
    music.play();
};

stopBtn.onclick = () => {
    music.pause();
    music.currentTime = 0;
};

// ========== STREAMING ==========
const WS_URL = "<?php echo $wsURL; ?>";

startStreamBtn.onclick = async () => {
    try {
        const key = prompt("Enter your stream key:");
        if (!key) return alert("Stream key required.");

        ws = new WebSocket(`${WS_URL}?key=${encodeURIComponent(key)}`);

        ws.onopen = async () => {
            console.log("✅ WebSocket connected to Mishuba stream server.");

            mixedStream = createMixedStream();

            const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });

            const combinedStream = new MediaStream([
                ...mixedStream.getTracks(),
                ...micStream.getTracks(),
                ...videoStream.getTracks()
            ]);

            preview.srcObject = combinedStream;

            mediaRecorder = new MediaRecorder(combinedStream, {
                mimeType: "video/webm;codecs=vp8,opus"
            });

            mediaRecorder.ondataavailable = e => {
                if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
                    ws.send(e.data);
                }
            };

            mediaRecorder.start(1000);
            console.log("🎙️ Stream started.");
        };

        ws.onclose = e => {
            console.log(`⚠️ Stream stopped. Code: ${e.code} Reason: ${e.reason}`);
            stopStreaming();
        };

        ws.onerror = err => {
            console.error("❌ WebSocket error:", err);
            stopStreaming();
        };

    } catch (err) {
        console.error("❌ Error starting stream:", err);
        alert("Failed to start stream. Check permissions or WebSocket connection.");
    }
};

stopStreamBtn.onclick = () => stopStreaming();

function stopStreaming() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        console.log("🛑 MediaRecorder stopped.");
    }
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
        console.log("🔒 WebSocket closed.");
    }
    if (preview.srcObject) {
        preview.srcObject.getTracks().forEach(track => track.stop());
        preview.srcObject = null;
    }
}
</script>

</body>
</html>