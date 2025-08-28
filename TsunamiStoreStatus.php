<?php
//TsunamiStoreStatus.php 
try {
    //retrieve JSON from POST body
    $myphpInput = file_get_content("php://input");
    $TheTsunamiStoreStuff = json_decode($myphpInput);

    $TfCheckoutSession = 

    echo json_encode(['status' => $TfCheckoutSession->status, 'customer_email' => $TfCheckoutSession->customer_details->email]);
    https_response_code(200);
} catch (Error $e) {
    https_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
//TsunamiStoreStatus.php ends
?>