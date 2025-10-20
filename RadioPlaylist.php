<?php
// Debug toggle (set environment variable DEBUG=1 to show PHP errors)
//$DEBUG = getenv('DEBUG') === '1';
//ini_set('display_errors', $DEBUG ? '1' : '0');
//error_reporting($DEBUG ? E_ALL : 0);

require "stripestuff/vendor/autoload.php";

use Aws\Exception\AwsException;
use Aws\Credentials\Credentials;
use Aws\S3\S3Client;

header("Content-Type: application/json; charset=utf-8");

// Ensure request type
if (!isset($_SERVER["HTTP_X_REQUEST_TYPE"]) || $_SERVER["HTTP_X_REQUEST_TYPE"] !== "fetchRadioSongs") {
    http_response_code(400);
    echo json_encode(["error" => "Invalid Request Type"]);
    exit;
}

$cacheFile = '/tmp/radioCache.json';
if (file_exists($cacheFile) && time() - filemtime($cacheFile) < 300) {
    echo file_get_contents($cacheFile);
    exit;
}

// --- Your category array (kept same shape) ---
$sentToJsArray = array(
    array(array(), array(), array(), array()), // 0 Rizz
    array(array(), array(), array(), array()), // 1 Dancing
    array(), // 2 After Club
    array(array(), array(), array()), // 3 Sex
    array(array(), array(), array()), // 4 Love
    array(array(), array(), array()), // 5 Family
    array(array(), array(), array()), // 6 Inspiration
    array(array(), array(), array()), // 7 History
    array(array(), array(), array(), array(), array(), array()), // 8 Politics
    array(array(), array(), array()), // 9 Gaming
    array(), // 10 Comedy
    array(), // 11 All Music (Everything)
    array(array(), array(), array(), array()), // 12 Literature
    array(array(), array(), array(), array()), // 13 Sports
    array(array(), array(), array(), array()), // 14 Tech
    array(array(), array(), array(), array()), // 15 Science
    array(array(), array(), array(), array()), // 16 Real Estate
    array(), // 17 DJshuba
    array(array(), array(), array(), array(), array(), array()), // 18 Film
    array(array(), array(), array(), array()), // 19 Fashion
    array(array(), array(), array(), array()), // 20 Business
    array(), // 21 Hustlin
    array(), // 22 Pregame
    array()  // 23 Outside
);

// --- Initialize S3 (Cloudflare R2) client once, using env vars for safety ---
$accountId = getenv('CloudflareR2AccountId') ?: null;
$accessKey = getenv('CloudflareR2AccessKey') ?: null;
$secretKey = getenv('CloudflareR2SecretKey') ?: null;
$r2Endpoint = getenv('CloudflareR2Endpoint') ?: "https://radio.tsunamiflow.club"; // e.g. https://<account-id>.r2.cloudflarestorage.com
$bucketName = getenv('CloudflareR2Name') ?: 'tsunami-radio';

if (!$accessKey || !$secretKey || !$r2Endpoint) {
    // If credentials are missing, respond with an error instead of silently failing
    http_response_code(500);
    echo json_encode([
        "error" => "Missing R2 credentials or endpoint. Set R2_ACCESS_KEY, R2_SECRET_KEY and R2_ENDPOINT environment variables."
    ]);
    exit;
}

try {
    $credentials = new Credentials($accessKey, $secretKey);
    $s3 = new S3Client([
        "region" => "auto",
        "endpoint" => $r2Endpoint,
        "version" => "latest",
        "credentials" => $credentials,
        "use_path_style_endpoint" => false
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to initialize S3 client: " . $e->getMessage()]);
    exit;
}

function addSongsToArray($path, array &$array, int $index, $index2 = null, S3Client $s3 = null, string $bucket = 'tsunami-radio') {
    if (!$s3) {
        error_log("addSongsToArray: Missing S3 client");
        return;
    }

    // Normalize prefix: remove leading slash, ensure trailing slash
    $prefix = ltrim($path, '/');
    if (substr($prefix, -1) !== '/') $prefix .= '/';

    try {
        $params = [
            "Bucket" => $bucket,
            "Prefix" => $prefix,
            "MaxKeys" => 1000
        ];

        $Objects = $s3->listObjectsV2($params);

        if (!isset($Objects["Contents"]) || !is_array($Objects["Contents"])) {
            error_log("addSongsToArray: No contents for prefix {$prefix}");
            return;
        }

        foreach ($Objects["Contents"] as $obj) {
            if (!isset($obj['Key'])) continue;
            $key = $obj['Key'];

            // only mp3
            if (!str_ends_with(strtolower($key), '.mp3')) continue;

            // Ensure index exists
            if (!isset($array[$index]) || !is_array($array[$index])) {
                $array[$index] = [];
            }

            $decodedKey = trim(urldecode(ltrim($key, '/')));

            // If index2 provided, ensure the subarray exists
            if ($index2 !== null) {
                if (!isset($array[$index][$index2]) || !is_array($array[$index][$index2])) {
                    $array[$index][$index2] = [];
                }
                $array[$index][$index2][] = "https://www.tsunamiflow.club/" . $decodedKey;
            } else {
                $array[$index][] = "https://www.tsunamiflow.club/" . $decodedKey;
            }
            $array[11][] = "https://www.tsunamiflow.club/" . $decodedKey;
        }

        error_log("Added songs to index $index" . ($index2 !== null ? " at sub-index $index2" : ""));
    } catch (AwsException $e) {
        error_log("AWS Exception: " . $e->getMessage());
    } catch (Exception $e) {
        error_log("Exception in addSongsToArray: " . $e->getMessage());
    }
}

// --- Calls (kept your original mapping) ---
// 12 a.m Rizz IceBreakers Flirting GetHerDone Shot
addSongsToArray("Music/Rizz/IceBreakers/", $sentToJsArray, 0, 0, $s3, $bucketName);
addSongsToArray("Music/Rizz/Flirting/", $sentToJsArray, 0, 1, $s3, $bucketName);
addSongsToArray("Music/Rizz/GetHerDone/", $sentToJsArray, 0, 2, $s3, $bucketName);
addSongsToArray("Music/Rizz/Shots/", $sentToJsArray, 0, 3, $s3, $bucketName);

// 1 a.m.
addSongsToArray("Music/Dance/Twerking/", $sentToJsArray, 1, 0, $s3, $bucketName);
addSongsToArray("Music/Dance/LineDance/", $sentToJsArray, 1, 1, $s3, $bucketName);
addSongsToArray("Music/Dance/PopDance/", $sentToJsArray, 1, 2, $s3, $bucketName);
addSongsToArray("Music/Dance/Battle/", $sentToJsArray, 1, 3, $s3, $bucketName);

// 2 a.m
addSongsToArray("Music/Afterparty/", $sentToJsArray, 2, null, $s3, $bucketName);

// 3 a.m Sex
addSongsToArray("Music/Sex/Foreplay/", $sentToJsArray, 3, 0, $s3, $bucketName);
addSongsToArray("Music/Sex/sex/", $sentToJsArray, 3, 1, $s3, $bucketName);
addSongsToArray("Music/Sex/Cuddle/", $sentToJsArray, 3, 2, $s3, $bucketName);

// 4 a.m Love 
addSongsToArray("Music/Love/Memories/", $sentToJsArray, 4, 0, $s3, $bucketName);
addSongsToArray("Music/Love/love/", $sentToJsArray, 4, 1, $s3, $bucketName);
addSongsToArray("Music/Love/Intimacy/", $sentToJsArray, 4, 2, $s3, $bucketName);

// 5 a.m Family
addSongsToArray("Music/Family/Lifestyle/", $sentToJsArray, 5, 0, $s3, $bucketName);
addSongsToArray("Music/Family/Values/", $sentToJsArray, 5, 1, $s3, $bucketName);
addSongsToArray("Music/Family/Kids/", $sentToJsArray, 5, 2, $s3, $bucketName);

// 6 a.m Inspiration
addSongsToArray("Music/Inspiration/Motivation/", $sentToJsArray, 6, 0, $s3, $bucketName);
addSongsToArray("Music/Inspiration/Meditation/", $sentToJsArray, 6, 1, $s3, $bucketName);
addSongsToArray("Music/Inspiration/Something/", $sentToJsArray, 6, 2, $s3, $bucketName);

// 7 a.m History 
addSongsToArray("Music/History/DH/", $sentToJsArray, 7, 0, $s3, $bucketName);
addSongsToArray("Music/History/BAH/", $sentToJsArray, 7, 1, $s3, $bucketName);
addSongsToArray("Music/History/HFnineteen/", $sentToJsArray, 7, 2, $s3, $bucketName);

// 8 a.m Politics 
addSongsToArray("Music/Politics/Neutral/", $sentToJsArray, 8, 0, $s3, $bucketName);
addSongsToArray("Music/Politics/Democracy/", $sentToJsArray, 8, 1, $s3, $bucketName);
addSongsToArray("Music/Politics/Republican/", $sentToJsArray, 8, 2, $s3, $bucketName);
addSongsToArray("Music/Politics/Socialism/", $sentToJsArray, 8, 3, $s3, $bucketName);
addSongsToArray("Music/Politics/Bureaucracy/", $sentToJsArray, 8, 4, $s3, $bucketName);
addSongsToArray("Music/Politics/Aristocratic/", $sentToJsArray, 8, 5, $s3, $bucketName);

// 9 a.m. Gaming 
addSongsToArray("Music/Gaming/Fighters/", $sentToJsArray, 9, 0, $s3, $bucketName);
addSongsToArray("Music/Gaming/Shooters/", $sentToJsArray, 9, 1, $s3, $bucketName);
addSongsToArray("Music/Gaming/Instrumentals/", $sentToJsArray, 9, 2, $s3, $bucketName);

// 10 a.m. Comedy
addSongsToArray("Music/Comedy/", $sentToJsArray, 10, null, $s3, $bucketName);

// 12 a.m Literature
addSongsToArray("Music/Literature/Poems/", $sentToJsArray, 12, 0, $s3, $bucketName);
addSongsToArray("Music/Literature/SS/", $sentToJsArray, 12, 1, $s3, $bucketName);
addSongsToArray("Music/Literature/Instrumentals/", $sentToJsArray, 12, 2, $s3, $bucketName);
addSongsToArray("Music/Literature/Books/", $sentToJsArray, 12, 3, $s3, $bucketName);

// 1 p.m Sports 
addSongsToArray("Music/Sports/Reviews/", $sentToJsArray, 13, 0, $s3, $bucketName);
addSongsToArray("Music/Sports/Fans/", $sentToJsArray, 13, 1, $s3, $bucketName);
addSongsToArray("Music/Sports/Updates/", $sentToJsArray, 13, 2, $s3, $bucketName);
addSongsToArray("Music/Sports/Disses/", $sentToJsArray, 13, 3, $s3, $bucketName);

// 2 p.m Tech
addSongsToArray("Music/Tech/News/", $sentToJsArray, 14, 0, $s3, $bucketName);
addSongsToArray("Music/Tech/Music/", $sentToJsArray, 14, 1, $s3, $bucketName);
addSongsToArray("Music/Tech/History/", $sentToJsArray, 14, 2, $s3, $bucketName);
addSongsToArray("Music/Tech/Instrumentals/", $sentToJsArray, 14, 3, $s3, $bucketName);

// 3 p.m Science 
addSongsToArray("Music/Science/Biology/", $sentToJsArray, 15, 0, $s3, $bucketName);
addSongsToArray("Music/Science/Chemistry/", $sentToJsArray, 15, 1, $s3, $bucketName);
addSongsToArray("Music/Science/Physics/", $sentToJsArray, 15, 2, $s3, $bucketName);
addSongsToArray("Music/Science/Environmental/", $sentToJsArray, 15, 3, $s3, $bucketName);

// 4 p.m Real Estate EP, Seller, Mortgage, Buyer
addSongsToArray("Music/RealEstate/EP/", $sentToJsArray, 16, 0, $s3, $bucketName);
addSongsToArray("Music/RealEstate/Seller/", $sentToJsArray, 16, 1, $s3, $bucketName);
addSongsToArray("Music/RealEstate/Mortgage/", $sentToJsArray, 16, 2, $s3, $bucketName);
addSongsToArray("Music/RealEstate/Buyer/", $sentToJsArray, 16, 3, $s3, $bucketName);

// 5 p.m DJ Shuba (Basically New Music)
addSongsToArray("Music/DJshuba/", $sentToJsArray, 17, null, $s3, $bucketName);

// 6 p.m Film
addSongsToArray("Music/Film/NM/", $sentToJsArray, 18, 0, $s3, $bucketName);
addSongsToArray("Music/Film/SHM/", $sentToJsArray, 18, 1, $s3, $bucketName);
addSongsToArray("Music/Film/MH/", $sentToJsArray, 18, 2, $s3, $bucketName);
addSongsToArray("Music/Film/VM/", $sentToJsArray, 18, 3, $s3, $bucketName);
addSongsToArray("Music/Film/LS/", $sentToJsArray, 18, 4, $s3, $bucketName);
addSongsToArray("Music/Film/CB/", $sentToJsArray, 18, 5, $s3, $bucketName);

// 7 p.m Fashion PD, LD, FH, SM 
addSongsToArray("Music/Fashion/PD/", $sentToJsArray, 19, 0, $s3, $bucketName);
addSongsToArray("Music/Fashion/LD/", $sentToJsArray, 19, 1, $s3, $bucketName);
addSongsToArray("Music/Fashion/FH/", $sentToJsArray, 19, 2, $s3, $bucketName);
addSongsToArray("Music/Fashion/SM/", $sentToJsArray, 19, 3, $s3, $bucketName);

// 8 p.m Business 
addSongsToArray("Music/Business/FE/", $sentToJsArray, 20, 0, $s3, $bucketName);
addSongsToArray("Music/Business/TOB/", $sentToJsArray, 20, 1, $s3, $bucketName);
addSongsToArray("Music/Business/Insurance/", $sentToJsArray, 20, 2, $s3, $bucketName);
addSongsToArray("Music/Business/TE/", $sentToJsArray, 20, 3, $s3, $bucketName);

// Hustlin
addSongsToArray("Music/Hustlin/", $sentToJsArray, 21, null, $s3, $bucketName);

// Pregame
addSongsToArray("Music/Pregame/", $sentToJsArray, 22, null, $s3, $bucketName);

// Outside
addSongsToArray("Music/Outside/", $sentToJsArray, 23, null, $s3, $bucketName);

// --- Finally output JSON ---
// --- Finally output JSON ---
$TsunamiFlowRadio = json_encode($sentToJsArray, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_IGNORE | JSON_UNESCAPED_SLASHES);

// Write cache first (safe write)
$tmpFile = $cacheFile . '.tmp';
file_put_contents($tmpFile, $TsunamiFlowRadio);
rename($tmpFile, $cacheFile);

// Output once
echo $TsunamiFlowRadio;
exit;

exit;