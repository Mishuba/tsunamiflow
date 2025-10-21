<?php
require '/stripestuff/vendor/autoload.php';
require 'config.php';

use Stripe\Stripe;
use Stripe\Webhook;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

Stripe::setApiKey(TfStripeSecretKey);

$payload=@file_get_contents('php://input');
$sig_header=$_SERVER['HTTP_STRIPE_SIGNATURE'];
$endpoint_secret='YOUR_STRIPE_WEBHOOK_SECRET';

try {
    $event=Webhook::constructEvent($payload,$sig_header,$endpoint_secret);
} catch(\UnexpectedValueException|\Stripe\Exception\SignatureVerificationException $e){
    http_response_code(400); exit();
}

function sendReceipt($to,$orderDetails){
    $mail=new PHPMailer(true);
    try{
        $mail->setFrom(TfEmailFr,'Tsunami Flow Store');
        $mail->addAddress($to);
        $mail->Subject='Your Tsunami Flow Store Receipt';
        $mail->Body="Thank you for your order! Here are your details:\n\n".print_r($orderDetails,true);
        $mail->send();
    }catch(Exception $e){
        error_log("Mailer Error: ".$e->getMessage());
    }
}

if($event->type==='checkout.session.completed'){
    $session=$event->data->object;
    $cart=json_decode($session->metadata->cart,true);

    $items=[];
    foreach($cart as $item){
        $items[]=['variant_id'=>$item['variant_id'],'quantity'=>$item['quantity']];
    }

    $order=[
        'recipient'=>[
            'name'=>$session->metadata->name,
            'address1'=>$session->metadata->address1,
            'city'=>$session->metadata->city,
            'state_code'=>$session->metadata->state,
            'country_code'=>$session->metadata->country,
            'zip'=>$session->metadata->zip,
            'email'=>$session->customer_email
        ],
        'items'=>$items
    ];

    $ch=curl_init('https://api.printful.com/orders');
    curl_setopt($ch,CURLOPT_HTTPHEADER,["Authorization: Bearer ".printfulApiKey,"Content-Type: application/json"]);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
    curl_setopt($ch,CURLOPT_POSTFIELDS,json_encode($order));
    $result=curl_exec($ch);
    curl_close($ch);

    $order_response=json_decode($result,true);
    sendReceipt($session->customer_email,$order_response);

    // Optional: clear session cart if using sessions
    if(session_status()===PHP_SESSION_NONE) session_start();
    $_SESSION['cart']=[];
}

http_response_code(200);