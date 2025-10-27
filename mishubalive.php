<?php
require "config.php";

// List all music files from Cloudflare R2
function listR2Files($prefix = 'music/') {
    $bucket = "tsunami-radio";
    $endpoint = CLOUDFLARE_R2_ENDPOINT; // e.g. https://<your-account-id>.r2.cloudflarestorage.com
    $accessKey = CLOUDFLARE_R2_ACCESS_KEY;
    $secretKey = CLOUDFLARE_R2_SECRET_KEY;

    $host = parse_url($endpoint, PHP_URL_HOST);
    $url = "$endpoint/$bucket?prefix=" . urlencode($prefix);

    $date = gmdate('D, d M Y H:i:s T');
    $method = 'GET';
    $canonical = "$method\n\n\n$date\n/$bucket?prefix=" . $prefix;

    $signature = base64_encode(hash_hmac('sha1', $canonical, $secretKey, true));
    $auth = "AWS $accessKey:$signature";

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Date: $date",
            "Authorization: $auth",
            "Host: $host"
        ]
    ]);
    $response = curl_exec($ch);
    curl_close($ch);

    $files = [];
    if ($response && preg_match_all('/<Key>(.*?)<\/Key>/', $response, $matches)) {
        foreach ($matches[1] as $key) {
            if (str_starts_with($key, $prefix) && !str_ends_with($key, '/')) {
                $files[] = [
                    'name' => basename($key),
                    'url' => "$endpoint/$bucket/$key"
                ];
            }
        }
    }
    return $files;
}

$musicFiles = listR2Files();
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mishuba Live Broadcaster Console</title>
<style>
    body {
        font-family: system-ui, sans-serif;
        background: #0b0b0b;
        color: #eee;
        text-align: center;
        padding: 20px;
    }
    video, audio {
        margin: 10px;
        border-radius: 10px;
        background: #000;
    }
    input, button, select {
        margin: 5px;
        padding: 8px 12px;
        border-radius: 8px;
        border: none;
        outline: none;
    }
    button {
        background: #1a1a1a;
        color: #fff;
        cursor: pointer;
        transition: 0.2s;
    }
    button:hover { background: #333; }
    .section { margin-top: 20px; }
    .soundboard button {
        display: inline-block;
        margin: 6px;
        padding: 10px 14px;
        border-radius: 10px;
        border: 1px solid #333;
    }
    .soundboard button:hover { background: #333; }
    .sliders { display: flex; justify-content: center; flex-wrap: wrap; margin-top: 10px; }
    .slider-group { margin: 10px; text-align: center; }
    input[type=range] {
        width: 150px;
        cursor: pointer;
    }
</style>
</head>
<body>
<h1>🌊 Mishuba Live Broadcaster Console</h1>

<video id="preview" autoplay muted playsinline style="width:400px;height:auto;"></video><br>

<div>
    <input id="streamKey" placeholder="Enter Stream Key" />
    <button id="start">Start Broadcast</button>
    <button id="stop" disabled>Stop</button><br>
    <label><input type="checkbox" id="videoToggle" checked> Include Video</label>
    <label><input type="checkbox" id="musicToggle" checked> Include Music</label>
</div>

<div class="section playlist">
    <h3>🎶 Music Player</h3>
    <audio id="music" controls></audio><br>
    <select id="playlist">
        <option value="">-- Select Song --</option>
        <?php foreach ($musicFiles as $f): ?>
            <option value="<?= htmlspecialchars($f['url']) ?>"><?= htmlspecialchars($f['name']) ?></option>
        <?php endforeach; ?>
    </select>
    <input type="file" id="fileInput" accept="audio/*">
</div>

<div class="section soundboard">
    <h3>🎛️ Sound Effects</h3>
    <button data-sound="crowd">Crowd Clapping</button>
    <button data-sound="bomb">Bomb</button>
    <button data-sound="gun">Gun Shots</button>
    <button data-sound="laugh">Crowd Laughing</button>
    <button data-sound="intro">Intro</button>
    <button data-sound="hellnah">Hell Nah</button>
    <button data-sound="shock">Shocked</button>
    <button data-sound="wtf">Questioned (WTF)</button>
    <button data-sound="other">Other</button>
</div>

<div class="section sliders">
    <div class="slider-group">
        <label>🎤 Mic Volume</label><br>
        <input type="range" id="micVol" min="0" max="1" step="0.01" value="1">
    </div>
    <div class="slider-group">
        <label>🎵 Music Volume</label><br>
        <input type="range" id="musicVol" min="0" max="1" step="0.01" value="0.8">
    </div>
    <div class="slider-group">
        <label>💥 Effects Volume</label><br>
        <input type="range" id="fxVol" min="0" max="1" step="0.01" value="0.9">
    </div>
</div>

<script>
// ---- JavaScript identical to the previous working version ----
// (dynamic audio routing, streaming logic, etc.)
// Just keep the JS part from the last working version I gave you.
</script>
</body>
</html>