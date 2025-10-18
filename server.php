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
$allowedOrigins = [
    "https://www.tsunamiflow.club",
    "https://world.tsunamiflow.club",
    "https://tsunamiflow.club"
];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With");
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(http_response_code(200));

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
    exit(json_encode(["error" => "Missing R2 credentials or endpoint."]));
}

try {
    $s3 = new S3Client([
        "region" => "auto",
        "endpoint" => $r2Endpoint,
        "version" => "latest",
        "credentials" => new Credentials($accessKey, $secretKey),
        "use_path_style_endpoint" => false
    ]);
} catch (Exception $e) {
    exit(json_encode(["error" => "Failed to initialize S3 client: " . $e->getMessage()]));
}

// --- Session defaults ---
$_SESSION["visit_count"] = ($_SESSION["visit_count"] ?? 0) + 1;
$_SESSION["UserPreferences"] = $_SESSION["UserPreferences"] ?? ["Chosen_Companion" => "Ackma Hawk"];
$_SESSION["Setting"] = $_SESSION["Setting"] ?? ["font_style" => "auto"];

// --- Membership counters ---
$membershipCounters = ["TfGuestCount","freeMembershipCount","lowestMembershipCount","middleMembershipCount","highestMembershipCount","TfMemberCount"];
foreach ($membershipCounters as $counter) $_SESSION[$counter] = $_SESSION[$counter] ?? 0;

if (!($_SESSION["TfNifage"] ?? false)) {
    $_SESSION["TfGuestCount"]++;
} else {
    switch ($_SESSION["TfAccess"] ?? "free") {
        case "Regular": $_SESSION["lowestMembershipCount"]++; break;
        case "Vip": $_SESSION["middleMembershipCount"]++; break;
        case "Team": $_SESSION["highestMembershipCount"]++; break;
        default: $_SESSION["freeMembershipCount"]++;
    }
    $_SESSION["TfMemberCount"]++;
}

// --- Cookies ---
setcookie("TfAccess", $_SESSION["TfAccess"] ?? "guest", time() + 86400 * 30, "/", "", true, true);
setcookie("visit_count", $_SESSION["visit_count"], time() + 86400, "/", "", true, true);

// --- JSON Input ---
$data = json_decode(file_get_contents("php://input"), true) ?: [];

// --- Fetch Radio Songs ---
if ($_SERVER["REQUEST_METHOD"] === "POST" && ($_SERVER["HTTP_X_REQUEST_TYPE"] ?? '') === "fetchRadioSongs") {

    $sentToJsArray = array_fill(0, 24, []);
    $multiSubArrays = [0=>4,1=>4,3=>3,4=>3,5=>3,6=>3,7=>3,8=>6,9=>3,12=>4,13=>4,14=>4,15=>4,16=>4,18=>6,19=>4,20=>4];
    foreach ($multiSubArrays as $i=>$count) $sentToJsArray[$i] = array_fill(0,$count,[]);

    function addSongs($path, array &$array, int $i, $j = null, S3Client $s3, string $bucket) {
    $prefix = rtrim(ltrim($path,'/'),'/') . '/';
    try {
        $paginator = $s3->getPaginator('ListObjectsV2', [
            'Bucket' => $bucket,
            'Prefix' => $prefix,
        ]);

        foreach ($paginator as $page) {
            foreach ($page['Contents'] ?? [] as $obj) {
                if (!isset($obj['Key']) || !str_ends_with(strtolower($obj['Key']), '.mp3')) continue;
                $url = trim(urldecode(ltrim($obj['Key'], '/')));
                if ($j !== null) $array[$i][$j][] = $url;
                else $array[$i][] = $url;
                $array[11][] = $url; // all music
            }
        }
    } catch (AwsException $e) {
        error_log("AWS Exception: " . $e->getMessage());
    }
}

    $musicMapping = [
        0=>['IceBreakers','Flirting','GetHerDone','Shots'],1=>['Twerking','LineDance','PopDance','Battle'],2=>[null],
        3=>['Foreplay','sex','Cuddle'],4=>['Memories','love','Intimacy'],5=>['Lifestyle','Values','Kids'],6=>['Motivation','Meditation','Something'],
        7=>['DH','BAH','HFnineteen'],8=>['Neutral','Democracy','Republican','Socialism','Bureaucracy','Aristocratic'],9=>['Fighters','Shooters','Instrumentals'],
        10=>[null],12=>['Poems','SS','Instrumentals','Books'],13=>['Reviews','Fans','Updates','Disses'],14=>['News','Music','History','Instrumentals'],
        15=>['Biology','Chemistry','Physics','Environmental'],16=>['EP','Seller','Mortgage','Buyer'],17=>[null],18=>['NM','SHM','MH','VM','LS','CB'],
        19=>['PD','LD','FH','SM'],20=>['FE','TOB','Insurance','TE'],21=>[null],22=>[null],23=>[null]
    ];

    $categoryFolders = [
        0=>'Rizz',1=>'Dance',2=>'Afterparty',3=>'Sex',4=>'Love',5=>'Family',6=>'Inspiration',7=>'History',8=>'Politics',9=>'Gaming',
        10=>'Comedy',12=>'Literature',13=>'Sports',14=>'Tech',15=>'Science',16=>'RealEstate',17=>'DJshuba',18=>'Film',19=>'Fashion',
        20=>'Business',21=>'Hustlin',22=>'Pregame',23=>'Outside'
    ];

    foreach ($musicMapping as $cat=>$sub) {
        foreach ($sub as $idx=>$folder) {
            $fullPath = $folder ? "Music/{$categoryFolders[$cat]}/$folder/" : "Music/{$categoryFolders[$cat]}/";
            addSongs($fullPath, $sentToJsArray, $cat, $folder!==null?$idx:null, $s3, $bucketName);
        }
    }

    exit(json_encode($sentToJsArray, JSON_INVALID_UTF8_IGNORE | JSON_UNESCAPED_SLASHES));
}

// --- Stripe ---
$stripe = new StripeClient(getenv("StripeSecretKey"));
$siteDomain = "https://www.tsunamiflow.club";
$StripeToken = "TsunamiFlowClubStripeToken";

// --- Main POST/GET Handling ---
try {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'POST') {
        if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) $data = json_decode(file_get_contents('php://input'), true) ?: [];

        // Stripe checkout
        if (($_POST['token'] ?? '') === $StripeToken) {
            $session_id = $_POST['session_id'] ?? '';
            if (!$session_id) exit(json_encode(['error'=>'Missing session_id']));
            $session = \Stripe\Checkout\Session::retrieve($session_id);
            $metadata = $session->metadata ?? [];
            if (!empty($metadata['TFRegisterPassword'])) $metadata['TFRegisterPassword'] = password_hash($metadata['TFRegisterPassword'], PASSWORD_DEFAULT);
            InputIntoDatabase(...array_values($metadata));
            header("Location: $siteDomain"); exit;
        }

        // Subscribers Signup
        if (($data['type'] ?? '') === 'Subscribers Signup') {
            $membership = $_POST['membershipLevel'] ?? 'free';
            $userData = $_POST;
            if (!empty($userData['TFRegisterPassword'])) $userData['TFRegisterPassword'] = password_hash($userData['TFRegisterPassword'], PASSWORD_DEFAULT);

            if ($membership === 'free') {
                InputIntoDatabase($membership, ...array_values($userData));
                exit(json_encode(['success'=>true,'message'=>'Free membership created']));
            } else {
                $costMap = ['regular'=>400,'vip'=>700,'team'=>1000];
                $checkoutSession = \Stripe\Checkout\Session::create([
                    'payment_method_types'=>['card'],
                    'mode'=>'payment',
                    'line_items'=>[['price_data'=>['currency'=>'usd','unit_amount'=>$costMap[strtolower($membership)] ?? 2000,'product_data'=>['name'=>'Community Member Signup Fee']], 'quantity'=>1]],
                    'success_url'=>"$siteDomain/server.php?session_id={CHECKOUT_SESSION_ID}",
                    'cancel_url'=>"$siteDomain/failed.php",
                    'metadata'=>$userData
                ]);
                header("Location: ".$checkoutSession->url); exit;
            }
        }

        // Navigation Login
        if (($data['type'] ?? '') === 'Navigation Login') {
            $_SESSION['LoginStatus'] = !empty($data['log in']);
            exit(json_encode(['success'=>true,'message'=>$_SESSION['LoginStatus']? 'Logged in':'Logged out']));
        }

        // Tsunami Flow Store
        if (($data['type'] ?? '') === 'Tsunami Flow Store') exit(json_encode(['success'=>true,'message'=>'Store endpoint hit']));

        exit(json_encode(['error'=>'Invalid POST type']));
    }

    if ($method === 'GET') {
        if (isset($_GET['shopping_cart'])) {
            $_SESSION['ShoppingCartItems'] = $_GET['shopping_cart'];
            exit(json_encode(['success'=>true,'items'=>$_SESSION['ShoppingCartItems']]));
        }
        exit(json_encode(['success'=>true,'message'=>'GET request received']));
    }

    exit(json_encode(['error'=>'Invalid request method']));
} catch (Exception $e) {
    exit(json_encode(['error'=>$e->getMessage()]));
}

// --- Printful fallback ---
$myProductsFr = false;
if (!$myProductsFr) echo "No data received from Printful API.";
?>