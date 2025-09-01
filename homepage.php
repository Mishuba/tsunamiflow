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
//header("Content-Security-Policy: default-src 'self'; script-src 'self' https://www.tsunamiflow.club https://world.tsunamiflow.club https://tsunamiflow.club; style-src 'self' 'unsafe-inline'; connect-src 'self' wss://world.tsunamiflow.club wss://www.tsunamiflow.club; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' https://www.tsunamiflow.club https://world.tsunamiflow.club");

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

<!DOCTYPE html>
<html>
<head>
<title>
Tycadome
</title>
    <meta charset="utf-8" />
    <meta name="viewpoint" width="device-width" height="device-height" initial-scale="1" minimum-scale="0.1" user-scalable="1" interactive-widget="resizes-content" />
    <meta name="author" content="Hubert Christopher Maxwell" />
    <meta name="keyword" content="mishuba, challenges, business, music, property, rap, pop, rock, news, thoughts, clothes, shoes, games, shows, movies, books, love, inspiration, information, research" />
    <meta name="description" content="Tsunami Flow is the homebase for turning your dreams to goals and mastering your life." />
</head>
<body id="homepageBody">

    <script type="module" crossorigin="anonymous">
        import { letsDoIt, FirstGame, HomepageUpdates, Stickman, gameComponent } from "./JS/sprite.js";
        let TFpostMessageLinks = "https://www.tsunamiflow.club"; //"https://tsunamiflow.club"; 

        let TFpostActualObject = {
            type: "Website Updates",
            message: "make this the first character maybe.",
            username: "Mishuba",
            error: "currently no error fam."
        };

        window.parent.postMessage(TFpostActualObject, TFpostMessageLinks);

        window.addEventListener("message", async (ev) => {
            console.log("iframe message received");
            console.log(ev.origin);
            let data = ev.data;
            let origin = ev.origin;
            let source = ev.source;

            if (origin === "https://www.tsunamiflow.club" || "https://tsunamiflow.club") {
                console.log(data.info);
                console.log(data);

                if (data.type === "start_updates") {
                    const game = letsDoIt.from(ev.data.info);
                    game.start();

                    TFpostActualObject = {
                        type: "updates",
                        info: game.toJSON(),
                        message: "the message should be showing.",
                        username: "Mishuba",
                        error: "Nothing as of now."
                    }
                    window.parent.postMessage(TFpostActualObject,TFpostMessageLinks);
                } else if (data.type === "game") {

                } else {
                    
                }
            } else if (ev.origin === "https://js.stripe.com") {
                console.log(ev.data);
                console.log(ev.source);
            } else {
                return console.log(`Some outside source is trying to send my homepage a message.`);
            }
        });
    </script>
</body>

</html>