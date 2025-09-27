import { DefaultPlaylist } from "./../JS/Arrays.js";

export class TfMusic {
    constructor(audioElement, Title, Buttons, Last, Restart, Start, Skip, TfCanvas) {
        this.TsunamiAudio = audioElement;
        this.TsunamiRadioTitle = Title;
        this.TsunamiRadioButtons = Buttons;
        this.TsunamiLastButton = Last;
        this.TsunamiRestartButton = Restart;
        this.TsunamiStartButton = Start;
        this.TsunamiSkipButton = Skip;
        this.phpRadio = new XMLHttpRequest();
        this.TsunamiRadioAudio = new AudioContext();
        this.RadioCanvas = TfCanvas;
        this.canvas;
        this.x;
        this.y;
        this.dx; // x velocity
        this.dy; // y velocity
        this.radius;
        this.baseRadius;
        this.color;
        this.particles = [];
        this.visualizatorController;
        this.SongList1st;
        this.SongList;
        this.Timing;
        this.RadioProcessBar;
        this.TaudioFtime;
        this.minutes;
        this.seconds;
        this.RadioLoadStartTime;
        this.RadioAnalyser;
        this.RadioSrc;
        this.TsunamiRadioBufferLength;
        this.TsunamiRadioBufferLength;
        this.TheLastSongUsed;
        this.CurrentSong;
        this.phpSongList;
        this.nextRadioItem;
        this.radioRandom;
        this.rangeIndex;
        this.hour;
        this.minute;
        this.randomMusicDefault = Math.floor(Math.random() * (DefaultPlaylist.length - 1));
        this.textTrackOptions = {
            kind: "subtitles", // caption, descriptions, chapters, metadata
            label: "name",
            language: "en", //
        };
        this.audioAnalyzerOptions = {
            fftSize: 2048, //32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768 // defaults to 2048.
            maxDecibels: 0, // 0 is the loudest
            minDecibels: -100, // 0 is the loudest 
            smoothingTimeConstant: 0.5, // between 0 and 1
            //channelCount: ,
            channelCountMode: "max",
            //channelInterpretation: ,
            //
        };
        this.periodicWaveOptions = {
            //channelCount: 2,
            //channelCountMode: "max",
            //channelInterpretation: "speakers",
            disableNormalization: true,
        };
        this.TFpowReal = new Float32Array(2);
        this.TFpwoImag = new Float32Array(2);
        this.TFaudioBuffer = new ArrayBuffer(32);
        this.TFtestingF32A = new Float32Array(this.TFaudioBuffer, 4, 4);
        //this.float32FromIterable = new Float32Array(this.TFgameIterable());

        //this.TFperiodicWave = this.TsunamiRadioAudio.createPeriodicWave(this.TFpwoReal, this.TFpwoImag, this.TFperiodicWaveOptions)
        /*
                this.TFoscillatorNodeOptions = {
                    type: "sine", //"square", "sawtooth", "triangle", "custom" //default is "sine";
                    detune: 0,
                    frequency: 440,
                    periodicWave: this.TFperiodicWave,
                    channelCount: 2,
                    channelCountMode: "max", // max, something , huh
                    channelInterpretation: "speakers"
                };
                */
        this.TFWaveShaperNodeOptions = {
            //curve: 0.5, // -1, 1
            oversample: "none", // "none", "2x", "4x",
            channelCount: "2", //
            channelCountMode: "max",
            //channelInterpretation: "speaker"
        };
        this.Game2dPannerOptions = { pan: 0 }; // -1 = far left, 1 = far right;
        this.TFdelayNodeOptions = {
            delayTime: 0,
            maxDelayTime: 1,
            channelCount: 2,
            channelCountMode: "max",
            channelInterpretation: "speakers"
        };
        this.TFdynamicsCompressorNodeOptions = {
            attack: 0.003, // 0-1
            knee: 30, //0 - 40
            ratio: 12, // 1  - 20
            release: 0.250, // 0-1
            threshold: -24 // -100 - 0
        };
    }
    tfParticles(x, y, dx, dy, radius, color) {
        return { x, y, dx, dy, radius, color };
    }
    particle() {
        for (let i = 0; i < 100; i++) {
            this.x = Math.random() * this.RadioCanvas.width;
            this.y = Math.random() * this.RadioCanvas.height;
            this.dx = (Math.random() - 0.5) * 0.5;
            this.dy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 0.5 + 0.2;
            this.color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, 0.8)`;
            this.particles.push(this.tfParticles(this.x, this.y, this.dx, this.dy, this.radius, this.color));
        }
    }
    update(volume) {
        this.radius = this.baseRadius + volume / 80; // pulse based on volume
        this.x += this.dx;
        this.y += this.dy;

        // bounce off edges
        if (this.x + this.radius > this.RadioCanvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > this.RadioCanvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.fill();
    }
    hereDude(ctx) {
        ctx.clearRect(0, 0, this.RadioCanvas.width, this.RadioCanvas.height);

        //this.RadioAnalyser.getFloatTimeDomainData(this.TsunamiRadioDataArray);
        //this.RadioAnalyser.getByteTimeDomainData(this.TsunamiRadioDataArray);
        this.RadioAnalyser.getByteFrequencyData(this.TsunamiRadioDataArray);

        ctx.fillStyle = "rgb(10, 10, 30)";
        ctx.fillRect(0, 0, this.RadioCanvas.width, this.RadioCanvas.height);

        //Get Average volume for particle reaction
        let CtxTotal = 0;
        for (let i = 0; i < this.TsunamiRadioDataArray.length; i++) {
            CtxTotal += this.TsunamiRadioDataArray[i];
        }
        let averageVolume = CtxTotal / this.TsunamiRadioDataArray.length;

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update(averageVolume);
            this.particles[i].draw(ctx);
        }

        let barWidth = (100 / this.TsunamiRadioBufferLength) * 2.5;
        let barHeight;
        let CtxX = 0;

        for (let i = 0; i < this.TsunamiRadioBufferLength; i++) {
            barHeight = this.TsunamiRadioDataArray[i];

            let CtxR = barHeight + 25 * (i / this.TsunamiRadioBufferLength);
            let CtxG = 250 * (i / this.TsunamiRadioBufferLength);
            let CtxB = 50;

            ctx.fillStyle = `rgb(${CtxR}, ${CtxG}, ${CtxB})`;
            ctx.fillRect(CtxX, 100 - barHeight, barWidth, barHeight);

            CtxX += barWidth + 1;
        }

        this.visualizatorController = requestAnimationFrame(this.hereDude);
    }
    Visualizer() {
        let ctx = this.RadioCanvas.getContext("2d");
        this.particle();
        this.hereDude(ctx);
    }
    StopVisualizator() {
        cancelAnimationFrame(this.visualizationController)
    }
    startMusic() {
        if (this.TsunamiAudio.paused) {
            this.TsunamiAudio.play().catch(async (error) => {
                if (error.name === "NotAllowedError") {
                    console.log("Autoplay is blocked. Please interact with the page to start the radio.");
                } else {
                    console.error("Error playing audio:", error);
                }
            });
        } else {
            this.TsunamiAudio.play().catch(async (error) => {
                if (error.name === "NotAllowedError") {
                    console.log("Autoplay is blocked. Please interact with the page to start the radio.");
                } else {
                    console.error("Error playing audio:", error);
                }
            });
        }
    }
    stopMusic() {
        if (!this.TsunamiAudio.paused) {
            this.TsunamiAudio.pause();
        }
    }
    previousSong(music) {
        this.TsunamiAudio.src = music;
        this.TsunamiAudio.play();
    }
    restartSong(music) {
        this.TsunamiAudio.src = music;
        this.TsunamiAudio.play();
    }
    TFgameIterable() {
        //yield * [1, 2, 3];
    }
    TsunamiRadioReady() {
        this.TsunamiRadioTitle.innerHTML = "Welcome to TFN Radio";

        this.TsunamiLastButton.id = "TFradioPreviousButton";
        this.TsunamiLastButton.innerHTML = "Previous";
        this.TsunamiLastButton.addEventListener("click", async () => {

        });
        this.TsunamiRadioButtons.appendChild(TsunamiLastButton);

        this.TsunamiRestartButton.id = "TFRadioRestartButton";
        this.TsunamiRestartButton.innerHTML = "Restart";
        this.TsunamiRestartButton.addEventListener("click", async () => {

        });
        this.TsunamiRadioButtons.appendChild(TsunamiRestartButton);

        this.TsunamiStartButton.id = "TFradioButton";
        this.TsunamiStartButton.innerHTML = "Start Radio";
        this.TsunamiStartButton.addEventListener("click", async () => {
            if (this.TsunamiAudio.paused) {
                this.startMusic();
                this.TsunamiStartButton.innerHTML = "Pause Tsuanmi Radio";
            } else {
                this.stopMusic();
                this.TsunamiStartButton.innerHTML = "Play Tsunami Radio";
            }
        });
        this.TsunamiRadioButtons.appendChild(this.TsunamiStartButton);


        this.TsunamiSkipButton.id = "TFradioSkipButton";
        this.TsunamiSkipButton.innerHTML = "Next";
        this.TsunamiSkipButton.addEventListener("click", async () => {

        });
        this.TsunamiRadioButtons.appendChild(TsunamiSkipButton);
    }
    MusicNetworkState(RadioWorker) {
        if (this.TsunamiAudio.readyState === 0) {
            console.log("Radio readyState is HAVE_NOTHING aka no data yet.");
            if (this.TsunamiAudio.networkState == 0) {
                console.log("Radio networkState has NETWORK_EMPTY");
                if (this.TsunamiAudio.src == "") {
                    console.log("The radio source is ''");
                    RadioWorker.postMessage({ type: "radio", system: "start" });
                } else if (!this.TsunamiAudio.src) {
                    ("The radio source does not exist");
                    RadioWorker.postMessage({ type: "radio", system: "start" });
                } else if (this.TsunamiAudio.src == " ") {
                    console.log("The radio source is ' '");
                    RadioWorker.postMessage({ type: "radio", system: "start" });
                } else if (this.TsunamiAudio.src == "about:blank") {
                    console.log("The radio source is about:blank");
                    RadioWorker.postMessage({ type: "radio", system: "start" });
                }
                else {
                    console.log("Something else is going on and I dont know what it is.");
                }
            } else if (this.TsunamiAudio.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (this.TsunamiAudio.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE");
                //No valid source
                RadioWorker.postMessage({ type: "radio", system: "start" });
            }
        } else if (this.TsunamiAudio.readyState === 1) {
            console.log("Radio readyState is HAVE_METADATA");
            if (this.TsunamiAudio.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (this.TsunamiAudio.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (this.TsunamiAudio.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE (but during the have metadata point.");
                //No valid source
            }
        } else if (this.TsunamiAudio.readyState === 2) {
            console.log("Radio readyState is HAVE_CURRENT_DATA");
            if (this.TsunamiAudio.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (this.TsunamiAudio.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (this.TsunamiAudio.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE but during the have ;loading point.");
                //No valid source
            }
        } else if (this.TsunamiAudio.readyState === 3) {
            console.log("Radio readyState is HAVE_FUTURE_DATA");
            if (this.TsunamiAudio.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (this.TsunamiAudio.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE during the canplay point.");
                //No valid source
            }
        } else if (this.TsunamiAudio.readyState === 4) {
            console.log("Radio readyState is HAVE_ENOUGH_DATA");
            if (this.TsunamiAudio.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (this.TsunamiAudio.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (this.TsunamiAudio.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE during the canplaythrough point.");
                //No valid source
            }

            if (this.TsunamiAudio.ended) {
                if (this.TsunamiAudio.src = "") {

                } else if (this.TsunamiAudio.src = undefined) {

                } else if (!this.TsunamiAudio.src) {

                } else {
                    RadioWorker.postMessage({ type: "radio", system: "skip" });
                }
            } else {
                if (this.TsunamiAudio.paused) {
                    if (this.TsunamiAudio.currentTime === 0) {
                        console.log("Tsunami Radio has not started yet.");
                    } else {
                        console.log("Paused at " + this.TsunamiAudio.currentTime);
                    }
                } else {
                    console.log("A song is still playing. Make the next song play using the functions");
                }
            }
        } else {
            if (this.TsunamiAudio.networkState === 3) {
                console.log("The network could not find the source.");
                RadioWorker.postMessage({ type: "radio", system: "start" });
            } else {
                console.log("Some unknown error is going on with the Radio");
            }
        }
    }
    MusicFile(event) {
        if (event.data.file == "undefined") {
            this.SongList = DefaultPlaylist[randomMusicDefault];
            console.log(`This should be a song from the default playlist in javascript <br />: ${this.SongList}`);
        } else if (event.data.file == undefined) {
            this.SongList = DefaultPlaylist[randomMusicDefault];
            console.log(`This should be a song from the default playlist in javascript <br /> ${this.SongList}`);
        } else if (event.data.file == "") {
            this.SongList = DefaultPlaylist[randomMusicDefault];
            console.log(`This should be a song from the default playlist in javascript <br /> ${this.SongList}`);
        } else if (event.data.file == "null") {
            this.SongList = DefaultPlaylist[randomMusicDefault];
            console.log(`This should be a song from the default playlist in javascript <br /> ${this.SongList}`);
        } else if (event.data.file == null) {
            this.SongList = DefaultPlaylist[randomMusicDefault];
            console.log(`This should be a song from the default playlist in javascript <br /> ${this.SongList}`);
        } else {
            this.SongList = event.data.file;
            console.log(`This should be a song from php ${this.SongList} <br /> typeof: ${typeof this.SongList}`);
        }
        return this.SongList;
    }
    MusicState(context) {
        if (this.context.state === "suspended") {
            this.context.resume();
        } else if (this.context.state === "running") {
            console.log("The audio context state is running");
            if (this.TsunamiAudio.waiting) {
                this.context.suspend();
            }
        } else {
            console.log("The Audio context state must be closed");
            if (this.TsunamiAudio.pause) {
                this.StopVisualizator();
            }
        }
    }
    emptiedAudio() {
        console.log("The audio is empty");
    }
    loadstartAudio() {
        this.RadioLoadStartTime = Date.now();
    }
    loadedmetadataAudio(context) {
        this.RadioSrc = this.context.createMediaElementSource(this.TsunamiAudio);
        this.RadioAnalyser = this.context.createAnalyser();
        this.RadioAnalyser.fftSize = 2048;
        this.TsunamiRadioBufferLength = this.RadioAnalyser.frequencyBinCount;
        this.TsunamiRadioDataArray = new Uint8Array(this.TsunamiRadioBufferLength);

        this.RadioSrc.connect(this.RadioAnalyser);
        this.RadioAnalyser.connect(this.context.destination);

        this.MusicState();
    }
    loadeddataAudio() {
        console.log("The audio data is loaded");
    }
    canplayAudio() {
        this.MusicState();
        if (this.RadioCanvas !== null) {
            this.Visualizator();
        } else {
            this.Visualizator();
        }
    }
    canplaythroughAudio() {
        this.MusicState();
        this.startMusic();
    }
    playAudio() {
        this.MusicState();

    }
    pauseAudio() {
        this.MusicState();
    }
    endedAudio() {
        console.log("The audio should have ended");
    }
    waitingAudio() {
        this.MusicState();
    }
    playingAudio() {
        this.MusicState();
    }
    stalledAudio(stalled) {
        console.log("The Tsunami Audio has stalled for some reason" + stalled);
    }
    suspendedAudio(suspend) {
        console.log("The audio is suspended");
    }
    FormatAudioTime(second) {
        this.minutes = Math.floor(second / 60);
        this.seconds = second % 60;
        return `${this.minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    timeupdateAudio() {
        this.Timing = Math.floor(this.TsunamiAudio.currentTime);
        this.RadioProcessBar = (this.TsunamiAudio.currentTime / this.TsunamiAudio.duration) * 100;
        this.TaudioFtime = `Time: ${this.FormatAudioTime(this.Timing)}`
    }
    volumechangeAudio() {
        console.log("The volume has changed");
    }
    NoSubFolder(PSL, tsu) {
        if (typeof PSL !== "undefined" && Array.isArray(PSL[tsu]) && PSL[tsu].length > 0) {
            if (PSL[tsu].length >= 20) {
                this.radioRandom = Math.floor(Math.random() * (PSL[tsu].length - 1));
                this.CurrentSong = PSL[tsu][this.radioRandom];
                console.log(this.CurrentSong);
                postMessage({ type: "file", file: this.CurrentSong });

            } else {
                this.radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
                this.CurrentSong = PSL[11][this.radioRandom];
                console.log(this.CurrentSong);
                postMessage({ type: "file", file: this.CurrentSong });
            }
        } else {
            this.radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
            this.CurrentSong = PSL[11][this.radioRandom];
            console.log(this.CurrentSong);
            postMessage({ type: "file", file: this.CurrentSong });
        }
    }
    ThreeFolderSub(PSL, tsu, nami) {
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
                postMessage({ type: "file", file: this.CurrentSong });
            } else {
                console.log(`No valid data in PSL[${tsu}][${this.rangeIndex}], falling back to PSL[11]`);
                this.radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
                this.CurrentSong = PSL[11][this.radioRandom];
                console.log(this.CurrentSong);
                postMessage({ type: "file", file: this.CurrentSong });
            }
        } else {
            console.log(`PSL[${tsu}] is not valid, falling back to PSL[11]`);
            this.radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
            this.CurrentSong = PSL[11][this.radioRandom];
            console.log(this.CurrentSong);
            postMessage({ type: "file", file: this.CurrentSong });
        }
    }
    FourFolderSub(PSL, tsu, nami) {
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
                postMessage({ type: "file", file: this.CurrentSong });
            } else {
                console.log(`No valid data in PSL[${tsu}][${this.rangeIndex}], falling back to PSL[11]`);
                this.radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
                this.CurrentSong = PSL[11][this.radioRandom];
                console.log(this.CurrentSong);
                postMessage({ type: "file", file: this.CurrentSong });
            }
        } else {
            console.log(`PSL[${tsu}] is not valid, falling back to PSL[11]`);
            this.radioRandom = PSL[11][Math.floor(Math.random() * (PSL[11].length - 1))];
            this.CurrentSong = PSL[11][this.radioRandom];
            console.log(this.CurrentSong);
            postMessage({ type: "file", file: this.CurrentSong });
        }
    }
    SixFolderSub(PSL, tsu, nami) {
        this.rangeIndex = Math.floor(nami / 10);

        console.log(`Accessing PSL[${tsu}] with this.rangeIndex: ${this.rangeIndex}`);

        if (Array.isArray(PSL) && Array.isArray(PSL[tsu])) {
            if (PSL[tsu][this.rangeIndex] && PSL[tsu][this.rangeIndex].length > 3) {
                this.radioRandom = Math.floor(Math.random() * (PSL[tsu][this.rangeIndex].length - 1));
                this.CurrentSong = PSL[tsu][this.rangeIndex][this.radioRandom];
                console.log(this.CurrentSong);
                postMessage({ type: "file", file: this.CurrentSong });
            } else {
                console.log(`No valid data in PSL[${tsu}][${this.rangeIndex}], falling back to PSL[11]`);
                this.radioRandom = Math.floor(Math.random() * (PSL[11].length - 1));
                this.CurrentSong = PSL[11][this.radioRandom];
                console.log(this.CurrentSong);
                postMessage({ type: "file", file: this.CurrentSong });
            }
        } else {
            console.log(`PSL[${tsu}] is not valid, falling back to PSL[11]`);
            this.radioRandom = PSL[11][Math.floor(Math.random() * (PSL[11].length - 1))];
            this.CurrentSong = PSL[11][this.radioRandom];
            console.log(this.CurrentSong);
            postMessage({ type: "file", file: this.CurrentSong });
        }
    }
    RadioTime(PSL) {
        let now = new Date();
        this.hour = now.getHours();
        this.minute = now.getMinutes();

        switch (this.hour) {
            case 0:
                this.FourFolderSub(PSL, 0, this.minute);
                break;
            case 1:
                if (this.minute <= 4) {
                    this.NoSubFolder(PSL, 1);
                } else if (this.minute <= 14) {
                    this.ThreeFolderSub(PSL, 1, this.minute);
                } else if (this.minute <= 29) {
                    this.ThreeFolderSub(PSL, 1, this.minute);
                } else {
                    this.ThreeFolderSub(PSL, 1, this.minute);
                }
                break;
            case 2:
                this.NoSubFolder(PSL, 2);
                break;
            case 3:
                this.ThreeFolderSub(PSL, 3, this.minute);
                break;
            case 4:
                this.ThreeFolderSub(PSL, 4, this.minute);
                break;
            case 5:
                this.ThreeFolderSub(PSL, 5, this.minute);
                break;
            case 6:
                this.ThreeFolderSub(PSL, 6, this.minute);
                break;
            case 7:
                this.ThreeFolderSub(PSL, 7, this.minute);
                break;
            case 8:
                this.SixFolderSub(PSL, 8, this.minute);
                break;
            case 9:
                this.ThreeFolderSub(PSL, 9, this.minute);
                break;
            case 10:
                this.NoSubFolder(PSL, 10);
                break;
            case 11:
                postMessage(PSL[11][Math.floor(Math.random() * (PSL[11].length - 1))]);
                break;
            case 12:
                this.FourFolderSub(PSL, 12, this.minute);
                break;
            case 13:
                this.FourFolderSub(PSL, 13, this.minute);
                break;
            case 14:
                this.FourFolderSub(PSL, 14, this.minute);
                break;
            case 15:
                this.FourFolderSub(PSL, 15, this.minute);
                break;
            case 16:
                this.FourFolderSub(PSL, 16, this.minute);
                break;
            case 17:
                this.NoSubFolder(PSL, 17);
                break;
            case 18:
                this.SixFolderSub(PSL, 18, this.minute);
                break;
            case 19:
                this.FourFolderSub(PSL, 19, this.minute);
                break;
            case 20:
                this.FourFolderSub(PSL, 20, this.minute);
                break;
            case 21:
                this.NoSubFolder(PSL, 21);
                break;
            case 22:
                this.NoSubFolder(PSL, 22);
                break;
            case 23:
                this.NoSubFolder(PSL, 23);
                break;
            default:
                postMessage(PSL[11][Math.floor(Math.random() * (PSL[11].length - 1))]);
                break;
        }
    }
    fetchRadioSongs() {
        try {
            this.phpRadio.open("GET", "./../RadioPlaylist.php", true);
            this.phpRadio.setRequestHeader("X-Request-Type", "fetchRadioSongs");
            this.phpRadio.onreadystatechange = async function () {
                if (this.phpRadio.readyState === 4) {
                    if (this.phpRadio.status === 200) {
                        this.phpSongList = JSON.parse(this.phpRadio.responseText);
                        console.log("Parsed Songs:", this.phpSongList);

                        this.RadioTime(this.phpSongList);
                        this.nextRadioItem = this.phpSongList;
                    } else {
                        console.log(this.phpRadio.response + this.phpRadio.responseText); //const xmlDoc = this.phpRadio.responseXML;
                        // For Blobs
                        // this.phpRadio.responseType = "blob";
                        // function () { const blob = this.phpRadio.response; const blobURL = URL.createObjectURL(blob); document.getElementById("the Element").src = bloblURL; }
                        console.error("It did not do JSON.parse");
                    }
                }
            };
            this.phpRadio.onerror = async function () {
                console.error("Network Error: Unable to reach the server.");
            };
            this.phpRadio.send();
        } catch (error) {
            console.error("Error fetching or parsing songs:", error);
        } finally {
        }
    }
    audioCapabilities() {
        if ("mediaCapabilities" in navigator) {
            //for (const type of radioTypes) {
            //console.log(`Is ${type} supported? ${MediaRecorder.isTypeSupported(type) ? "Yes" : "Nope :("}`);
            //console.log(`Can you use this audio type for playback: ${this.TsunamiAudio.canPlayType}`);
            //}
            this.fetchRadioSongs();
        } else {
            console.log("Tsunami Radio cannot be played on this device for some reason. Lets fix it together.");
        }
    }
    messageReceived(event) {
        if (event.data.type === "radio") {
            if (event.data.system === "start") {
                this.fetchRadioSongs();
                this.TheLastSongUsed = this.CurrentSong;
            } else if (event.data.system === "skip") {
                this.TheLastSongUsed = this.CurrentSong;
                this.fetchRadioSongs();
            } else if (event.data.system === "previous") {
                if (this.TheLastSongUsed === null) {
                    this.TheLastSongUsed = this.CurrentSong;
                    postMessage({ type: "radio", system: "Previous", file: this.CurrentSong })
                } else if (this.TheLastSongUsed !== this.CurrentSong) {
                    postMessage({ type: "radio", system: "Previous", file: TheLastSongUsed });
                } else {
                    postMessage({ type: "radio", system: "Previous", file: this.CurrentSong });
                }
            } else if (event.data.system === "ended") {
                this.TheLastSongUsed = this.CurrentSong;
                this.fetchRadioSongs();
            }
        } else if (event.data.type === "visualizator") {

        } else if (event.data.type === "processor") {

        } else if (event.data.type === "game") {

        }
    }
    RadioWorkerReceivedMessage(event) {
        this.TsunamiRadioReady();
        if (typeof event.data.file == undefined) {
            this.SongList1st = this.MusicFile(event);
        } else if (typeof event.data.file == null) {
            this.SongList1st = this.MusicFile(event);
        } else if (typeof event.data.file == "string") {
            this.SongList1st = this.MusicFile(event);
        } else {
            this.SongList1st = this.MusicFile(event);
        }

        console.log(this.SongList1st + " is the source of the current song.");
        this.TsunamiAudio.src = this.SongList1st; //SongList.trim();
        this.TsunamiAudio.load();

        this.TsunamiAudio.addEventListener("emptied", () => {

        }); //The media has become empty; for example, this event is sent if the media has already been loaded( or partially loaded), and the HTMLMediaElement.load method is called to reload it.

        this.TsunamiAudio.addEventListener("loadstart", async () => {

        }); // Fired when the browser has started to load the resource.

        this.TsunamiAudio.addEventListener("loadedmetadata", async () => {

        }); //The metadata has been loaded.

        this.TsunamiAudio.addEventListener("loadeddata", () => {

        }); //The first frame of the media has finished loading.

        this.TsunamiAudio.addEventListener("canplay", () => {

        }); // The browser can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content.

        this.TsunamiAudio.addEventListener("canplaythrough", async () => {

        }); //The browser estimates it can play the media up to its ends without stopping for content buffering.

        this.TsunamiAudio.addEventListener("play", () => {

        }); //Playback has begun.

        this.TsunamiAudio.addEventListener("pause", () => {

        }); // Playback has been paused.

        this.TsunamiAudio.addEventListener("ended", async () => {

        }); //Playback has stopped because of the end of the media was reached.

        this.TsunamiAudio.addEventListener("waiting", (waiting) => {

        }); //Playback has stopped because of a temporary lack of data.

        this.TsunamiAudio.addEventListener("playing", () => {

        }); // Playback is ready to start after having been paused or delayed due to lack of data.

        this.TsunamiAudio.addEventListener("stalled", (stalled) => {

        });//The user agent is trying to fetch media data, but data is unexpectedly not forthcoming.

        this.TsunamiAudio.addEventListener("suspended", (suspend) => {

        }); //Media data loading has been suspended.

        this.TsunamiAudio.addEventListener("timeupdate", () => {

        }); //The time indicated by the currentTime attribute has been updated.

        this.TsunamiAudio.addEventListener("volumechange", () => {

        });
    }
}