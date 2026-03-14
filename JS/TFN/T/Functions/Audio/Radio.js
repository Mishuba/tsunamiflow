let radioRandom;
let rangeIndex;

let phpRadio = new XMLHttpRequest();

export async function NoSubFolder(PSL, tsu, response = null) {
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

export async function ThreeFolderSub(PSL, tsu, nami, response = null) {
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

export async function FourFolderSub(PSL, tsu, nami, response = null) {
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

export async function SixFolderSub(PSL, tsu, nami, response = null) {
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

export function fetchRadioSongs() {
    let nextRadioItem;
    phpRadio.open("GET", "https://world.tsunamiflow.club/RadioPlaylist.php", true);
    phpRadio.setRequestHeader("X-Request-Type", "fetchRadioSongs");

    phpRadio.onreadystatechange = function () {
        if (phpRadio.readyState !== 4) return;

        const text = phpRadio.responseText?.trim();

        if (phpRadio.status !== 200 || !text || text.startsWith("<")) {
            postMessage({
                type: "radio",
                file: undefined,
                system: "file",
                message: "could not obtain the music list",
                buffer: "nothing"
            });
            return;
        }

        try {
            const songList = JSON.parse(text);
            console.log("Parsed Songs:", songList);
            RadioTime(songList);
            nextRadioItem = songList;
        } catch (e) {
            console.error("JSON parse error:", e);
        }
    };

    phpRadio.onerror = function () {
        console.error("Network Error");
    };

    phpRadio.send();
}

export async function fetchRadioArrayBuffer(file) {
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