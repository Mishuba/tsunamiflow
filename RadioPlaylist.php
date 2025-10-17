<?php
ini_set("display_errors", 0);
error_reporting(0);

require "stripestuff/vendor/autoload.php";
use Aws\Exception\AwsException;

header("Content-Type: application/json");

if (isset($_SERVER["HTTP_X_REQUEST_TYPE"]) && $_SERVER["HTTP_X_REQUEST_TYPE"] === "fetchRadioSongs") {

    // Base array setup
    $sentToJsArray = [
        [[], [], [], []], // Rizz
        [[], [], [], []], // Dancing
        [], // After Club
        [[], [], []], // Sex
        [[], [], []], // Love
        [[], [], []], // Family
        [[], [], []], // Inspiration
        [[], [], []], // History
        [[], [], [], [], [], []], // Politics
        [[], [], []], // Gaming
        [], // Comedy
        [], // All Music
        [[], [], [], []], // Literature
        [[], [], [], []], // Sports
        [[], [], [], []], // Tech
        [[], [], [], []], // Science
        [[], [], [], []], // Real Estate
        [], // DJshuba
        [[], [], [], [], [], []], // Film
        [[], [], [], []], // Fashion
        [[], [], [], []], // Business
        [], // Hustlin
        [], // Pregame
        []  // Outside
    ];

    /**
     * Fetch and append songs to category arrays
     */
    function addSongsToArray($path, &$array, $index, $index2 = null) {
        try {
            $accountId = "ac47c31c7548ac580a0b4caaed91d41f";
            $accessKey = "e049b04aab83b8cf7e2d73ea3c660c66";
            $secretKey = "fbdd66bb5fb5d0021396dea586a5d358ff0a9be106ad5bc234791690dce66212";

            $credentials = new Aws\Credentials\Credentials($accessKey, $secretKey);
            $StorageBucket = new Aws\S3\S3Client([
                "region" => "auto",
                "endpoint" => "https://ac47c31c7548ac580a0b4caaed91d41f.r2.cloudflarestorage.com",
                "version" => "latest",
                "credentials" => $credentials
            ]);

            $Objects = $StorageBucket->listObjectsV2([
                "Bucket" => "tsunami-radio",
                "Prefix" => $path
            ]);

            if (!isset($Objects["Contents"])) {
                error_log("No contents for $path");
                return;
            }

            // Make sure indexes exist
            if (!isset($array[$index])) $array[$index] = [];
            if ($index2 !== null && !isset($array[$index][$index2])) $array[$index][$index2] = [];

            $added = 0;

            foreach ($Objects["Contents"] as $obj) {
                if (isset($obj["Key"]) && str_ends_with($obj["Key"], ".mp3")) {
                    $url = "https://www.tsunamiflow.club/" . $obj["Key"];
                    if ($index2 === null) {
                        $array[$index][] = $url;
                    } else {
                        $array[$index][$index2][] = $url;
                    }
                    if (!isset($array[11])) {
                        $array[11] = [];
                   }
                    $array[11][] = $url;
                    $added++;
                }
            }

            error_log("Added $added songs to $path (index $index" . ($index2 !== null ? "[$index2]" : "") . ")");

        } catch (AwsException $e) {
            error_log("AWS Error ($path): " . $e->getAwsErrorMessage());
        } catch (Exception $e) {
            error_log("PHP Error ($path): " . $e->getMessage());
        }
    }

    // --- All calls (unchanged, just cleaned) ---
    addSongsToArray("Music/Rizz/IceBreakers/", $sentToJsArray, 0, 0);
    addSongsToArray("Music/Rizz/Flirting/", $sentToJsArray, 0, 1);
    addSongsToArray("Music/Rizz/GetHerDone/", $sentToJsArray, 0, 2);
    addSongsToArray("Music/Rizz/Shots/", $sentToJsArray, 0, 3);

    addSongsToArray("Music/Dance/Twerking/", $sentToJsArray, 1, 0);
    addSongsToArray("Music/Dance/LineDance/", $sentToJsArray, 1, 1);
    addSongsToArray("Music/Dance/PopDance/", $sentToJsArray, 1, 2);
    addSongsToArray("Music/Dance/Battle/", $sentToJsArray, 1, 3);

    addSongsToArray("Music/Afterparty/", $sentToJsArray, 2);
    addSongsToArray("Music/Sex/Foreplay/", $sentToJsArray, 3, 0);
    addSongsToArray("Music/Sex/sex/", $sentToJsArray, 3, 1);
    addSongsToArray("Music/Sex/Cuddle/", $sentToJsArray, 3, 2);
    addSongsToArray("Music/Love/Memories/", $sentToJsArray, 4, 0);
    addSongsToArray("Music/Love/love/", $sentToJsArray, 4, 1);
    addSongsToArray("Music/Love/Intimacy/", $sentToJsArray, 4, 2);
    addSongsToArray("Music/Family/Lifestyle/", $sentToJsArray, 5, 0);
    addSongsToArray("Music/Family/Values/", $sentToJsArray, 5, 1);
    addSongsToArray("Music/Family/Kids/", $sentToJsArray, 5, 2);
    addSongsToArray("Music/Inspiration/Motivation/", $sentToJsArray, 6, 0);
    addSongsToArray("Music/Inspiration/Meditation/", $sentToJsArray, 6, 1);
    addSongsToArray("Music/Inspiration/Something/", $sentToJsArray, 6, 2);
    addSongsToArray("Music/History/DH/", $sentToJsArray, 7, 0);
    addSongsToArray("Music/History/BAH/", $sentToJsArray, 7, 1);
    addSongsToArray("Music/History/HFnineteen/", $sentToJsArray, 7, 2);
    addSongsToArray("Music/Politics/Neutral/", $sentToJsArray, 8, 0);
    addSongsToArray("Music/Politics/Democracy/", $sentToJsArray, 8, 1);
    addSongsToArray("Music/Politics/Republican/", $sentToJsArray, 8, 2);
    addSongsToArray("Music/Politics/Socialism/", $sentToJsArray, 8, 3);
    addSongsToArray("Music/Politics/Bureaucracy/", $sentToJsArray, 8, 4);
    addSongsToArray("Music/Politics/Aristocratic/", $sentToJsArray, 8, 5);
    addSongsToArray("Music/Gaming/Fighters/", $sentToJsArray, 9, 0);
    addSongsToArray("Music/Gaming/Shooters/", $sentToJsArray, 9, 1);
    addSongsToArray("Music/Gaming/Instrumentals/", $sentToJsArray, 9, 2);
    addSongsToArray("Music/Comedy/", $sentToJsArray, 10);
    addSongsToArray("Music/Literature/Poems/", $sentToJsArray, 12, 0);
    addSongsToArray("Music/Literature/SS/", $sentToJsArray, 12, 1);
    addSongsToArray("Music/Literature/Instrumentals/", $sentToJsArray, 12, 2);
    addSongsToArray("Music/Literature/Books/", $sentToJsArray, 12, 3);
    addSongsToArray("Music/Sports/Reviews/", $sentToJsArray, 13, 0);
    addSongsToArray("Music/Sports/Fans/", $sentToJsArray, 13, 1);
    addSongsToArray("Music/Sports/Updates/", $sentToJsArray, 13, 2);
    addSongsToArray("Music/Sports/Disses/", $sentToJsArray, 13, 3);
    addSongsToArray("Music/Tech/News/", $sentToJsArray, 14, 0);
    addSongsToArray("Music/Tech/Music/", $sentToJsArray, 14, 1);
    addSongsToArray("Music/Tech/History/", $sentToJsArray, 14, 2);
    addSongsToArray("Music/Tech/Instrumentals/", $sentToJsArray, 14, 3);
    addSongsToArray("Music/Science/Biology/", $sentToJsArray, 15, 0);
    addSongsToArray("Music/Science/Chemistry/", $sentToJsArray, 15, 1);
    addSongsToArray("Music/Science/Physics/", $sentToJsArray, 15, 2);
    addSongsToArray("Music/Science/Environmental/", $sentToJsArray, 15, 3);
    addSongsToArray("Music/RealEstate/EP/", $sentToJsArray, 16, 0);
    addSongsToArray("Music/RealEstate/Seller/", $sentToJsArray, 16, 1);
    addSongsToArray("Music/RealEstate/Mortgage/", $sentToJsArray, 16, 2);
    addSongsToArray("Music/RealEstate/Buyer/", $sentToJsArray, 16, 3);
    addSongsToArray("Music/DJshuba/", $sentToJsArray, 17);
    addSongsToArray("Music/Film/NM/", $sentToJsArray, 18, 0);
    addSongsToArray("Music/Film/SHM/", $sentToJsArray, 18, 1);
    addSongsToArray("Music/Film/MH/", $sentToJsArray, 18, 2);
    addSongsToArray("Music/Film/VM/", $sentToJsArray, 18, 3);
    addSongsToArray("Music/Film/LS/", $sentToJsArray, 18, 4);
    addSongsToArray("Music/Film/CB/", $sentToJsArray, 18, 5);
    addSongsToArray("Music/Fashion/PD/", $sentToJsArray, 19, 0);
    addSongsToArray("Music/Fashion/LD/", $sentToJsArray, 19, 1);
    addSongsToArray("Music/Fashion/FH/", $sentToJsArray, 19, 2);
    addSongsToArray("Music/Fashion/SM/", $sentToJsArray, 19, 3);
    addSongsToArray("Music/Business/FE/", $sentToJsArray, 20, 0);
    addSongsToArray("Music/Business/TOB/", $sentToJsArray, 20, 1);
    addSongsToArray("Music/Business/Insurance/", $sentToJsArray, 20, 2);
    addSongsToArray("Music/Business/TE/", $sentToJsArray, 20, 3);
    addSongsToArray("Music/Hustlin/", $sentToJsArray, 21);
    addSongsToArray("Music/Pregame/", $sentToJsArray, 22);
    addSongsToArray("Music/Outside/", $sentToJsArray, 23);

    echo json_encode($sentToJsArray, JSON_INVALID_UTF8_IGNORE);
} else {
    echo json_encode(["error" => "Invalid Request Type"]);
}