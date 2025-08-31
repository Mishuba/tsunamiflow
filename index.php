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

    <!--meta name="format-detection" content="telephone=no"> <Instructs browsers not to detect and format telephone numbers automatically.
    Useful for preventing unintended UI modifications, especially on mobile devices.
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
    <meta property="fb:app_id" content="Your_App_ID" (ayo fam update and upgrade this shit. I think i have the info in my php already. Which config.php should be used.)
    <meta name="twitter:card" content="Tsunami Flow">
    <meta name="twitter:title" content="Tsunami Flow Club">
    <meta name="twitter:description"
        content="Tsunami Flow is the homebase for turning your dreams to reality, achieving your goals and mastering your life">
    <meta name="twitter:image" content="/Pictures/Logo/'Tsubnami Flow Logo.png'">
    <meta name="theme-color" content="#ffffff"> -->
    <!--meta http-equiv="refresh" content="30"--> <!-- Refreshes the page every 30 seconds -->
    <!--meta name="referrer" content="no-referrer"-->
    <!--Controls the amount of referrer information sent along with requests.-->
    <!--meta http-equiv="X-Content-Type-Options" content="nosniff"-->
    <!--Prevents the browser from MIME-sniffing a response away from the declared content-type-->
    <!--meta http-equiv="Content-Security-Policy" content="default-src 'self'"-->
    <!--Controls resources the user agent is allowed to load, enhancing security-->

    <meta name="google-site-verification" content="Yae7Q7bC5eK9FjTbjARZOisTwVTVknEe0tLWT4EiVqU" />
    <meta name="google-adsense-account" content="ca-pub-1650194129657038">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1650194129657038"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <script src="https://js.stripe.com/v3/"></script>

    <meta http-equiv="Content-Type" content="text/html">
    <!--meta http-equiv="X-UA-Compatible" content="IE=edge"--> <!-- Compatibility mode for IE -->
    <!--meta name="msapplication-TileColor" content="#000000"--> <!--Defines the color of the tile for Windows 8 and 10 when the user pins the site to their start menu.
Helps maintain brand consistency across user platforms-->
    <!--meta name="apple-mobile-web-app-capable" content="yes"-->
    <!--meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"-->

    <link rel="stylesheet" href="./MyStyle/tfMain.css" />

    <script src="https://cdnjs.cloudflare.com/ajax/libs/webrtc-adapter/8.1.2/adapter.min.js"
        integrity="sha512-l40eBFtXx+ve5RryIELC3y6/OM6Nu89mLGQd7fg1C93tN6XrkC3supb+/YiD/Y+B8P37kdJjtG1MT1kOO2VzxA=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>

    <!--meta name="application-name" content="Tsunami Flow Club"--> <!--Specifies the name of the web application-->
    <!--link rel="mainfest" href="/JSon/mainfest.json" /-->
</head>
<body id="theBody">
    <header>
        <div>
            <h3 id="TFtime">Time</h3>
            <p5 id="tfWordOfTheDay"></p5>
            <br />
            <p5 id="TimeInfo"></p5>
            <p6 id="TfAd"></p>
        </div>
        <div>
            <h3>TF News & History</h3>
            <p3 id="NTS">News Currently Unavailable</p3>
        </div>
        <div>
            <h3>Weather</h3>
            <p3 id="TFweather"></p3>
        </div>
    </header>
    <nav>
        <table>
            <caption> Website Navigation and Login. </caption>
            <colgroup>
                <col span="7">
            </colgroup>
            <tbody>
                <tr>
                    <td>
                        <button id="tfHome" type="button">Home</button>
                    </td>
                    <td>
                        <button id="tfRoster" type="button">Roster</button>
                    </td>
                    <td>
                        <button id="tfNews" type="button">News</button>
                    </td>
                    <td>
                        <button id="tfCompetitions" type="button">Competition</button>
                    </td>
                    <td>
                        <button id="tfNetwork" type="button">TV</button>
                    </td>
                    <td>
                        <button id="tfCommunity" type="button">Community</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <br>
        <form id="tfNavLoginForm" action="server.php" method="POST" target="_blank">
            <label for="tfNavUsername"><input class="nav-input" id="nun" type="text" placeholder="Username" name="NavUserName" size="4" /></label>
            <label for="tfNavPassword"><input class="nav-input" id="npsw" type="password" placeholder="Password" name="NavPassword" size="4" /></label>
            <label for="tfNavSubmitButton"><input id="NavLoginButton" type="submit" value="Login" /></label>
            <i class="glyphicon glyphicon-user" id="TFloginIcon">Nobody is logged in.</i>
        </form>
    </nav>
    <div id="MainSection">
        <aside>
            <span>
                <h6> Tsunami Radio (completely random)</h6>
                <p6 id="TfRadioStuff"></p6>
                <p6 id="CheckRadio"></p6>
            </span>
            <span>
                <h1>Ai</h1>
                <p>Ai Content</p>
            </span>
            <span>
                <address id="authorStuffTF" itemscope itemref="a b c" itemtype="">
                    <p itemprop="b">Homebase: Tyacdome <br />Location: The Land of Dreams <br /></p>
                    <p itemprop="c">Planet: Earth<br />Galaxy: Milky Way<br /></p>
                </address>
            </span>
            <span id="donation">
                <form id="TFdonation" name="TFdonation" method="POST" action="server.php">

                    <label for="Donation Amount"> Enter The Amount You Want To Donate. </label>
                    <input type="number" id="DonationAmount" name="DonationAmount" placeholder="Enter Amount" required />

                    <label for="Donation Email"> Enter your email</label>
                    <input type="email" id="StripePaymentStuffEmail" name="email" placeholder="email" />

                    <label for="First Name"> Enter Your First Name"> </label>
                    <input type="text" id="StripePaymentStuffFirstName" name="FirstName" placeholder="name" />

                    <label for="Last Name"> Enter Your Last Name <label>
                    <input type="text" id="StripePaymentStuffLastName" name="LastName" placeholder="Last Name" />


                    <select name="country" id="StripePaymentStuffCountryCode">
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="US">United States</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                    </select>
                    <label for="Donation Note"> Leave us a message" </label>
                    <input type="text" id="StripePaymentStuffDescription" name="Description" placeholder="Do you have anything to share" />

                    <button id="DonationCheckoutButton" type="submit"> Submit Payment </button>
                </form>
<script>
let donationForm = document.getElementById("TFdonation");

donationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // get the form information you want to use.
    let donationAmount = document.getElementById("DonationAmount").value;
    let donationEmail = document.getElementById("StripePaymentStuffEmail").value;
    let donationFirstName = document.getElementById("StripePaymentStuffFirstName").value;
    let donationLastName = document.getElementById("StripePaymentStuffLastName").value;
    let donationCountry = document.getElementById("StripePaymentStuffCountryCode").value;
    let donationNote = document.getElementById("StripePaymentStuffDescription").value;

    let donationXHR = new XMLHttpRequest();
    donationXHR.open("POST", "server.php", true);
    donationXHR.setRequestHeader("Content-Type", "application/json");
    donationXHR.onreadystatechange = async function () {
        if (donationXHR.readyState === 4) {
            if (donationXHR.status === 200) {
                let donationResponse = JSON.parse(donationXHR.responseText);

                if (donationResponse.url) {
                    window.location.href = donationResponse.url;
                } else {
                    alert("Error: " + (donationResponse.error || "Unknown"));
                }
            } else {
                alert("Failed to create checkout session.");
                console.log("Failed to create a checkout session.");
            }
        }
    };

    let donationData = JSON.stringify({
        "type": "Tsunami Flow Donation",
        "amount": donationAmount,
        "email": donationEmail,
        "first_name": donationFirstName,
        "last_name": donationLastName,
        "country": donationCountry,
        "note": donationNote
    });
    donationXHR.send(donationData);
})
</script>
        <div id="DonationCardElement" style="padding: 10px; margin-top: 15px; margin-bottom: 15px; margin-right: 15px; margin-left: 15px; border: 1px solid #ccc; border-radius: 4px;" min-width="10%" min-height="10%" max-width="100%" min-height="100%">

        </div>
        
        <div id="DonationCardErrors" role="alert">

        </div>
                <button type="button" id="DonationReadyPayment" disabled>Click To Input Card Information</button>
            </span>
            <!--p1 id="TFdonation"></p1>
                <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                    <input type="hidden" name="cmd" value="_s-xclick" />
                    <input type="hidden" name="hosted_button_id" value="3LQGL334FUKLW" />
                    <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" />
                    <ilt="Please donate." border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                </form>
            </p1-->
        </aside>
        <section>
            <div id="mainTsectionFdiv" height="800" width="800" src=""></div>
        </section>
        <aside id="tfExtraSection">
            <span id="ThoughtsCss">
                <form id="TFthoughtsNow" method="POST" action="server.php" target="_blank">
                    <label for="TFthoughtLabel"><textarea name="tfThoughtArea" id="TFthought" cols="14" rows="5" placeholder="Share your thoughts with everyone."></textarea></label>
                    <br />
                    <input type="submit" id="ThoughtsButtonTFok" name="tfTbutton" value="Release" />
                </form>
            </span>
            <span id="ThoughtArea">
                <h4>Thoughts</h4>
                <ul id="thoughtsList"></ul>
                <i class="glyphicon glyphicon-thumbs-up">like</i>
                <i class="material-icons">love </i>
                <i class="glyphicon glyphicon-remove">remove </i>
                <select name="numThoughts">
                    <option value="1">1</option>
                </select>
                <button type="submit" id="displayNumberOfThoughts">This Many?</button>
            </span>
            <span id="ThoughtsCss">
                <form name="TfCompleteForm" id="TFCompleteForm" class="TfMemberForm" autocomplete="on" target="_self" method="POST" action="server.php">
                    <h1>Subscriber Form</h1>
                    <fieldset name="FreeLevelSection" formid="FreeLevel">
                        <legend>You will have to input your card information to help with verification.</legend>

                        <!-- Membership Level Selection -->
                        <label for="membershipLevel">Select Membership Level</label><select id="TFMembershipLevel" name="membershipLevel" required>
                            <option value="none">Please Select One</option>
                            <option value="free">Free</option>
                            <option value="regular">Regular</option>
                            <option value="vip">VIP</option>
                            <option value="team">Team</option>
                        </select>
                        <br>

                        <div id="freeLevelInputs">
                            <!-- Free Level Fields -->
                            <label for="FirstName"><input id="TfFirstName" class="TFFormInput" name="TFRegisterFirstName" type="text" placeholder="First Name" required /></label>
                            <br>
                            <label for="LastName"><input id="TfLastName" class="TFFormInput" name="TFRegisterLastName" type="text" placeholder="Last Name" required /></label>
                            <br>
                            <label for="NickName"><input id="TfNickName" class="TFFormInput" name="TFRegisterNickName" type="text" placeholder="Nickname" /></label>
                            <br>
                            <label for="Gender">
                                Gender
                                <select id="TfGender" name="TFRegisterGender">
                                    <option>Please Select</option>
                                    <option value="Male"> Male </option>
                                    <option value="Female"> Female </option>
                                    <option value="Transgender"> Transgender </option>
                                    <option value="Transexual"> Transexual </option>
                                    <option value="Transvestite"> Transvestite </option>
                                </select>
                                <br>
                                <label for="Birthday">Birthday<input id="TfBirthday" class="TFFormInput" name="TFRegisterBirthday" type="date" min="1890-01-01" max="" placeholder="01/01/1900" required /></label>
                                <br>
                                <label for="Email"><input id="TfEmail" class="TFFormInput" name="TFRegisterEmail" type="email" placeholder="Email" required /></label>
                                <br>
                                <label for="Username"><input id="TFuserName" class="TFFormInput" name="TFRegisterUsername" type="text" placeholder="Username" required /></label>
                                <br>
                                <label for="Password"><input id="TFpassword" class="TFFormInput" name="TFRegisterPassword" type="password" placeholder="Password" required /></label>
                                <br>
                        </div>

                        <!-- Regular Member Section -->
                        <div id="regularLevelInputs" style="display:none;">
                            <label for="ChineseZodiacSign">Chinese Zodiac Sign
                                <select id="ChineseZodiacSign" class="TFFormInput" name="ChineseZodiacSign">
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                </select>
                            </label>
                            <br>
                            <label for="WesternZodiacSign">Western Zodiac Sign<input type="text" placeholder="Western Zodiac Sign" />
                                <select id="WesternZodiacSign" class="TFFormInput" name="WesternZodiacSign">
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                </select>
                            </label>
                            <br>
                            <label for="SpiritAnimal">Spirit Animal
                                <select id="SpiritAnimal" class="TFFormInput" name="SpiritAnimal">
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                </select>
                            </label>
                            <br>
                            <label for="CelticTreeZodiacSign">Celtic Tree Zodiac Sign
                                <select id="CelticTreeZodiacSign" class="TFFormInput" name="CelticTreeZodiacSign">
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                    <option value=""></option>
                                </select>
                            </label>
                            <br>
                            <label for="NativeAmericanZodiacSign">Native American Zodiac Sign<input id="NativeAmericanZodiacSign" class="TFFormInput" name="NativeAmericanZodiacSign" type="text" placeholder="Native American Zodiac Sign" /></label>
                            <br>
                            <label for="VedicAstrologySign">Vedic Astrology Sign<input id="VedicAstrologySign" class="TFFormInput" name="VedicAstrologySign" type="text" placeholder="Verdic Astrology Sign" /></label>
                            <br>
                            <label for="GuardianAngel">Guardian Angel<input id="GuardianAngel" class="TFFormInput" name="GuardianAngel" type="text" placeholder="Guardian Angel" /></label>
                            <br>
                            <label for="ChineseElement">Chinese Element<input id="ChineseElement" class="TFFormInput" name="ChineseElement" type="text" placeholder="Chinese Element" /></label>
                            <br>
                            <label for="EyeColorMeaning">Eye Color Meaning<input id="EyeColorMeaning" class="TFFormInput" name="EyeColorMeaning" type="text" placeholder="Eye Color Meaning" /></label>
                            <br>
                            <label for="GreekMythologyArchetype">Greek Mythology Archetype<input id="GreekMythologyArchetype" class="TFFormInput" name="GreekMythologyArchetype" type="text" placeholder="Greek Mythology Archetype" /></label>
                            <br>
                            <label for="NorseMythologyPatronDeity">Norse Mythology Patron Deity<input id="NorseMythologyPatronDeity" class="TFFormInput" name="NorseMythologyPatronDeity" type="text" placeholder="Norse Mythology Patron Deity" /></label>
                            <br>
                            <label for="EgyptianZodiacSign">Egyptian Zodiac Sign<input id="EgyptianZodiacSign" class="TFFormInput" name="EgyptianZodiacSign" type="text" placeholder="Egyptian Zodiac Sign" /></label>
                            <br>
                            <label for="MayanZodiacSign">Mayan Zodiac Sign<input id="MayanZodiacSign" class="TFFormInput" name="MayanZodiacSign" type="text" placeholder="Mayan Zodiac Sign" />
                            </label>
                        </div>

                        <!-- VIP Member Section -->
                        <div id="vipLevelInputs" style="display:none;">
                            <label for="LoveLanguage">Love Language<input id="LoveLanguage" class="TFFormInput" name="LoveLanguage" type="text" placeholder="Love Language" /></label>
                            <br>
                            <label for="Birthstone">Birthstone<input id="Birthstone" class="TFFormInput" name="Birthstone" type="text" placeholder="Birthstone" /></label>
                            <br>
                            <label for="BirthFlower">Birth Flower<input id="BirthFlower" class="TFFormInput" name="BirthFlower" type="text" placeholder="Birth Flower" /></label>
                            <br>
                            <label for="BloodType">Blood Type<input id="BloodType" class="TFFormInput" name="BloodType" type="text" placeholder="Blood Type" /></label>
                            <br>
                            <label for="AttachmentStyle">Attachment Style<input id="AttachmentStyle" class="TFFormInput" name="AttachmentStyle" type="text" placeholder="Attachment Style" /></label>
                            <br>
                            <label for="CharismaType">Charisma Type<input id="CharismaType" class="TFFormInput" name="CharismaType" type="text" placeholder="Charisma Type" /></label>
                        </div>

                        <!-- Team Member Section -->
                        <div id="teamLevelInputs" style="display:none;">
                            <label for="BusinessPersonality">Business Personality<input id="BusinessPersonality" class="TFFormInput" name="BusinessPersonality" type="text" placeholder="Business Personality" /></label>
                            <br>
                            <label for="DISC">DISC<input id="DISC" class="TFFormInput" name="DISC" type="text" placeholder="DISC" /></label>
                            <br>
                            <label for="SocionicsType">Socionics Type<input id="SocionicsType" class="TFFormInput" name="SocionicsType" type="text" placeholder="Socionics Type" /></label>
                            <br>
                            <label for="LearningStyle">Learning Style<input id="LearningStyle" class="TFFormInput" name="LearningStyle" type="text" placeholder="Learning Style" /></label>
                            <br>
                            <label for="FinancialPersonalityType">Financial Personality Type<input id="FinancialPersonalityType" class="TFFormInput" name="FinancialPersonalityType" type="text" placeholder="Financial Personality Type" /></label>
                            <br>
                            <label for="PrimaryMotivationStyle">Primary Motivation Style<input id="PrimaryMotivationStyle" class="TFFormInput" name="PrimaryMotivationStyle" type="text" placeholder="Primary Motivation Style" /></label>
                            <br>
                            <label for="CreativeStyle">Creative Style<input id="CreativeStyle" class="TFFormInput" name="CreativeStyle" type="text" placeholder="Creative Style" /></label>
                            <br>
                            <label for="ConflictManagementStyle">Conflict Management Style<input id="ConflictManagementStyle" class="TFFormInput" name="ConflictManagementStyle" type="text" placeholder="Conflict Management Style" /></label>
                            <br>
                            <label for="TeamRolePreference">Team Role Preference<input id="TeamRolePreference" class="TFFormInput" name="TeamRolePreference" type="text" placeholder="Team Role Prefernce" /></label>
                        </div>

                        <div id="AddressDetailsSubscibers">
                            <input id="tfSubPaymentCity" class="TFFormInput" name="tfSubPaymentCity" type="text" placeholder="City" />
                            <input id="tfSubPaymentCountry" class="TFFormInput" name="tfSubPaymentCountry" type="text" placeholder="Country" />
                            <input id="tfSubPaymentAddress1" class="TFFormInput" name="tfSubPaymentAddress1" type="text" placeholder="Address Line 1" />
                            <input id="tfSubPaymentAddress2" class="TFFormInput" name="tfSubPaymentAddress2" type="text" placeholder="Address Line 2" />
                            <input id="tfSubPostalCode" class="TFFormInput" name="tfSubPostalCode" type="text" placeholder="Postal Code" />
                            <input id="tfSubState" class="TFFormInput" name="tfSubState" type="text" placeholder="State" />
                            <input id="tfSubPhoneNumber" class="TFFormInput" name="tfSubPhoneNumber" type="text" placeholder="Phone Number" />
                        </div>

                        <!-- Membership Cost Information -->
                        <div id="membershipCostInfo">
                            <input type="hidden" name="membershipCost" id="hiddenMC" placeholder="0" />
                            Cost: <span id="membershipCost"></span>
                            <input type="hidden" name="paymentType" id="hiddenPT" />
                            <p><span id="paymentType"></span></p>
                        </div>

                        <div id="card-element"><!-- Stripe.js injects the Card Element here --></div>
                        

                        <div id="payment-message" class="hidden"></div>

                        <!-- Submit Button -->
                        <label for="SubmitButton"><button id="FreeLevelSubmit" class="SubFormButton" name="TFRegisterFreeLevelButton" type="submit"> Subscribe </button></label>
                    </fieldset>
                    <div id="payment-message" class="hidden"></div>
                </form>
                <button id="SubReadyPayment" disabled>Ready to Pay?</button>

            </span>
        </aside>
    </div>
    <article>
        <canvas id="TFradioCanvas">
            
        </canvas>
        <!--p id="TFradioInfo">
            Song Name: , Song Title: , Album Name: , Artist: , Featured Artist: , Writers: , Composers: , Record Label: , Publisher: ,
                </p>
            <p id="TFradioCurrentTIme">
                
                </p>
            <p id="TFradioTimeLeft">

                </p>
            <p id="RadioTimeFr"> 

                </p>
            <p id="TFradioProcessBar">

                </p-->
        <audio id="TFradioPlayer" src="" controls controlsList="nodownload"> 
            Radio
        </audio> <!---->
    </article>
    <footer>
        <div id="TFstore">
            <?php if ($showSuccess): ?>
                <p> success </p>
            <?php endif; ?>

            <ul>
                <?php
                if (isset($myProductsFr["result"]) && is_array($myProductsFr['result'])) {
                    foreach ($myProductsFr["result"] as $ItemsFr) {
                ?>
                        <li id="<?php echo (htmlspecialchars($ItemsFr["name"] ?? "No Name")); ?>">
                            <h4><?php echo (htmlspecialchars($ItemsFr["name"] ?? "No Name")); ?></h4>
                            <img src="<?php echo (htmlspecialchars($ItemsFr["thumbnail_url"] ?? "No Url")); ?>">
                            <br>
                            <p>
                                <?php
                                $TheDescriptionFr = PrintfulProductionDescription($ItemsFr["id"]);
                                echo (htmlspecialchars($TheDescriptionFr["result"]["product"]["description"] ?? "Description Unavailable" /*var_dump($TheDescriptionFr)*/)); ?>
                            </p>
                            <form method="POST" action="server.php" target="self">
                                <?php
                                $printfulVariants = getVariantandPrice($ItemsFr["id"]);
                                //var_dump($printfulVariants["sync_variants"]);
                                if (is_array($printfulVariants) && !empty($printfulVariants)) {
                                ?>
                                    <select name="product_id" required>
                                        <?php
                                        foreach ($printfulVariants["sync_variants"] as $variant) {
                                        ?>
                                            <option value="<?php echo htmlspecialchars($variant["id"]); ?>"><?php echo (htmlspecialchars($variant["name"])); ?> (Price: <?php echo (htmlspecialchars($variant["retail_price"])); ?>) (Size: <?php echo (htmlspecialchars($variant["size"])); ?>) (Availability: <?php echo (htmlspecialchars($variant["availability_status"])); ?>)</option>
                                        <?php
                                        }
                                        ?>
                                    </select>
                                    <br>
                                <?php
                                } else {
                                ?>
                                    <select>
                                        <option value=""> No Variants Available </option>
                                    </select>
                                <?php
                                }
                                ?>
                                <input  type="number" name=”StoreQuantity" value="1" min="1" max="1000">
                                <input type="hidden" name="product_id" value="<?php echo (htmlspecialchars($variant["id"])); ?>">
                                <button id="StoreButton" type="submit" name="addProductToCart"> Add to Cart </button>
                            </form>
                        </li>
                <?php
                    }
                }
                ?>
            </ul>
            <p>
                Cost:
            </p>

            <form id="tspf">

                <div id="cardStoreelement"><!-- Stripe.js injects the Card Element here --></div>

                <div id="OrdersAddressesFr">
                    <input id="tfOrdPaymentCity" class="TFFormInput" name="tfOrdPaymentCity" type="text" placeholder="City" />
                    <input id="tfOrdPaymentCountry" class="TFFormInput" name="tfOrdPaymentCountry" type="text" placeholder="Country" />
                    <input id="tfOrdPaymentAddress1" class="TFFormInput" name="tfOrdPaymentAddress1" type="text" placeholder="Address Line 1" />
                    <input id="tfOrdPaymentAddress2" class="TFFormInput" name="tfOrdPaymentAddress2" type="text" placeholder="Address Line 2" />
                    <input id="tfOrdPostalCode" class="TFFormInput" name="tfOrdPostalCode" type="text" placeholder="Postal Code" />
                    <input id="tfOrdState" class="TFFormInput" name="tfOrdState" type="text" placeholder="State" />
                    <input id="tfOrdPhoneNumber" class="TFFormInput" name="tfOrdPhoneNumber" type="text" placeholder="Phone Number" />
                </div>
                <button id="StoreSubmitButton" name="StoreSubmitButton">Pay</button disabled>

                <div id="payment-message" class="hidden"></div>
            </form>
            <button id="StoreReadyPayment" disabled>Ready to Pay?</button>
        </div>
    </footer>
<script type="module" crossorigin="anonymous">
    import {
        FreeSubmitButton,
        TStoreF,
        tfFN,
        tfLN,
        tfNN,
        tfGen,
        tfEM,
        tfBirth,
        tfUN,
        tfPsw,
        tfMembershipLevel,
        tfChineseZodiacSign,
        tfWesternZodiacSign,
        tfSpiritAnimal,
        tfCelticTreeZodiacSign,
        tfNativeAmericanZodiacSign,
        tfVedicAstrologySign,
        tfGuardianAngel,
        tfChineseElement,
        tfEyeColorMeaning,
        tfGreekMythologyArchetype,
        tfNorseMythologyPatronDeity,
        tfEgyptianZodiacSign,
        tfMayanZodiacSign,
        tfLoveLanguage,
        tfBirthstone,
        tfBirthFlower,
        tfBloodType,
        tfAttachmentStyle,
        tfCharismaType,
        tfBusinessPersonality,
        tfDisc,
        tfSocionicsType,
        tfLearningStyle,
        tfFinancialPersonalityType,
        tfPrimaryMotivationStyle,
        tfCreativeStyle,
        tfConflictManagementStyle,
        tfTeamRolePreference,
        SPC,
        SPCC,
        SPA1,
        SPA2,
        SPCtf,
        SS,
        SPN,
        MembershipCostFr, TFDA
    } from "./JS/Variables.js";

    import {
        DoXML, toggleTaxField
    } from "./JS/Functions.js";

    import "./JS/tfMain.js";

    /*
    const paymentElementOptions = {layout: "accordion"};
    var SoStShOk = Stripe("<?php echo htmlspecialchars(TfStripePublishableKey, ENT_QUOTES, 'UTF-8'); ?>");
    var StrEleOk = SoStShOk.elements();
    let StrCaOk = StrEleOk.create("card");

    document.getElementById("TFdonation").addEventListener("submit", function(event) {
        event.preventDefault();
        handleSubmit(SoStShOk, StrCaOk, "TycadomeDonations");
    });

    let supportedPaymentMethods = {
        supportedMethods: {
            type: "card",
            methodDetails: "",
            methodName: "",
        },
        Stripe: {
            type: "card",
            card: StrCaOk,
        }
    };

    //TsunamiStoreCheckout.js
async function initializeTsunamiStore() {
    const fetchTsunamiClientSecret = async () => {
        const TsunamiStoreResponse = await fetch("TsunamiStoreCheckout.php", { method: "POST", });
        const { clientSecret } = await TsunamiStoreResponse.json();
        return clientSecret;
    }

    let StripeDonationXML = new XMLHttpRequest();

    StripeDonationXML.onreadystatechange = async function () {
        if (this.readyState == 4 && this.status == 200) {
            let StripeSecretKeyOk = JSON.parse(this.responseText);
            if (StripeSecretKeyOk.error) {

            } else {
                let thestripekey = StripeSecretKeyOk.secret_key;
                const TsunamiStoreCheckout = await thestripekey.initEmbeddedCheckout({
                    fetchTsunamiClientSecret,
                });

                TsunamiStoreCheckout.mount("#DonationCheckoutElement");
            }
        }
    }
    StripeDonationXML.open("POST", 'server.php', true);
    StripeDonation = JSON.parse({
        "Payment_Message": "donation"
    });
    StripeDonationXML.send(StripeDonation);
};


    async function TFdonationXML(needThis, successMessageElement, amount, email, name, description, countryCode) {
        let DonationXHR = new XMLHttpRequest();
        //DonationXHR.timeout(300000); // one second
        
        DonationXHR.ontimeout = (e) => {

        }
        
        //DonationXHR.overrideMimeType();
        DonationXHR.open("POST", "server.php", true);
        DonationXHR.setRequestHeader("Content-Type", "application/json");
        //DonationXHR.setAttributionReporting({eventSourceEligible: true, triggerEligible: true});
        DonationXHR.withCredentials = true;
        DonationXHR.onreadystatechange = async () => {
            if (this.readyState === this.HEADERS_RECEIVED) {
                const TsunamiHeaders = this.getAllResponseHeaders();
                const TfHeaderArray = TsunamiHeaders.trim().split(/[\r\n]+/);
                const TfHeaderMap = {};
                TfHeaderArray.forEach((line) => {
                    const TfHeaderParts = line.split(":");
                    const TfHeaderHeader = TfHeaderParts.shift();
                    const TfHeaderValue = TfHeaderParts.join(":");
                    TfHeaderMap[TfHeaderHeader] = value;
                });

                const StripeHeaderMap = TfHeaderMap["content-type"];
            } else {

            }
            if (this.readyState === 4) {
                if (this.status === 200) {
                    console.log(`the XML http request status for the current Stripe Payment is ${this.statusText}`)
                    //console.log(this.response);
                    //console.log(this.responseURL);
                    //console.log(this.responseXML)
                    try {
                        let DonationResponse = this.responseText.startsWith("<") ? this.responseText : JSON.parse(this.responseText);
                        if (DonationResponse.success) {
                            console.log(DonationResponse.message);
                            successMessageElement.innerHTML = DonationResponse.message;
                        } else if (DonationResponse.requires_action) {
                            console.log(DonationResponse.message);
                            let HandleCardActionPromise = await paymentInstance.handleCardAction(DonationResponse.payment_intent_client_secret);
                            const paymentIntent = HandleCardActionPromise.error ? HandleCardActionPromise.error : HandleCardActionPromise.paymentIntent;
                            //successMessageElement.innerHTML = "Error: " + paymentIntent;
                        } else if (DonationResponse.requires_confirmation) {
                            let ReqConfiPromise = await paymentInstance.confirmCardPayment(DonationResponse.payment_intent_client_secret, {
                                payment_method: {
                                    card: paymentElement
                                }
                            });
                            let RCPouttaHere = await ReqConfiPromise.error ? ReqConfiPromise.error : ReqConfiPromise.paymentIntent;
                            //successMessageElement.innerHTML = "Payment successful: " + RCPouttaHere;
                        } else if (DonationResponse.requires_capture) {
                            let DRRCugg = await paymentInstance.captureCardPayment(DonationResponse.payment_intent_client_secret);
                            let DRRCokjo = await DRRCugg.error ? DRRCugg.error : DRRCugg.paymentIntent;
                            //successMessageElement.innerHTML = "Payment successful: " + DRRCokjo;
                        }
                    } catch (Error) {
                        console.error("Error processing donation:", Error);
                        //successMessageElement.innerHTML = "An error occurred. Please try again.";
                    }
                } else {
                    console.error("Failed to contact server: ", this.status);
                }
            }
        };
        DonationAmount = JSON.parse({
            "Payment_Method": needThis,
            "Payment_Message": successMessageElement,
            "Payment_Amount": amount, 
            "email": email,
            "name": name,
            "description": description,
            "countryCode": countryCode,
            "TaxId": ""
        }); 
        DonationXHR.send(DonationAmount);
        //let NdXhr = DonationXHR.upload;
        // NdXhr.onloadstart();
        // NdXhr.onprogress();
        // NdXhr.onabort();
        // NdXhr.onerror();
        // NdXhr.onload();
        // NdXhr.ontimeout();
        // NdXhr.onloadend();

        //Donation.abort();
    }

    async function handleSubmit(paymentInstance, paymentElement, theThing) {
        if (theThing === "SubscriberTfFormHandleIght") {
            if (tfMembershipLevel.value === "free" || tfMembershipLevel.value === "Free") {
                return await DoXML(tfFN, tfLN, tfNN, tfGen, tfEM, tfBirth, tfUN, tfPsw, tfMembershipLevel, tfChineseZodiacSign, tfWesternZodiacSign, tfSpiritAnimal, tfCelticTreeZodiacSign, tfNativeAmericanZodiacSign, tfVedicAstrologySign, tfGuardianAngel, tfChineseElement, tfEyeColorMeaning, tfGreekMythologyArchetype, tfNorseMythologyPatronDeity, tfEgyptianZodiacSign, tfMayanZodiacSign, tfLoveLanguage, tfBirthstone, tfBirthFlower, tfBloodType, tfAttachmentStyle, tfCharismaType, tfBusinessPersonality, tfDisc, tfSocionicsType, tfLearningStyle, tfFinancialPersonalityType, tfPrimaryMotivationStyle, tfCreativeStyle, tfConflictManagementStyle, tfTeamRolePreference, SPC, SPCC, SPA1, SPA2, SPCtf, SS, SPN, MembershipCostFr, "No Payment Method Required");
            } else {
                let SubmitPromise = await paymentInstance.createPaymentMethod(supportedPaymentMethods.Stripe);
                let paymentMethodFr = await SubmitPromise.error ? SubmitPromise.error : SubmitPromise.paymentMethod;
                TFdonationXML(paymentMethodFr, DonationUserMessages, MembershipCostFr); //needThis, successMessageElement, amount, email, name, description, countryCode
                return await DoXML(tfFN, tfLN, tfNN, tfGen, tfEM, tfBirth, tfUN, tfPsw, tfMembershipLevel, tfChineseZodiacSign, tfWesternZodiacSign, tfSpiritAnimal, tfCelticTreeZodiacSign, tfNativeAmericanZodiacSign, tfVedicAstrologySign, tfGuardianAngel, tfChineseElement, tfEyeColorMeaning, tfGreekMythologyArchetype, tfNorseMythologyPatronDeity, tfEgyptianZodiacSign, tfMayanZodiacSign, tfLoveLanguage, tfBirthstone, tfBirthFlower, tfBloodType, tfAttachmentStyle, tfCharismaType, tfBusinessPersonality, tfDisc, tfSocionicsType, tfLearningStyle, tfFinancialPersonalityType, tfPrimaryMotivationStyle, tfCreativeStyle, tfConflictManagementStyle, tfTeamRolePreference, SPC, SPCC, SPA1, SPA2, SPCtf, SS, SPN, MembershipCostFr, paymentMethodFr);
            }
        } else if (theThing === "TycadomePrintfulStore") {
            let SubmitPromise = await paymentInstance.createPaymentMethod(supportedPaymentMethods.Stripe);
            let paymentMethod = await SubmitPromise.error ? SubmitPromise.error : SubmitPromise.paymentMethod;
            TFdonationXML(paymentMethod, DonationUserMessages, amount); //needThis, successMessageElement, amount, email, name, description, countryCode
            return;
        } else if (theThing === "TycadomeDonations") {
            const DonationAmount = TFDA.value * 100;
            if (DonationAmount < 50) {
                return await alert("minimum donation is $0.50");
            } else {
                let DonationEmail = document.getElementById("StripePaymentStuffEmail").value;
                let DonationFirstName = document.getElementById("StripePaymentStuffFirstName").value;
                let DonationLastName = document.getElementById("StripePaymentStuffLastName").value;
                let DonationFullName = DonationFirstName + " " + DonationLastName;
                let DonationDescription = document.getElementById("StripePaymentStuffDescription").value;
                let DonationCountryCode = document.getElementById("StripePaymentStuffCountryCode").value;
                let SubmitPromise = await paymentInstance.createPaymentMethod(supportedPaymentMethods.Stripe);
                let paymentMethod = await SubmitPromise.error ? SubmitPromise.error : SubmitPromise.paymentMethod;
                return TFdonationXML(paymentMethod, "Donation", DonationAmount, DonationEmail, DonationFullName, DonationDescription, DonationCountryCode); 
            }
        } else {
            console.error("Something went wrong.");
            alert("An unknown error occurred. Time to debug.");
        }
    }

    function mountStripeCardElement(targetElementId) {
        const apperance = {
            theme: "stripe",
            variables: {
                colorPrimary: "#5469d4",
                colorBackground: "#ffffff",
                colorText: "#32325d",
                colorDanger: "#df1b41",
                fontFamily: "Arial, sans-serif",
                borderRadius: "4px"
            },
        };
        if (StrCaOk) {
            StrCaOk.unmount();
        }
        StrEleOk = SoStShOk.elements({apperance});
        StrCaOk = StrEleOk.create("card");
        try {
            StrCaOk.mount(targetElementId);
            FreeSubmitButton.disabled = true;
            TStoreF.disabled = true;
            document.getElementById("DonationSubmitButton").disabled = false;
        } catch (error) {
            console.error("Error mounting Stripe Card Element:", error);
        }
    }

    function setupPaymentElements() {
        document.getElementById("DonationReadyPayment").addEventListener("click", function() {
            mountStripeCardElement('#DonationCardElement');
        });

        document.getElementById("SubReadyPayment").addEventListener("click", function() {
            mountStripeCardElement('#card-element');
        });

        document.getElementById("StoreReadyPayment").addEventListener("click", function() {
            mountStripeCardElement("#cardStoreelement");
        });
    }

    if (FreeSubmitButton) {
        FreeSubmitButton.addEventListener('click', function(event) {
            event.preventDefault();
            handleSubmit(SoStShOk, StrCaOk, "SubscriberTfFormHandleIght");
        });
    }

    if (TStoreF) {
        TStoreF.addEventListener('submit', function(event) {
            event.preventDefault();
            handleSubmit(SoStShOk, StrCaOk, "TycadomePrintfulStore");
        });
    }

    setupPaymentElements();
    */
</script>
</body>
</html>