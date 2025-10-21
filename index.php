<?php
include "server.php";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Tsunami Flow Club</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=0.1, user-scalable=yes" />

    <meta name="author" content="Hubert Christopher Maxwell" />
    <meta name="keywords"
        content="music, real estate, fashion, games, sports, literature, information, art, software development, current events, news, politics, business, stocks, research, artificial intelligence, robotic process automation, inspiration, entertainment" />
    <meta name="description"
        content="Tsunami Flow is the homebase for turning your dreams to reality, achieving your goals and mastering your life" />


    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta property="og:title" content="Tsunami Flow Club">
    <meta property="og:description"
        content="Tsunami Flow is the homebase for turning your dreams to reality, achieving your goals and mastering your life">
    <meta property="og:image" content="/Pictures/Logo/Tsunami Flow Logo.png">
    <meta property="og:url" content="https://www.tsunamiflow.club">
    <meta property="og:type" content="website">
    <meta property="fb:app_id" content="Your_App_ID">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Tsunami Flow Club">
    <meta name="twitter:description"
        content="Tsunami Flow is the homebase for turning your dreams to reality, achieving your goals and mastering your life">
    <meta name="twitter:image" content="/Pictures/Logo/Tsunami Flow Logo.png">

    <meta name="google-site-verification" content="Yae7Q7bC5eK9FjTbjARZOisTwVTVknEe0tLWT4EiVqU" />
    <meta name="google-adsense-account" content="ca-pub-1650194129657038"-->

    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1650194129657038"
        crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <script src="https://js.stripe.com/v3/"></script>

    <!-- WebRTC Adapter -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/webrtc-adapter/8.1.2/adapter.min.js"
        integrity="sha512-l40eBFtXx+ve5RryIELC3y6/OM6Nu89mLGQd7fg1C93tN6XrkC3supb+/YiD/Y+B8P37kdJjtG1MT1kOO2VzxA=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>

    <!-- CSS -->
    <link rel="stylesheet" href="./MyStyle/tfMain.css" />

    <!-- Misc -->
        <link rel="manifest" href="/manifest.json">
        <meta name="theme-color" content="#000000">
        <meta name="mobile-web-app-capable" content="yes">
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png">

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
<body id="theBody">
    <header id="tfHeaderFr">
        <div>
            <h3 id="TFtime">Time</h3>
            <p5 id="tfWordOfTheDay"></p5>
            <br />
            <p5 id="TimeInfo"></p5>

        </div>
        <div>
            <h3>TF News & History</h3>
            <p3 id="NTS">News Currently Unavailable</p3>
        </div>
        <div>
            <h3>Weather</h3>
            <p3 id="TFweather"></p3>
            <p6 id="TfAd"></p>
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
                <address id="authorStuffTF" itemscope itemref="a b c" itemtype="">
                    <p itemprop="b">Homebase: Tyacdome <br />Location: The Land of Dreams <br /></p>
                    <p itemprop="c">Planet: Earth<br />Galaxy: Milky Way<br /></p>
                </address>
            </span>
            <p1 id="TFdonation"></p1>
                <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                    <input type="hidden" name="cmd" value="_s-xclick" />
                    <input type="hidden" name="hosted_button_id" value="3LQGL334FUKLW" />
                    <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" />
                    <img="Please donate." border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                </form>
            </p1>
        </aside>
        <section>
            <div id="mainTsectionFdiv" height="800" width="800"></div>
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
                        <label for="SubmitButton"><button id="FreeLevelSubmit" class="SubFormButton" name="TFRegisterFreeLevelButton" type="submit"> Subscribe </button></label>
                    </fieldset>
                </form>
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
<?php if ($showSuccess): ?>
    <div id="TFstore">
        <h2>Tsunami Flow Store</h2>
        <ul>
            <?php foreach ($myProductsFr['result'] as $ItemsFr): ?>
                <li id="<?php echo htmlspecialchars($ItemsFr['name'] ?? 'No Name'); ?>">
                    <h4><?php echo htmlspecialchars($ItemsFr['name'] ?? 'No Name'); ?></h4>
                    <img src="<?php echo htmlspecialchars($ItemsFr['thumbnail_url'] ?? ''); ?>" alt="Product Image">
                    <p>
                        <?php
                        $TheDescriptionFr = PrintfulProductionDescription($ItemsFr['id']);
                        echo htmlspecialchars($TheDescriptionFr['result']['product']['description'] ?? 'Description Unavailable');
                        ?>
                    </p>
                    <?php
                    $printfulVariants = getVariantandPrice($ItemsFr['id']);
                    ?>
                    <form method="POST" action="server.php">
                        <?php if (is_array($printfulVariants['sync_variants'] ?? null) && !empty($printfulVariants['sync_variants'])): ?>
                            <select name="product_id" required>
                                <?php foreach ($printfulVariants['sync_variants'] as $variant): ?>
                                    <option value="<?php echo htmlspecialchars($variant['id']); ?>">
                                        <?php 
                                        echo htmlspecialchars($variant['name']); 
                                        echo " (Price: " . htmlspecialchars($variant['retail_price']) . ")";
                                        echo " (Size: " . htmlspecialchars($variant['size']) . ")";
                                        echo " (Availability: " . htmlspecialchars($variant['availability_status']) . ")";
                                        ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                            <br>
                        <?php else: ?>
                            <select>
                                <option value="">No Variants Available</option>
                            </select>
                        <?php endif; ?>

                        <input type="number" name="StoreQuantity" value="1" min="1" max="1000">
                        <button id="StoreButton" type="submit" name="addProductToCart">Add to Cart</button>
                    </form>
                </li>
            <?php endforeach; ?>
        </ul>
        <p>Cost:</p>
    </div>
<?php endif; ?>
<script type="module" crossorigin="anonymous">
    import "./JS/tfMain.js";

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/service-worker.js").then(reg => console.log("Service Worker Register", reg.scope)).catch(err => console.warn("SW registration bad: ", err));
    }
</script>
</footer>
</body>
</html>