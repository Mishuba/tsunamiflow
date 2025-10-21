<?php
session_start();
require '/stripestuff/vendor/autoload.php';

use Stripe\Stripe;
use Stripe\Webhook;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

Stripe::setApiKey(TfStripeSecretKey);

// Get payload and signature
$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
$endpoint_secret = 'YOUR_STRIPE_WEBHOOK_SECRET'; // Replace this

// Helper: send email receipt
function sendReceipt($to, $orderDetails) {
    $mail = new PHPMailer(true);
    try {
        $mail->setFrom(TfEmailFr, 'Tsunami Flow Store');
        $mail->addAddress($to);
        $mail->Subject = 'Your Tsunami Flow Store Receipt';

        $body = "Thank you for your order! Here are your details:\n\n";
        foreach ($orderDetails as $item) {
            $body .= "- {$item['name']} x {$item['quantity']} @ \${$item['price']}\n";
        }

        $mail->Body = $body;
        $mail->send();
    } catch (Exception $e) {
        error_log("Mailer Error: " . $e->getMessage());
    }
}

// Helper: fetch Printful products
function getPrintfulProducts() {
    $ch = curl_init('https://api.printful.com/store/products');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . getenv("PrintfulApiKey")]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    curl_close($ch);
    $data = json_decode($result, true);
    return $data['result'] ?? [];
}

// Verify webhook
try {
    $event = Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
} catch (\UnexpectedValueException|\Stripe\Exception\SignatureVerificationException $e) {
    http_response_code(400);
    exit();
}

// Handle checkout session completed
if ($event->type === 'checkout.session.completed') {
    $session = $event->data->object;
    $cart = json_decode($session->metadata->cart, true);

    // Build variant name map
    $products = getPrintfulProducts();
    $variantNames = [];
    foreach($products as $product){
        foreach($product['sync_variants'] as $variant){
            $variantNames[$variant['id']] = $product['name'] . ' - ' . $variant['name'];
        }
    }

    // Build order items for Printful
    $items = [];
    $order_details = [];
    foreach ($cart as $item) {
        $items[] = [
            'variant_id' => $item['variant_id'],
            'quantity' => $item['quantity']
        ];
        $order_details[] = [
            'name' => $variantNames[$item['variant_id']] ?? $item['variant_id'],
            'quantity' => $item['quantity'],
            'price' => $item['price']
        ];
    }

    // Prepare Printful order
    $order = [
        'recipient' => [
            'name' => $session->metadata->name,
            'address1' => $session->metadata->address1,
            'city' => $session->metadata->city,
            'state_code' => $session->metadata->state,
            'country_code' => $session->metadata->country,
            'zip' => $session->metadata->zip,
            'email' => $session->customer_email
        ],
        'items' => $items
    ];

    // Create order on Printful
    $ch = curl_init('https://api.printful.com/orders');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer " . getenv("PrintfulApiKey"),
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($order));
    $result = curl_exec($ch);
    curl_close($ch);

    $order_response = json_decode($result, true);

    // Send receipt with product names
    sendReceipt($session->customer_email, $order_details);

    // Optional: clear session cart if using sessions
    if(session_status()===PHP_SESSION_NONE) session_start();
    $_SESSION['cart'] = [];
}

http_response_code(200);