<?php
session_start();
require '/stripestuff/vendor/autoload.php';
require 'config.php';

use Stripe\Stripe;
use Stripe\Checkout\Session;

Stripe::setApiKey(TfStripeSecretKey);

if (empty($_SESSION['cart'])) {
    die('Cart is empty');
}

// Map cart items for Stripe
$line_items = [];
foreach ($_SESSION['cart'] as $item) {
    $line_items[] = [
        'price_data' => [
            'currency' => 'usd',
            'product_data' => [
                'name' => 'Product '.$item['product_id'],
            ],
            'unit_amount' => intval($item['price'] * 100), // Stripe wants cents
        ],
        'quantity' => $item['quantity'],
    ];
}

// Create checkout session
$session = Session::create([
    'payment_method_types' => ['card'],
    'line_items' => $line_items,
    'mode' => 'payment',
    'success_url' => 'https://yourdomain.com/success.php?session_id={CHECKOUT_SESSION_ID}',
    'cancel_url' => 'https://yourdomain.com/cancel.php',
    'customer_email' => $_POST['email']
]);

header("Location: " . $session->url);
exit;