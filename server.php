<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set("session.cookie_secure", true);
ini_set("session.cookie_httponly", "1");
ini_set("session.gc_maxlifetime", 3600);
ini_set("session.cookie_lifetime", 0);
ini_set("session.use_strict_mode", true);

session_start();

// MP3
header("Accept-Ranges: bytes");

header("Access-Control-Allow-Origin: https://www.tsunamiflow.club https://world.tsunamiflow.club https://tsunamiflow.club");
//header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With");
//header("Content-Security-Policy: default-src 'self'; script-src 'self' https://www.tsunamiflow.club https://world.tsunamiflow.club https://tsunamiflow.club; style-src 'self' 'unsafe-inline'; connect-src 'self' wss://world.tsunamiflow.club wss://www.tsunamiflow.club; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' https://www.tsunamiflow.club https://world.tsunamiflow.club");

//header("Strict-Transport-Security: max-age=31536000; includeSubDomains; preload");

/*
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header("Referrer-Policy: no-referrer-when-downgrade");
header("Permissions-Policy: camera=(), microphone=(), geolocation=()");
header("Cross-Origin-Opener-Policy: same-origin");
header("Cross-Origin-Embedder-Policy: require-corp");
header("Cross-Origin-Resource-Policy: same-origin");
*/
require_once "functions.php";

//use Stripe\Stripe;
//use Stripe\StripeClient;
//use \Stripe\Exception\ApiErrorException;
//$StripeKeyTf = Stripe::setApiKey(TfStripeSecretKey);
//$StfPk = new StripeClient(TfStripeSecretKey);

//ip address
getIpAddress();

$GetJson = @file_get_contents("php://ipnut");
$data = json_decode($GetJson);

//User Time
$TfUserTime = time();

//Community
$_SESSION["UserPreferences"] = [
    "Chosen_Companion" => "Ackma Hawk"
];

$_SESSION["Setting"] = [
    "font_style" => "auto"
];
/*
curl_init(); //initializes the session
curl_setopt(); //configure options like the URL, HTTP, method, headers, or data payload,
curl_exec(); //executes the session and returns the response.
curl_close(); //close the cURL session to free resources.

Turn Server Stuff Uncomment later when you ready
*/

/*
//Session
// use the code below to display all available session data
// var_dump($_SESSION);
*/

//Session Starts
//$_SESSION["TfGuest"]; 
//$_SESSION["TfNifage"] = true; 
//$_SESSION["freeMembership]; 
// $_SESSION["regularMembership"]; 
// $_SESSION["vipMembership"]; 
// $_SESSION["teamMembership"];
if(!isset($_SESSION["visit_count"])) {
    $_SESSION["visit_count"] = 1;
    if (isset($_COOKIE["visit_count"])) {
        setcookie("visit_count", $_SESSION["visit_count"]);
    } else {
        setcookie("visit_count", $_SESSION["visit_count"], (time() + 86400));
    }
    if (!isset($_SESSION["TfNifage"])) {
        if(!isset($_SESSION["TfGuest"])) {
            $_SESSION["TfGuest"] = session_id();
            $member = $_SESSION["TfGuest"];
            $_SESSION["TfNifage"] = false;
            $_SESSION["TfAccess"] = "guest";
            $TfAccessLevel = $_SESSION["TfAccess"];
            if (isset($_COOKIE["TfAccess"])) {
                setcookie("TfAccess", $TfAccessLevel);
            } else {
                setcookie("TfAccess", $TfAccessLevel, (time() + 86400 * 30));
            }
            $_SESSION["TfGuestCount"] = 1;
            setcookie("TfGuestCount", $_SESSION["TfGuestCount"], (time() + 86400));
        }  else {
            $_SESSION["TfGuestCount"] + 1;
        }   
    } else if ($_SESSION["TfNifage"] === false) {
            $_SESSION["TfGuestCount"] + 1;
    } else {
        if($_SESSION["TfAccess"] !== "Team") {
            if($_SESSION["TfAccess"] !== "Vip") {
                if($_SESSION["TfAccess"] !== "Regular") {
                    $_SESSION["freeMembershipCount"] + 1;
                } else {
                    $_SESSION["lowestMembershipCount"] + 1;
                }
            } else {
                $_SESSION["middleMembershipCount"] + 1;
            }
        } else {
            $_SESSION["highestMembershipCount"] + 1;
        }
        $_SESSION["TfMemberCount"] + 1;
        if (isset($_COOKIE["TfAccess"])) {
            setcookie("TfAccess", $TfAccessLevel);
        } else {
        setcookie("TfAccess", $TfAccessLevel, (time() + 86400 * 30));
        }
    }
} else {
    $_SESSION["visit_count"] + 1;
    if ($_SESSION["TfNifage"] === false) { 
            $_SESSION["TfGuestCount"] + 1;
    } else {
        if($_SESSION["TfAccess"] !== "Team") {
            if($_SESSION["TfAccess"] !== "Vip") {
                if($_SESSION["TfAccess"] !== "Regular") {
                    $_SESSION["freeMembershipCount"] + 1;
                } else {
                    $_SESSION["lowestMembershipCount"] + 1;
                }
            } else {
                $_SESSION["middleMembershipCount"] + 1;
            }
        } else {
            $_SESSION["highestMembershipCount"] + 1;
        }
        $_SESSION["TfMemberCount"] + 1;
    }
}

// Ensure request type
if (isset($_SERVER["HTTP_X_REQUEST_TYPE"]) {
if ($_SERVER["HTTP_X_REQUEST_TYPE"] === "fetchRadioSongs") {
// --- Category array shape ---
$sentToJsArray = array_fill(0, 24, []);

// Subarrays for categories with multiple subfolders
$multiSubArrays = [
    0 => 4, 1 => 4, 3 => 3, 4 => 3, 5 => 3, 6 => 3, 7 => 3, 8 => 6,
    9 => 3, 12 => 4, 13 => 4, 14 => 4, 15 => 4, 16 => 4, 18 => 6, 19 => 4, 20 => 4
];
foreach ($multiSubArrays as $idx => $count) {
    $sentToJsArray[$idx] = array_fill(0, $count, []);
}

// --- Initialize S3 client ---
$accessKey = getenv('CloudflareR2AccessKey');
$secretKey = getenv('CloudflareR2SecretKey');
$r2Endpoint = getenv('CloudflareR2Endpoint');
$bucketName = getenv('CloudflareR2Name') ?: 'tsunami-radio';

if (!$accessKey || !$secretKey || !$r2Endpoint) {
    http_response_code(500);
    echo json_encode(["error" => "Missing R2 credentials or endpoint."]);
    exit;
}

try {
    $credentials = new Credentials($accessKey, $secretKey);
    $s3 = new S3Client([
        "region" => "auto",
        "endpoint" => $r2Endpoint,
        "version" => "latest",
        "credentials" => $credentials,
        "use_path_style_endpoint" => false
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to initialize S3 client: " . $e->getMessage()]);
    exit;
}

// --- Function to add songs ---
function addSongsToArray($path, array &$array, int $index, $index2 = null, S3Client $s3 = null, string $bucket = 'tsunami-radio') {
    if (!$s3) return;
    $prefix = rtrim(ltrim($path, '/'), '/') . '/';
    try {
        $Objects = $s3->listObjectsV2([
            "Bucket" => $bucket,
            "Prefix" => $prefix,
            "MaxKeys" => 1000
        ]);
        if (!isset($Objects["Contents"]) || !is_array($Objects["Contents"])) return;

        foreach ($Objects["Contents"] as $obj) {
            if (!isset($obj['Key']) || !str_ends_with(strtolower($obj['Key']), '.mp3')) continue;
            $decodedKey = trim(urldecode(ltrim($obj['Key'], '/')));
            $url = "https://www.tsunamiflow.club/" . $decodedKey;

            if ($index2 !== null) {
                $array[$index][$index2][] = $url;
            } else {
                $array[$index][] = $url;
            }
            $array[11][] = $url; // All Music
        }
    } catch (AwsException $e) {
        error_log("AWS Exception: " . $e->getMessage());
    }
}

// --- Music mapping array ---
$musicMapping = [
    0 => ['IceBreakers','Flirting','GetHerDone','Shots'],
    1 => ['Twerking','LineDance','PopDance','Battle'],
    2 => [null], // Afterparty
    3 => ['Foreplay','sex','Cuddle'],
    4 => ['Memories','love','Intimacy'],
    5 => ['Lifestyle','Values','Kids'],
    6 => ['Motivation','Meditation','Something'],
    7 => ['DH','BAH','HFnineteen'],
    8 => ['Neutral','Democracy','Republican','Socialism','Bureaucracy','Aristocratic'],
    9 => ['Fighters','Shooters','Instrumentals'],
    10 => [null], // Comedy
    12 => ['Poems','SS','Instrumentals','Books'],
    13 => ['Reviews','Fans','Updates','Disses'],
    14 => ['News','Music','History','Instrumentals'],
    15 => ['Biology','Chemistry','Physics','Environmental'],
    16 => ['EP','Seller','Mortgage','Buyer'],
    17 => [null], // DJShuba
    18 => ['NM','SHM','MH','VM','LS','CB'],
    19 => ['PD','LD','FH','SM'],
    20 => ['FE','TOB','Insurance','TE'],
    21 => [null], // Hustlin
    22 => [null], // Pregame
    23 => [null], // Outside
];

// --- Loop through mapping ---
foreach ($musicMapping as $catIndex => $subFolders) {
    foreach ($subFolders as $subIndex => $folder) {
        $path = $folder ? "Music/" . array_search($catIndex, array_keys($musicMapping)) . "/$folder/" : "Music/";
        // Fix actual folder path based on category names
        $categoryFolders = [
            0=>'Rizz',1=>'Dance',2=>'Afterparty',3=>'Sex',4=>'Love',5=>'Family',
            6=>'Inspiration',7=>'History',8=>'Politics',9=>'Gaming',10=>'Comedy',
            12=>'Literature',13=>'Sports',14=>'Tech',15=>'Science',16=>'RealEstate',
            17=>'DJshuba',18=>'Film',19=>'Fashion',20=>'Business',21=>'Hustlin',
            22=>'Pregame',23=>'Outside'
        ];
        $catName = $categoryFolders[$catIndex] ?? '';
        $fullPath = $folder ? "Music/$catName/$folder/" : "Music/$catName/";
        addSongsToArray($fullPath, $sentToJsArray, $catIndex, $folder !== null ? $subIndex : null, $s3, $bucketName);
    }
}

// --- Output JSON ---
echo json_encode($sentToJsArray, JSON_INVALID_UTF8_IGNORE | JSON_UNESCAPED_SLASHES);
exit;
}
} else if ($_SERVER["REQUEST_METHOD"] === "POST") {
    //Get javascript information.
    $TsunamiFlowClubDomain = "https://www.tsunamiflow.club";

    if(isset($_POST["token"]) && $_POST["token"] === "TsunamiFlowClubStripeToken") {
        //get the checkout session
        $session_id = $_POST["session_id"];
        $TsunamiFlowStripeSuccessSession = \Stripe\Checkout\Session::retrieve($session_id);

        //Get information you want to use.
        $metadata = $TsunamiFlowStripeSuccessSession->metadata;
            //Validate User Information Next.
            $TfMlCts = $metadata["membership"];
            $fiNa = $metadata["FirstName"]; //$metadata["tfFirstName"];
            $laNa = $metadata["LastName"];
            $niNa = $metadata["NickName"];
            $gede = $metadata["Gender"];
            $bihda = $metadata["Birthday"];
            $eml = $_POST["Email"];
            //$eml = TsunamiInput($_POST["TFRegisterEmail"]);
            $usNa = $metadata["Username"];
            $Checkpassword = $metadata["TFRegisterPassword"];
            $pawo = password_hash($Checkpassword, PASSWORD_DEFAULT);
            $chZoSi = $metadata["ChineseZodiacSign"];
            $weZoSi = $metadata["WesternZodiacSign"];
            $spiAna = $metadata["SpiritAnimal"];
            $ceTrZoSi = $metadata["CelticTreeZodiacSign"];
            $naAmZoSi = $metadata["NativeAmericanZodiacSign"];
            $veAsSi = $metadata["VedicAstrologySign"];
            $guAg = $metadata["GuardianAngel"];
            $ChEl = $metadata["ChineseElement"];
            $eyCoMe = $metadata["EyeColorMeaning"];
            $GrMyAr = $metadata["GreekMythologyArchetype"];
            $NoMyPaDe = $metadata["NorseMythologyPatronDeity"];
            $EgZoSi = $metadata["EgyptianZodiacSign"];
            $MaZoSi =  $metadata["MayanZodiacSign"];
            $loLaua = $metadata["LoveLanguage"];
            $biSt = $metadata["Birthstone"];
            $biFl = $metadata["BirthFlower"];
            $blTy = $metadata["BloodType"];
            $atchntyl = $metadata["AttachmentStyle"];
            $chisTy = $metadata["CharismaType"];
            $bunePeonit = $metadata["BusinessPersonality"];
            $usDIC = $metadata["DISC"];
            $soonsTy = $metadata["SocionicsType"];
            $leniSte = $metadata["LearningStyle"];
            $finclPsonityp = $metadata["FinancialPersonalityType"];
            $prarotatnSle = $metadata["PrimaryMotivationStyle"];
            $crtiSte = $metadata["CreativeStyle"];
            $coliMagentyl = $metadata["ConflictManagementStyle"];
            $teRoPrerc = $metadata["TeamRolePreference"];

        InputIntoDatabase($TfMlCts, $usNa, $fiNa, $laNa, $niNa, $gede, $bihda, $eml, $pawo, $chZoSi, $weZoSi, $spiAna, $ceTrZoSi, $naAmZoSi, $veAsSi, $guAg, $ChEl, $eyCoMe, $GrMyAr, $NoMyPaDe, $EgZoSi, $MaZoSi, $loLaua, $biSt, $biFl, $blTy, $atchntyl, $chisTy, $bunePeonit, $usDIC, $soonsTy, $leniSte, $finclPsonityp, $prarotatnSle, $crtiSte, $coliMagentyl, $teRoPrerc);

        header("Location: https://www.tsunamiflow.club");
        exit;
    } else if (isset($data["type"])) {
        //Community
        if($data["type"] === "Subscribers Signup") {
        
        $TfMlCts = validate_input("membershipLevel", $_POST);
        $MembershipCost = validate_input("membershipCost", $_POST);
        //$PaymentTypeFr = validate_input("PTFform", $_REQUEST);
        $SCidBroIdk = validate_input("SCidFR", $_POST);

        //Validate User Information Next.
        if (empty($_POST["TFRegisterFirstName"]) || empty($_POST["TFRegisterLastName"]) || empty($_POST["TFRegisterNickName"]) || empty($_POST["TFRegisterGender"]) || empty($_POST["TFRegisterBirthday"]) || empty($_POST["TFRegisterEmail"]) || empty($_POST["TFRegisterUsername"]) || empty($_POST["TFRegisterPassword"])) {
            echo ("Missing required fields");
        } else {
            $fiNa = validate_input("TFRegisterFirstName", $_POST);
            $laNa = validate_input("TFRegisterLastName", $_POST);
            $niNa = validate_input("TFRegisterNickName", $_POST);
            $gede = validate_input("TFRegisterGender", $_POST);
            $bihda = validate_input("TFRegisterBirthday", $_POST);
            $eml = $_POST["TFRegisterEmail"];
            //$eml = TsunamiInput($_POST["TFRegisterEmail"]);
            $usNa = validate_input("TFRegisterUsername", $_POST);
            $Checkpassword = validate_input("TFRegisterPassword", $_POST);
            $pawo = password_hash($Checkpassword, PASSWORD_DEFAULT);
            $chZoSi = validate_input("ChineseZodiacSign", $_POST);
            $weZoSi = validate_input("WesternZodiacSign", $_POST);
            $spiAna = validate_input("SpiritAnimal", $_POST);
            $ceTrZoSi = validate_input("CelticTreeZodiacSign", $_POST);
            $naAmZoSi = validate_input("NativeAmericanZodiacSign", $_POST);
            $veAsSi = validate_input("VedicAstrologySign", $_POST);
            $guAg = validate_input("GuardianAngel", $_POST);
            $ChEl = validate_input("ChineseElement", $_POST);
            $eyCoMe = validate_input("EyeColorMeaning", $_POST);
            $GrMyAr = validate_input("GreekMythologyArchetype", $_POST);
            $NoMyPaDe = validate_input("NorseMythologyPatronDeity", $_POST);
            $EgZoSi = validate_input("EgyptianZodiacSign", $_POST);
            $MaZoSi =  validate_input("MayanZodiacSign", $_POST);
            $loLaua = validate_input("LoveLanguage", $_POST);
            $biSt = validate_input("Birthstone", $_POST);
            $biFl = validate_input("BirthFlower", $_POST);
            $blTy = validate_input("BloodType", $_POST);
            $atchntyl = validate_input("AttachmentStyle", $_POST);
            $chisTy = validate_input("CharismaType", $_POST);
            $bunePeonit = validate_input("BusinessPersonality", $_POST);
            $usDIC = validate_input("DISC", $_POST);
            $soonsTy = validate_input("SocionicsType", $_POST);
            $leniSte = validate_input("LearningStyle", $_POST);
            $finclPsonityp = validate_input("FinancialPersonalityType", $_POST);
            $prarotatnSle = validate_input("PrimaryMotivationStyle", $_POST);
            $crtiSte = validate_input("CreativeStyle", $_POST);
            $coliMagentyl = validate_input("ConflictManagementStyle", $_POST);
            $teRoPrerc = validate_input("TeamRolePreference", $_POST);

            //Create Stripe Checkout
            if ($TfMlCts === "free") {
                InputIntoDatabase($TfMlCts, $usNa, $fiNa, $laNa, $niNa, $gede, $bihda, $eml, $pawo, $chZoSi, $weZoSi, $spiAna, $ceTrZoSi, $naAmZoSi, $veAsSi, $guAg, $ChEl, $eyCoMe, $GrMyAr, $NoMyPaDe, $EgZoSi, $MaZoSi, $loLaua, $biSt, $biFl, $blTy, $atchntyl, $chisTy, $bunePeonit, $usDIC, $soonsTy, $leniSte, $finclPsonityp, $prarotatnSle, $crtiSte, $coliMagentyl, $teRoPrerc);

                // Use this for regular file shit file_put_contents("Database.csv", $TheEntireFormFr) 
            } else {
                global $StfPk;
                    error_log("Stripe PaymentMethod ID received: $SCidBroIdk");

                    if ($TfMlCts == "regular") {
                        if ($membershipCost >= 0.49 || $membershipCost <= 4.01) {
                            $membershipCost = 4;
                        } else {
                            $membershipCost = 4;
                        }
                    } else if ($TfMlCts == "vip") {
                        if ($membershipCost >= 4 || $membershipCost <= 7.01) {
                            $membershipCost = 4;
                        } else {
                            $membershipCost = 4;
                        }
                    } else if ($TfMlCts == "team") {
                        if ($membershipCost >= 7 || $membershipCost <= 10.01) {
                            $membershipCost = 10;
                        } else {
                            $membershipCost = 10;
                        }
                    } else {
                        $membershipCost = 20;
                    }

                    $TsunamiFlowCheckoutAmount = $membershipCost;

                    $TsunamiFlowStripeCheckoutSession =  \Stripe\Checkout\Session::create([
                        "payment_method_types" => ["card"],
                        "mode" => "payment", //subscription
                        "line_items" => [[
                            "price_data" => [
                                "currency" => "usd",
                                "unit_amount" => $membershipCost, //amount in cents
                                "product_data" => [
                                    "name" => "Community Member Signup Fee",
                                ],
                            ],
                            "quantity" => 1,
                        ]],
                        "success_url" => "$TsunamiFlowClubDomain/server.php?session_id={CHECKOUT_SESSION_ID}",
                        "cancel_url" => "$TsunamiFlowClubDomain/failed.php",
                        "metadata" => [
                            "membership" => $TfMlCts,
                            "FirstName" => $fiNa,
                            "LastName" => $laNa,
                            "NickName" => $niNa,
                            "Gender" => $gede,
                            "Birthday" => $bihda,
                            "Email" => $eml,
                            "Username" => $usNa,
                            "Password" => $Checkpassword,
                            "ChineseZodiacSign" => $chZoSi,
                            "WesternZodiacSign" => $weZoSi,
                            "SpiritAnimal" => $spiAna,
                            "CelticTreeZodiacSign" => $ceTrZoSi,
                            "NativeAmericanZodiacSign" => $naAmZoSi,
                            "VedicAstrologySign" => $veAsSi,
                            "GuardianAngel" => $guAg,
                            "ChineseElement" => $ChEl,
                            "EyeColorMeaning" => $eyCoMe,
                            "GreekMythologyArchetype" => $GrMyAr,
                            "NorseMythologyPatronDeity" => $NoMyPaDe,
                            "EgyptianZodiacSign" => $EgZoSi,
                            "MayanZodiacSign" => $MaZoSi,
                            "LoveLanguage" => $loLaua,
                            "Birthstone" => $biSt,
                            "BirthFlower" => $biFl, 
                            "BloodType" => $blTy,
                            "AttachmentStyle" => $atchntyl,
                            "CharismaType" => $chisTy,
                            "BusinessPersonality" => $bunePeonit,
                            "DISC" => $usDIC,
                            "SocionicsType" => $soonsTy,
                            "LearningStyle" => $leniSte, 
                            "FinancialPersonalityType" => $finclPsonityp,
                            "PrimaryMotivationStyle" =>  $prarotatnSle,
                            "CreativeStyle" => $crtiSte,
                            "ConflictManagementStyle" => $coliMagentyl,
                            "TeamRolePreference" => $teRoPrerc
                        ],
                    ]);

                    header("Location: " . $TsunamiFlowStripeCheckoutSession->url);
                    exit;
                //Subscriptions Ends
                }
            }
        } else if($data["type"] === "Navigation Login") {
            if ($data["log in"] === true) {
                // Allow specific headers
                header("Access-Control-Allow-Headers: X-Requested-With, Content-Type");
                // Allow specific methods
                //NavLoginFr();
                // use session_regenerate_id() for every login attempt.
                $_SESSION["LoginStatus"] = "is the user logged in or nah";
            } else {
                //tfLogOut(); // logout function already created.
            }
        } else if($data["type"] === "Tsunami Flow Store") {
            if ($data["shopping cart"] === true) {
                //Shopping Cart
                    UserShoppingCartWishList();
            } else if ($data["tycadome order"]) {
                $UserCity = validate_input("tfOrdPaymentCity", $_POST);
                $UserCountry = validate_input("tfOrdPaymentCountry", $_POST);
                $streetPOorCompanyName = validate_input("tfOrdPaymentAddress1", $_POST);
                $ApartmentSuiteUnitBuilding = validate_input("tfOrdPaymentAddress2", $_POST);
                $ZipOrPostalCode = validate_input("tfOrdPostalCode", $_POST);
                $StateCountyProvinceRegion = validate_input("tfOrdState", $_POST);
                $SomeStoreNumber = validate_input("tfOrdPhoneNumber", $_POST);

            // Gather cart items (from session)
                $items = [];
                $totalPriceOk = 0;

                foreach ($_SESSION["TfShoppingCartWish"] as $cartItem) {
                    $items[] = [
                        'product_id' => $cartItem['product_id'],
                        'variant_id' => $cartItem['variant_id'],
                        'quantity' => $cartItem['quantity'],
                        'name' => $cartItem['name'],
                        'price' => $cartItem['price']
                    ];
                    $totalPriceOk = $totalPriceOk + $cartItem['price'];
                };

            //Draft the Order in Printful
                $oDtF = [
                    "recipient" => [
                        "name" => $CustomerName,
                        "address1" => $streetPOorCompanyName,
                        "address2" => $ApartmentSuiteUnitBuilding ?? '',
                        "city" => $UserCity,
                        "state_code" => $StateCountyProvinceRegion,
                        "country_code" => $UserCountry,
                        "zip" => $ZipOrPostalCode,
                        "email" => $CustomersEmail
                    ],
                    "items" => [],
                    //"shipping_method" => $shippingMethod, 
                    //"packing_slip" => ["email" => "","phone" => "","message" => "","logo_url" => "",]
                ];

            //price total before tax
                $estimatedTotalPrice0Tax = $totalPriceOK;

            //Real Price 
                $tfRealStorePrice = $estimatedTotalPrice0Tax;

            //payment Method ID
                $tsTFpmID = validate_input("pmIDtsTF", $_POST);

                //Create a Customer Printful (hopefully I can use sStripe to .
                //$CreatedCustomer = TcreateFCustomer($tsTFpmID);

                //Draft the Order.
                //NPOtfTS($oDtF);

                //create Payment Intent
                
                $tsTFpiID = validate_input("SpPiTfFr", $_POST);

            }
        } else {
                echo(json_encode([
                    "error" => "",
                    "log" => "",
                    "url" => "",
                    'status' => "", 
                    'customer_email' => ""
                ]));
        };
    } else {
        http_response_code(403);
        exit("Unauthorized");
    }
    /////Server php stuff now 
} else if ($_SERVER["REQUEST_METHOD"] === "GET") {
    //$_SESSION["PermissionLevel"] = "are you over or under the age of 18";
    //$_SESSION["TemporaryData"] = "I'm most likely gonna use localstorage or something like that instead of this.";

    if (isset($_GET["Shopping Cart"])) {
        $TfCart = [];
        foreach($_GET["Shopping Cart"] as $product) {
            array_push($product, $TfCart);
            }
            $_SESSION["ShoppingCartItems"] = $TfCart;

        /*                        
            header("Content-Type: application/json");
            echo json_encode([
                "ip" => $ip_address
                "status" => "ok",
                "visits" => $_SESSION["visit_count"],
                "guest_visits" => $_SESSION["TfGuestCount"],
                "member_visits" => $_SESSION["TfNifageCount"],
                "free_visits" => $_SESSION["freeMembershipCount"],"low_visits" => $_SESSION["lowestMembershipCount"],
                "middle_visits" => $_SESSION["middleMembershipCount"],
                "high_visits" => $_SESSION["highestMembershipCount"],
                "member" => $_SESSION["TfNifage"],
                "member_level" => $_SESSION["TfAccess"],
                "username" => $member
            ]);
        */
    } else {

    }
} else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid Request Type"]);
exit;
}

//If Statements End
// Lets Begin the Process Now 

// $myProductsFr = BasicPrintfulRequest();
$myProductsFr = false;

if (!$myProductsFr) {
    $showSuccess = "No data received from Printful API. ";
    echo ($showSuccess);
} else {
    $showSuccess = isset($_GET["success"]) && $_GET["success"] === "true";
}
    
?>