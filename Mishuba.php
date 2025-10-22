<?php

?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mishuba Go Live</title>
</head>
<body>
    <h1>Go Live</h1>
    <video id="MishubaLive" autoplay muted playsinline></video>

    <button id="StartLiveButton">Start Live</button>
    <button id="StopLiveButton" disabled>Stop Live</button>

    <h2>Stream Info</h2>
    <form id="metaForm">
        <label>Title</label><br />
        <input name="title" id="title" placeholder="Stream Title" /><br />

        <label>Description</label><br />
        <textarea name="description" id="description" placeholder="Stream Description"></textarea><br />

        <button type="submit">Update Twitch Stream</button>
    </form>

    <script>
        const StartButton = document.getElementById("StartLiveButton");
        const StopButton = document.getElementById("StopLiveButton");
        const videoEl = document.getElementById("MishubaLive");

        let wss = null;
        let mediaRecorder = null;
        let localStream = null;

        StartButton.addEventListener("click", start);
        StopButton.addEventListener("click", stop);

        document.getElementById("metaForm").addEventListener("submit", async (event) => {
            event.preventDefault();
            const title = document.getElementById("title").value;
            const description = document.getElementById("description").value;
            try {
                console.log("Would send Twitch metadata:", { title, description });
                // Add your fetch() call here
            } catch (error) {
                console.error("Meta update error", error);
                alert("Failed to update Twitch metadata");
            }
        });

        function log(...args) {
            console.log("[MishubaLive]", ...args);
        }

        async function start() {
            StartButton.disabled = true;
            log("Requesting camera/mic...");
            try {
                localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                videoEl.srcObject = localStream;
                videoEl.play();
            } catch (error) {
                log("GetUserMedia error:", error);
                StartButton.disabled = false;
                return;
            }

            wss = new WebSocket("<?php echo getenv('Ec2Websocket'); ?>");
            wss.binaryType = "arraybuffer";

            wss.onopen = () => {
                log("WSS connected, starting MediaRecorder...");
                let mime = "video/webm;codecs=vp8,opus";
                if (!MediaRecorder.isTypeSupported(mime)) mime = "video/webm";

                try {
                    mediaRecorder = new MediaRecorder(localStream, { mimeType: mime });
                } catch (error) {
                    log("MediaRecorder error:", error);
                    alert("MediaRecorder not supported");
                    return;
                }

                mediaRecorder.ondataavailable = async (event) => {
                    if (event.data && event.data.size > 0 && wss.readyState === WebSocket.OPEN) {
                        const buffer = await event.data.arrayBuffer();
                        wss.send(buffer);
                    }
                };

                mediaRecorder.onstop = () => {
                    log("Recorder stopped");
                    if (wss.readyState === WebSocket.OPEN) {
                        wss.send(JSON.stringify({ event: "END" }));
                    }
                };

                mediaRecorder.start(1000);
                StopButton.disabled = false;
                log("Recording started");
            };

            wss.onmessage = (msg) => log("Server:", msg.data);
            wss.onclose = () => { log("WSS closed"); stop(); };
            wss.onerror = (err) => log("WSS error:", err);
        }

        function stop() {
            StopButton.disabled = true;
            StartButton.disabled = false;
            if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
            if (localStream) {
                localStream.getTracks().forEach(t => t.stop());
                videoEl.srcObject = null;
                localStream = null;
            }
            if (wss && wss.readyState === WebSocket.OPEN) wss.close();
            wss = null;
            log("Stopped live");
        }
    </script>
</body>
</html>