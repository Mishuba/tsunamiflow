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
        function WhichPaymentWeDoing($oneTimePayment, $PaymentMethod, $PaymentAmount){//, $TypeOfThing
        /*
            global $StfPk;
            $TfStoreShit = json_decode(file_get_contents("php://input"), true);
            try {
                $stripeTcustomerF = Customer::create([ //$StfPk->customers->create([
                    "email" => $TfStoreShit["email"],
                    "name" => $TfStoreShit["name"],
                    "description" => $TfStoreShit["description"],
                    "address" => [
                        "country" => $TfStoreShit["countryCode"]
                    ]
                ]);

                if (isset($stripeTcustomerF->id)) {
                    $TfCusId = $stripeTcustomerF->id;
                        Customer::update($TfCusId, [
                            "invoice_settings" => [
                                "default_payment_method" => $PaymentMethod //TfStoreShit["PaymentMethod"]->id
                            ]
                        ]);

                        if (!empty($TfStoreShit["TaxId"])) {
                            $taxIdType = getTaxIdType($TfStoreShit["countryCode"]);

                            if ($taxIdType) {
                                Customer::createTaxId($TfCusId, [
                                    "type" => $taxIdType,
                                    "value" => $TfStoreShit["TaxId"]
                                ]);
                            }
                        }
                } else {
                        return json_encode(["error" => "Failed to create customer"]);
                }
            } catch (ApiErrorException $e) {
                return json_encode(["error" => $e->getMessage()]);
            } catch (CardException $e) {
                return json_encode(["error" => $e->getError()->message, "error_param" => $e->getError()->param, "error_code" => $e->getError()->code, "error_type" => $e->getError()->type, "error_status" => $e->getHttpStatus()]);
            } catch (RateLimitException $e) {
                return json_encode(["error" => $e->getError()->message, "error_param" => $e->getError()->param, "error_code" => $e->getError()->code, "error_type" => $e->getError()->type, "error_status" => $e->getHttpStatus()]);
            } catch (InvalidRequestException $e) {
                return json_encode(["error" => $e->getError()->message, "error_param" => $e->getError()->param, "error_code" => $e->getError()->code, "error_type" => $e->getError()->type, "error_status" => $e->getHttpStatus()]);
            } catch (AuthenticationException $e) {
                return json_encode(["error" => $e->getError()->message, "error_param" => $e->getError()->param, "error_code" => $e->getError()->code, "error_type" => $e->getError()->type, "error_status" => $e->getHttpStatus()]);
            } catch (ApiConnectionException $e) {
                return json_encode(["error" => $e->getError()->message, "error_param" => $e->getError()->param, "error_code" => $e->getError()->code, "error_type" => $e->getError()->type, "error_status" => $e->getHttpStatus()]);
            } catch (Exception $e) {
                return json_encode(["error" => "An unexpected error occurred: " . $e->getMessage()]);
            } finally {
                try {
                    if($oneTimePayment === true) {
                        $TfStoreIntent = $StfPk->paymentIntents->create([
                            "amount" => $PaymentAmount,
                            "currency" => "usd",
                            "payment_method" => $PaymentMethod,
                            "automatic_payment_methods" => [
                                "enabled" => true,
                                "allow_redirects" => "always",
                            ],
                            "confirmation_method" => "manual",
                            "confirm" => true,
                            "statement_descriptor_suffix" => "TF",
                            //"description" => $somethingIdkYet,
                            //"metadata" => $someKeyValuePairArrayorObject
                            "off_session" => true,
                            "receipt_email" => $TfStoreShit["email"],
                            "setup_future_usage" => "off_session",
                            "payment_method_types" => ["card"],
                            //"shipping" => [], address infomation
                            //"statement_descriptor" => "",

                            "capture_method" => "automatic_async",
                            //confirmation_token" => $IntentConfirmation,
                            //"mandate" => $IntentMandate,
                            //"payment_method_configuration" => $IntentPaymentMethodConfiguration,
                            //"return_url" => "https://webhooks.tsunamiflow.club/webhook/StripePayments.php",
                            //"use_stripe_sdk" => true,
                        ]);
                    } else {//Monthly Payment

                        $TfStoreIntent = $StfPk->subscriptions->create([
                            "customer" => $TfCusId,
                            "automatic_tax" => [
                                "enabled" => true,
                            ],
                            "currency" => "usd",
                            "default_payment_method" => $PaymentMethod,
                        "items" => [
                            [
                                //"discounts" => [
                                //"coupon" => ,
                                //"promotion_code" => ,
                                //]
                                "price" => $PaymentAmount,
                            ],
                        ],
                        "collection_method" => "charge_automatically",
                        "payment_behavior" => "default_incomplete",
                        "off_session" => true,
                        "trial_period_days" => 7,
                        "expand" => ["lastest_invoice.payment_intent"],
                        ]);
                    } 
                } catch (ApiErrorException $e) {
                    return json_encode(["error" => $e->getMessage()]);
                } catch (CardException $e) {
                    return json_encode(["error" => $e->getError()->message, "error_param" => $e->getError()->param, "error_code" => $e->getError()->code, "error_type" => $e->getError()->type, "error_status" => $e->getHttpStatus()]);
                } catch (RateLimitException $e) {
                    return json_encode(["error" => $e->getError()->message, "error_param" => $e->getError()->param, "error_code" => $e->getError()->code, "error_type" => $e->getError()->type, "error_status" => $e->getHttpStatus()]);
                } catch (InvalidRequestException $e) {
                    return json_encode(["error" => $e->getError()->message, "error_param" => $e->getError()->param, "error_code" => $e->getError()->code, "error_type" => $e->getError()->type, "error_status" => $e->getHttpStatus()]);
                } catch (AuthenticationException $e) {
                    return json_encode(["error" => $e->getError()->message, "error_param" => $e->getError()->param, "error_code" => $e->getError()->code, "error_type" => $e->getError()->type, "error_status" => $e->getHttpStatus()]);
                } catch (ApiConnectionException $e) {
                    return json_encode(["error" => $e->getError()->message, "error_param" => $e->getError()->param, "error_code" => $e->getError()->code, "error_type" => $e->getError()->type, "error_status" => $e->getHttpStatus()]);
                } finally {
                    if (isset($TfStoreIntent->id)) {
                        $TfSiId = $TfStoreIntent->id; 
                        if (isset($TfStoreIntent->client_secret)) {
                            $TfUrCs = $TfStoreIntent->client_secret;

                            try{
                                if($oneTimePayment === true) {
                                    $PaymentStatusFr = PaymentIntent::retrieve($TfSiId);
                                    $RealStatus = $PaymentStatusFr->status;
                                } else {
                                    $PaymentStatusFr = Subscription::retrieve($TfSiId);  
                                    $RealStatus = $PaymentStatusFr->latest_invoice->payment_intent;
                                }
                            } catch (ApiErrorException $e) {
                                echo json_encode(["error" => $e->getMessage()]);
                            } finally {
                                $PayIntentId = $TfSiId;
                                $TheIntentTFcs = $RealStatus;
                                $ClientSecret = $TfUrCs; 
                                $DorS = "donation";
                                try {
                                    if($oneTimePayment === true) {// Check status of payment intent.
                                        //$TheIntentStatus = $StfPk->paymentIntents->confirm($PayIntentId, []); //maybe add a return url;
                                        //$TheIntentStatus = $StfPk->paymentIntents->capture($PayIntentId->id, []);
                                        if ($TheIntentTFcs == "succeeded") {
                                            if ($DorS === "donation") {
                                                $TheStatus = [
                                                "success" => true, 
                                                "requires_action" => false, 
                                                "requires_confirmation" => false, 
                                                "requires_source_action" => false,
                                                "message" => "Your donation was successful. We thank you here at Tsunami Flow.", 
                                                "payment_intent_client_secret" => $ClientSecret, 
                                                "next_step" => "none",
                                                "error" => "no error"
                                                ];
                                            } else if ($DorS === "store") {
                                                $TheStatus = [
                                                "success" => true, 
                                                "requires_action" => false, 
                                                "requires_confirmation" => false, 
                                                "requires_source_action" => false,
                                                "message" => "Your payment was successful. was successful. We thank you here at Tsunami Flow.", 
                                                "payment_intent_client_secret" => $ClientSecret, 
                                                "next_step" => "Printful_Order",
                                                "error" => "no error"
                                                ];
                                                //Submit the Order (the order should have been drafted already before this.)
                                            } else {
                                                $TheStatus = [
                                                "success" => true, 
                                                "requires_action" => false, 
                                                "requires_confirmation" => false, 
                                                "requires_source_action" => false,
                                                "message" => "", 
                                                "payment_intent_client_secret" => $ClientSecret, 
                                                "next_step" => "none",
                                                "error" => "no error"
                                                ];
                                                //Digital store download link or something like that email maybe. 
                                            }
                                        } if ($TheIntentTFcs == "requires_action") { //authenication
                                            $TheStatus = [
                                                "success" => true, 
                                                "requires_action" => true, 
                                                "requires_confirmation" => false, 
                                                "requires_source_action" => false,
                                                "message" => "We require verification for you to complete this payment.", 
                                                "payment_intent_client_secret" => $ClientSecret, 
                                                "next_step" => "requires_action",
                                                "error" => "no error"
                                            ];
                                        } else if ($TheIntentTFcs === "requires_payment_method") {
                                            $TheStatus = [
                                                "success" => true, 
                                                "requires_action" => false, 
                                                "requires_confirmation" => false, 
                                                "requires_source_action" => true,
                                                "message" => "Something went wrong with your payment information.", 
                                                "payment_intent_client_secret" => $ClientSecret, 
                                                "next_step" => "requires_source_action",
                                                "error" => "no error"
                                            ];
                                        } else if ($TheIntentTFcs == "requires_capture") {
                                            $TheIntentStatus = $StfPk->paymentIntents->incrementAuthorization($PayIntentId);
                                            
                                            $TheStatus = [
                                                "success" => false, 
                                                "requires_action" => false, 
                                                "requires_confirmation" => true, 
                                                "requires_source_action" => false,
                                                "message" => "Your bank requires you to confirm the payment", 
                                                "payment_intent_client_secret" => $ClientSecret, 
                                                "next_step" => "requires_confirmation",
                                                "error" => "no error"
                                            ];
                                            
                                        } else if ($TheIntentTFcs == "canceled") {
                                            $TheStatus = [
                                                "success" => false, 
                                                "requires_action" => false, 
                                                "requires_confirmation" => false, 
                                                "requires_source_action" => false,
                                                "message" => "Your payment failed. You can try again later.", 
                                                "payment_intent_client_secret" => $ClientSecret, 
                                                "next_step" => "cancel_order",
                                                "error" => "no error"
                                            ];
                                        } else if ($TheIntentTFcs == "requires_confirmation") {
                                                $TheIntentStatus = $StfPk->paymentIntents->confirm($TfStoreIntent->id, []); //maybe add a return url  https://www.tsunamiflow.club/server.php
                                        }
                                    } else {
                                        //This is for subscribers
                                        $TheIntentStatus = $StfPk->subscriptions->retrieve($PayIntentId, []);
                                        if ($TheIntentStatus->latest_invoice === "succeeded") {
                                            //Community Level
                                            if ($DorS === "Community") {
                                                $TfMlCts = validate_input("membershipLevel", $_POST);
                                                $fiNa = validate_input("TFRegisterFirstName", $_POST);
                                                $laNa = validate_input("TFRegisterLastName", $_POST);
                                                $niNa = validate_input("TFRegisterNickName", $_POST);
                                                $gede = validate_input("TFRegisterGender", $_POST);
                                                $bihda = validate_input("TFRegisterBirthday", $_POST);
                                                $eml = $_POST["TFRegisterEmail"];
                                                //$eml = TsunamiInput($_POST["TFRegisterEmail"]);
                                                $usNa = validate_input("TFRegisterUsername", $_POST);
                                                $Checkpassword = validate_input("TFRegisterPassword", $_POST);
                                                $pawo = password_hash($Checkpassword, PASSWORD_DEFAULT);
                                                $chZoSi = validate_input("ChineseZodiacSign", $_POST);
                                                $weZoSi = validate_input("WesternZodiacSign", $_POST);
                                                $spiAna = validate_input("SpiritAnimal", $_POST);
                                                $ceTrZoSi = validate_input("CelticTreeZodiacSign", $_POST);
                                                $naAmZoSi = validate_input("NativeAmericanZodiacSign", $_POST);
                                                $veAsSi = validate_input("VedicAstrologySign", $_POST);
                                                $guAg = validate_input("GuardianAngel", $_POST);
                                                $ChEl = validate_input("ChineseElement", $_POST);
                                                $eyCoMe = validate_input("EyeColorMeaning", $_POST);
                                                $GrMyAr = validate_input("GreekMythologyArchetype", $_POST);
                                                $NoMyPaDe = validate_input("NorseMythologyPatronDeity", $_POST);
                                                $EgZoSi = validate_input("EgyptianZodiacSign", $_POST);
                                                $MaZoSi =  validate_input("MayanZodiacSign", $_POST);
                                                $loLaua = validate_input("LoveLanguage", $_POST);
                                                $biSt = validate_input("Birthstone", $_POST);
                                                $biFl = validate_input("BirthFlower", $_POST);
                                                $blTy = validate_input("BloodType", $_POST);
                                                $atchntyl = validate_input("AttachmentStyle", $_POST);
                                                $chisTy = validate_input("CharismaType", $_POST);
                                                $bunePeonit = validate_input("BusinessPersonality", $_POST);
                                                $usDIC = validate_input("DISC", $_POST);
                                                $soonsTy = validate_input("SocionicsType", $_POST);
                                                $leniSte = validate_input("LearningStyle", $_POST);
                                                $finclPsonityp = validate_input("FinancialPersonalityType", $_POST);
                                                $prarotatnSle = validate_input("PrimaryMotivationStyle", $_POST);
                                                $crtiSte = validate_input("CreativeStyle", $_POST);
                                                $coliMagentyl = validate_input("ConflictManagementStyle", $_POST);
                                                $teRoPrerc = validate_input("TeamRolePreference", $_POST);
                                                InputIntoDatabase($TfMlCts, $usNa, $fiNa, $laNa, $niNa, $gede, $bihda, $eml, $pawo, $chZoSi, $weZoSi, $spiAna, $ceTrZoSi, $naAmZoSi, $veAsSi, $guAg, $ChEl, $eyCoMe, $GrMyAr, $NoMyPaDe, $EgZoSi, $MaZoSi, $loLaua, $biSt, $biFl, $blTy, $atchntyl, $chisTy, $bunePeonit, $usDIC, $soonsTy, $leniSte, $finclPsonityp, $prarotatnSle, $crtiSte, $coliMagentyl, $teRoPrerc);
                                                $TheStatus = [
                                                    "success" => true, 
                                                    "requires_action" => false, 
                                                    "requires_confirmation" => false, 
                                                    "requires_source_action" => false,
                                                    "message" => "Your payment was successful. We thank you here at Tsunami Flow.", 
                                                    "payment_intent_client_secret" => "Unnecessary", 
                                                    "next_step" => "none",
                                                    "error" => "no error"
                                                ];
                                            } else {
                                                $TheStatus = [
                                                    "success" => true, 
                                                    "requires_action" => false, 
                                                    "requires_confirmation" => false, 
                                                    "requires_source_action" => false,
                                                    "message" => "Your payment was successful. We thank you here at Tsunami Flow.", 
                                                    "payment_intent_client_secret" => "Unnecessary", 
                                                    "next_step" => "none",
                                                    "error" => "no error"
                                                ];
                                            }
                                        } else if($TheIntentStatus === "requires_action") {
                                            $TheStatus = [
                                                "success" => false, 
                                                "requires_action" => true, 
                                                "requires_confirmation" => false, 
                                                "requires_source_action" => false,
                                                "message" => "We require an verification before we can accept your payment.", 
                                                "payment_intent_client_secret" => $ClientSecret, 
                                                "next_step" => "requires_action",
                                                "error" => "no error"
                                            ];
                                        } else if ($TheIntentStatus === "requires_confirmation") {
                                            $TheStatus = [
                                                "success" => false, 
                                                "requires_action" => false, 
                                                "requires_confirmation" => true, 
                                                "requires_source_action" => false,
                                                "message" => "Your bank requires you to confirm your payment.", 
                                                "payment_intent_client_secret" => $ClientSecret, 
                                                "next_step" => "requires_confirmation",
                                                "error" => "no error"
                                            ];
                                        } else if ($TheIntentStatus === "requires_source_action") {
                                            $TheStatus = [
                                                "success" => false, 
                                                "requires_action" => false, 
                                                "requires_confirmation" => false, 
                                                "requires_source_action" => true,
                                                "message" => "Your bank requires you to do some extra steps", 
                                                "payment_intent_client_secret" => $ClientSecret, 
                                                "next_step" => "requires_confirmation",
                                                "error" => "no error"
                                            ];
                                        } else {
                                            //$StfPk->subscriptions->cancel($TfStoreIntent, []);
                                            $TheStatus = [
                                                "success" => false, 
                                                "requires_action" => false, 
                                                "requires_confirmation" => false, 
                                                "requires_source_action" => false,
                                                "message" => "Your payment failed.", 
                                                "payment_intent_client_secret" => $ClientSecret, 
                                                "next_step" => "cancel",
                                                "error" => "unknown error"
                                            ];
                                        }
                                    }
                                } catch (ApiErrorException $e) {
                                    return json_encode(["error" => $e->getMessage()]);
                                } catch (CardException $e) {
                                    return json_encode(["error" => $e->getError()->message, "error_param" => $e->getError()->param, "error_code" => $e->getError()->code, "error_type" => $e->getError()->type, "error_status" => $e->getHttpStatus()]);
                                } catch (RateLimitException $e) {
                                    return json_encode(["error" => $e->getError()->message, "error_param" => $e->getError()->param, "error_code" => $e->getError()->code, "error_type" => $e->getError()->type, "error_status" => $e->getHttpStatus()]);
                                } catch (InvalidRequestException $e) {
                                    return json_encode(["error" => $e->getError()->message, "error_param" => $e->getError()->param, "error_code" => $e->getError()->code, "error_type" => $e->getError()->type, "error_status" => $e->getHttpStatus()]);
                                } catch (AuthenticationException $e) {
                                    return json_encode(["error" => $e->getError()->message, "error_param" => $e->getError()->param, "error_code" => $e->getError()->code, "error_type" => $e->getError()->type, "error_status" => $e->getHttpStatus()]);
                                } catch (ApiConnectionException $e) {
                                    return json_encode(["error" => $e->getError()->message, "error_param" => $e->getError()->param, "error_code" => $e->getError()->code, "error_type" => $e->getError()->type, "error_status" => $e->getHttpStatus()]);
                                } finally {
                                    return json_encode($TheStatus);
                                }
                            }
                        } else {
                            return json_encode(["error" => "Failed to create client_secret"]);
                        }
                    } else {
                        return json_encode(["error" => "Failed to create payment intent"]);
                    }
                }
    }
*/}

//Printful Functions
function BasicPrintfulRequest()
{
    /*
    $someCurl = curl_init(PrintfulBaseUrl . "store/products");
    curl_setopt($someCurl, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . printfulApiKey]);
    curl_setopt($someCurl, CURLOPT_RETURNTRANSFER, true);

    $myStoreItems = curl_exec($someCurl);

    if (curl_errno($someCurl)) {
        echo ("<script> console.error(`Product Curl error: " . curl_error($someCurl) . "`); </script>");
        curl_close($someCurl);
        return null;
    } else {
    }
    $myStoreItems = json_decode($myStoreItems, true);

    curl_close($someCurl);
    return $myStoreItems;
    */
}

//Printful Product Description
function PrintfulProductionDescription($printfulProduct_id)
{
    /*
    $regularPrintfulShit = "https://api.printful.com/products/$printfulProduct_id";
    $SomeDescription = curl_init($regularPrintfulShit);

    // Set the cURL options for the request
    curl_setopt($SomeDescription, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . printfulApiKey]);
    curl_setopt($SomeDescription, CURLOPT_RETURNTRANSFER, true);

    // Execute the request
    $DescriptionResponse = curl_exec($SomeDescription);

    // Handle errors in the cURL request
    if (curl_errno($SomeDescription)) {
        echo ("<script> console.error(`Description Curl error: " . curl_error($SomeDescription) . "`); </script>");
        curl_close($SomeDescription);
        return null;
    }

    curl_close($SomeDescription);

    // Decode the JSON response
    $DescriptionDecodeResponse = json_decode($DescriptionResponse, true);

    // Check if the product and description exist and return it, otherwise return an empty array
    return $DescriptionDecodeResponse;
    */
}

//Choose Store Items
function getVariantandPrice($variantId)
{
    /*
    $PrintfulVariantId = "https://api.printful.com/store/products/$variantId";
    $TFvariant = curl_init($PrintfulVariantId);
    curl_setopt($TFvariant, CURLOPT_HTTPHEADER, ["Authorization: Bearer " . printfulApiKey]);
    curl_setopt($TFvariant, CURLOPT_RETURNTRANSFER, true);
    $VariantResponse = curl_exec($TFvariant);
    curl_close($TFvariant);

    if (curl_errno($TFvariant)) {
        echo ("<script> console.error(`Variant Curl error: " . curl_error($TFvariant) . "`); </script>");
        curl_close($TFvariant);
        return null;
    }

    $VariantResponse = json_decode($VariantResponse, true);
    return isset($VariantResponse["result"]) ? $VariantResponse["result"] : [];
    */
}

function UserShoppingCartWishList(){
    // Handle the shopping cart logic
    // Add product to session/cart
    /*
    $_SESSION["TfShoppingCartWish"][] = [
        'product_id' => validate_input("", $_REQUEST) ?? validate_input("", $_POST),
        'variant_id' => validate_input("", $_REQUEST) ?? validate_input("", $_POST),
        'quantity' => validate_input("", $_REQUEST) ?? validate_input("", $_POST),
        'name' => validate_input("", $_REQUEST) ?? validate_input("", $_POST),
        'price' => validate_input("", $_REQUEST) ?? validate_input("", $_POST),
    ];
    header("Location: " . $_SERVER["PHP_SELF"]);
    exit();
    */
}

//Create an Order

function NPOtfTS($orderData)
{
/*
    //Printful Order
    // Initialize cURL session to make the API request
    $ch = curl_init(PrintfulOrdersUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . printfulApiKey,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($orderData));

    // Execute the cURL request
    $response = curl_exec($ch);
    curl_close($ch);

    // Check the response for errors
    if ($response === false) {
        echo "Error in API request: " . curl_error($ch);
    } else {
        $decodedResponse = json_decode($response, true);
        if (isset($decodedResponse['result'])) {
            echo ("Order created successfully. Order ID: " . $decodedResponse['result']['id']);
            return $decodedResponse['result']['id'];
        } else {
            echo "Error creating order: " . $decodedResponse['error']['message'];
            //cancel payment here. Create cancel payment function. CancelStripePaymentDude();
        }
    }
    //Orders Ends
    */
}
    
//Printful Functions Ends

//Webhook Functions

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