<?php
require "config.php";
require "stripestuff/vendor/autoload.php";

\Stripe\Stripe::setApiKey(TfStripeSecretKey);

$session = \Stripe\Checkout\Session::create([
    "payment_method_types" => ["card"],
    "line_items" => [[
        "price" => "regular",
        "quantity" => 1,
    ]],
    "mode" => "subscription",
    "success_url" => "https://www.tsunamiflow.club/server.php",
    "cancel_url" => "https://www.tsunamiflow.club/server.php",
    ]);

echo(json_encode(["url" => $session->url]));