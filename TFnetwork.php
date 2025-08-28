<?php
ini_set("session.cookie_secure", true);
ini_set("session.cookie_httponly", "1");
ini_set("session.gc_maxlifetime", 3600);
ini_set("session.cookie_lifetime", 0);
ini_set("session.use_strict_mode", true);

header("Access-Control-Allow-Origin: https://www.tsunamiflow.club");
header("Content-Security-Policy: frame-ancestors 'self' https://www.tsunamiflow.club https://webhook.tsunamiflow.club");

session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>
<!DOCTYPE HTML>
<html>
    <head>
        <title>
            TF TV
        </title>
    <meta charset="utf-8" />
    <meta name="viewpoint" width="device-width" height="device-height" initial-scale="1" minimum-scale="0.1" user-scalable="1" interactive-widget="resizes-content" />
    <meta name="author" content="Hubert Christopher Maxwell" />
    <meta name="keyword" content="mishuba, challenges, business, music, property, rap, pop, rock, news, thoughts, clothes, shoes, games, shows, movies, books, love, inspiration, information, research" />
    <meta name="description" content="Tsunami Flow is the homebase for turning your dreams to goals and mastering your life." />
        <style>
iframe {
    min-height: 226px;
    height: 430px;
    max-height: 100%;
    min-width: 70%;
    width: 925px;
    max-width: 100%;
}
</style>
    </head>
    <body>
        <iframe src="https://www.youtube.com/embed/videoseries?si=lMjD0RMZMB1z0z_q&amp;list=PLyt4VU_WgIQN8YX1ZJozFpsKMMWVXcD7C" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen>

        </iframe>
    </body>
</html>