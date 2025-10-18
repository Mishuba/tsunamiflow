<?php
// --- Required files & namespaces ---
require_once "Arrays.php";
require_once "Objects.php";
require_once "stripestuff/vendor/autoload.php";

use Stripe\Subscription;
use Stripe\Customer;
use Stripe\StripeClient;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;
use Stripe\Exception\CardException;
use Stripe\Exception\RateLimitException;
use Stripe\Exception\InvalidRequestException;
use Stripe\Exception\AuthenticationException;
use Stripe\Exception\ApiConnectionException;

// --- Start session ---
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// --- NanoTech Database Credentials ---
$nanoH = getenv("NanoHost");
$nanoP = getenv("NanoPort");
$nanoDb = getenv("NanoDB");
$nanoU = getenv("NanoUser");
$nanoPsw = getenv("NanoPsw");
$nanoDSN = "pgsql:host=$nanoH;port=$nanoP;dbname=$nanoDb;sslmode=require;channel_binding=require";

// --- Input ---
$TfRcI = @file_get_contents("php://input");
$UseThis = json_decode($TfRcI);

// --- Utility Functions ---
function getIpAddress() {
    if (!empty($_SERVER["HTTP_CLIENT_IP"])) return $_SERVER["HTTP_CLIENT_IP"];
    if (!empty($_SERVER["HTTP_X_FORWARDED_FOR"])) return $_SERVER["HTTP_X_FORWARDED_FOR"];
    return $_SERVER["REMOTE_ADDR"];
}

function LogOut() {
    $_SESSION = [];
    session_unset();
    session_destroy();
    session_write_close();
    header("Location: index.php");
    exit;
}

function TsunamiInput($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

function validate_input($inputName, $inputArray, $type = 'string') {
    if (!isset($inputArray[$inputName]) || empty($inputArray[$inputName])) {
        return null;
    }
    $value = TsunamiInput($inputArray[$inputName]);
    if ($type === 'string' && preg_match("/^[a-zA-Z0-9-']+$/", $value)) return $value;
    if ($type === 'number') return filter_var($value, FILTER_VALIDATE_INT);
    if ($type === 'email') return filter_var($value, FILTER_VALIDATE_EMAIL);
    return $value;
}

function handleDatabaseError($e){
    if ($e->getCode() == '23505') { // Postgres unique violation
        die("The username you choose is already being used. Please choose a new one.");
    } else {
        error_log($e->getMessage(), 0);
        file_put_contents("tferror.log", $e->getMessage() . "\n", FILE_APPEND);
        die("An error occurred. Please try again later.");
    }
}

function TsunamiDatabaseFlow(){
    global $tfSQLoptions, $nanoDSN, $nanoU, $nanoPsw;
    return new PDO($nanoDSN, $nanoU, $nanoPsw, $tfSQLoptions ?? []);
}

function createCookieAndSession($key, $value, $days = 365){
    setcookie($key, $value, time() + (86400 * $days), "/");
    $_SESSION[$key] = $value;
}

// --- Main function to insert user data ---
function InputIntoDatabase(
    $membership, $userName, $firstName, $lastName, $nickName, $gender, $birthdate, $email, $password,
    $chineseZodiacSign, $westernZodiacSign, $spiritAnimal, $celticTreeZodiacSign, $nativeAmericanZodiacSign, $vedicAstrologySign,
    $guardianAngel, $ChineseElement, $eyeColorMeaning, $GreekMythologyArchetype, $NorseMythologyPatronDeity, $EgyptianZodiacSign,
    $MayanZodiacSign, $loveLanguage, $birthStone, $birthFlower, $bloodType, $attachmentStyle, $charismaType, $businessPersonality,
    $TFuserDISC, $socionicsType, $learningStyle, $financialPersonalityType, $primaryMotivationStyle, $creativeStyle,
    $conflictManagementStyle, $teamRolePreference
){
    try {
        $db = TsunamiDatabaseFlow();

        // --- FreeLevelMembers insert with hashed password ---
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $db->prepare("INSERT INTO FreeLevelMembers (tfUN, tfFN, tfLN, tfNN, tfGen, tfBirth, tfEM, tfPSW, created)
            VALUES (:tfUN, :tfFN, :tfLN, :tfNN, :tfGen, :tfBirth, :tfEM, :tfPSW, NOW())");
        $stmt->execute([
            ":tfUN" => $userName, ":tfFN" => $firstName, ":tfLN" => $lastName, ":tfNN" => $nickName,
            ":tfGen" => $gender, ":tfBirth" => $birthdate, ":tfEM" => $email, ":tfPSW" => $hashedPassword
        ]);

        // --- Set common cookies/session ---
        $commonFields = [
            "TfAccess" => ucfirst($membership),
            "Username" => $userName,
            "Birthday" => $birthdate,
            "Gender" => $gender,
            "Nickname" => $nickName,
            "Email" => $email
        ];
        foreach ($commonFields as $key => $value) createCookieAndSession($key, $value);

        // --- RegularMembers insert ---
        if (in_array($membership, ["regular","vip","team"])) {
            $stmt2 = $db->prepare("INSERT INTO RegularMembers
                (tfUN, ChineseZodiacSign, WesternZodiacSign, SpiritAnimal, CelticTreeZodiacSign,
                NativeAmericanZodiacSign, VedicAstrologySign, GuardianAngel, ChineseElement, EyeColorMeaning,
                GreekMythologyArchetype, NorseMythologyPatronDeity, EgyptianZodiacSign, MayanZodiacSign)
                VALUES (:tfUN, :ChineseZodiacSign, :WesternZodiacSign, :SpiritAnimal, :CelticTreeZodiacSign,
                :NativeAmericanZodiacSign, :VedicAstrologySign, :GuardianAngel, :ChineseElement, :EyeColorMeaning,
                :GreekMythologyArchetype, :NorseMythologyPatronDeity, :EgyptianZodiacSign, :MayanZodiacSign)");
            $stmt2->execute([
                ":tfUN"=>$userName, ":ChineseZodiacSign"=>$chineseZodiacSign, ":WesternZodiacSign"=>$westernZodiacSign,
                ":SpiritAnimal"=>$spiritAnimal, ":CelticTreeZodiacSign"=>$celticTreeZodiacSign, ":NativeAmericanZodiacSign"=>$nativeAmericanZodiacSign,
                ":VedicAstrologySign"=>$vedicAstrologySign, ":GuardianAngel"=>$guardianAngel, ":ChineseElement"=>$ChineseElement,
                ":EyeColorMeaning"=>$eyeColorMeaning, ":GreekMythologyArchetype"=>$GreekMythologyArchetype,
                ":NorseMythologyPatronDeity"=>$NorseMythologyPatronDeity, ":EgyptianZodiacSign"=>$EgyptianZodiacSign,
                ":MayanZodiacSign"=>$MayanZodiacSign
            ]);
            $astrologyFields = compact(
                "chineseZodiacSign","westernZodiacSign","spiritAnimal","celticTreeZodiacSign",
                "nativeAmericanZodiacSign","vedicAstrologySign","guardianAngel","ChineseElement",
                "eyeColorMeaning","GreekMythologyArchetype","NorseMythologyPatronDeity",
                "EgyptianZodiacSign","MayanZodiacSign"
            );
            foreach ($astrologyFields as $k => $v) createCookieAndSession($k, $v);
        }

        // --- VIPMembers insert ---
        if (in_array($membership, ["vip","team"])) {
            $stmt3 = $db->prepare("INSERT INTO VIPMembers
                (tfUN, LoveLanguage, Birthstone, BirthFlower, BloodType, AttachmentStyle, CharismaType)
                VALUES (:tfUN, :LoveLanguage, :Birthstone, :BirthFlower, :BloodType, :AttachmentStyle, :CharismaType)");
            $stmt3->execute([
                ":tfUN"=>$userName, ":LoveLanguage"=>$loveLanguage, ":Birthstone"=>$birthStone,
                ":BirthFlower"=>$birthFlower, ":BloodType"=>$bloodType, ":AttachmentStyle"=>$attachmentStyle,
                ":CharismaType"=>$charismaType
            ]);
            foreach (compact("loveLanguage","birthStone","birthFlower","bloodType","attachmentStyle","charismaType") as $k=>$v) {
                createCookieAndSession($k, $v);
            }
        }

        // --- TeamMembers insert & CSV backup ---
        if ($membership === "team") {
            $stmt4 = $db->prepare("INSERT INTO TeamMembers
                (tfUN, BusinessPersonality, DISC, SocionicsType, LearningStyle,
                FinancialPersonalityType, PrimaryMotivationStyle, CreativeStyle, ConflictManagementStyle, TeamRolePreference)
                VALUES (:tfUN, :BusinessPersonality, :DISC, :SocionicsType, :LearningStyle,
                :FinancialPersonalityType, :PrimaryMotivationStyle, :CreativeStyle, :ConflictManagementStyle, :TeamRolePreference)");
            $stmt4->execute([
                ":tfUN"=>$userName, ":BusinessPersonality"=>$businessPersonality, ":DISC"=>$TFuserDISC,
                ":SocionicsType"=>$socionicsType, ":LearningStyle"=>$learningStyle, ":FinancialPersonalityType"=>$financialPersonalityType,
                ":PrimaryMotivationStyle"=>$primaryMotivationStyle, ":CreativeStyle"=>$creativeStyle,
                ":ConflictManagementStyle"=>$conflictManagementStyle, ":TeamRolePreference"=>$teamRolePreference
            ]);
            foreach (compact("businessPersonality","TFuserDISC","socionicsType","learningStyle",
                              "financialPersonalityType","primaryMotivationStyle","creativeStyle",
                              "conflictManagementStyle","teamRolePreference") as $k=>$v) {
                createCookieAndSession($k, $v);
            }

            // CSV backup
            $TheEntireFormFr = [
                $userName, $birthdate, $gender, $nickName, $email,
                $chineseZodiacSign, $westernZodiacSign, $spiritAnimal,
                $celticTreeZodiacSign, $nativeAmericanZodiacSign, $vedicAstrologySign,
                $guardianAngel, $ChineseElement, $eyeColorMeaning, $GreekMythologyArchetype,
                $NorseMythologyPatronDeity, $EgyptianZodiacSign, $MayanZodiacSign,
                $loveLanguage, $birthStone, $birthFlower, $bloodType, $attachmentStyle, $charismaType,
                $businessPersonality, $TFuserDISC, $socionicsType, $learningStyle,
                $financialPersonalityType, $primaryMotivationStyle, $creativeStyle,
                $conflictManagementStyle, $teamRolePreference
            ];
            $csvDir = "./TDFB/CSV/Members/team.csv";
            if (!is_dir(dirname($csvDir))) mkdir(dirname($csvDir), 0777, true);
            $fileMode = file_exists($csvDir) ? "a" : "w";
            $csvFile = fopen($csvDir, $fileMode);
            if ($fileMode === "w") {
                fputcsv($csvFile, array_keys(array_flip($TheEntireFormFr))); // header
            }
            fputcsv($csvFile, $TheEntireFormFr);
            fclose($csvFile);
        }

 // --- Final response ---
        echo json_encode([
            "status" => "success",
            "message" => "User $userName successfully registered as $membership member."
        ]);

    } catch (PDOException $e) {
        handleDatabaseError($e);
    } catch (Exception $e) {
        error_log($e->getMessage(), 0);
        echo json_encode(["status" => "error", "message" => "Unexpected error: " . $e->getMessage()]);
    }
}

// --- Login function ---
function Login() {
    $tfUsername = $_POST["NavUserName"] ?? $_REQUEST["phpnun"] ?? null;
    $tfPassword = $_POST["NavPassword"] ?? $_REQUEST["phpnpsw"] ?? null;

    if (!$tfUsername || !$tfPassword) return;

    $tfUsername = validate_input("NavUserName", $_POST ?? $_REQUEST);
    $tfPassword = validate_input("NavPassword", $_POST ?? $_REQUEST);

    try {
        $pdo = TsunamiDatabaseFlow();
        $stmt = $pdo->prepare("SELECT * FROM FreeLevelMembers WHERE tfUN = :username");
        $stmt->bindParam(':username', $tfUsername, PDO::PARAM_STR);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($tfPassword, $user['tfPSW'])) {
            session_regenerate_id(true);
            $_SESSION["UserName"] = $user['tfUN'];
            echo htmlspecialchars($tfUsername) . " is now logged in.";
        } else {
            echo "Incorrect Username or Password";
        }

    } catch (PDOException $e) {
        handleDatabaseError($e);
    } catch (Exception $e) {
        error_log($e->getMessage(), 0);
        echo "Unexpected error: " . $e->getMessage();
    }
}

//Nav Login ends

//Stripe && Handling Payments 
//$StfPk = new StripeClient(TfStripeSecretKey); //Public Key

/**
 * Stripe Helper Module for Tsunami Flow
 * Handles: Customer creation, PaymentIntent, subscriptions, and confirmations
 */

// Map country codes to Stripe tax ID types
function getTaxIdType($countryCode): ?string {
    $taxIdTypes = [
        "US" => "us_ein",
        "CA" => "ca_bn",
        "GB" => "gb_vat",
        // Extend as needed
    ];
    return $taxIdTypes[$countryCode] ?? null;
}

// Initialize Stripe client
function getStripeClient($secretKey): StripeClient {
    return new StripeClient($secretKey);
}

/**
 * Create Stripe Customer asynchronously
 */
function createCustomerFiber($secretKey, $email, $name, $taxId, $countryCode, $description, $paymentMethodId): Fiber {
    return new Fiber(function() use ($secretKey, $email, $name, $taxId, $countryCode, $description, $paymentMethodId) {
        Fiber::suspend("Creating customer asynchronously...\n");
        $stripe = getStripeClient($secretKey);

        if (empty($paymentMethodId)) {
            return json_encode(["error" => "Payment Method ID is missing or invalid"]);
        }

        try {
            $customer = $stripe->customers->create([
                "email" => $email,
                "name" => $name,
                "description" => $description,
                "address" => ["country" => $countryCode]
            ]);

            $stripe->customers->update($customer->id, [
                "invoice_settings" => ["default_payment_method" => $paymentMethodId]
            ]);

            if (!empty($taxId)) {
                $taxType = getTaxIdType($countryCode);
                if ($taxType) {
                    $stripe->customers->createTaxId($customer->id, [
                        "type" => $taxType,
                        "value" => $taxId
                    ]);
                }
            }

            return $customer;

        } catch (ApiErrorException | CardException | RateLimitException | InvalidRequestException | AuthenticationException | ApiConnectionException $e) {
            return json_encode(["error" => $e->getMessage()]);
        } catch (Exception $e) {
            return json_encode(["error" => "Unexpected error: " . $e->getMessage()]);
        }
    });
}

/**
 * Create PaymentIntent
 */
function createPaymentIntent($secretKey, $amount, $currency, $paymentMethodId): array|string {
    $stripe = getStripeClient($secretKey);

    if ($amount <= 0 || empty($paymentMethodId)) {
        return json_encode(["error" => "Invalid amount or Payment Method ID"]);
    }

    try {
        $intent = $stripe->paymentIntents->create([
            "amount" => $amount,
            "currency" => $currency,
            "payment_method" => $paymentMethodId,
            "confirmation_method" => "manual",
            "confirm" => true,
            "automatic_payment_methods" => ["enabled" => true]
        ]);

        return $intent;

    } catch (ApiErrorException | CardException | RateLimitException | InvalidRequestException | AuthenticationException | ApiConnectionException $e) {
        return json_encode(["error" => $e->getMessage()]);
    }
}

/**
 * Confirm PaymentIntent (one-time or subscription)
 */
function confirmStripePayment($secretKey, $intentId, $clientSecret, $isOneTime = true, $type = "store"): string {
    $stripe = getStripeClient($secretKey);

    try {
        if ($isOneTime) {
            $intent = $stripe->paymentIntents->retrieve($intentId);
            $status = $intent->status;

            $messages = [
                "succeeded" => "Your payment was successful. Thank you!",
                "requires_action" => "Verification required to complete payment.",
                "requires_payment_method" => "Payment method issue. Try again.",
                "requires_capture" => "Bank requires confirmation.",
                "canceled" => "Payment failed. Try later."
            ];

            $response = [
                "success" => $status === "succeeded",
                "requires_action" => $status === "requires_action",
                "requires_confirmation" => $status === "requires_capture",
                "requires_source_action" => $status === "requires_payment_method",
                "message" => $messages[$status] ?? "",
                "payment_intent_client_secret" => $clientSecret,
                "error" => "no error"
            ];

            return json_encode($response);

        } else {
            // Subscription
            $subscription = $stripe->subscriptions->retrieve($intentId);
            $latestInvoiceStatus = $subscription->latest_invoice->status ?? "";

            $response = [
                "success" => $latestInvoiceStatus === "paid",
                "requires_action" => $latestInvoiceStatus === "requires_action",
                "requires_confirmation" => $latestInvoiceStatus === "requires_confirmation",
                "requires_source_action" => $latestInvoiceStatus === "requires_source_action",
                "message" => $latestInvoiceStatus === "paid" ? "Subscription successful. Thank you!" : "Payment requires action.",
                "payment_intent_client_secret" => $clientSecret,
                "error" => $latestInvoiceStatus === "paid" ? "no error" : "unknown error"
            ];

            return json_encode($response);
        }

    } catch (ApiErrorException | CardException | RateLimitException | InvalidRequestException | AuthenticationException | ApiConnectionException $e) {
        return json_encode(["error" => $e->getMessage()]);
    }
}

/**
 * Update PaymentIntent or Subscription Payment Method
 */
function updatePaymentMethod($secretKey, $type, $id, $paymentMethodId) {
    $stripe = getStripeClient($secretKey);

    try {
        if ($type === "intent") {
            return $stripe->paymentIntents->update($id, ["payment_method" => $paymentMethodId]);
        } else if ($type === "subscription") {
            $paymentMethod = $stripe->paymentMethods->retrieve($paymentMethodId);
            return $stripe->subscriptions->update($id, ["default_payment_method" => $paymentMethod->id]);
        } else {
            return json_encode(["error" => "Invalid type"]);
        }

    } catch (ApiErrorException | CardException | RateLimitException | InvalidRequestException | AuthenticationException | ApiConnectionException $e) {
        return json_encode(["error" => $e->getMessage()]);
    }
}

function WhichPaymentWeDoing(
    StripeClient $stripe,
    bool $oneTimePayment,
    string $paymentMethodId,
    float $paymentAmount,
    array $customerData, // ['email','name','description','countryCode','taxId']
    string $type = "store" // store, donation, subscription
): string {
    try {
        // Step 1: Create customer
        $customer = $stripe->customers->create([
            "email" => $customerData['email'],
            "name" => $customerData['name'],
            "description" => $customerData['description'] ?? "",
            "address" => ["country" => $customerData['countryCode']]
        ]);

        if (!$customer || !isset($customer->id)) {
            return json_encode(["error" => "Failed to create customer"]);
        }

        // Set default payment method
        $stripe->customers->update($customer->id, [
            "invoice_settings" => ["default_payment_method" => $paymentMethodId]
        ]);

        // Add tax ID if provided
        if (!empty($customerData['taxId'])) {
            $taxType = getTaxIdType($customerData['countryCode']);
            if ($taxType) {
                $stripe->customers->createTaxId($customer->id, [
                    "type" => $taxType,
                    "value" => $customerData['taxId']
                ]);
            }
        }

        // Step 2: Create payment intent or subscription
        if ($oneTimePayment) {
            $intent = $stripe->paymentIntents->create([
                "amount" => $paymentAmount,
                "currency" => "usd",
                "payment_method" => $paymentMethodId,
                "confirmation_method" => "manual",
                "confirm" => true,
                "automatic_payment_methods" => ["enabled" => true],
                "off_session" => true,
                "receipt_email" => $customerData['email'],
                "setup_future_usage" => "off_session"
            ]);

            $status = $intent->status;
            $clientSecret = $intent->client_secret ?? null;
        } else {
            $subscription = $stripe->subscriptions->create([
                "customer" => $customer->id,
                "items" => [["price" => $paymentAmount]],
                "collection_method" => "charge_automatically",
                "payment_behavior" => "default_incomplete",
                "expand" => ["latest_invoice.payment_intent"],
                "off_session" => true
            ]);

            $intent = $subscription->latest_invoice->payment_intent ?? null;
            $status = $intent->status ?? "unknown";
            $clientSecret = $intent->client_secret ?? null;
        }

        // Step 3: Build standard response
        $messages = [
            "succeeded" => "Payment successful. Thank you!",
            "requires_action" => "Verification required to complete payment.",
            "requires_payment_method" => "Payment method issue. Try again.",
            "requires_capture" => "Bank requires confirmation.",
            "canceled" => "Payment failed. Try later."
        ];

        return json_encode([
            "success" => $status === "succeeded",
            "requires_action" => $status === "requires_action",
            "requires_confirmation" => $status === "requires_capture",
            "requires_source_action" => $status === "requires_payment_method",
            "message" => $messages[$status] ?? "Unknown status",
            "payment_intent_client_secret" => $clientSecret,
            "next_step" => $status === "succeeded" ? ($type === "store" ? "Printful_Order" : "none") : null,
            "error" => $status === "succeeded" ? "no error" : null
        ]);

    } catch (CardException | ApiErrorException $e) {
        return json_encode(["error" => $e->getMessage()]);
    } catch (Exception $e) {
        return json_encode(["error" => "Unexpected error: " . $e->getMessage()]);
    }
}

// Basic Printful request: fetch all store products
function BasicPrintfulRequest(): ?array {
    $ch = curl_init(PrintfulBaseUrl . "store/products");
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . printfulApiKey]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo "<script>console.error('Product Curl error: " . curl_error($ch) . "');</script>";
        curl_close($ch);
        return null;
    }

    curl_close($ch);
    return json_decode($response, true);
}

// Fetch Printful product description by product ID
function PrintfulProductionDescription($productId): ?array {
    $url = PrintfulBaseUrl . "products/$productId";
    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . printfulApiKey]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo "<script>console.error('Description Curl error: " . curl_error($ch) . "');</script>";
        curl_close($ch);
        return null;
    }

    curl_close($ch);
    return json_decode($response, true);
}

// Fetch variant info and price by variant ID
function getVariantandPrice($variantId): array {
    $url = PrintfulBaseUrl . "store/products/$variantId";
    $ch = curl_init($url);

    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . printfulApiKey]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo "<script>console.error('Variant Curl error: " . curl_error($ch) . "');</script>";
        curl_close($ch);
        return [];
    }

    curl_close($ch);
    $data = json_decode($response, true);
    return $data['result'] ?? [];
}

// Add item to user's shopping cart (stored in session)
function UserShoppingCartWishList(): void {
    session_start();

    $item = [
        'product_id' => $_REQUEST['product_id'] ?? null,
        'variant_id' => $_REQUEST['variant_id'] ?? null,
        'quantity' => $_REQUEST['quantity'] ?? 1,
        'name' => $_REQUEST['name'] ?? '',
        'price' => $_REQUEST['price'] ?? 0,
    ];

    $_SESSION['TfShoppingCartWish'][] = $item;

    header("Location: " . $_SERVER['PHP_SELF']);
    exit();
}

// Create a Printful order
function NPOtfTS(array $orderData): ?int {
    $ch = curl_init(PrintfulOrdersUrl);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . printfulApiKey,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($orderData));

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo "Error in API request: " . curl_error($ch);
        curl_close($ch);
        return null;
    }

    curl_close($ch);
    $decodedResponse = json_decode($response, true);

    if (isset($decodedResponse['result'])) {
        echo "Order created successfully. Order ID: " . $decodedResponse['result']['id'];
        return $decodedResponse['result']['id'];
    } else {
        echo "Error creating order: " . ($decodedResponse['error']['message'] ?? 'Unknown error');
        return null;
    }
}

//Webrtc Functions 
//curl response to make php 
/*
curl -X POST \
    -H "Authorization: Bearer $APITOKEN" \
    -H "Content-TYpe: application/json" -d `{"ttl": 86400}` \
    https://rtc.live.cloudlflare.com/v1/turn/keys/$TurnTokenID/credentials/generate 

    JSON response (Passed to Servers) 
    {
        "iceServers": {
            "urls": [
                "stun:stun.cloudflare.com:3478",
                "turn:turn.cloudflare.com:3478?transport=udp",
                "turn:turn.cloudflare.com:3478?transport=tcp",
                "turn:turn.cloudflare.com:3478?transport=tcp"
                ],
                "username": "mishuba14@gmail.com" //i think,
                "credential": "#SuperSayian14+" //i think, 
                }
    }
*/
?>