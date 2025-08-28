<?php
header("Access-Control-Allow-Origin: https://www.tsunamiflow.club");
header("Content-Security-Policy: frame-ancestors 'self' https://www.tsunamiflow.club https://world.tsunamiflow.club");

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

    <script>
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
