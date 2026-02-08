let phpRadio = new XMLHttpRequest();

let phpSongList;

let hour;
let minute;
let now;

let nextRadioItem;

let radioRandom;
let rangeIndex;

let TheLastSongUsed;
let CurrentSong;

async function NoSubFolder(PSL, tsu, response = null) {
    if (typeof PSL !== "undefined" && Array.isArray(PSL[tsu]) && PSL[tsu].length > 0) {
        if (PSL[tsu].length >= 20) {
            radioRandom = Math.floor(Math.random() * (PSL[tsu].length - 1));
            CurrentSong = PSL[tsu][radioRandom];
            console.log(CurrentSong);
            postMessage({ type: "radio", file: CurrentSong, system: "file", message: "Obtained the audio file", buffer: "nothing" });

        } else {
            radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
            CurrentSong = PSL[11][radioRandom];
            console.log(CurrentSong);
            postMessage({ type: "radio", file: CurrentSong, system: "file", message: "Obtained the audio file", buffer: "nothing" });
        }
    } else {
        postMessage({ type: "radio", file: undefined, system: "file", message: "Obtained the audio file", buffer: "nothing" });
    }
}
async function ThreeFolderSub(PSL, tsu, nami, response = null) {
    if (nami <= 19) {
        rangeIndex = 0;
    } else if (nami >= 20 && nami <= 39) {
        rangeIndex = 1;
    } else {
        rangeIndex = 2;
    }

    console.log(`Accessing PSL[${tsu}] with rangeIndex: ${rangeIndex}`);

    if (Array.isArray(PSL) && Array.isArray(PSL[tsu])) {
        if (PSL[tsu][rangeIndex] && PSL[tsu][rangeIndex].length > 7) {
            radioRandom = Math.floor(Math.random() * (PSL[tsu][rangeIndex].length - 1));
            CurrentSong = PSL[tsu][rangeIndex][radioRandom];
            console.log(CurrentSong);
            postMessage({ type: "radio", file: CurrentSong, system: "file", message: "Obtained the audio file", buffer: "nothing" });
        } else {
            console.log(`No valid data in PSL[${tsu}][${rangeIndex}], falling back to PSL[11]`);
            radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
            CurrentSong = PSL[11][radioRandom];
            console.log(CurrentSong);
            postMessage({ type: "radio", file: CurrentSong, system: "file", message: "Obtained the audio file", buffer: "nothing" });
        }
    } else {
        postMessage({ type: "radio", file: undefined, system: "file", message: "Obtained the audio file", buffer: "nothing" });
    }
}
async function FourFolderSub(PSL, tsu, nami, response = null) {
    if (nami <= 14) {
        rangeIndex = 0;
    } else if (nami >= 15 && nami <= 29) {
        rangeIndex = 1;
    } else if (nami >= 30 && nami <= 44) {
        rangeIndex = 2;
    } else {
        rangeIndex = 3;
    }

    console.log(`Accessing PSL[${tsu}] with rangeIndex: ${rangeIndex}`);

    if (Array.isArray(PSL) && Array.isArray(PSL[tsu])) {
        if (PSL[tsu][rangeIndex] && PSL[tsu][rangeIndex].length > 4) {
            radioRandom = Math.floor(Math.random() * (PSL[tsu][rangeIndex].length - 1));
            CurrentSong = PSL[tsu][rangeIndex][radioRandom];
            console.log(CurrentSong);
            postMessage({ type: "radio", file: CurrentSong, system: "file", message: "Obtained the audio file", buffer: "nothing" });
        } else {
            console.log(`No valid data in PSL[${tsu}][${rangeIndex}], falling back to PSL[11]`);
            radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
            CurrentSong = PSL[11][radioRandom];
            console.log(CurrentSong);
            postMessage({ type: "radio", file: CurrentSong, system: "file", message: "Obtained the audio file", buffer: "nothing" });
        }
    } else {
        postMessage({ type: "radio", file: undefined, system: "file", message: "Obtained the audio file", buffer: "nothing" });
    }
}
async function SixFolderSub(PSL, tsu, nami, response = null) {
    rangeIndex = Math.floor(nami / 10);

    console.log(`Accessing PSL[${tsu}] with rangeIndex: ${rangeIndex}`);

    if (Array.isArray(PSL) && Array.isArray(PSL[tsu])) {
        if (PSL[tsu][rangeIndex] && PSL[tsu][rangeIndex].length > 3) {
            radioRandom = Math.floor(Math.random() * (PSL[tsu][rangeIndex].length - 1));
            CurrentSong = PSL[tsu][rangeIndex][radioRandom];
            console.log(CurrentSong);
            postMessage({ type: "radio", file: CurrentSong, system: "file", message: "Obtained the audio file", buffer: "nothing" });
        } else {
            console.log(`No valid data in PSL[${tsu}][${rangeIndex}], falling back to PSL[11]`);
            radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
            CurrentSong = PSL[11][radioRandom];
            console.log(CurrentSong);
            postMessage({ type: "radio", file: CurrentSong, system: "file", message: "Obtained the audio file", buffer: "nothing" });
        }
    } else {
        postMessage({ type: "radio", file: undefined, system: "file", message: "Obtained the audio file", buffer: "nothing" });
    }
}


async function RadioTime(PSL, response = null) {
    now = new Date();
    hour = now.getHours();
    minute = now.getMinutes();

    switch (hour) {
        case 0:
            FourFolderSub(PSL, 0, minute, response);
            break;
        case 1:
            if (minute <= 4) {
                NoSubFolder(PSL, 1, response);
            } else if (minute <= 14) {
                ThreeFolderSub(PSL, 1, minute, response);
            } else if (minute <= 29) {
                ThreeFolderSub(PSL, 1, minute, response);
            } else {
                ThreeFolderSub(PSL, 1, minute, response);
            }
            break;
        case 2:
            NoSubFolder(PSL, 2, response);
            break;
        case 3:
            ThreeFolderSub(PSL, 3, minute, response);
            break;
        case 4:
            ThreeFolderSub(PSL, 4, minute, response);
            break;
        case 5:
            ThreeFolderSub(PSL, 5, minute, response);
            break;
        case 6:
            ThreeFolderSub(PSL, 6, minute, response);
            break;
        case 7:
            ThreeFolderSub(PSL, 7, minute, response);
            break;
        case 8:
            SixFolderSub(PSL, 8, minute, response);
            break;
        case 9:
            ThreeFolderSub(PSL, 9, minute, response);
            break;
        case 10:
            NoSubFolder(PSL, 10, response);
            break;
        case 11:
            postMessage(PSL[11][Math.floor(Math.random() * (PSL[11].length - 1))]);
            break;
        case 12:
            FourFolderSub(PSL, 12, minute, response);
            break;
        case 13:
            FourFolderSub(PSL, 13, minute, response);
            break;
        case 14:
            FourFolderSub(PSL, 14, minute, response);
            break;
        case 15:
            FourFolderSub(PSL, 15, minute, response);
            break;
        case 16:
            FourFolderSub(PSL, 16, minute, response);
            break;
        case 17:
            NoSubFolder(PSL, 17, response);
            break;
        case 18:
            SixFolderSub(PSL, 18, minute, response);
            break;
        case 19:
            FourFolderSub(PSL, 19, minute, response);
            break;
        case 20:
            FourFolderSub(PSL, 20, minute, response);
            break;
        case 21:
            NoSubFolder(PSL, 21, response);
            break;
        case 22:
            NoSubFolder(PSL, 22, response);
            break;
        case 23:
            NoSubFolder(PSL, 23, response);
            break;
        default:
            postMessage(PSL[11][Math.floor(Math.random() * (PSL[11].length - 1))]);
            break;
    }
}

async function fetchRadioSongs() {
    try {
        phpRadio.open("GET", "https://world.tsunamiflow.club/RadioPlaylist.php", true);
        phpRadio.setRequestHeader("X-Request-Type", "fetchRadioSongs");
        phpRadio.onreadystatechange = async function () {
            if (phpRadio.readyState === 4) {
                if (phpRadio.status === 200) {
if (phpRadio.responseText.startsWith('<')) {
postMessage({ type: "radio", file: undefined, system: "file", message: "could not obtain the music list", buffer: "nothing" });;
} else {
                    phpSongList = JSON.parse(phpRadio.responseText);
                    console.log("Parsed Songs:", phpSongList);

                    //RadioResponseOk = phpRadio.response;
                    RadioTime(phpSongList);
                    nextRadioItem = phpSongList;
}
                } else {
                    console.log(phpRadio.response + phpRadio.responseText); //const xmlDoc = phpRadio.responseXML;
                    // For Blobs
                    // phpRadio.responseType = "blob";
                    // function () { const blob = phpRadio.response; const blobURL = URL.createObjectURL(blob); document.getElementById("the Element").src = bloblURL; }
                    console.error("It did not do JSON.parse");
                            postMessage({ type: "radio", file: undefined, system: "file", message: "could not obtain the music list", buffer: "nothing" });;
                }
            }
        };
        phpRadio.onerror = async function () {
            console.error("Network Error: Unable to reach the server.");
        };
        phpRadio.send();
    } catch (error) {
        console.error("Error fetching or parsing songs:", error);
    } finally {
    }
};

async function fetchRadioArrayBuffer(file) {
    try {
        phpRadio.open("Get", file, true);
        phpRadio.responseType = "arraybuffer";
        phpRadio.onreadystatechange = async () => {
            if (phpRadio.status >= 200 && phpRadio.status < 300) {
                postMessage({
                    type: "radio",
                    system: "arraybuffer",
                    file: file,
                    message: "put this into audio context",
                    buffer: phpRadio.response,
                    error: "none"
                }, [phpRadio.response]);
            } else {
                postMessage({
                    type: "",
                    system: "",
                    file: "",
                    message: "",
                    buffer: "none",
                    error: "none"
                })
            }
        };
        phpRadio.onerror = async () => {
            postMessage({
                type: "error",
                system: "error",
                file: "idk yet",
                message: "error",
                buffer: "none",
                error: error
            });
        };
        phpRadio.send();
    } catch (e) {
        console.error(e);
    } finally {

    }
}

onmessage = async (event) => {
    //Fetch Streaming URL
    if (event.data.type === "radio") {
        if (event.data.system === "file") {
            fetchRadioSongs();
            TheLastSongUsed = CurrentSong;
        } else if (event.data.system === "start") {
            fetchRadioArrayBuffer();
            TheLastSongUsed = CurrentSong;
        } else if (event.data.system === "skip") {
            TheLastSongUsed = CurrentSong;
            fetchRadioSongs();
        } else if (event.data.system === "previous") {
            if (TheLastSongUsed === null) {
                TheLastSongUsed = CurrentSong;
                postMessage({ type: "radio", system: "Previous", file: CurrentSong })
            } else if (TheLastSongUsed !== CurrentSong) {
                postMessage({ type: "radio", system: "Previous", file: TheLastSongUsed });
            } else {
                postMessage({ type: "radio", system: "Previous", file: CurrentSong });
            }
        } else if (event.data.system === "ended") {
            TheLastSongUsed = CurrentSong;
            fetchRadioSongs();
        } else if (event.data.system === "pcm") {

        }
    } else if (event.data.type === "stream") {
        //Streaming Chuncks
        if (event.data.system === "audio array") {


            console.log("Processing audio array:", event.data.audioArray);

        } else {

        }
    } else if (event.data.type === "downloads") {
        // Handle Downloads  
        if (event.data.system === "") {

        } else {

        }
    } else if (event.data.type === "calculations") {
        //Audio Processing
        if (event.data.system === "fft") {

        } else if (event.data.system === "Peak Detection") {

        } else if (event.data.system === "signaling") {

        } else if (event.data.system === "RMS") {

        } else {

        }
    } else if (event.data.type === "visualizator") {
        //
        if (event.data.system === "") {

        } else {

        }
    } else if (event.data.type === "processor") {
        //
        if (event.data.system === "stereo") {
            // Stereo 

            //Mono
        } else if (event.data.system === "amplitude") {

        } else if (event.data.system === "volume peak Detection") {

        } else if (event.data.system === "filtering") {

        } else if (event.data.system === "Zero Crossing") {

        } else if (event.data.system === "Pitch Detection") {

        } else if (event.data.system === "decode") {

        } else {

        }
    } else if (event.data.type === "game") {
        //
        if (event.data.system === "") {

        } else {

        }
    }
    //NO Sound output
    //Not node connections
    //No Dom or Web aduio API
}