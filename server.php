<?php
//error_reporting(E_ALL);
//ini_set('display_errors', 1);
//ini_set("session.cookie_secure", true);
//ini_set("session.cookie_httponly", true);
//ini_set("session.gc_maxlifetime", 3600);
//ini_set("session.cookie_lifetime", 0);
//ini_set("session.use_strict_mode", true);

session_start();

require_once "functions.php";
use Aws\S3\S3Client;
use Aws\Credentials\Credentials;
use Aws\Exception\AwsException;
use Stripe\StripeClient;

// --- Helper function ---
function respond(array $data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    exit(json_encode($data, JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_IGNORE));
}

// --- CORS ---
$allowedOrigins = ["https://www.tsunamiflow.club", "https://world.tsunamiflow.club", "https://tsunamiflow.club"];
if (!empty($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With");
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(http_response_code(200));

// --- Cloudflare R2 Setup ---
$bucket = getenv('CloudflareR2Name') ?: 'tsunami-radio';
$ak = getenv('CloudflareR2AccessKey');
$sk = getenv('CloudflareR2SecretKey');
$ep = getenv('CloudflareR2Endpoint');
if (!$ak || !$sk || !$ep) respond(["error" => "Missing R2 credentials"], 500);

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

// --- Session Defaults ---
$_SESSION["visit_count"] = ($_SESSION["visit_count"] ?? 0) + 1;
$_SESSION["UserPreferences"] ??= ["Chosen_Companion" => "Ackma Hawk"];
$_SESSION["Setting"] ??= ["font_style" => "auto"];

foreach (["TfGuestCount","freeMembershipCount","lowestMembershipCount","middleMembershipCount","highestMembershipCount","TfMemberCount"] as $c) {
    $_SESSION[$c] ??= 0;
}

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

// --- Input Data ---
$data = json_decode(file_get_contents("php://input"), true) ?? [];

// --- Stripe Setup ---
$stripe = new StripeClient(getenv("StripeSecretKey"));
$domain = "https://www.tsunamiflow.club";

// --- Helper: Add item to cart ---
function addToCart(array $product, int $quantity): array {
    $cartItem = $product + ['quantity' => $quantity, 'added_at' => date('c')];
    $_SESSION['ShoppingCartItems'] ??= [];

    foreach ($_SESSION['ShoppingCartItems'] as &$existing) {
        if ((string)$existing['variant_id'] === (string)$cartItem['variant_id']) {
            $existing['quantity'] += $cartItem['quantity'];
            return ['merged' => true, 'item' => $existing];
        }
    }
    unset($existing);

    $_SESSION['ShoppingCartItems'][] = $cartItem;
    return ['merged' => false, 'item' => $cartItem];
}

// --- Main Logic ---
try {
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'POST') {
        // ---- Add Product to Cart ----
        if (isset($_POST['addProductToCart'])) {
            $variantId = trim($_POST['product_id'] ?? '');
            $quantity = max(1, (int)($_POST['StoreQuantity'] ?? 1));
            if ($variantId === '') respond(['error' => 'Missing product ID'], 400);

            $allProducts = BasicPrintfulRequest();
            $found = null;

            foreach ($allProducts['result'] ?? [] as $product) {
                $variants = $product['sync_variants'] ?? $product['variants'] ?? [];
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

            $result = addToCart($found, $quantity);
            respond(['success' => true, 'cart_count' => count($_SESSION['ShoppingCartItems']), 'item' => $result['item']]);
        }

        // ---- Stripe Checkout ----
        if (($data['type'] ?? '') === 'Stripe Checkout') {
            $cartItems = $_SESSION['ShoppingCartItems'] ?? [];
            if (empty($cartItems)) respond(['error' => 'Cart is empty'], 400);

            $checkout = CreateStripeCheckout($cartItems, "$domain/server.php?type=Printful Checkout", "$domain/checkout_cancel.php");
            respond([
                'success' => !empty($checkout['success']),
                'checkout_url' => $checkout['url'] ?? null,
                'session_id' => $checkout['id'] ?? null,
                'error' => $checkout['error'] ?? null
            ]);
        }

        // ---- Printful Checkout ----
        if (($data['type'] ?? '') === 'Printful Checkout') {
            $cartItems = $_SESSION['ShoppingCartItems'] ?? [];
            if (empty($cartItems)) respond(['error' => 'Cart is empty'], 400);

            $result = CreatePrintfulOrder($cartItems, $data['customer'] ?? []);
            if (!empty($result['success'])) unset($_SESSION['ShoppingCartItems']);

            respond([
                'success' => !empty($result['success']),
                'order' => $result['result'] ?? null,
                'error' => $result['error'] ?? null
            ]);
        }

        // ---- Subscribers Signup ----
        if (($data['type'] ?? '') === 'Subscribers Signup') {
            $membership = $_POST['membershipLevel'] ?? 'free';
            $userData = $_POST;
            if (!empty($userData['TFRegisterPassword'])) $userData['TFRegisterPassword'] = password_hash($userData['TFRegisterPassword'], PASSWORD_DEFAULT);

            if ($membership === 'free') {
                InputIntoDatabase($membership, ...array_values($userData));
                respond(['success' => true, 'message' => 'Free membership created']);
            }

            $costMap = ['regular' => 400, 'vip' => 700, 'team' => 1000];
            $s = $stripe->checkout->sessions->create([
                'payment_method_types' => ['card'],
                'mode' => 'payment',
                'line_items' => [[
                    'price_data' => [
                        'currency' => 'usd',
                        'unit_amount' => $costMap[strtolower($membership)] ?? 2000,
                        'product_data' => ['name' => 'Community Member Signup Fee']
                    ],
                    'quantity' => 1
                ]],
                'success_url' => "$domain/server.php?session_id={CHECKOUT_SESSION_ID}",
                'cancel_url'  => "$domain/failed.php",
                'metadata'    => $userData
            ]);
            header("Location: " . $s->url);
            exit;
        }

        respond(['error' => 'Invalid POST type'], 400);
    }

    // ---- GET Routes ----
    if ($method === 'GET') {
        if (isset($_GET['cart_action'])) {
            switch ($_GET['cart_action']) {
                case 'view': respond(['success' => true, 'items' => $_SESSION['ShoppingCartItems'] ?? []]);
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

// --- Printful Fetch (legacy check) ---
$myProductsFr = BasicPrintfulRequest();
if (!$myProductsFr) echo "No data received from Printful API.";
?>