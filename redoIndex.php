<?php
include "server.php";
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <title>
        Tsunami Flow Club
    </title>
    <meta charset="utf-8" />
    <meta name="viewpoint" width="device-width" height="device-height" inital-scale="1" minimum-scale="0.1"
        user-scalable="1" interactive-widget="resizes-content" />

    <meta name="author" content="Hubert Christopher Maxwell" />
    <meta name="keyword"
        content="music, real estate, fashion, games, sports, literature, information, art, software development, current events, news, politics, business, stocks, research, artifical intelligence, robotic process automation, inspiration, entertainment" />
    <meta name="description"
        content="Tsunami Flow is the homebase for turning your dreams to reality, achieving your goals and mastering your life" />

    <meta name="format-detection" content="telephone=no"> <!--Instructs browsers not to detect and format telephone numbers automatically.
    Useful for preventing unintended UI modifications, especially on mobile devices.-->
    <meta name="theme-color" content="#0A0A0A" />
    <meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large" />
    <meta name="googlebot" content="index, follow">
    <meta name="googlebot-news" content="index, follow">
    <meta property="og:title" content="Tsunami Flow Club">
    <meta property="og:description"
        content="Tsunami Flow is the homebase for turning your dreams to reality, achieving your goals and mastering your life">
    <meta property="og:image" content="/Pictures/Logo/'Tsubnami Flow Logo.png'">
    <meta property="og:url" content="https://example.com">
    <meta property="og:type" content="website">
    <!--meta property="fb:app_id" content="Your_App_ID" (ayo fam update and upgrade this shit. I think i have the info in my php already. Which config.php should be used.)-->
    <meta name="twitter:card" content="Tsunami Flow">
    <meta name="twitter:title" content="Tsunami Flow Club">
    <meta name="twitter:description"
        content="Tsunami Flow is the homebase for turning your dreams to reality, achieving your goals and mastering your life">
    <meta name="twitter:image" content="/Pictures/Logo/'Tsubnami Flow Logo.png'">
    <meta name="theme-color" content="#ffffff"> <!-- Sets browser theme color -->
    <!--meta http-equiv="refresh" content="30"--> <!-- Refreshes the page every 30 seconds -->
    <meta name="referrer" content="no-referrer">
    <!--Controls the amount of referrer information sent along with requests.-->
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <!--Prevents the browser from MIME-sniffing a response away from the declared content-type-->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'">
    <!--Controls resources the user agent is allowed to load, enhancing security-->

    <meta name="google-site-verification" content="Yae7Q7bC5eK9FjTbjARZOisTwVTVknEe0tLWT4EiVqU" />
    <meta name="google-adsense-account" content="ca-pub-1650194129657038">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1650194129657038"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <script src="https://js.stripe.com/v3/"></script>

    <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Compatibility mode for IE -->
    <meta name="msapplication-TileColor" content="#000000"> <!--Defines the color of the tile for Windows 8 and 10 when the user pins the site to their start menu.
Helps maintain brand consistency across user platforms-->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

    <link rel="stylesheet" href="./MyStyle/tfMain.css" />

    <script src="https://cdnjs.cloudflare.com/ajax/libs/webrtc-adapter/8.1.2/adapter.min.js"
        integrity="sha512-l40eBFtXx+ve5RryIELC3y6/OM6Nu89mLGQd7fg1C93tN6XrkC3supb+/YiD/Y+B8P37kdJjtG1MT1kOO2VzxA=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>

    <meta name="application-name" content="Tsunami Flow Club"> <!--Specifies the name of the web application-->
    <link rel="mainfest" href="/JSon/mainfest.json" />
</head>

<body>
    <header>
        <div>
            <p5 id="tfWordOfTheDay"></p5>
            <br />
            <p5 id="TimeInfo"></p5>
        </div>
        <div>
            <h3 id="TFtime">Time</h3>
            <p6 id="TfAd"></p>
        </div>
        <div>
            <h3>Weather</h3>
            <p3 id="TFweather"></p3>
    </header>
    <nav>

    </nav>
    <div>
        <aside>
<span>
    <h6> Tsunami Radio </h6>
    <p6 id="TfRadioStuff"></p6>
    <p6 id="CheckRadio"></p6>
</span>
<span>
    <h6 id="RubyDetha"> Ruby Detha </h6>
    <p6 id="RubyDethaContent"> Content </p6>
    <canvas id="RubyDethaCanvas"> </canvas>
</span>
<span id="donation">
    <form id="TFdonation" name="TFdonation" method="POST" action="server.php">
        <input type="number" id="DonationAmount" name="DonationAmount" placeholder="Enter Amount" required>
        <input type="email" id="StripePaymentStuffEmail" name="email" placeholder="email" required>
        <input type="text" id="StripePaymentStuffFirstName" name="FirstName" placeholder="name" required>
        <input type="text" id="StripePaymentStuffLastName" name="LastName" placeholder="Last Name" required>
        <select name="country" id="StripePaymentStuffCountryCode" required>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
        </select>
        <input type="text" id="StripePaymentStuffDescription" name="Description" placeholder="Do you have anything to share">
        <input type="checkout" id="businessCheck">
        <div id="taxIdField" style="display: none;">
            <input type="text" name="tax_id">
        </div>
        <div id="DonationCheckoutElement">

        </div>

        <div id="DonationCardElement" style="padding: 10px; margin-top: 15px; margin-bottom: 15px; margin-right: 15px; margin-left: 15px; border: 1px solid #ccc; border-radius: 4px;" min-width="10%" min-height="10%" max-width="100%" min-height="100%">

        </div>

        <div id="DonationCardErrors" role="alert">

        </div>
    </form>
<button type="button" id="DonationReadyPayment">Click To Input Card Information</button>
</span>
        </aside>
        <section>

        </section>
        <aside>

        </aside>
    </div>
    <article>

    </article>
    <footer>

    </footer>
    <script>

    </script>
</body>

</html>