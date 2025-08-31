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
header("Content-Security-Policy: script-src 'self' https://www.tsunamiflow.club https://world.tsunamiflow.club https://tsunamiflow.club; frame-ancestors 'self' https://www.tsunamiflow.club https://world.tsunamiflow.club");

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
    <title>Chroma Key Canvas</title>
        <meta charset="utf-8" />
    <meta name="viewpoint" width="device-width" height="device-height" initial-scale="1" minimum-scale="0.1" user-scalable="1" interactive-widget="resizes-content" />
    <meta name="author" content="Hubert Christopher Maxwell" />
    <meta name="keyword" content="mishuba, challenges, business, music, property, rap, pop, rock, news, thoughts, clothes, shoes, games, shows, movies, books, love, inspiration, information, research" />
    <meta name="description" content="Tsunami Flow is the homebase for turning your dreams to goals and mastering your life." />
    <style>
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        #TFcanvas {
            border: 1px solid black;
        }
        #TsunamiFlowVideoStuff {
            display: none; /* Hide the video element */
        }
        #TFchromaKey {
            margin-top: 10px;
        }
        .button {
            display: block;
            margin: 10px 0;
        }
    </style>
</head>
<body>

    <h1>Chroma Key Canvas</h1>
    <label for="chromaColorWebcam">Choose Chroma Key Color for Webcam:</label>
    <input type="color" id="TFchromaKey" value="#00ff00">
    <button id="TuseFthisKeycolor">Use Webcam Chroma Key Color</button>
    
    <button id="rmvTFchromakey">Remove Chroma Key Color</button>

    <button id="TfStartRecPlz">Start Recording</button>
    <button id="TfStopRecPlz">Stop Recording</button>

    <video id="TsunamiFlowVideoStuff" width="640" height="480" autoplay></video>
    <canvas id="TFcanvas" width="640" height="480"></canvas>
    <button id="TfControlShit">Control I Guess.</button>
    <button id="TfStartShit">Start</button>
    <button id="TfStopShit">Stop</button>
    
    <input type="file" id="TFuploadImage" accept="image/*">
    <button id="rmvTFimg" style="display:none;">Remove Image</button>
    
    <input type="file" id="TFuploadVideo" accept="video/*">
    <button id="rmvTFvid" style="display:none;">Remove Video</button>
    <script type="module" src="./JS/Community.js" crossorigin="anonymous">

    </script>
</body>
</html>