<?php require "config.php"; ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Mishuba Live Broadcaster</title>
<style>
    body {
        font-family: sans-serif;
        background: #0c0c0c;
        color: #eee;
        text-align: center;
        padding: 20px;
    }
    video {
        border: 2px solid #444;
        border-radius: 10px;
        margin-bottom: 10px;
    }
    .controls {
        margin-top: 10px;
    }
    button, input[type="file"], select {
        margin: 5px;
        padding: 10px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
    }
    button:hover {
        opacity: 0.8;
    }
    .fx-buttons button {
        background: #1e1e1e;
        color: #0ff;
    }
</style>
</head>
<body>
    <h1>Mishuba Live Broadcaster</h1>

    <video id="preview" autoplay muted playsinline width="400" height="auto"></video><br>

    <div class="controls">
        <input id="streamKey" placeholder="Enter Stream Key" />
        <button id="start">Start Broadcast</button>
        <button id="stop" disabled>Stop</button>
        <label><input type="checkbox" id="videoToggle" checked> Include Video</label>
    </div>

    <hr style="margin:20px 0;">

    <!-- Music player -->
    <div>
        <h3>Music Player</h3>
        <audio id="music" controls></audio><br>
        <input type="file" id="fileInput" accept="audio/*" />
        <select id="playlist">
            <option value="">-- Select from Playlist --</option>
            <option value="/songs/track1.mp3">Track 1</option>
            <option value="/songs/track2.mp3">Track 2</option>
        </select>
    </div>

    <!-- FX Buttons -->
    <div class="fx-buttons">
        <h3>Sound Effects</h3>
        <button onclick="playEffect('clap')">👏 Crowd Clapping</button>
        <button onclick="playEffect('bomb')">💣 Bomb</button>
        <button onclick="playEffect('gun')">🔫 Gun Shots</button>
        <button onclick="playEffect('laugh')">😂 Crowd Laughing</button>
        <button onclick="playEffect('intro')">🎬 Intro</button>
        <button onclick="playEffect('hellnah')">😤 Hell Nah</button>
        <button onclick="playEffect('shock')">😱 Shocked</button>
        <button onclick="playEffect('wtf')">🤨 What the F***</button>
        <button onclick="playEffect('other')">🎵 Other</button>
    </div>

    <canvas id="visualizer" width="400" height="100" style="display:block;margin:20px auto;background:#111;"></canvas>

    <script type="module">
    import { TfMusic } from './audio.js'; // <--- Update path to your actual class file

    const startBtn = document.getElementById("start");
    const stopBtn = document.getElementById("stop");
    const preview = document.getElementById("preview");
    const videoToggle = document.getElementById("videoToggle");
    const music = document.getElementById("music");
    const playlist = document.getElementById("playlist");
    const fileInput = document.getElementById("fileInput");

    let ws, recorder, stream;
    let audioCtx, micGain, musicGain, fxGain;
    let tfMusic, tfAnalyser;

    // preload FX
    const sounds = {
        clap: new Audio("/fx/clap.mp3"),
        bomb: new Audio("/fx/bomb.mp3"),
        gun: new Audio("/fx/gun.mp3"),
        laugh: new Audio("/fx/laugh.mp3"),
        intro: new Audio("/fx/intro.mp3"),
        hellnah: new Audio("/fx/hellnah.mp3"),
        shock: new Audio("/fx/shock.mp3"),
        wtf: new Audio("/fx/wtf.mp3"),
        other: new Audio("/fx/other.mp3")
    };

    function playEffect(name) {
        const s = sounds[name];
        if (!s) return;
        s.currentTime = 0;
        s.play().catch(err => console.error("FX play error:", err));
    }

    async function createMixedStream() {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        tfAnalyser = audioCtx.createAnalyser();
        tfAnalyser.fftSize = 2048;
        tfAnalyser.smoothingTimeConstant = 0.6;

        const destNode = audioCtx.createMediaStreamDestination();
        micGain = audioCtx.createGain(); micGain.gain.value = 1.0;
        musicGain = audioCtx.createGain(); musicGain.gain.value = 0.8;
        fxGain = audioCtx.createGain(); fxGain.gain.value = 0.9;

        // mic
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const micSource = audioCtx.createMediaStreamSource(micStream);
        micSource.connect(micGain);
        micGain.connect(destNode);
        micGain.connect(tfAnalyser);

        // music
        const musicSource = audioCtx.createMediaElementSource(music);
        musicSource.connect(musicGain);
        musicGain.connect(destNode);
        musicGain.connect(tfAnalyser);
        musicGain.connect(audioCtx.destination);

        // fx
        for (const key in sounds) {
            const el = sounds[key];
            const fxSource = audioCtx.createMediaElementSource(el);
            fxSource.connect(fxGain);
            fxGain.connect(destNode);
            fxGain.connect(tfAnalyser);
            fxGain.connect(audioCtx.destination);
        }

        // TfMusic instance
        tfMusic = new TfMusic(
            music, null, null, null, null, null, null,
            document.getElementById("visualizer"),
            audioCtx, tfAnalyser, music
        );
        window.tfMusic = tfMusic;

        // start visualizer
        const canvas = document.getElementById("visualizer");
        if (tfMusic && canvas) {
            const bufferLength = tfAnalyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            tfMusic.Visualizer(canvas, tfAnalyser, dataArray, bufferLength, 50, 50, 1, 1, 10, "#00ffcc", 4, []);
        }

        return destNode.stream;
    }

    playlist.onchange = () => {
        if (playlist.value) {
            music.src = playlist.value;
            music.play();
        }
    };
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        music.src = URL.createObjectURL(file);
        music.play();
    };

    async function startBroadcast() {
        const key = document.getElementById("streamKey").value.trim();
        if (!key) return alert("Enter stream key");

        startBtn.disabled = true;

        try {
            const videoStream = videoToggle.checked 
                ? await navigator.mediaDevices.getUserMedia({ video: true })
                : null;

            const audioStream = await createMixedStream();
            const mixedTracks = [...audioStream.getTracks()];

            if (videoStream) mixedTracks.push(...videoStream.getTracks());
            stream = new MediaStream(mixedTracks);

            preview.srcObject = stream;

            const role = videoToggle.checked ? "broadcaster" : "audio_only";
            ws = new WebSocket("<?php echo getenv('Ec2Websocket'); ?>?key=" + encodeURIComponent(key) + "&role=" + role);
            ws.binaryType = "arraybuffer";

            ws.onopen = () => {
                console.log("🌊 Connected to WebSocket server");
                const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus") && videoToggle.checked
                    ? "video/webm;codecs=vp8,opus"
                    : "audio/webm;codecs=opus";

                recorder = new MediaRecorder(stream, { mimeType: mime });
                recorder.ondataavailable = async e => {
                    if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) {
                        ws.send(await e.data.arrayBuffer());
                    }
                };
                recorder.start(500);
                stopBtn.disabled = false;
            };

            ws.onclose = () => stopLocal();
            ws.onerror = err => console.error("WebSocket error:", err);

        } catch (e) {
            alert("Error starting broadcast: " + e.message);
            startBtn.disabled = false;
        }
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
        console.log("Streaming stopped");
    }

    startBtn.onclick = startBroadcast;
    stopBtn.onclick = stopLocal;
    </script>
</body>
</html>