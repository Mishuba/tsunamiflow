<?php
require "config.php";
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>TsunamiFlow Stream</title>
</head>
<body>
<video id="preview" autoplay muted></video>

<script>
const wsUrl = "<? EC2_WEBSOCKET ?>";
const ws = new WebSocket(wsUrl);

// Set binary type to send raw blobs
ws.binaryType = "arraybuffer";

ws.onopen = () => {
    console.log("🌊 Connected to WebSocket server");
};

ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    console.log("Received:", data);
};

// Capture webcam + microphone
async function startStream() {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById("preview").srcObject = mediaStream;

    // Use MediaRecorder to send WebM chunks
    const recorder = new MediaRecorder(mediaStream, { mimeType: "video/webm; codecs=vp8,opus" });

    recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
            event.data.arrayBuffer().then(buffer => {
                ws.send(buffer);
            });
        }
    };

    recorder.start(200); // 200ms chunks for low latency
}

startStream();
</script>
</body>
</html>