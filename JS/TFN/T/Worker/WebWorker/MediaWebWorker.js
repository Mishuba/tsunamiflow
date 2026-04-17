import { Flo } from "../OffscreenCanvas.js";

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
    songList;
    visualizatorController;
    radioRandom;
    rangeIndex;
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
    fetchRadioSongs() {
        try {
            this.songList = await this.request(
    "GET", "https://world.tsunamiflow.club/RadioPlaylist.php",
    null,
    { "X-Request-Type": "fetchRadioSongs" },
    "fetch"
);
            this.RadioTime(songList);
            this.nextRadioItem = songList;
        } catch (e) {
        this.songList = null;
            console.error("JSON parse error:", e);
            this.RadioTime(songList);
        }
    }
    NoSubFolder(PSL, tsu, response = null) {
        if (typeof PSL !== "undefined" && Array.isArray(PSL[tsu]) && PSL[tsu].length > 0) {
            if (PSL[tsu].length >= 20) {
                this.radioRandom = Math.floor(Math.random() * (PSL[tsu].length - 1));
                this.CurrentSong = PSL[tsu][this.radioRandom];
                console.log(this.CurrentSong);
                postMessage({ type: "radio", file: this.CurrentSong, system: "file", message: "Obtained the audio file", buffer: "nothing" });

            } else {
                this.radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
                this.CurrentSong = PSL[11][this.radioRandom];
                console.log(this.CurrentSong);
                postMessage({ type: "radio", file: this.CurrentSong, system: "file", message: "Obtained the audio file", buffer: "nothing" });
            }
        } else {
            postMessage({ type: "radio", file: undefined, system: "file", message: "Obtained the audio file", buffer: "nothing" });
        }
    }

    ThreeFolderSub(PSL, tsu, nami, response = null) {
        if (nami <= 19) {
            this.rangeIndex = 0;
        } else if (nami >= 20 && nami <= 39) {
            this.rangeIndex = 1;
        } else {
            this.rangeIndex = 2;
        }

        console.log(`Accessing PSL[${tsu}] with this.rangeIndex: ${this.rangeIndex}`);

        if (Array.isArray(PSL) && Array.isArray(PSL[tsu])) {
            if (PSL[tsu][this.rangeIndex] && PSL[tsu][this.rangeIndex].length > 7) {
                this.radioRandom = Math.floor(Math.random() * (PSL[tsu][this.rangeIndex].length - 1));
                this.CurrentSong = PSL[tsu][this.rangeIndex][this.radioRandom];
                console.log(this.CurrentSong);
                postMessage({ type: "radio", file: this.CurrentSong, system: "file", message: "Obtained the audio file", buffer: "nothing" });
            } else {
                console.log(`No valid data in PSL[${tsu}][${this.rangeIndex}], falling back to PSL[11]`);
                this.radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
                this.CurrentSong = PSL[11][this.radioRandom];
                console.log(this.CurrentSong);
                postMessage({ type: "radio", file: this.CurrentSong, system: "file", message: "Obtained the audio file", buffer: "nothing" });
            }
        } else {
            postMessage({ type: "radio", file: undefined, system: "file", message: "Obtained the audio file", buffer: "nothing" });
        }
    }

    FourFolderSub(PSL, tsu, nami, response = null) {
        if (nami <= 14) {
            this.rangeIndex = 0;
        } else if (nami >= 15 && nami <= 29) {
            this.rangeIndex = 1;
        } else if (nami >= 30 && nami <= 44) {
            this.rangeIndex = 2;
        } else {
            this.rangeIndex = 3;
        }

        console.log(`Accessing PSL[${tsu}] with this.rangeIndex: ${this.rangeIndex}`);

        if (Array.isArray(PSL) && Array.isArray(PSL[tsu])) {
            if (PSL[tsu][this.rangeIndex] && PSL[tsu][this.rangeIndex].length > 4) {
                this.radioRandom = Math.floor(Math.random() * (PSL[tsu][this.rangeIndex].length - 1));
                this.CurrentSong = PSL[tsu][this.rangeIndex][this.radioRandom];
                console.log(this.CurrentSong);
                postMessage({ type: "radio", file: this.CurrentSong, system: "file", message: "Obtained the audio file", buffer: "nothing" });
            } else {
                console.log(`No valid data in PSL[${tsu}][${this.rangeIndex}], falling back to PSL[11]`);
                this.radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
                this.CurrentSong = PSL[11][this.radioRandom];
                console.log(this.CurrentSong);
                postMessage({ type: "radio", file: this.CurrentSong, system: "file", message: "Obtained the audio file", buffer: "nothing" });
            }
        } else {
            postMessage({ type: "radio", file: undefined, system: "file", message: "Obtained the audio file", buffer: "nothing" });
        }
    }

    SixFolderSub(PSL, tsu, nami, response = null) {
        this.rangeIndex = Math.floor(nami / 10);

        console.log(`Accessing PSL[${tsu}] with this.rangeIndex: ${this.rangeIndex}`);

        if (Array.isArray(PSL) && Array.isArray(PSL[tsu])) {
            if (PSL[tsu][this.rangeIndex] && PSL[tsu][this.rangeIndex].length > 3) {
                this.radioRandom = Math.floor(Math.random() * (PSL[tsu][this.rangeIndex].length - 1));
                this.CurrentSong = PSL[tsu][this.rangeIndex][this.radioRandom];
                console.log(this.CurrentSong);
                postMessage({ type: "radio", file: this.CurrentSong, system: "file", message: "Obtained the audio file", buffer: "nothing" });
            } else {
                console.log(`No valid data in PSL[${tsu}][${this.rangeIndex}], falling back to PSL[11]`);
                this.radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
                this.CurrentSong = PSL[11][this.radioRandom];
                console.log(this.CurrentSong);
                postMessage({ type: "radio", file: this.CurrentSong, system: "file", message: "Obtained the audio file", buffer: "nothing" });
            }
        } else {
            postMessage({ type: "radio", file: undefined, system: "file", message: "Obtained the audio file", buffer: "nothing" });
        }
    }

    RadioTime(PSL, response = null) {
        this.now = new Date();
        this.hour = this.now.getHours();
        this.minute = this.now.getMinutes();

        switch (this.hour) {
            case 0:
                this.FourFolderSub(PSL, 0, this.minute, response);
                break;
            case 1:
                if (this.minute <= 4) {
                    this.NoSubFolder(PSL, 1, response);
                } else if (this.minute <= 14) {
                    this.ThreeFolderSub(PSL, 1, this.minute, response);
                } else if (this.minute <= 29) {
                    this.ThreeFolderSub(PSL, 1, this.minute, response);
                } else {
                    this.ThreeFolderSub(PSL, 1, this.minute, response);
                }
                break;
            case 2:
                this.NoSubFolder(PSL, 2, response);
                break;
            case 3:
                this.ThreeFolderSub(PSL, 3, this.minute, response);
                break;
            case 4:
                this.ThreeFolderSub(PSL, 4, this.minute, response);
                break;
            case 5:
                this.ThreeFolderSub(PSL, 5, this.minute, response);
                break;
            case 6:
                this.ThreeFolderSub(PSL, 6, this.minute, response);
                break;
            case 7:
                this.ThreeFolderSub(PSL, 7, this.minute, response);
                break;
            case 8:
                this.SixFolderSub(PSL, 8, this.minute, response);
                break;
            case 9:
                this.ThreeFolderSub(PSL, 9, this.minute, response);
                break;
            case 10:
                this.NoSubFolder(PSL, 10, response);
                break;
            case 11:
                postMessage(PSL[11][Math.floor(Math.random() * (PSL[11].length - 1))]);
                break;
            case 12:
                this.FourFolderSub(PSL, 12, this.minute, response);
                break;
            case 13:
                this.FourFolderSub(PSL, 13, this.minute, response);
                break;
            case 14:
                this.FourFolderSub(PSL, 14, this.minute, response);
                break;
            case 15:
                this.FourFolderSub(PSL, 15, this.minute, response);
                break;
            case 16:
                this.FourFolderSub(PSL, 16, this.minute, response);
                break;
            case 17:
                this.NoSubFolder(PSL, 17, response);
                break;
            case 18:
                this.SixFolderSub(PSL, 18, this.minute, response);
                break;
            case 19:
                this.FourFolderSub(PSL, 19, this.minute, response);
                break;
            case 20:
                this.FourFolderSub(PSL, 20, this.minute, response);
                break;
            case 21:
                this.NoSubFolder(PSL, 21, response);
                break;
            case 22:
                this.NoSubFolder(PSL, 22, response);
                break;
            case 23:
                this.NoSubFolder(PSL, 23, response);
                break;
            default:
                postMessage(PSL[11][Math.floor(Math.random() * (PSL[11].length - 1))]);
                break;
        }
    }

    update(p, volume, baseRadius, canvas) {
        p.radius = baseRadius + volume / 80;
        p.x += p.dx;
        p.y += p.dy;

        if (p.x + p.radius > canvas.width || p.x - p.radius < 0) p.dx = -p.dx;
        if (p.y + p.radius > canvas.height || p.y - p.radius < 0) p.dy = -p.dy;
    }

    draw(p) {
        this.offscreenctx.save();
        this.offscreenctx.beginPath();
        this.offscreenctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
        this.offscreenctx.fillStyle = p.color;
        this.offscreenctx.shadowColor = p.color;
        this.offscreenctx.shadowBlur = 20;
        this.offscreenctx.fill();
        this.offscreenctx.restore();
    }

    tfParticles(x, y, dx, dy, radius, color) {
        return { x, y, dx, dy, radius, color };
    }

    particle(particles) {
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * this.offscreencanvas.width;
            const y = Math.random() * this.offscreencanvas.height;
            const dx = (Math.random() - 0.5) * 0.5;
            const dy = (Math.random() - 0.5) * 0.5;
            const radius = Math.random() * 0.5 + 0.2;
            const color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, 0.8)`;
            particles.push(this.tfParticles(x, y, dx, dy, radius, color));
        }
    }

    async RadioVisualizer(dataArray, bufferLength, baseRadius, particles) {
        this.offscreenctx.fillStyle = "rgb(10, 10, 30)";
        this.offscreenctx.fillRect(0, 0, this.offscreencanvas.width, this.offscreencanvas.height);

        let CtxTotal = 0;
        for (let i = 0; i < dataArray.length; i++) {
            CtxTotal += dataArray[i];
        }
        const averageVolume = CtxTotal / dataArray.length;

        for (let i = 0; i < particles.length; i++) {
            this.update(particles[i], averageVolume, baseRadius, this.offscreencanvas);
            this.draw(particles[i]);
        }

        const barWidth = this.offscreencanvas.width / bufferLength;
        let CtxX = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i];
            const CtxR = barHeight + 25 * (i / bufferLength);
            const CtxG = 250 * (i / bufferLength);
            const CtxB = 50;
            this.offscreenctx.fillStyle = `rgb(${CtxR}, ${CtxG}, ${CtxB})`;
            this.offscreenctx.fillRect(CtxX, this.offscreencanvas.height - barHeight, barWidth, barHeight);
            CtxX += barWidth + 1;
        }

        this.visualizatorController = async () => {
this.RadioVisualizer(dataArray, bufferLength, baseRadius, particles);
    setTimeout(loop, 16); // ~60fps
};
this.visualizatorController();
    }
    //////////////////End of Audio ////////////////////////////
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
            if (event.data.payload.system === "file") {
                this.fetchRadioSongs();
                this.TheLastSongUsed = this.CurrentSong;
            } else if (event.data.payload.system === "start") {
                this.fetchRadioSongs();
                this.TheLastSongUsed = this.CurrentSong;
            } else if (event.data.payload.system === "skip") {
                this.TheLastSongUsed = this.CurrentSong;
                this.fetchRadioSongs();
            } else if (event.data.payload.system === "previous") {
                if (this.TheLastSongUsed === null) {
                    this.TheLastSongUsed = this.CurrentSong;
                    postMessage({ type: "radio", system: "Previous", file: this.CurrentSong })
                } else if (this.TheLastSongUsed !== this.CurrentSong) {
                    postMessage({ type: "radio", system: "Previous", file: this.TheLastSongUsed });
                } else {
                    postMessage({ type: "radio", system: "Previous", file: this.CurrentSong });
                }
            } else if (event.data.payload.system === "ended") {
                this.TheLastSongUsed = this.CurrentSong;
                this.fetchRadioSongs();
            } else if (event.data.payload.system === "pcm") {

            }
        } else if (event.data.type === "stream") {
            //Streaming Chuncks
            if (event.data.payload.system === "audio array") {


               // console.log("Processing audio array:", event.data.audioArray);

            } else {

            }
        } else if (event.data.type === "downloads") {
            // Handle Downloads  
            if (event.data.payload.system === "") {

            } else {

            }
        } else if (event.data.type === "calculations") {
            //Audio Processing
            if (event.data.payload.system === "fft") {

            } else if (event.data.payload.system === "Peak Detection") {

            } else if (event.data.payload.system === "signaling") {

            } else if (event.data.payload.system === "RMS") {

            } else {

            }
        } else if (event.data.type === "visualizator") {
            //
            if (event.data.payload.system === "playing") {
                this.offscreencanvas = event.data.payload.canvas;

                this.RadioVisualizer(event.data.payload.analyser, event.data.payload.dataArray, event.data.payload.bufferLength, event.data.payload.baseRadius, event.data.payload.particles);
            } else {

            }
        } else if (event.data.type === "processor") {
            //
            if (event.data.payload.system === "stereo") {
                // Stereo 

                //Mono
            } else if (event.data.payload.system === "amplitude") {

            } else if (event.data.payload.system === "volume peak Detection") {

            } else if (event.data.payload.system === "filtering") {

            } else if (event.data.payload.system === "Zero Crossing") {

            } else if (event.data.payload.system === "Pitch Detection") {

            } else if (event.data.payload.system === "decode") {

            } else {

            }
        } else if (event.data.type === "game") {
            //
            if (event.data.payload.system === "") {

            } else {

            }
        }
    }
}
