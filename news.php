<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Secure session
ini_set("session.cookie_secure", 1);
ini_set("session.cookie_httponly", 1);
ini_set("session.use_strict_mode", 1);
ini_set("session.gc_maxlifetime", 3600);
ini_set("session.cookie_lifetime", 0);

// Load config
require "config.php";
session_start();

// -------------------------
// CORS
// -------------------------
$allowedOrigins = [
    'https://www.tsunamiflow.club',
    'https://world.tsunamiflow.club',
    'https://tsunamiflow.club'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With");

// -------------------------
// SECURITY HEADERS
// -------------------------
header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: no-referrer-when-downgrade");
header("Permissions-Policy: camera=(), microphone=(), geolocation=()");
header("Cross-Origin-Opener-Policy: same-origin");
header("Cross-Origin-Embedder-Policy: require-corp");
header("Cross-Origin-Resource-Policy: same-origin");

// -------------------------
// Content Security Policy
// -------------------------
//header("Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://www.tsunamiflow.club https://world.tsunamiflow.club https://tsunamiflow.club; style-src 'self' 'unsafe-inline'; connect-src 'self' wss://world.tsunamiflow.club https://world.tsunamiflow.club https://www.tsunamiflow.club https://tsunamiflow.club; img-src 'self' data:; media-src https://world.tsunamiflow.club; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' https://www.tsunamiflow.club https://world.tsunamiflow.club");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Chat</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        #chatBox { height: 300px; overflow-y: scroll; border: 1px solid black; padding: 10px; margin-bottom: 10px; }
        #msg { width: 80%; padding: 5px; }
        #LiveStreamChat { padding: 5px 10px; }
        video { width: 100%; max-width: 800px; margin-bottom: 20px; }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
</head>
<body>
    <h1>🎥 Live Chat</h1>

    <!-- VIDEO STREAM -->
    <video id="stream" controls autoplay></video>

    <!-- CHAT -->
    <h2>💬 Live Chat</h2>
    <div id="chatBox"></div>
    <input id="msg" type="text" placeholder="Type a message...">
    <button id="LiveStreamChat">Send</button>

    <script data-cfasync>
        // ------------------------
        // VIDEO STREAM SETUP
        // ------------------------
        const videoSrc = "https://world.tsunamiflow.club/hls/anything.m3u8";
        const videoEl = document.getElementById("stream");

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoSrc);
            hls.attachMedia(videoEl);
            hls.on(Hls.Events.ERROR, (event, data) => console.error("HLS error:", data));
        } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
            videoEl.src = videoSrc;
        } else {
            console.error("HLS not supported in this browser.");
        }

        // ------------------------
        // CHAT SETUP
        // ------------------------
        const chatBox = document.getElementById('chatBox');
        const input = document.getElementById('msg');
        const sendButton = document.getElementById("LiveStreamChat");
        const guest = "Guest";

        // WebSocket connection
        const socket = new WebSocket("<?php echo EC2_WEB_SOCKET; ?>");

        socket.onopen = () => console.log("WebSocket connected!");
        socket.onclose = () => console.log("WebSocket disconnected.");
        socket.onerror = (err) => console.error("WebSocket error:", err);

        // Receive messages
        socket.onmessage = function(event) {
            try {
                const data = JSON.parse(event.data);
                if(data.type === "welcome" || data.type === "chat") {
                    chatBox.innerHTML += `<div><strong>${data.service}:</strong> ${data.message}</div>`;
                    chatBox.scrollTop = chatBox.scrollHeight;
                }
            } catch(e) {
                console.error("Invalid WebSocket message:", event.data);
            }
        };

        // Send messages
        sendButton.addEventListener("click", () => {
            const message = input.value.trim();
            if(!message) return;
            const payload = {
                type: "chat",
                message: message,
                username: guest,
                error: ""
            };
            socket.send(JSON.stringify(payload));
            input.value = "";
        });

        // Send on Enter key
        input.addEventListener("keydown", (e) => {
            if(e.key === "Enter") sendButton.click();
        });
    </script>
</body>
</html>