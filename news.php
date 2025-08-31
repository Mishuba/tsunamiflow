<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set("session.cookie_secure", true);
ini_set("session.cookie_httponly", "1");
ini_set("session.gc_maxlifetime", 3600);
ini_set("session.cookie_lifetime", 0);
ini_set("session.use_strict_mode", true);

session_start();

header("Access-Control-Allow-Origin: https://www.tsunamiflow.club https://world.tsunamiflow.club https://tsunamiflow.club");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With");
header("Content-Security-Policy: default-src 'self'; script-src 'self' https://www.tsunamiflow.club https://world.tsunamiflow.club https://tsunamiflow.club; style-src 'self' 'unsafe-inline'; connect-src 'self' wss://world.tsunamiflow.club wss://www.tsunamiflow.club; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' https://www.tsunamiflow.club https://world.tsunamiflow.club");

header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");

header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: no-referrer-when-downgrade");
header("Permissions-Policy: camera=(), microphone=(), geolocation=()");
header("Cross-Origin-Opener-Policy: same-origin");
header("Cross-Origin-Embedder-Policy: require-corp");
header("Cross-Origin-Resource-Policy: same-origin");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Chat</title>
    <style>
        body { font-family: Arial, sans-serif; }
        #chatBox { height: 300px; overflow-y: scroll; border: 1px solid black; margin-bottom: 10px; }
        #msg { width: 80%; }
    </style>
        <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
</head>
<body>
    <h1>Live Chat</h1>
        <video id="stream" controls autoplay>
            <!--type="application/x-mpegURL"-->
        </video>

    <h2>🎥 Live Chat</h2>
        <div id="chatBox"></div>
        <input id="msg" type="text" placeholder="Type a message...">
        <button id="LiveStreamChat"></button></button>>Send</button>

    <script crossorigin="anonymous">
        let videoSrc = "https://world.tsunamiflow.club/hls/anything.m3u8";
        let videoRemote = document.getElementById("stream");
        let chatBox = document.getElementById('chatBox');
        let input = document.getElementById('msg');
        let sendButton = document.getElementById("LiveStreamChat");

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(videoRemote);
    } else if (videoRemote.canPlayType('application/vnd.apple.mpegurl')) {
        videoRemote.src = videoSrc;
    }
        const socket = new WebSocket('wss://world.tsunamiflow.club/websocket');
        //(ws://world.tsunamiflow.club:8080)
        //(wss://world.tsunamiflow.club/wss)

        socket.onmessage = async function(event) {
            const data = JSON.parse(event.data);
            if(data["type"] === "welcome") {
                chatBox.innerHTML += `<div><strong>${data.service}:</strong> ${data.message}</div><br />`;
                chatBox.scrollTop = chatBox.scrollHeight;
            } else if (data["type"] === "chat") {
                chatBox.innerHTML += `<div><strong>${data.service}:</strong> ${data.message}</div><br />`;
                chatBox.scrollTop = chatBox.scrollHeight;
            } else {

            }
        };

        sendButton.addEventListener("click", async () => {
            input.value
            let newThing = {
                type: "chat",
                message: input.value,
                username: guest,
                error: "",
            } 
            socket.postMessage(JSON.stringify(newThing));
        });
    </script>
</body>
</html>
