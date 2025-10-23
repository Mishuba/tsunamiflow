<?php
// PHP section to safely output variables
session_start();
$guest = $_SESSION['username'] ?? 'Guest';
$videoSrc = "https://world.tsunamiflow.club/hls/anything.m3u8";
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
<script>
const chatBox = document.getElementById('chatBox');
const input = document.getElementById('msg');
const sendButton = document.getElementById("LiveStreamChat");
const guest = "<?php echo json_encode($_SESSION['username'] ?? 'Guest'); ?>";

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
// WEBSOCKET WITH AUTORECONNECT
// ------------------------
let socket;
let reconnectInterval = 2000;

function connectWebSocket() {
    socket = new WebSocket("<?php echo json_encode(EC2_WEB_SOCKET); ?>");

    socket.onopen = () => console.log("WebSocket connected!");
    socket.onclose = () => {
        console.log(`WebSocket disconnected. Reconnecting in ${reconnectInterval/1000}s...`);
        setTimeout(connectWebSocket, reconnectInterval);
    };
    socket.onerror = (err) => console.error("WebSocket error:", err);

    socket.onmessage = function(event) {
        try {
            const data = JSON.parse(event.data);
            if (data.type === "welcome") {
                chatBox.innerHTML += `<div><em>${data.message}</em></div>`;
            }
            if (data.type === "chat") {
                chatBox.innerHTML += `<div><strong>${data.username}:</strong> ${data.message}</div>`;
            }
            chatBox.scrollTop = chatBox.scrollHeight;
        } catch (e) {
            console.error("Invalid WebSocket message:", event.data);
        }
    };
}

// Connect immediately
connectWebSocket();

// ------------------------
// SEND MESSAGE
// ------------------------
function sendMessage() {
    const message = input.value.trim();
    if (!message || socket.readyState !== WebSocket.OPEN) return;
    const payload = { type: "chat", message: message, username: guest };
    socket.send(JSON.stringify(payload));
    input.value = "";
}

sendButton.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => { if(e.key === "Enter") sendMessage(); });
</script>
</body>
</html>