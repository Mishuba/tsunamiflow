import { TsWorker } from "./Child/OffscreenCanvas.js";
export class mediaWorker extends TsWorker {
    //time below
    radiooffscreencanvas;
    radiooffscreenctx;
    isradiooffscreenReady = false;
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
    visualizatorLoop;
    dataArrayLength = null;
    volume = null;
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
    renderFrame =
        typeof self.requestAnimationFrame === "function"
            ? self.requestAnimationFrame.bind(self)
            : (callback) => setTimeout(callback, 16);

    cancelFrame =
        typeof self.cancelAnimationFrame === "function"
            ? self.cancelAnimationFrame.bind(self)
            : clearTimeout.bind(self);
    visualLoopId = null;
    constructor(options = {}) {
        super(options);
        if (options.radiooffscreencanvas) {
            this.radiooffscreencanvas = options.radiooffscreencanvas;
        }
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


    startTime() {
        if (this.TimerLoop) return;

        this.TimerLoop = setInterval(() => {
            const now = new Date();

            const hour = now.getHours();
            const minute = now.getMinutes();

            const key = `${hour}:${minute}`;

            if (minute % 5 === 0 && !this.TimerTrigger.has(key)) {

                this.TimerTrigger.add(key);

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
                        time: key,
                    });
                self.postMessage(tf);


            }

            if (hour === 23 && minute === 59) {
                this.TimerTrigger.clear();
            }

        }, 1000);
    }

    initRadioOffscreen() {
        if (!this.radiooffscreencanvas) return;

        try {
            this.radiooffscreenctx = this.radiooffscreencanvas.getContext(this.contextType);
            if (!this.radiooffscreenctx) throw new Error(`${this.contextType} context not supported`);
            this.isradiooffscreenReady = true;
            console.log(`OffscreenCanvas initialized with ${this.contextType} context`);
        } catch (err) {
            console.error("OffscreenCanvas init failed:", err);
            this.radiooffscreenctx = null;
        }
    }
}