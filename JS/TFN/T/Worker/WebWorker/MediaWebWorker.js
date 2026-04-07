import { Flo } from "./../../Class/Elder/Adult/Teen/OffscreenCanvas.js";

import { NoSubFolder, ThreeFolderSub, FourFolderSub, SixFolderSub, fetchRadioSongs, fetchRadioArrayBuffer } from "./../../Functions/Audio/Radio.js"; // or bundle it

export class mediaWorker extends Flo {
    hour;
    minute;
    now;
    TheLastSongUsed;
    CurrentSong;
    visualizatorController;
    constructor(options = {}) {
        super(options);
    }
    RadioTime(PSL, response = null) {
        this.now = new Date();
        this.hour = this.now.getHours();
        this.minute = this.now.getMinutes();

        switch (this.hour) {
            case 0:
                FourFolderSub(PSL, 0, this.minute, response);
                break;
            case 1:
                if (this.minute <= 4) {
                    NoSubFolder(PSL, 1, response);
                } else if (this.minute <= 14) {
                    ThreeFolderSub(PSL, 1, this.minute, response);
                } else if (this.minute <= 29) {
                    ThreeFolderSub(PSL, 1, this.minute, response);
                } else {
                    ThreeFolderSub(PSL, 1, this.minute, response);
                }
                break;
            case 2:
                NoSubFolder(PSL, 2, response);
                break;
            case 3:
                ThreeFolderSub(PSL, 3, this.minute, response);
                break;
            case 4:
                ThreeFolderSub(PSL, 4, this.minute, response);
                break;
            case 5:
                ThreeFolderSub(PSL, 5, this.minute, response);
                break;
            case 6:
                ThreeFolderSub(PSL, 6, this.minute, response);
                break;
            case 7:
                ThreeFolderSub(PSL, 7, this.minute, response);
                break;
            case 8:
                SixFolderSub(PSL, 8, this.minute, response);
                break;
            case 9:
                ThreeFolderSub(PSL, 9, this.minute, response);
                break;
            case 10:
                NoSubFolder(PSL, 10, response);
                break;
            case 11:
                postMessage(PSL[11][Math.floor(Math.random() * (PSL[11].length - 1))]);
                break;
            case 12:
                FourFolderSub(PSL, 12, this.minute, response);
                break;
            case 13:
                FourFolderSub(PSL, 13, this.minute, response);
                break;
            case 14:
                FourFolderSub(PSL, 14, this.minute, response);
                break;
            case 15:
                FourFolderSub(PSL, 15, this.minute, response);
                break;
            case 16:
                FourFolderSub(PSL, 16, this.minute, response);
                break;
            case 17:
                NoSubFolder(PSL, 17, response);
                break;
            case 18:
                SixFolderSub(PSL, 18, this.minute, response);
                break;
            case 19:
                FourFolderSub(PSL, 19, this.minute, response);
                break;
            case 20:
                FourFolderSub(PSL, 20, this.minute, response);
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
    //////////////////End of Video ////////////////////////////

    async MessageRecieved(event) {
        if (event.data.type === "radio") {
            if (event.data.system === "file") {
                fetchRadioSongs();
                this.TheLastSongUsed = this.CurrentSong;
            } else if (event.data.system === "start") {
                fetchRadioArrayBuffer();
                this.TheLastSongUsed = this.CurrentSong;
            } else if (event.data.system === "skip") {
                this.TheLastSongUsed = this.CurrentSong;
                fetchRadioSongs();
            } else if (event.data.system === "previous") {
                if (this.TheLastSongUsed === null) {
                    this.TheLastSongUsed = this.CurrentSong;
                    postMessage({ type: "radio", system: "Previous", file: this.CurrentSong })
                } else if (this.TheLastSongUsed !== this.CurrentSong) {
                    postMessage({ type: "radio", system: "Previous", file: this.TheLastSongUsed });
                } else {
                    postMessage({ type: "radio", system: "Previous", file: this.CurrentSong });
                }
            } else if (event.data.system === "ended") {
                this.TheLastSongUsed = this.CurrentSong;
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
    }
}