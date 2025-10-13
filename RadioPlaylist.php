<?php
ini_set("display_errors", 1);
ini_set("display_startup_errors", 1);
error_reporting(E_ALL);

require "stripestuff/vendor/autoload.php";

use Aws\S3\S3Client;
use Aws\Exception\AwsException;

header("Content-Type: application/json");

if (isset($_SERVER["HTTP_X_REQUEST_TYPE"])) {
    if ($_SERVER["HTTP_X_REQUEST_TYPE"] === "fetchRadioSongs") {

// Define the array with corrected syntax
$sentToJsArray = array(
    array(array(), array(), array(), array()), // Rizz
    array(array(), array(), array(), array()), // Dancing
    array(), // After Club
    array(array(), array(), array()), // Sex Foreplay Sex Cuddles
    array(array(), array(), array()), // Love
    array(array(), array(), array()), // Family
    array(array(), array(), array()), // Inspiration
    array(array(), array(), array()), // History\
    array(array(), array(), array(), array(), array(), array()), // Politics
    array(array(), array(), array()), // Gaming
    array(), // Comedy
    array(), // All Music
    array(array(), array(), array(), array()), // Literature
    array(array(), array(), array(), array()), // Sports
    array(array(), array(), array(), array()), // Tech
    array(array(), array(), array(), array()), // Science
    array(array(), array(), array(), array()), // Real Estate
    array(), // DJshuba
    array(array(), array(), array(), array(), array(), array()), // Film
    array(array(), array(), array(), array()), // Fashion
    array(array(), array(), array(), array()), // Business
    array(), // Hustlin
    array(), // Pregame
    array()  // Outside
);

function addSongsToArray($path, &$array, $index, $index2 = null){
    //$songs = glob($path . '*.mp3');
    $matches = file_get_contents("https://www.tsunamiflow.club/Music/");

    if ($matches === false || empty($songs[1])) {
        error_log("Failed to fetch music listing from Cloudflare R2 HTML endpoint");
        return;
    } else {
        preg_match_all('/href="([^"]+\.mp3)"/', $matches, $songs);
        foreach ($songs[1] as $song) {
            if ($index2 === null) {
                array_push($array[$index], $song);
            } else if ($index2 !== null) {
                array_push($array[$index][$index2], $song);
            } else {
                array_push($array[11], $song);
            }
        }
    }

    error_log("Added songs to index $index" . ($index2 !== null ? " at sub-index $index2" : ""));
}

// 12 a.m Rizz IceBreakers Flirting GetHerDone Shot
addSongsToArray("Music/Rizz/IceBreakers/", $sentToJsArray, 0, 0);
addSongsToArray("Music/Rizz/Flirting/", $sentToJsArray, 0, 1);
addSongsToArray("Music/Rizz/GetHerDone/", $sentToJsArray, 0, 2);
addSongsToArray("Music/Rizz/Shots/", $sentToJsArray, 0, 3);

// 1 a.m.
addSongsToArray("Music/Dance/Twerking/", $sentToJsArray, 1, 0);
addSongsToArray("Music/Dance/LineDance/", $sentToJsArray, 1, 1);
addSongsToArray("Music/Dance/PopDance/", $sentToJsArray, 1, 2);
addSongsToArray("Music/Dance/Battle/", $sentToJsArray, 1, 3);

// 2 a.m
addSongsToArray("Music/Afterparty/", $sentToJsArray, 2);

// 3 a.m Sex
addSongsToArray("Music/Sex/Foreplay/", $sentToJsArray, 3, 0);
addSongsToArray("Music/Sex/sex/", $sentToJsArray, 3, 1);
addSongsToArray("Music/Sex/Cuddle/", $sentToJsArray, 3, 2);

// 4 a.m Love 
addSongsToArray("Music/Love/Memories/", $sentToJsArray, 4, 0);
addSongsToArray("Music/Love/love/", $sentToJsArray, 4, 1);
addSongsToArray("Music/Love/Intimacy/", $sentToJsArray, 4, 2);

// 5 a.m Family
addSongsToArray("Music/Family/Lifestyle/", $sentToJsArray, 5, 0);
addSongsToArray("Music/Family/Values/", $sentToJsArray, 5, 1);
addSongsToArray("Music/Family/Kids/", $sentToJsArray, 5, 2);

// 6 a.m Inspiration
addSongsToArray("Music/Inspiration/Motivation/", $sentToJsArray, 6, 0);
addSongsToArray("Music/Inspiration/Meditation/", $sentToJsArray, 6, 1);
addSongsToArray("Music/Inspiration/Something/", $sentToJsArray, 6, 2);

// 7 a.m History 
addSongsToArray("Music/History/DH/", $sentToJsArray, 7, 0);
addSongsToArray("Music/History/BAH/", $sentToJsArray, 7, 1);
addSongsToArray("Music/History/HFnineteen/", $sentToJsArray, 7, 2);

// 8 a.m Politics 
addSongsToArray("Music/Politics/Neutral/", $sentToJsArray, 8, 0);
addSongsToArray("Music/Politics/Democracy/", $sentToJsArray, 8, 1);
addSongsToArray("Music/Politics/Republican/", $sentToJsArray, 8, 2);
addSongsToArray("Music/Politics/Socialism/", $sentToJsArray, 8, 3);
addSongsToArray("Music/Politics/Bureaucracy/", $sentToJsArray, 8, 4);
addSongsToArray("Music/Politics/Aristocratic/", $sentToJsArray, 8, 5);
 
// 9 a.m. Gaming 
addSongsToArray("Music/Gaming/Fighters/", $sentToJsArray, 9, 0);
addSongsToArray("Music/Gaming/Shooters/", $sentToJsArray, 9, 1);
addSongsToArray("Music/Gaming/Instrumentals/", $sentToJsArray, 9, 2);

// 10 a.m. Comedy
addSongsToArray("Music/Comedy/", $sentToJsArray, 10);

// 12 a.m Literature
addSongsToArray("Music/Literature/Poems/", $sentToJsArray, 12, 0);
addSongsToArray("Music/Literature/SS/", $sentToJsArray, 12, 1);
addSongsToArray("Music/Literature/Instrumentals/", $sentToJsArray, 12, 2);
addSongsToArray("Music/Literature/Books/", $sentToJsArray, 12, 3);

// 1 p.m Sports 
addSongsToArray("Music/Sports/Reviews/", $sentToJsArray, 13, 0);
addSongsToArray("Music/Sports/Fans/", $sentToJsArray, 13, 1);
addSongsToArray("Music/Sports/Updates/", $sentToJsArray, 13, 2);
addSongsToArray("Music/Sports/Disses/", $sentToJsArray, 13, 3);

// 2 p.m Tech
addSongsToArray("Music/Tech/News/", $sentToJsArray, 14, 0);
addSongsToArray("Music/Tech/Music/", $sentToJsArray, 14, 1);
addSongsToArray("Music/Tech/History/", $sentToJsArray, 14, 2);
addSongsToArray("Music/Tech/Instrumentals/", $sentToJsArray, 14, 3);

// 3 p.m Science 
addSongsToArray("Music/Science/Biology/", $sentToJsArray, 15, 0);
addSongsToArray("Music/Science/Chemistry/", $sentToJsArray, 15, 1);
addSongsToArray("Music/Science/Physics/", $sentToJsArray, 15, 2);
addSongsToArray("Music/Science/Environmental/", $sentToJsArray, 15, 3);

// 4 p.m Real Estate EP, Seller, Mortgage, Buyer
addSongsToArray("Music/RealEstate/EP/", $sentToJsArray, 16, 0);
addSongsToArray("Music/RealEstate/Seller/", $sentToJsArray, 16, 1);
addSongsToArray("Music/RealEstate/Mortgage/", $sentToJsArray, 16, 2);
addSongsToArray("Music/RealEstate/Buyer/", $sentToJsArray, 16, 3);

// 5 p.m DJ Shuba (Basically New Music)
addSongsToArray("Music/DJshuba/", $sentToJsArray, 17);

// 6 p.m Film
addSongsToArray("Music/Film/NM/", $sentToJsArray, 18, 0);
addSongsToArray("Music/Film/SHM/", $sentToJsArray, 18, 1);
addSongsToArray("Music/Film/MH/", $sentToJsArray, 18, 2);
addSongsToArray("Music/Film/VM/", $sentToJsArray, 18, 3);
addSongsToArray("Music/Film/LS/", $sentToJsArray, 18, 4);
addSongsToArray("Music/Film/CB/", $sentToJsArray, 18, 5);

// 7 p.m Fashion PD, LD, FH, SM 
addSongsToArray("Music/Fashion/PD/", $sentToJsArray, 19, 0);
addSongsToArray("Music/Fashion/LD/", $sentToJsArray, 19, 1);
addSongsToArray("Music/Fashion/FH/", $sentToJsArray, 19, 2);
addSongsToArray("Music/Fashion/SM/", $sentToJsArray, 19, 3);

// 8 p.m Business 
addSongsToArray("Music/Business/FE/", $sentToJsArray, 20, 0);
addSongsToArray("Music/Business/TOB/", $sentToJsArray, 20, 1);
addSongsToArray("Music/Business/Insurance/", $sentToJsArray, 20, 2);
addSongsToArray("Music/Business/TE/", $sentToJsArray, 20, 3);

// Hustlin
addSongsToArray("Music/Hustlin/", $sentToJsArray, 21);

// Pregame
addSongsToArray("Music/Pregame/", $sentToJsArray, 22);

// Outside
addSongsToArray("Music/Outside/", $sentToJsArray, 23);

// Everything 
//$EverythingRadio = glob("Music/Everything/*.mp3");
try {
    $StorageBucket = new S3Client([
        "region" => "auto",
        "endpoint" => "https://ac47c31c7548ac580a0b4caaed91d41f.r2.cloudflarestorage.com",
        "version" => "latest",
        "credentials" => [
            "key" => "e049b04aab83b8cf7e2d73ea3c660c66",
            "secret" => "fbdd66bb5fb5d0021396dea586a5d358ff0a9be106ad5bc234791690dce66212",
        ]
    ]);

    $Objects = $StorageBucket->listObjects([
        "Bucket" => "tsunami-radio",
        "Prefix" => "Music/"
    ]);

    if (!isset($Objects["Contents"])) {
        throw new Exception("No contents returned from R2 listObjects");
    } else {
        foreach ($Objects["Contents"] as $objects) {
            if (str_ends_with($objects["Key"], ".mp3")) {
                //$EverythingRadio[] = 
                array_push($sentToJsArray[11], "https://www.tsunamiflow.club/" . $objects["Key"]);
            }
        }
    }

    if (empty($sentToJsArray)) {
        echo (json_encode(["error" => "No .mp3 files found in bucket"], JSON_INVALID_UTF8_IGNORE));
    } else {

    }
} catch (AwsException $e) {
            echo json_encode(["error" => "AWS Exception: " . $e->getAwsErrorMessage()], JSON_INVALID_UTF8_IGNORE);
} catch (Exception $e) {
            echo json_encode(["error" => "PHP Exception: " . $e->getMessage()], JSON_INVALID_UTF8_IGNORE);
}



/*
if ($EverythingRadio !== false) {
    foreach ($EverythingRadio as $tfSongs) {
        //$sentToJsArray[11][] = $tfSongs;
        array_push($sentToJsArray[11], $tfSongs);
    }
}
*/
// Encode the array to JSON
$json = json_encode($sentToJsArray, JSON_INVALID_UTF8_IGNORE);

// Output the JSON
echo $json;
} else {
    throw new Exception("Invalid Request Type");
    }
}
?>