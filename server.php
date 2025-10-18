<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set("session.cookie_secure", true);
ini_set("session.cookie_httponly", true);
ini_set("session.gc_maxlifetime", 3600);
ini_set("session.cookie_lifetime", 0);
ini_set("session.use_strict_mode", true);

session_start();

function respond(array $data, int $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    exit(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_IGNORE));
}

// --- Allow specific domains ---
$allowed = ["https://www.tsunamiflow.club", "https://world.tsunamiflow.club", "https://tsunamiflow.club"];
if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed)) {
    header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With");
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(http_response_code(200));

require_once "functions.php";
use Aws\S3\S3Client, Aws\Credentials\Credentials, Aws\Exception\AwsException, Stripe\StripeClient;

// --- Cloudflare R2 Setup ---
$bucket = getenv('CloudflareR2Name') ?: 'tsunami-radio';
if (!($ak = getenv('CloudflareR2AccessKey')) || !($sk = getenv('CloudflareR2SecretKey')) || !($ep = getenv('CloudflareR2Endpoint'))) {
    respond(["error" => "Missing R2 credentials"], 500);
}
try {
    $s3 = new S3Client([
        "region" => "auto",
        "endpoint" => $ep,
        "version" => "latest",
        "credentials" => new Credentials($ak, $sk),
        "use_path_style_endpoint" => false
    ]);
} catch (Exception $e) {
    respond(["error" => $e->getMessage()], 500);
}

// --- Session Data Setup ---
$_SESSION["visit_count"] = ($_SESSION["visit_count"] ?? 0) + 1;
$_SESSION["UserPreferences"] ??= ["Chosen_Companion" => "Ackma Hawk"];
$_SESSION["Setting"] ??= ["font_style" => "auto"];

foreach (["TfGuestCount", "freeMembershipCount", "lowestMembershipCount", "middleMembershipCount", "highestMembershipCount", "TfMemberCount"] as $c)
    $_SESSION[$c] ??= 0;

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

setcookie("TfAccess", $_SESSION["TfAccess"] ?? "guest", time() + 86400 * 30, "/", "", true, true);
setcookie("visit_count", $_SESSION["visit_count"], time() + 86400, "/", "", true, true);

$data = json_decode(file_get_contents("php://input"), true) ?? [];

// ---- Stripe Setup ----
$stripe = new StripeClient(getenv("StripeSecretKey"));
$domain = "https://www.tsunamiflow.club";
$Token = "TsunamiFlowClubStripeToken";

// ---- Main Logic ----
try {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'POST') {
        if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false)
            $data = json_decode(file_get_contents('php://input'), true) ?? [];

       if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true) ?? [];

    // ---- 1. Add to Cart ----
    if (isset($_POST['addProductToCart'])) {
        $variantId = trim($_POST['product_id'] ?? '');
        $quantity = max(1, (int)($_POST['StoreQuantity'] ?? 1));
        if ($variantId === '') respond(['error' => 'Missing product ID'], 400);

        $allProducts = BasicPrintfulRequest();
        $found = null;

        foreach ($allProducts['result'] ?? [] as $product) {
            $variants = $product['sync_variants'] ?? $product['variants'] ?? [];
            if (!is_array($variants)) continue;
            foreach ($variants as $v) {
                if ((string)($v['id'] ?? '') === (string)$variantId) {
                    $found = [
                        'parent_product_id' => $product['id'] ?? null,
                        'name' => $product['name'] ?? ($v['name'] ?? 'Unknown'),
                        'variant_id' => $v['id'] ?? $variantId,
                        'variant_name' => $v['name'] ?? '',
                        'price' => (float)($v['retail_price'] ?? ($v['price'] ?? 0)),
                        'size' => $v['size'] ?? ($v['size_name'] ?? ''),
                        'availability' => $v['availability_status'] ?? ($v['availability'] ?? ''),
                        'thumbnail' => $product['thumbnail_url'] ?? ($product['image'] ?? '')
                    ];
                    break 2;
                }
            }
        }

        if (!$found) respond(['error' => 'Variant not found'], 404);

        $cartItem = $found;
        $cartItem['quantity'] = $quantity;
        $cartItem['added_at'] = date('c');

        $_SESSION['ShoppingCartItems'] ??= [];

        // merge quantities if exists
        $merged = false;
        foreach ($_SESSION['ShoppingCartItems'] as &$existing) {
            if ((string)$existing['variant_id'] === (string)$cartItem['variant_id']) {
                $existing['quantity'] += $cartItem['quantity'];
                $merged = true;
                break;
            }
        }
        unset($existing);
        if (!$merged) $_SESSION['ShoppingCartItems'][] = $cartItem;

        respond([
            'success' => true,
            'cart_count' => count($_SESSION['ShoppingCartItems']),
            'item' => $cartItem
        ]);
    }

    // ---- 2. Stripe Checkout ----
    if (($data['type'] ?? '') === 'Stripe Checkout') {
        $cartItems = $_SESSION['ShoppingCartItems'] ?? [];
        if (empty($cartItems)) respond(['error' => 'Cart is empty'], 400);

        $successUrl = "https://www.tsunamiflow.club/server.php?type=Printful Checkout";
        $cancelUrl  = "https://www.tsunamiflow.club/checkout_cancel.php";

        $checkout = CreateStripeCheckout($cartItems, $successUrl, $cancelUrl);
        if (!empty($checkout['success'])) {
            respond(['success' => true, 'checkout_url' => $checkout['url'], 'session_id' => $checkout['id']]);
        } else {
            respond(['success' => false, 'error' => $checkout['error'] ?? 'Stripe error'], 500);
        }
    }

    // ---- 3. Printful Checkout ----
    if (($data['type'] ?? '') === 'Printful Checkout') {
        $cartItems = $_SESSION['ShoppingCartItems'] ?? [];
        if (empty($cartItems)) respond(['error' => 'Cart is empty'], 400);

        $customerData = $data['customer'] ?? [];
        $result = CreatePrintfulOrder($cartItems, $customerData);

        if (!empty($result['success'])) {
            unset($_SESSION['ShoppingCartItems']); // clear cart
            respond(['success' => true, 'order' => $result['result']]);
        } else {
            respond(['success' => false, 'error' => $result['error'] ?? 'Printful order error'], 500);
        }
    }

    respond(['error' => 'Invalid POST type'], 400);
}

// GET fallback
respond(['success' => true, 'message' => 'GET request received']);



        // ---- STRIPE + ACCOUNT LOGIC ----
        if (($_POST['token'] ?? '') === $Token) {
            $sid = $_POST['session_id'] ?? null;
            if (!$sid) respond(['error' => 'Missing session_id'], 400);

            $s = \Stripe\Checkout\Session::retrieve($sid);
            $m = $s->metadata ?? [];
            if (!empty($m['TFRegisterPassword']))
                $m['TFRegisterPassword'] = password_hash($m['TFRegisterPassword'], PASSWORD_DEFAULT);

            InputIntoDatabase(...array_values($m));
            header("Location: $domain");
            exit;
        }

        if (($data['type'] ?? '') === 'Subscribers Signup') {
            $m = $_POST['membershipLevel'] ?? 'free';
            $u = $_POST;

            if (!empty($u['TFRegisterPassword']))
                $u['TFRegisterPassword'] = password_hash($u['TFRegisterPassword'], PASSWORD_DEFAULT);

            if ($m === 'free') {
                InputIntoDatabase($m, ...array_values($u));
                respond(['success' => true, 'message' => 'Free membership created']);
            }

            $costMap = ['regular' => 400, 'vip' => 700, 'team' => 1000];
            $s = \Stripe\Checkout\Session::create([
                'payment_method_types' => ['card'],
                'mode' => 'payment',
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'unit_amount' => $costMap[strtolower($m)] ?? 2000,
                        'product_data' => ['name' => 'Community Member Signup Fee']
                    ],
                    'quantity' => 1
                ]],
                'success_url' => "$domain/server.php?session_id={CHECKOUT_SESSION_ID}",
                'cancel_url'  => "$domain/failed.php",
                'metadata'    => $u
            ]);
            header("Location: " . $s->url);
            exit;
        }

        if (($data['type'] ?? '') === 'Navigation Login') {
            $_SESSION['LoginStatus'] = !empty($data['log in']);
            respond(['success' => true, 'message' => $_SESSION['LoginStatus'] ? 'Logged in' : 'Logged out']);
        }

        if (($data['type'] ?? '') === 'Tsunami Flow Store')
            respond(['success' => true, 'message' => 'Store endpoint hit']);

        respond(['error' => 'Invalid POST type'], 400);
    }

    // ---- GET Routes ----
    if ($method === 'GET') {
        if (isset($_GET['cart_action'])) {
            switch ($_GET['cart_action']) {
                case 'view':
                    respond(['success' => true, 'items' => $_SESSION['ShoppingCartItems'] ?? []]);
                case 'clear':
                    $_SESSION['ShoppingCartItems'] = [];
                    respond(['success' => true, 'message' => 'Cart cleared']);
            }
        }
        respond(['success' => true, 'message' => 'GET request received']);
    }

    respond(['error' => 'Invalid request method'], 400);
} catch (Exception $e) {
    respond(['error' => $e->getMessage()], 500);
}

// ---- Printful Fetch ----
$myProductsFr = BasicPrintfulRequest();
if (!$myProductsFr) {
    echo "No data received from Printful API.";
} else {
    $showSuccess = true;
}
?>