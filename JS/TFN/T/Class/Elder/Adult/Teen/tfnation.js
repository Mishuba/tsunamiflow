import { TsWorker } from "./Child/OffscreenCanvas.js";
export class mediaWorker extends TsWorker {
    //time below
    hour;
    minute;
    now;
    TimerTrigger = new Set();
    something = null;
    TimerTimes = ["00:00", "00:05", "00:10", "00:15", "00:20", "00:30", "00:40", "00:45", "00:50", "01:00", "01:05", "01:10", "01:15", "01:20", "01:30", "01:40", "01:45", "01:50", "02:00", "02:05", "02:10", "02:15", "02:20", "02:30", "02:40", "02:45", "02:50", "03:00", "03:05", "03:10", "03:15", "03:20", "03:30", "03:40", "03:45", "03:50", "04:00", "04:05", "04:10", "04:15", "04:20", "04:30", "04:40", "04:45", "04:50", "05:00", "05:05", "05:10", "05:15", "05:20", "05:30", "05:40", "05:45", "05:50", "06:00", "06:05", "06:10", "06:15", "06:20", "06:30", "06:40", "06:45", "06:50", "07:00", "07:05", "07:10", "07:15", "07:20", "07:30", "07:40", "07:45", "07:50", "08:00", "08:05", "08:10", "08:15", "08:20", "08:30", "08:40", "08:45", "08:50", "09:00", "09:05", "09:10", "09:15", "09:20", "09:30", "09:40", "09:45", "09:50", "10:00", "10:05", "10:10", "10:15", "10:20", "10:30", "10:40", "10:45", "10:50", "11:00", "11:05", "11:10", "11:15", "11:20", "11:30", "11:40", "11:45", "11:50", "12:00", "12:05", "12:10", "12:15", "12:20", "12:30", "12:40", "12:45", "12:50", "13:00", "13:05", "13:10", "13:15", "13:20", "13:30", "13:40", "13:45", "13:50", "14:00", "14:05", "14:10", "14:15", "14:20", "14:30", "14:40", "14:45", "14:50", "15:00", "15:05", "15:10", "15:15", "15:20", "15:30", "15:40", "15:45", "15:50", "16:00", "16:05", "16:10", "16:15", "16:20", "16:30", "16:40", "16:45", "16:50", "17:00", "17:05", "17:10", "17:15", "17:20", "17:30", "17:40", "17:45", "17:50", "18:00", "18:05", "18:10", "18:15", "18:20", "18:30", "18:40", "18:45", "18:50", "19:00", "19:05", "19:10", "19:15", "19:20", "19:30", "19:40", "19:45", "19:50", "20:00", "20:05", "20:10", "20:15", "20:20", "20:30", "20:40", "20:45", "20:50", "21:00", "21:05", "21:10", "21:15", "21:20", "21:30", "21:40", "21:45", "21:50", "22:00", "22:05", "22:10", "22:15", "22:20", "22:30", "22:40", "22:45", "22:50", "23:00", "23:05", "23:10", "23:15", "23:20", "23:30", "23:40", "23:45", "23:50",];
    //image below
    backgroundImg
    //audio below
    TheLastSongUsed;
    CurrentSong;
    songList;
    visualizatorController;
    latestVisualizerData = null;
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
    async fetchRadioSongs() {
        try {
            this.songList = await this.requestWorld(
                "GET", "https://world.tsunamiflow.club/RadioPlaylist.php",
                null,
                { "X-Request-Type": "fetchRadioSongs" },
                "fetch"
            );
            this.RadioTime(this.songList);
            this.nextRadioItem = this.songList;
        } catch (e) {
            this.songList = null;
            console.error("JSON parse error:", e);
            this.RadioTime(this.songList);
        }
    }
    NoSubFolder(PSL, tsu, response = null) {
        if (typeof PSL !== "undefined" && Array.isArray(PSL[tsu]) && PSL[tsu].length > 0) {
            if (PSL[tsu].length >= 20) {
                this.radioRandom = Math.floor(Math.random() * (PSL[tsu].length - 1));
                this.CurrentSong = PSL[tsu][this.radioRandom];
                console.log(this.CurrentSong);

                let tf = this.tycadome(
                    "tycadome-guest" + Date.now(),
                    "radio",
                    "radio.song",
                    {
                        source: "web",
                        target: "device:web-001"
                    },
                    {
                        status: "pending",
                        priority: "low"
                    },
                    "async",
                    {
                        system: "file",
                        file: this.CurrentSong,
                        //        analyser: this.updateAnalyser(),
                        message: "",
                        buffer: ""
                    }
                );

                self.postMessage(tf);

            } else {
                this.radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
                this.CurrentSong = PSL[11][this.radioRandom];
                console.log(this.CurrentSong);
                let tf = this.tycadome(
                    "tycadome-guest" + Date.now(),
                    "radio",
                    "radio.song",
                    {
                        source: "web",
                        target: "device:web-001"
                    },
                    {
                        status: "pending",
                        priority: "low"
                    },
                    "async",
                    {
                        system: "file",
                        file: this.CurrentSong,
                        //        analyser: this.updateAnalyser(),
                        message: "",
                        buffer: ""
                    }
                );

                self.postMessage(tf);
            }
        } else {
            let tf = this.tycadome(
                "tycadome-guest" + Date.now(),
                "radio",
                "radio.song",
                {
                    source: "web",
                    target: "device:web-001"
                },
                {
                    status: "pending",
                    priority: "low"
                },
                "async",
                {
                    system: "file",
                    file: undefined,
                    //        analyser: this.updateAnalyser(),
                    message: "",
                    buffer: ""
                }
            );

            self.postMessage(tf);
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
                let tf = this.tycadome(
                    "tycadome-guest" + Date.now(),
                    "radio",
                    "radio.song",
                    {
                        source: "web",
                        target: "device:web-001"
                    },
                    {
                        status: "pending",
                        priority: "low"
                    },
                    "async",
                    {
                        system: "file",
                        file: this.CurrentSong,
                        //        analyser: this.updateAnalyser(),
                        message: "",
                        buffer: ""
                    }
                );

                self.postMessage(tf);
            } else {
                console.log(`No valid data in PSL[${tsu}][${this.rangeIndex}], falling back to PSL[11]`);
                this.radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
                this.CurrentSong = PSL[11][this.radioRandom];
                console.log(this.CurrentSong);
                let tf = this.tycadome(
                    "tycadome-guest" + Date.now(),
                    "radio",
                    "radio.song",
                    {
                        source: "web",
                        target: "device:web-001"
                    },
                    {
                        status: "pending",
                        priority: "low"
                    },
                    "async",
                    {
                        system: "file",
                        file: this.CurrentSong,
                        //        analyser: this.updateAnalyser(),
                        message: "",
                        buffer: ""
                    }
                );

                self.postMessage(tf);
            }
        } else {
            let tf = this.tycadome(
                "tycadome-guest" + Date.now(),
                "radio",
                "radio.song",
                {
                    source: "web",
                    target: "device:web-001"
                },
                {
                    status: "pending",
                    priority: "low"
                },
                "async",
                {
                    system: "file",
                    file: undefined,
                    //        analyser: this.updateAnalyser(),
                    message: "",
                    buffer: ""
                }
            );

            self.postMessage(tf);
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
                let tf = this.tycadome(
                    "tycadome-guest" + Date.now(),
                    "radio",
                    "radio.song",
                    {
                        source: "web",
                        target: "device:web-001"
                    },
                    {
                        status: "pending",
                        priority: "low"
                    },
                    "async",
                    {
                        system: "file",
                        file: this.CurrentSong,
                        //        analyser: this.updateAnalyser(),
                        message: "",
                        buffer: ""
                    }
                );

                self.postMessage(tf);
            } else {
                console.log(`No valid data in PSL[${tsu}][${this.rangeIndex}], falling back to PSL[11]`);
                this.radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
                this.CurrentSong = PSL[11][this.radioRandom];
                console.log(this.CurrentSong);
                let tf = this.tycadome(
                    "tycadome-guest" + Date.now(),
                    "radio",
                    "radio.song",
                    {
                        source: "web",
                        target: "device:web-001"
                    },
                    {
                        status: "pending",
                        priority: "low"
                    },
                    "async",
                    {
                        system: "file",
                        file: this.CurrentSong,
                        //        analyser: this.updateAnalyser(),
                        message: "",
                        buffer: ""
                    }
                );

                self.postMessage(tf);
            }
        } else {
            let tf = this.tycadome(
                "tycadome-guest" + Date.now(),
                "radio",
                "radio.song",
                {
                    source: "web",
                    target: "device:web-001"
                },
                {
                    status: "pending",
                    priority: "low"
                },
                "async",
                {
                    system: "file",
                    file: undefined,
                    //        analyser: this.updateAnalyser(),
                    message: "",
                    buffer: ""
                }
            );

            self.postMessage(tf);
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
                let tf = this.tycadome(
                    "tycadome-guest" + Date.now(),
                    "radio",
                    "radio.song",
                    {
                        source: "web",
                        target: "device:web-001"
                    },
                    {
                        status: "pending",
                        priority: "low"
                    },
                    "async",
                    {
                        system: "file",
                        file: this.CurrentSong,
                        //        analyser: this.updateAnalyser(),
                        message: "",
                        buffer: ""
                    }
                );

                self.postMessage(tf);
            } else {
                console.log(`No valid data in PSL[${tsu}][${this.rangeIndex}], falling back to PSL[11]`);
                this.radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
                this.CurrentSong = PSL[11][this.radioRandom];
                console.log(this.CurrentSong);
                let tf = this.tycadome(
                    "tycadome-guest" + Date.now(),
                    "radio",
                    "radio.song",
                    {
                        source: "web",
                        target: "device:web-001"
                    },
                    {
                        status: "pending",
                        priority: "low"
                    },
                    "async",
                    {
                        system: "file",
                        file: this.CurrentSong,
                        //        analyser: this.updateAnalyser(),
                        message: "",
                        buffer: ""
                    }
                );

                self.postMessage(tf);
            }
        } else {
            let tf = this.tycadome(
                "tycadome-guest" + Date.now(),
                "radio",
                "radio.song",
                {
                    source: "web",
                    target: "device:web-001"
                },
                {
                    status: "pending",
                    priority: "low"
                },
                "async",
                {
                    system: "file",
                    file: undefined,
                    //        analyser: this.updateAnalyser(),
                    message: "",
                    buffer: ""
                }
            );

            self.postMessage(tf);
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
                this.CurrentSong = PSL[11][
                    Math.floor(Math.random() * (PSL[11].length - 1))
                ];
                let tf = this.tycadome(
                    "tycadome-guest" + Date.now(),
                    "radio",
                    "radio.song",
                    {
                        source: "web",
                        target: "device:web-001"
                    },
                    {
                        status: "pending",
                        priority: "low"
                    },
                    "async",
                    {
                        system: "file",
                        file: this.CurrentSong,
                        //        analyser: this.updateAnalyser(),
                        message: "",
                        buffer: ""
                    }
                );

                self.postMessage(tf);
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
                self.postMessage(PSL[11][Math.floor(Math.random() * (PSL[11].length - 1))]);
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

    RadioVisualizer(dataArray, bufferLength, baseRadius, particles) {
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
    }
    startVisualizerLoop(dataArray, bufferLength, baseRadius, particles) {
        if (this.visualizatorController) return;

        this.initOffscreen();
        this.visualizatorController = true;

        const loop = () => {
            if (!this.visualizatorController) return;

            const liveData = this.latestVisualizerData || dataArray;
            const liveLength = liveData.length || bufferLength;

            this.RadioVisualizer(
                liveData,
                liveLength,
                baseRadius,
                particles
            );
            setTimeout(loop, 16);
        };

        loop();
    }

    stopVisualizerLoop() {
        this.visualizatorController = false;
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
        this.resizeoffscreen(vidCanv.width, vidCanv.height);

        this.offscreenctx.clearRect(0, 0, vidCanv.width, vidCanv.height);

        // Draw background
        if (this.backgroundVideo) {
            this.UseVideo(vidCanv.width, vidCanv.height);
            if (this.backgroundImg) this.UseImage(vidCanv, true); // corner logo
        } else if (this.backgroundImg) {
            this.UseImage(vidCanv, true);
        }

        // Draw to offscreen for chroma key
        this.offscreenctx.drawImage(TfWebcam, 0, 0, vidCanv.width, vidCanv.height);

        if (this.useChromaKey) {
            const frame = this.offscreenctx.getImageData(0, 0, vidCanv.width, vidCanv.height);
            const processed = this.webcam(frame);
            this.offscreenctx.putImageData(processed, 0, 0);
        }

        // Composite webcam over background
        return this.offscreenctx;
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
    async startTime() {
        let TheTimeIGuess = new Promise((resolve) => {
            let currentTime = new Date();
            let TsunamiTimes = currentTime.toTimeString().slice(0, 5);// "HH:MM";

            if (this.something === null) {
                this.something = setInterval(() => {
                    currentTime = new Date();
                    TsunamiTimes = currentTime.toTimeString().slice(0, 5);
                }, 1000);
            } else {
                TsunamiTimes = currentTime.toTimeString().slice(0, 5);
            }
            resolve(TsunamiTimes);
        });

        let TheRealTime = await TheTimeIGuess;

        if (this.TimerTimes.includes(TheRealTime) && !this.TimerTrigger.has(TheRealTime)) {
            this.TimerTrigger.add(TheRealTime);
            console.log(`Triggering event for ${TheRealTime}`);


            let tf = this.tycadome(
                "tycadome-guest" /*+ Date.now()*/,
                "timer",
                "scheduled.timer",
                {
                    source: "web",
                    target: "device:web-001",
                    layer: "tf",
                    worker: "media"
                },
                {
                    status: "pending",
                    priority: "low"
                },
                "async",
                {
                    system: "Tf Schedule",
                    time: TheRealTime,
                });
            self.postMessage(tf);
        } else {
            let tf = this.tycadome(
                "tycadome-guest" /*+ Date.now()*/,
                "timer",
                "scheduled.timer",
                {
                    source: "web",
                    target: "device:web-001",
                    layer: "tf",
                    worker: "media",
                    backend: false
                },
                {
                    status: "pending",
                    priority: "low"
                },
                "async",
                {
                    system: "Tf Schedule",
                    time: TheRealTime,
                });
            self.postMessage(tf);
        }

        if (TheRealTime === "23:59") {
            this.TimerTrigger.clear();
        }
    }
    async MessageReceived(event) {
        if (event.data.type === "timer") {
            if (event.data.payload.system === "Tf Schedule") {
                if (!this.something) {
                    this.something = setInterval(() => {
                        this.startTime();
                    }, 60000);
                }
            }
        }
        if (event.data.type === "radio") {
            if (event.data.payload.system === "init_canvas") {
                this.offscreencanvas = event.data.payload.canvas;
            } else if (event.data.payload.system === "file") {
                await this.fetchRadioSongs();
                this.TheLastSongUsed = this.CurrentSong;
            } else if (event.data.payload.system === "start") {
                await this.fetchRadioSongs();
                this.TheLastSongUsed = this.CurrentSong;
            } else if (event.data.payload.system === "skip") {
                this.TheLastSongUsed = this.CurrentSong;
                await this.fetchRadioSongs();
            } else if (event.data.payload.system === "previous") {
                if (this.TheLastSongUsed === null) {
                    this.TheLastSongUsed = this.CurrentSong;
                    let tf = this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "scheduled.timer",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "Previous",
                            file: this.CurrentSong
                            //time: TheRealTime,
                        });
                    self.postMessage(tf)
                } else if (this.TheLastSongUsed !== this.CurrentSong) {
                    let tf = this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "scheduled.timer",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "Previous",
                            file: this.CurrentSong
                            //time: TheRealTime,
                        });
                    self.postMessage(tf);
                } else {
                    let tf = this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "scheduled.timer",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "Previous",
                            file: this.CurrentSong
                            //time: TheRealTime,
                        });
                    self.postMessage(tf);
                }
            } else if (event.data.payload.system === "ended") {
                this.TheLastSongUsed = this.CurrentSong;
                await this.fetchRadioSongs();
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
                this.startVisualizerLoop(event.data.payload.dataArray, event.data.payload.bufferLength, event.data.payload.baseRadius, event.data.payload.particles);
            } else if (event.data.payload.system === "visual_data") {
                this.latestVisualizerData = event.data.payload.dataArray;
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