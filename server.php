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

// --- Dependencies ---
require_once "functions.php";
use Aws\S3\S3Client;
use Aws\Credentials\Credentials;
use Aws\Exception\AwsException;
use Stripe\StripeClient;

// --- AWS / Cloudflare R2 ---
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
$_SESSION["visit_count"] = ($_SESSION["visit_count"] ?? 0) + 1;
$_SESSION["UserPreferences"] = $_SESSION["UserPreferences"] ?? ["Chosen_Companion" => "Ackma Hawk"];
$_SESSION["Setting"] = $_SESSION["Setting"] ?? ["font_style" => "auto"];

// --- Membership / visit counters ---
function incrementMembershipCounters() {
    $_SESSION["TfGuestCount"] = $_SESSION["TfGuestCount"] ?? 0;
    $_SESSION["freeMembershipCount"] = $_SESSION["freeMembershipCount"] ?? 0;
    $_SESSION["lowestMembershipCount"] = $_SESSION["lowestMembershipCount"] ?? 0;
    $_SESSION["middleMembershipCount"] = $_SESSION["middleMembershipCount"] ?? 0;
    $_SESSION["highestMembershipCount"] = $_SESSION["highestMembershipCount"] ?? 0;
    $_SESSION["TfMemberCount"] = $_SESSION["TfMemberCount"] ?? 0;

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
$data = json_decode($inputJson, true) ?: [];

// --- Fetch Radio Songs ---
if ($_SERVER["REQUEST_METHOD"] === "POST" && ($_SERVER["HTTP_X_REQUEST_TYPE"] ?? '') === "fetchRadioSongs") {

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
                $url = $decodedKey; // Replace with public R2 URL if needed
                if ($index2 !== null) $array[$index][$index2][] = $url;
                else $array[$index][] = $url;
                $array[11] = $array[11] ?? [];
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
$StfPk = new StripeClient(getenv("StripeSecretKey"));
$TsunamiFlowClubDomain = "https://www.tsunamiflow.club";
$StripeToken = "TsunamiFlowClubStripeToken";

// --- Main ---
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'POST') {
        if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
            $data = json_decode(file_get_contents('php://input'), true) ?: [];
        }

        // Stripe Checkout callback
        if (isset($_POST['token']) && $_POST['token'] === $StripeToken) {
            $session_id = $_POST['session_id'] ?? null;
            if (!$session_id) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing session_id']);
                exit;
            }

            try {
                $session = \Stripe\Checkout\Session::retrieve($session_id);
                $metadata = $session->metadata ?? [];
                if (!empty($metadata['TFRegisterPassword'])) {
                    $metadata['TFRegisterPassword'] = password_hash($metadata['TFRegisterPassword'], PASSWORD_DEFAULT);
                }

                InputIntoDatabase(...array_values($metadata));

                header("Location: $TsunamiFlowClubDomain");
                exit;

            } catch (\Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Stripe session error: ' . $e->getMessage()]);
                exit;
            }

        } elseif (($data['type'] ?? '') === 'Subscribers Signup') {
            // handle signup (free or paid)
            $membership = $_POST['membershipLevel'] ?? 'free';
            $userData = $_POST;
            if (!empty($userData['TFRegisterPassword'])) {
                $userData['TFRegisterPassword'] = password_hash($userData['TFRegisterPassword'], PASSWORD_DEFAULT);
            }

            if ($membership === 'free') {
                InputIntoDatabase($membership, ...array_values($userData));
                echo json_encode(['success' => true, 'message' => 'Free membership created']);
            } else {
                $costMap = ['regular'=>400, 'vip'=>700, 'team'=>1000];
                $membershipCost = $costMap[strtolower($membership)] ?? 2000;

                $checkoutSession = \Stripe\Checkout\Session::create([
                    'payment_method_types' => ['card'],
                    'mode' => 'payment',
                    'line_items' => [[
                        'price_data' => [
                            'currency' => 'usd',
                            'unit_amount' => $membershipCost,
                            'product_data' => ['name' => 'Community Member Signup Fee'],
                        ],
                        'quantity' => 1,
                    ]],
                    'success_url' => "$TsunamiFlowClubDomain/server.php?session_id={CHECKOUT_SESSION_ID}",
                    'cancel_url' => "$TsunamiFlowClubDomain/failed.php",
                    'metadata' => $userData,
                ]);

                header("Location: " . $checkoutSession->url);
                exit;
            }

        } elseif (($data['type'] ?? '') === 'Navigation Login') {
            if (!empty($data['log in'])) {
                $_SESSION['LoginStatus'] = true;
                echo json_encode(['success' => true]);
            } else {
                $_SESSION['LoginStatus'] = false;
                echo json_encode(['success' => true, 'message' => 'Logged out']);
            }

        } elseif (($data['type'] ?? '') === 'Tsunami Flow Store') {
            echo json_encode(['success' => true, 'message' => 'Store endpoint hit']);

        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid POST type']);
        }

    } elseif ($method === 'GET') {
        if (isset($_GET['shopping_cart'])) {
            $_SESSION['ShoppingCartItems'] = $_GET['shopping_cart'];
            echo json_encode(['success' => true, 'items' => $_SESSION['ShoppingCartItems']]);
        } else {
            echo json_encode(['success' => true, 'message' => 'GET request received']);
        }

    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid request method']);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

// --- Printful / fallback ---
$myProductsFr = false; // Replace with actual Printful request if needed
if (!$myProductsFr) {
    echo "No data received from Printful API.";
} else {
    $showSuccess = isset($_GET["success"]) && $_GET["success"] === "true";
}

?>