<?php require "config.php"; ?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mishuba Live Broadcaster</title>
</head>
<body>
    <h1>Mishuba Live Broadcaster</h1>

    <video id="preview" autoplay muted playsinline style="width:400px;height:auto;"></video><br>

    <input id="streamKey" placeholder="Enter Stream Key" />
    <button id="start">Start Broadcast</button>
    <button id="stop" disabled>Stop</button>
    <label><input type="checkbox" id="videoToggle" checked> Include Video</label>

    <script>
        const startBtn = document.getElementById("start");
        const stopBtn = document.getElementById("stop");
        const preview = document.getElementById("preview");
        const videoToggle = document.getElementById("videoToggle");

        let ws, recorder, stream;

        async function startBroadcast() {
            const key = document.getElementById("streamKey").value.trim();
            if (!key) return alert("Enter stream key");

            startBtn.disabled = true;

            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: videoToggle.checked
                });
            } catch (e) {
                alert("Camera/microphone access denied");
                startBtn.disabled = false;
                return;
            }

            preview.srcObject = stream;

            // Build WebSocket URL with stream key and role
            const role = videoToggle.checked ? "broadcaster" : "audio_only";
            ws = new WebSocket("<?php echo getenv('Ec2Websocket'); ?>?key=" + encodeURIComponent(key) + "&role=" + role);
            ws.binaryType = "arraybuffer";

            ws.onopen = () => {
                console.log("🌊 Connected to WebSocket server");

                // Determine MIME type
                let mime;
                if (videoToggle.checked) {
                    mime = "video/webm;codecs=vp8,opus";
                    if (!MediaRecorder.isTypeSupported(mime)) {
                        alert("Video WebM VP8/Opus not supported, switching to audio-only");
                        videoToggle.checked = false;
                        stopLocal();
                        startBroadcast(); // restart as audio-only
                        return;
                    }
                } else {
                    mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") 
                        ? "audio/webm;codecs=opus" 
                        : "audio/webm";
                }

                recorder = new MediaRecorder(stream, { mimeType: mime });

                recorder.ondataavailable = async (e) => {
                    if (e.data && e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
                        const buffer = await e.data.arrayBuffer();
                        ws.send(buffer);
                    }
                };

                recorder.onstart = () => {
                    stopBtn.disabled = false;
                    console.log("Streaming started");
                };

                recorder.start(videoToggle.checked ? 300 : 1000); // smaller chunks for video
            };

            ws.onclose = () => {
                console.log("WebSocket closed");
                stopLocal();
            };

            ws.onerror = (err) => console.error("WebSocket error", err);
        }

        function stopLocal() {
            stopBtn.disabled = true;
            startBtn.disabled = false;

            if (recorder && recorder.state !== "inactive") recorder.stop();
            if (stream) {
                stream.getTracks().forEach(t => t.stop());
                preview.srcObject = null;
                stream = null;
            }
            if (ws && ws.readyState === WebSocket.OPEN) ws.close();
            ws = null;
            console.log("Streaming stopped");
        }

        startBtn.onclick = startBroadcast;
        stopBtn.onclick = stopLocal;
    </script>
</body>
</html>