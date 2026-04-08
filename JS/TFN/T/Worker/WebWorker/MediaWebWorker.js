import { Flo } from "./../../Class/Elder/Adult/Teen/OffscreenCanvas.js";

import { NoSubFolder, ThreeFolderSub, FourFolderSub, SixFolderSub, fetchRadioSongs, fetchRadioArrayBuffer } from "./../../Functions/Audio/Radio.js"; // or bundle it

export class mediaWorker extends Flo {
    //time below
    hour;
    minute;
    now;
    //image below
    backgroundImg
    //audio below
    TheLastSongUsed;
    CurrentSong;
    visualizatorController;
    //vid below
    backgroundVideo;
    //canvas below
    Tfhex;
    rgb;
    chromaKeyColorWebcam = { r: 0, g: 255, b: 0 };
    frameSkipCount = 2;
    frameCounter = 0;
    constructor(options = {}) {
        super(options);
    }
    UseImage(canvas, corner = false) {
        this.initOffscreen();
        this.resizeoffscreen(canvas.width, canvas.height);
        if (corner) {
            const logoW = canvas.width / 4;
            const logoH = canvas.height / 4;
            this.offscreenctx.drawImage(this.backgroundImg, canvas.width - logoW - 10, 10, logoW, logoH);
        } else {
            this.offscreenctx.drawImage(this.backgroundImg, 0, 0, canvas.width, canvas.height);
        }
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
    UseVideo(w, h) {
        this.initOffscreen();
        if (this.backgroundVideo) this.offscreenctx.drawImage(this.backgroundVideo, 0, 0, w, h);
    }
    webcam(frameData) {
        this.frameCounter++;
        if (this.frameCounter % this.frameSkipCount !== 0) {
            return frameData;
        }

        const chromaData = frameData.data;
        const key = this.chromaKeyColorWebcam;

        for (let i = 0; i < chromaData.length; i += 4) {
            const r = chromaData[i];
            const g = chromaData[i + 1];
            const b = chromaData[i + 2];

            const diff =
                Math.abs(r - key.r) +
                Math.abs(g - key.g) +
                Math.abs(b - key.b);

            if (diff < 120) {
                chromaData[i + 3] = 0; // true transparency
            }
        }

        return frameData;
    }
    async drawingFrame(vidCanv, TfWebcam) {
        this.initOffscreen();
        resizeoffscreen(vidCanv.width, vidCanv.height)

        this.offscreenctx.clearRect(0, 0, w, h);

        // Draw background
        if (this.backgroundVideo) {
            this.UseVideo(w, h);
            if (this.backgroundImg) this.UseImage(ctx, w, h, true); // corner logo
        } else if (this.backgroundImg) {
            this.UseImage(ctx, w, h);
        }

        // Draw to offscreen for chroma key
        this.offscreenctx.drawImage(TfWebcam, 0, 0, vidCanv.width, vidCanv.height);

        if (this.useChromaKey) {
            const frame = this.offscreenctx.getImageData(0, 0, vidCanv.width, vidCanv.height);
            const processed = this.webcam(frame);
            this.offscreenctx.putImageData(processed, 0, 0);
        }

        // Composite webcam over background
        return getoffscreenContext();
    }

    setChromaHex(hex) {
        this.rgb = parseInt(hex.slice(1), 16);
        this.chromaKeyColorWebcam.r = (this.rgb >> 16) & 255;
        this.chromaKeyColorWebcam.g = (this.rgb >> 8) & 255;
        this.chromaKeyColorWebcam.b = this.rgb & 255;
    }

    ColorPickerChromaKey(chroma) {
        this.Tfhex = chroma.value;
        this.setChromaHex(this.Tfhex);
        this.useChromaKey = true;
    }

    disableChromaKey() {
        this.frameCounter = 0;
        this.useChromaKey = false;
    }
    /////////////////////////////////////////////
    MessageRecieved(event) {
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
