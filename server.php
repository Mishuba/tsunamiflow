<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set("session.cookie_secure", true);
ini_set("session.cookie_httponly", 1);
ini_set("session.gc_maxlifetime", 3600);
ini_set("session.cookie_lifetime", 0);
ini_set("session.use_strict_mode", true);

session_start();

// --- CORS ---
$allowed = [
    "https://www.tsunamiflow.club",
    "https://world.tsunamiflow.club",
    "https://tsunamiflow.club"
];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With");
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --- AWS / Cloudflare R2 ---
require_once "functions.php";
use Aws\S3\S3Client;
use Aws\Credentials\Credentials;
use Aws\Exception\AwsException;

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

// --- Session defaults ---
if (!isset($_SESSION["visit_count"])) $_SESSION["visit_count"] = 0;
$_SESSION["visit_count"] += 1;

if (!isset($_SESSION["UserPreferences"])) $_SESSION["UserPreferences"] = ["Chosen_Companion" => "Ackma Hawk"];
if (!isset($_SESSION["Setting"])) $_SESSION["Setting"] = ["font_style" => "auto"];

// --- Membership / visit counters ---
function incrementMembershipCounters() {
    if (!isset($_SESSION["TfGuestCount"])) $_SESSION["TfGuestCount"] = 0;
    if (!isset($_SESSION["freeMembershipCount"])) $_SESSION["freeMembershipCount"] = 0;
    if (!isset($_SESSION["lowestMembershipCount"])) $_SESSION["lowestMembershipCount"] = 0;
    if (!isset($_SESSION["middleMembershipCount"])) $_SESSION["middleMembershipCount"] = 0;
    if (!isset($_SESSION["highestMembershipCount"])) $_SESSION["highestMembershipCount"] = 0;
    if (!isset($_SESSION["TfMemberCount"])) $_SESSION["TfMemberCount"] = 0;

    if (!isset($_SESSION["TfNifage"]) || $_SESSION["TfNifage"] === false) {
        $_SESSION["TfGuestCount"] += 1;
    } else {
        switch ($_SESSION["TfAccess"] ?? "free") {
            case "Regular": $_SESSION["lowestMembershipCount"] += 1; break;
            case "Vip": $_SESSION["middleMembershipCount"] += 1; break;
            case "Team": $_SESSION["highestMembershipCount"] += 1; break;
            default: $_SESSION["freeMembershipCount"] += 1;
        }
        $_SESSION["TfMemberCount"] += 1;
    }
}
incrementMembershipCounters();

// --- Cookies ---
$TfAccessLevel = $_SESSION["TfAccess"] ?? "guest";
setcookie("TfAccess", $TfAccessLevel, time() + 86400 * 30, "/", "", true, true);
setcookie("visit_count", $_SESSION["visit_count"], time() + 86400, "/", "", true, true);

// --- JSON Input ---
$inputJson = file_get_contents("php://input");
$data = json_decode($inputJson, true); // true = associative array

// --- Fetch Radio Songs ---
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_SERVER["HTTP_X_REQUEST_TYPE"]) && $_SERVER["HTTP_X_REQUEST_TYPE"] === "fetchRadioSongs") {

    $sentToJsArray = array_fill(0, 24, []);
    $multiSubArrays = [0=>4,1=>4,3=>3,4=>3,5=>3,6=>3,7=>3,8=>6,9=>3,12=>4,13=>4,14=>4,15=>4,16=>4,18=>6,19=>4,20=>4];
    foreach ($multiSubArrays as $idx=>$count) $sentToJsArray[$idx] = array_fill(0,$count,[]);

    function addSongsToArray($path, array &$array, int $index, $index2 = null, S3Client $s3, string $bucket) {
        $prefix = rtrim(ltrim($path, '/'), '/') . '/';
        try {
            $objects = $s3->listObjectsV2(["Bucket"=>$bucket,"Prefix"=>$prefix,"MaxKeys"=>1000]);
            if (!isset($objects["Contents"])) return;
            foreach ($objects["Contents"] as $obj) {
                if (!isset($obj['Key']) || !str_ends_with(strtolower($obj['Key']), '.mp3')) continue;
                $decodedKey = trim(urldecode(ltrim($obj['Key'], '/')));
                $url = $decodedKey; // replace with public R2 URL if needed
                if ($index2 !== null) $array[$index][$index2][] = $url;
                else $array[$index][] = $url;
                $array[11][] = $url; // all music
            }
        } catch (AwsException $e) {
            error_log("AWS Exception: " . $e->getMessage());
        }
    }

    // --- Music mapping ---
    $musicMapping = [
        0=>['IceBreakers','Flirting','GetHerDone','Shots'],
        1=>['Twerking','LineDance','PopDance','Battle'],
        2=>[null],
        3=>['Foreplay','sex','Cuddle'],
        4=>['Memories','love','Intimacy'],
        5=>['Lifestyle','Values','Kids'],
        6=>['Motivation','Meditation','Something'],
        7=>['DH','BAH','HFnineteen'],
        8=>['Neutral','Democracy','Republican','Socialism','Bureaucracy','Aristocratic'],
        9=>['Fighters','Shooters','Instrumentals'],
        10=>[null],
        12=>['Poems','SS','Instrumentals','Books'],
        13=>['Reviews','Fans','Updates','Disses'],
        14=>['News','Music','History','Instrumentals'],
        15=>['Biology','Chemistry','Physics','Environmental'],
        16=>['EP','Seller','Mortgage','Buyer'],
        17=>[null],
        18=>['NM','SHM','MH','VM','LS','CB'],
        19=>['PD','LD','FH','SM'],
        20=>['FE','TOB','Insurance','TE'],
        21=>[null],
        22=>[null],
        23=>[null]
    ];

    $categoryFolders = [
        0=>'Rizz',1=>'Dance',2=>'Afterparty',3=>'Sex',4=>'Love',5=>'Family',6=>'Inspiration',7=>'History',8=>'Politics',9=>'Gaming',
        10=>'Comedy',12=>'Literature',13=>'Sports',14=>'Tech',15=>'Science',16=>'RealEstate',17=>'DJshuba',18=>'Film',19=>'Fashion',
        20=>'Business',21=>'Hustlin',22=>'Pregame',23=>'Outside'
    ];

    foreach ($musicMapping as $catIndex=>$subFolders) {
        foreach ($subFolders as $subIndex=>$folder) {
            $catName = $categoryFolders[$catIndex] ?? '';
            $fullPath = $folder ? "Music/$catName/$folder/" : "Music/$catName/";
            addSongsToArray($fullPath, $sentToJsArray, $catIndex, $folder!==null?$subIndex:null, $s3, $bucketName);
        }
    }

    echo json_encode($sentToJsArray, JSON_INVALID_UTF8_IGNORE | JSON_UNESCAPED_SLASHES);
    exit;
}

// --- Stripe Setup ---
use Stripe\StripeClient;
$StfPk = new StripeClient(getenv("StripeSecretKey"));

// Add your Stripe POST / GET logic here, but remember:
// - Multiply amounts by 100
// - Use $data['type'] if JSON decoded with true
// - Handle free vs paid memberships correctly


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

if ($_SERVER["REQUEST_METHOD"] === "POST") {
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
            array_push($TfCart, $product);
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