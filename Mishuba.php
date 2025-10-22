<?php require "config.php"; ?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Mishuba Go Live</title>
</head>
<body>
  <h1>Mishuba Go Live</h1>

  <video id="preview" autoplay muted playsinline></video><br>
  <input id="streamKey" placeholder="Enter Stream Key" />
  <button id="start">Start Live</button>
  <button id="stop" disabled>Stop</button>

  <script>
    const startBtn = document.getElementById("start");
    const stopBtn = document.getElementById("stop");
    const preview = document.getElementById("preview");
    let ws, rec, stream;

    startBtn.onclick = async () => {
      const key = document.getElementById("streamKey").value.trim();
      if (!key) return alert("Enter stream key");

      startBtn.disabled = true;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      } catch (e) {
        alert("Camera/mic denied");
        startBtn.disabled = false;
        return;
      }

      preview.srcObject = stream;

      ws = new WebSocket("<?php echo(EC2_WEBSOCKET); ?>?key=" + encodeURIComponent(key));
      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        const mime = "video/webm;codecs=vp8,opus";
        rec = new MediaRecorder(stream, { mimeType: mime });
        rec.ondataavailable = async e => {
          if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            const buf = await e.data.arrayBuffer();
            ws.send(buf);
          }
        };
        rec.start(1000);
        stopBtn.disabled = false;
        console.log("Streaming started");
      };

      ws.onerror = e => console.error("WS error", e);
      ws.onclose = () => stop();
    };

    stopBtn.onclick = stop;

    function stop() {
      stopBtn.disabled = true;
      startBtn.disabled = false;
      if (rec && rec.state !== "inactive") rec.stop();
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
        preview.srcObject = null;
      }
      if (ws && ws.readyState === WebSocket.OPEN) ws.close();
      ws = null;
      console.log("Streaming stopped");
    }
  </script>
</body>
</html>