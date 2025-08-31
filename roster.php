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
//header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With");
//header("Content-Security-Policy: default-src 'self'; script-src 'self' https://www.tsunamiflow.club https://world.tsunamiflow.club https://tsunamiflow.club; frame-ancestors 'self' https://www.tsunamiflow.club https://world.tsunamiflow.club");
/*
header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");

header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: no-referrer-when-downgrade");
header("Permissions-Policy: camera=(), microphone=(), geolocation=()");
header("Cross-Origin-Opener-Policy: same-origin");
header("Cross-Origin-Embedder-Policy: require-corp");
header("Cross-Origin-Resource-Policy: same-origin");
*/
?>
<!DOCTYPE HTML>
<html lang="en">
<head>

    <title>Tsunami Flow Gang</title>
        <meta charset="utf-8" />
    <meta name="viewpoint" width="device-width" height="device-height" initial-scale="1" minimum-scale="0.1" user-scalable="1" interactive-widget="resizes-content" />
    <meta name="author" content="Hubert Christopher Maxwell" />
    <meta name="keyword" content="mishuba, challenges, business, music, property, rap, pop, rock, news, thoughts, clothes, shoes, games, shows, movies, books, love, inspiration, information, research" />
    <meta name="description" content="Tsunami Flow is the homebase for turning your dreams to goals and mastering your life." />
    <style>
        body {
            background: dark;
            font-family: Arial, sans-serif;
            color: white;
            margin: 0;
            padding: 0;
        }
        nav {
            display: flex;
            background-color: #b22222;
        }
        .menu-item {
            position: relative;
            cursor: pointer;
            margin-right: 20px;
        }
        .menu-item:hover {
            background-color: #a52a2a;
        }
        .submenu {
            display: none; /* Hide submenus by default */
            position: absolute;
            top: 40px; /* Position below the menu item */
            left: 0;
            background-color: #b22222;
            z-index: 1000;
        }
        .menu-item:focus-within .submenu {
            display: block; /* Show submenu when the item is focused */
        }
        .submenu li {
            
        }
        a {
            color: lightblue;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <nav>
        <div class="menu-item" tabindex="0">
            Hubert Christopher Maxwell
            <ul class="submenu">
                <li>
                    Business
                    <ul>
                        <li>Email: <a href="mailto:hubertmaxwell34@gmail.com">hubertmaxwell34@gmail.com</a></li>
                    </ul> 
                </li>
                <li>
                    Resume Info:
                    <ul>
                        <li><a href="https://www.linkedin.com/in/agentchrismaxwell" target="_blank">LinkedIn</a></li>
                    </ul>
                </li>
                <li>
                    Real Estate Info:
                    <ul>
                        <li><a href="https://directories.apps.realtor/memberDetail/?personId=4916509&officeStreetCountry=US&memberLastName=Maxwell" target="_blank">NAR <br> National Association of Realtors</a></li>
                        <li><a href="https://www.coldwellbanker.com/city/sc/columbia/agents" target="_blank">Coldwell Banker</a></li>
                        <li><a href="" target="_blank">Realtor.com</a>Realtor.com</li>
                    </ul>
                </li>
                <li>
                    Writer Info:
                    <ul>
                        <li><a href="https://www.amazon.com/dp/1675298106" target="_blank">The Lost Path (Paperback)</a></li>
                        <li><a href="https://www.amazon.com/dp/B082QVSTQX" target="_blank">The Lost Path (Kindle)</a></li>
                        <!--li><a href="" target="_blank">The Lost Path (hardcover [currently unavailable])</a></li-->
                    </ul>
                </li>
                <li>
                    Social Media:
                    <ul>
                        <li><a href="https://www.facebook.com/profile.php?id=100087486632483&mibextid=ZbWKwL" target="_blank">Facebook</a></li>
                        <li><a href="https://x.com/mishuba" target="_blank">X</a></li>
                        <li><a href="https://www.instagram.com/mishuba/" target="_blank">Instagram</a></li>
                        <li><a href="https://www.tiktok.com/@mishuba_?is_from_webapp=1&sender_device=pc" target="_blank">Tik Tok</a></li>
                        <li><a href="" target="_blank">Threads</a></li>
                        <li><a href="https://www.youtube.com/@mishuba_" target="_blank">YouTube</a></li>
                    </ul>
                </li>
                <li>
                    Software Developer Info:
                    <ul>
                        <li><a href="https://www.w3profile.com/mishuba" target="">w3Schools</a></li>
                        <li><a href="https://www.hackerrank.com/profile/Mishuba" target="">Hackerrank</a></li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="menu-item" tabindex="0">
            Mishuba (Musician)
            <ul class="submenu">
                <li>
                    Blog
                    <ul>
                        <li>Personal (Myself and Family)</li>
                        <li>Business (Tsunami Flow)</li>
                        <li>Workout (Athletics)</li>
                        <li>Dream (Lucid Dreaming Training)</li>
                    </ul>
                </li>
                <li>Vlog</li>
                <li>
                    Social Media
                    <ul>
                        <li><a href="https://www.facebook.com/profile.php?id=100087486632483&mibextid=ZbWKwL" target="_blank">Facebook</a></li>
                        <li><a href="https://x.com/mishuba" target="_blank">X</a></li>
                        <li><a href="https://www.twitch.tv/mishuba" target="_blank">Twitch</a></li>
                        <li><a href="https://www.instagram.com/mishuba/" target="_blank">Instagram</a></li>
                        <li><a href="https://www.tiktok.com/@mishuba_?is_from_webapp=1&sender_device=pc" target="_blank">Tik Tok</a></li>
                        <li><a href="" target="_blank">Threads</a></li>
                        <li><a href="https://www.reddit.com/user/Mishuba/?rdt=59439" target="_blank">Reddit</a></li>
                    </ul> 
                </li>
                <li>
                    Music
                    <ul>
                        <li><a href="https://untd.io/mishuba" target="_blank">UnitedMasters</a></li>
                        <li><a href="https://www.pandora.com/artist/mishuba/AR54m3xdXxt6wzK" target="_blank">Pandora</a></li>
                        <li><a href="https://open.spotify.com/artist/4InHEXrLAM4O7BbC3siHXG" target="_blank">Spotify</a></li>
                        <li><a href="https://www.deezer.com/en/artist/8833316" target="_blank">Deezer</a></li>
                        <li><a href="https://tidal.com/browse/artist/7204861" target="_blank">Tidal</a></li>
                        <li><a href="https://www.iheart.com/artist/mishuba-30991375/" target="_blank">IHeartRadio</a></li>
                        <li><a href="https://music.apple.com/us/artist/mishuba/1036937013" target="_blank">Apple Music/iTunes</a></li>
                        <li><a href="https://soundcloud.com/mishuba-music" target="_blank">Soundcloud</a></li>
                        <li><a href="https://music.amazon.com/artists/B014VF3GWI/mishuba" target="_blank">Amazon Music</a></li>
                        <li><a href="https://www.shazam.com/artist/mishuba/1036937013" target="_blank">Shazam</a></li>
                    </ul>
                </li>
                <li>
                    Videos
                    <ul>
                        <li><a href="https://www.youtube.com/@mishuba_" target="_blank">YouTube</a></li>
                        <li><a href="https://www.twitch.tv/mishuba" target="_blank">Twitch</a></li>
                    </ul>
                </li>
                <li>
                    Drawings
                    <ul>
                        <li><a href="https://mishuba.tumblr.com/" target="_blank">Tumblr</a></li>
                        <li><a href="https://www.pinterest.com/mishuba/" target="_blank">Pinterest</a></li>
                    </ul>
                </li>
                <li>
                    Programming
                    <ul>
                        <li><a href="https://github.com/Mishuba/" target="_blank">GitHub</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </nav>
<iframe id="RosterMain" loading="lazy" src="https://chrismaxwell.sites.cbmoxi.com/" allow="camera;microphone" allowfullscreen="true" height="800" width="100%" style="border: 0px solid black;">

</iframe>
</body>

<script>

</script>
</html>
