<?php
require "config.php";
require "stripestuff/vendor/autoload.php";

\Stripe\Stripe::setApiKey(TfStripeSecretKey);

$data = json_decode(file_get_contents("php://input"), true);
$paymentMethodId = $data["payment_method_id"];
$amount = $data["donation_amount"];
$type = $data["type"];

try {
    if ($type === "one_time") {
        $paymentIntent = \Stripe\PaymentIntent::create([
            "amount" => $amount,
            "currency" => "usd",
            "payment_method" => $paymentMethodId,
            "confirmation_method" => "manual",
            "confirm" => true,
        ]);

        echo (json_encode(["message" => "Payment Successful", "status" => $paymentIntent->status]));
        }
} catch (\Stripe\Exception\ApiErrorException $e) {
    echo (json_encode(["error" => $e->getMessage()]));
}
?>