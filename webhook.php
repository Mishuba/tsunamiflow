<?php
require '/stripestuff/vendor/autoload.php';
require 'config.php';

use Stripe\Stripe;
use Stripe\Webhook;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

Stripe::setApiKey(TfStripeSecretKey);

$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
$endpoint_secret = 'YOUR_STRIPE_WEBHOOK_SECRET';

try {
    $event = \Stripe\Webhook::constructEvent(
        $payload, $sig_header, $endpoint_secret
    );
} catch(\UnexpectedValueException $e) {
    http_response_code(400);
    exit();
} catch(\Stripe\Exception\SignatureVerificationException $e) {
    http_response_code(400);
    exit();
}

// Handle successful payment
if ($event->type === 'checkout.session.completed') {
    $session = $event->data->object;
    $customer_email = $session->customer_email;

    // TODO: Create Printful order here using $session metadata or saved cart
    // sendReceipt($customer_email, $order_details);

}

http_response_code(200);