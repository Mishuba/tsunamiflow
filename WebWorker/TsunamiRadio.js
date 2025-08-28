let phpRadio = new XMLHttpRequest();

let TheLastSongUsed = null;
let CurrentSong = null;
let nextRadioItem = null;

async function RadioNoSubFolder(PSL, tsu) {
    let radioRandom;
    if (typeof PSL !== "undefined" && Array.isArray(PSL[tsu]) && PSL[tsu].length > 0) {
        if (PSL[tsu].length >= 20) {
            radioRandom = Math.floor(Math.random() * (PSL[tsu].length - 1));
            CurrentSong = PSL[tsu][radioRandom];
            console.log(CurrentSong); 
            postMessage({type: "file", file: CurrentSong});

        } else {
            radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
            CurrentSong = PSL[11][radioRandom];
            console.log(CurrentSong);
            postMessage({type: "file", file: CurrentSong});
        }
    } else {
        radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
        CurrentSong = PSL[11][radioRandom];
        console.log(CurrentSong);
            postMessage({type: "file", file: CurrentSong});
    }
}

async function Radio3Folder(PSL, tsu, nami) {
    let radioRandom;
    let rangeIndex;
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
            postMessage({type: "file", file: CurrentSong});
        } else {
            console.log(`No valid data in PSL[${tsu}][${rangeIndex}], falling back to PSL[11]`);
            radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
            CurrentSong = PSL[11][radioRandom];
            console.log(CurrentSong);
            postMessage({type: "file", file: CurrentSong});
        }
    } else {
        console.log(`PSL[${tsu}] is not valid, falling back to PSL[11]`);
        radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
        CurrentSong = PSL[11][radioRandom];
        console.log(CurrentSong);
            postMessage({type: "file", file: CurrentSong});
    }
}

async function Radio4Folder(PSL, tsu, nami) {
    let radioRandom;
    let rangeIndex;
    if (nami <= 14) {
        rangeIndex = 0;
    } else if (nami >= 15 && nami <= 29) {
        rangeIndex = 1;
    } else if (nami >= 30 && nami <= 44) {
        rangeIndex = 2;
    } else {
        rangeIndex = 3;
    }

    await console.log(`Accessing PSL[${tsu}] with rangeIndex: ${rangeIndex}`);

    if (Array.isArray(PSL) && Array.isArray(PSL[tsu])) {
        if (PSL[tsu][rangeIndex] && PSL[tsu][rangeIndex].length > 4) {
            radioRandom = Math.floor(Math.random() * (PSL[tsu][rangeIndex].length - 1));
            CurrentSong = PSL[tsu][rangeIndex][radioRandom];
            console.log(CurrentSong);
            postMessage({type: "file", file: CurrentSong});
        } else {
            console.log(`No valid data in PSL[${tsu}][${rangeIndex}], falling back to PSL[11]`);
            radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
            CurrentSong = PSL[11][radioRandom];
            console.log(CurrentSong);
            postMessage({type: "file", file: CurrentSong});
        }
    } else {
        console.log(`PSL[${tsu}] is not valid, falling back to PSL[11]`);
        radioRandom = PSL[11][Math.floor(Math.random() * (PSL[11].length - 1))];
        CurrentSong = PSL[11][radioRandom];
        console.log(CurrentSong);
            postMessage({type: "file", file: CurrentSong});
    }
}

async function Radio6Folder(PSL, tsu, nami) {
    let radioRandom;
    let rangeIndex = Math.floor(nami / 10);

    console.log(`Accessing PSL[${tsu}] with rangeIndex: ${rangeIndex}`);

    if (Array.isArray(PSL) && Array.isArray(PSL[tsu])) {
        if (PSL[tsu][rangeIndex] && PSL[tsu][rangeIndex].length > 3) {
            radioRandom = Math.floor(Math.random() * (PSL[tsu][rangeIndex].length - 1));
            CurrentSong = PSL[tsu][rangeIndex][radioRandom];
            console.log(CurrentSong);
            postMessage({type: "file", file: CurrentSong});
        } else {
            console.log(`No valid data in PSL[${tsu}][${rangeIndex}], falling back to PSL[11]`);
            radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
            CurrentSong = PSL[11][radioRandom];
            console.log(CurrentSong);
            postMessage({type: "file", file: CurrentSong});
        }
    } else {
        console.log(`PSL[${tsu}] is not valid, falling back to PSL[11]`);
        radioRandom = PSL[11][Math.floor(Math.random() * (PSL[11].length - 1))];
        CurrentSong = PSL[11][radioRandom];
        console.log(CurrentSong);
            postMessage({type: "file", file: CurrentSong});
    }
}

async function RadioTime(PSL) {
    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();

    switch (hour) {
        case 0:
            await Radio4Folder(PSL, 0, minutes);
            break;
        case 1:
            if (minutes <= 4) {
                await RadioNoSubFolder(PSL, 1);
            } else if (minutes <= 14) {
                await Radio3Folder(PSL, 1, minutes);
            } else if (minutes <= 29) {
                await Radio3Folder(PSL, 1, minutes);
            } else {
                await Radio3Folder(PSL, 1, minutes);
            }
            break;
        case 2:
            await RadioNoSubFolder(PSL, 2);
            break;
        case 3:
            await Radio3Folder(PSL, 3, minutes);
            break;
        case 4:
            await Radio3Folder(PSL, 4, minutes);
            break;
        case 5:
            await Radio3Folder(PSL, 5, minutes);
            break;
        case 6:
            await Radio3Folder(PSL, 6, minutes);
            break;
        case 7:
            await Radio3Folder(PSL, 7, minutes);
            break;
        case 8:
            await Radio6Folder(PSL, 8, minutes);
            break;
        case 9:
            await Radio3Folder(PSL, 9, minutes);
            break;
        case 10:
            await RadioNoSubFolder(PSL, 10);
            break;
        case 11:
            postMessage(PSL[11][Math.floor(Math.random() * (PSL[11].length - 1))]);
            break;
        case 12:
            await Radio4Folder(PSL, 12, minutes);
            break;
        case 13:
            await Radio4Folder(PSL, 13, minutes);
            break;
        case 14:
            await Radio4Folder(PSL, 14, minutes);
            break;
        case 15:
            await Radio4Folder(PSL, 15, minutes);
            break;
        case 16:
            await Radio4Folder(PSL, 16, minutes);
            break;
        case 17:
            await RadioNoSubFolder(PSL, 17);
            break;
        case 18:
            await Radio6Folder(PSL, 18, minutes);
            break;
        case 19:
            await Radio4Folder(PSL, 19, minutes);
            break;
        case 20:
            await Radio4Folder(PSL, 20, minutes);
            break;
        case 21:
            await RadioNoSubFolder(PSL, 21);
            break;
        case 22:
            await RadioNoSubFolder(PSL, 22);
            break;
        case 23:
            await RadioNoSubFolder(PSL, 23);
            break;
        default:
            postMessage(PSL[11][Math.floor(Math.random() * (PSL[11].length - 1))]);
            break;
    }
};

let fetchRadioSongs = async () => {
    try {
        phpRadio.open("GET", "./../RadioPlaylist.php", true);
        phpRadio.setRequestHeader("X-Request-Type", "fetchRadioSongs");
        phpRadio.onreadystatechange = async function () {
            if (phpRadio.readyState === 4) {
                if (phpRadio.status === 200) {
                    let phpSongList = await JSON.parse(phpRadio.responseText);
                    console.log("Parsed Songs:", phpSongList);

                    await RadioTime(phpSongList);
                    nextRadioItem = phpSongList;
                } else {
                    console.log(phpRadio.response + phpRadio.responseText); //const xmlDoc = phpRadio.responseXML;
                    // For Blobs
                    // phpRadio.responseType = "blob";
                    // function () { const blob = phpRadio.response; const blobURL = URL.createObjectURL(blob); document.getElementById("the Element").src = bloblURL; }
                    console.error("It did not do JSON.parse");
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
/*
if ("mediaCapabilities" in navigator) {
    for (const type of radioTypes) {
        console.log(`Is ${type} supported? ${MediaRecorder.isTypeSupported(type) ? "Yes" : "Nope :("}`);
        console.log(`Can you use this audio type for playback: ${TsunamiRadio.canPlayType}`);
        fetchRadioSongs();
    }
} else {
    console.log("Tsunami Radio cannot be played on this device for some reason. Lets fix it together.");
}
    */
onmessage = async (event) => {
    if (event.data.type === "radio") {
        if (event.data.system === "start") {
            fetchRadioSongs();
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
        }
    } if (event.data.type === "visualizator") {

    } if (event.data.type === "processor") {

    }
}