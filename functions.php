<?php
// --- Required files & namespaces ---
require_once "Arrays.php";
require_once "Objects.php";
require_once "stripestuff/vendor/autoload.php";

use Stripe\StripeClient;
use Stripe\Exception\ApiErrorException;
use Stripe\Exception\CardException;

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
    if (!isset($inputArray[$inputName]) || empty($inputArray[$inputName])) return null;
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

// --- Stripe Helper ---
function getStripeClient($secretKey): StripeClient {
    return new StripeClient($secretKey);
}

function getTaxIdType($countryCode): ?string {
    $taxIdTypes = [
        "US" => "us_ein",
        "CA" => "ca_bn",
        "GB" => "gb_vat",
    ];
    return $taxIdTypes[$countryCode] ?? null;
}

// --- Main Stripe Payment Function ---
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

        // Step 2: Create PaymentIntent or Subscription
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

// --- Database Insert Function (Full) ---
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
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        // --- Insert into FreeLevelMembers ---
        $stmt = $db->prepare("INSERT INTO FreeLevelMembers (tfUN, tfFN, tfLN, tfNN, tfGen, tfBirth, tfEM, tfPSW, created)
            VALUES (:tfUN, :tfFN, :tfLN, :tfNN, :tfGen, :tfBirth, :tfEM, :tfPSW, NOW())");
        $stmt->execute([
            ":tfUN" => $userName, ":tfFN" => $firstName, ":tfLN" => $lastName, ":tfNN" => $nickName,
            ":tfGen" => $gender, ":tfBirth" => $birthdate, ":tfEM" => $email, ":tfPSW" => $hashedPassword
        ]);

        // --- Session & Cookies ---
        foreach (["TfAccess" => ucfirst($membership), "Username" => $userName, "Birthday" => $birthdate,
                  "Gender" => $gender, "Nickname" => $nickName, "Email" => $email] as $k=>$v) createCookieAndSession($k, $v);

        // --- Additional inserts for Regular/VIP/Team members ---
        $tableMap = [
            "Regular" => "RegularMembers",
            "VIP" => "VIPMembers",
            "Team" => "TeamMembers"
        ];

        if (isset($tableMap[$membership])) {
            $stmtExtra = $db->prepare("INSERT INTO {$tableMap[$membership]} 
                (tfUN, tfFN, tfLN, tfNN, tfEM, tfBirth, tfGen, created) 
                VALUES (:tfUN, :tfFN, :tfLN, :tfNN, :tfEM, :tfBirth, :tfGen, NOW())");
            $stmtExtra->execute([
                ":tfUN" => $userName, ":tfFN" => $firstName, ":tfLN" => $lastName, ":tfNN" => $nickName,
                ":tfEM" => $email, ":tfBirth" => $birthdate, ":tfGen" => $gender
            ]);
        }

        // --- CSV Backup ---
        $csvFile = __DIR__ . "/user_backup.csv";
        $csvData = [
            $userName, $firstName, $lastName, $nickName, $gender, $birthdate, $email,
            $chineseZodiacSign, $westernZodiacSign, $spiritAnimal, $celticTreeZodiacSign, $nativeAmericanZodiacSign,
            $vedicAstrologySign, $guardianAngel, $ChineseElement, $eyeColorMeaning, $GreekMythologyArchetype,
            $NorseMythologyPatronDeity, $EgyptianZodiacSign, $MayanZodiacSign, $loveLanguage, $birthStone,
            $birthFlower, $bloodType, $attachmentStyle, $charismaType, $businessPersonality, $TFuserDISC,
            $socionicsType, $learningStyle, $financialPersonalityType, $primaryMotivationStyle, $creativeStyle,
            $conflictManagementStyle, $teamRolePreference, date("Y-m-d H:i:s")
        ];
        $handle = fopen($csvFile, 'a');
        fputcsv($handle, $csvData);
        fclose($handle);

        echo json_encode(["status"=>"success","message"=>"User $userName successfully registered as $membership member."]);

    } catch (PDOException $e) {
        handleDatabaseError($e);
    } catch (Exception $e) {
        error_log($e->getMessage(), 0);
        echo json_encode(["status"=>"error","message"=>"Unexpected error: ".$e->getMessage()]);
    }
}

// --- Login ---
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

// --- Printful functions ---
function BasicPrintfulRequest(): ?array {
    $ch = curl_init(PrintfulBaseUrl . "store/products");
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . printfulApiKey]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    if (curl_errno($ch)) { curl_close($ch); return null; }
    curl_close($ch);
    return json_decode($response, true);
}

function PrintfulProductionDescription($productId): ?array {
    $ch = curl_init(PrintfulBaseUrl . "store/products/$productId");
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . printfulApiKey]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    if (curl_errno($ch)) { curl_close($ch); return null; }
    curl_close($ch);
    return json_decode($response, true);
}

function getVariantandPrice($productId): ?array {
    $prod = PrintfulProductionDescription($productId);
    return $prod['result']['sync_variants'] ?? null;
}

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
    if (curl_errno($ch)) { curl_close($ch); return null; }
    curl_close($ch);

    $decodedResponse = json_decode($response, true);
    return $decodedResponse['result']['id'] ?? null;
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