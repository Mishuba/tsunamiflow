import { DefaultPlaylist } from "./../JS/Arrays.js";

export class TfMusic {
    constructor(audioElement = null, Title = null, Buttons = null, Last = null, Restart = null, Start = null, Skip = null, TfCanvas = null) {
        this.TsunamiAudio = audioElement;
        this.TsunamiRadioTitle = Title;
        this.TsunamiRadioButtons = Buttons;
        this.TsunamiLastButton = Last;
        this.TsunamiRestartButton = Restart;
        this.TsunamiStartButton = Start;
        this.TsunamiSkipButton = Skip;
        this.textTrackOptions = {
            kind: "subtitles", // caption, descriptions, chapters, metadata
            label: "name",
            language: "en", //
        };
        this.TsunamiRadioAudio;
        //= new (window.AudioContext() || window.webkitAudioContext)();
        this.TsunamiGain;
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
        this.TsunamiAnalyser;
        this.periodicWaveOptions = {
            channelCount: 2,
            channelCountMode: "max",
            channelInterpretation: "speakers",
            disableNormalization: true,
        };
        this.TsunamiPanner;
        this.TsunamiDelay;
        this.TsunamiCompressor;
        this.TsunamiRadioMedia;
        this.TFpwoImag;
        this.TFaudioBuffer;
        this.RadioChannel1;
        this.TfRcCopy1;
        this.RadioChannel2;
        this.TsunamiCtxSrc;
        this.TfNextPlayTime = 0;
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
        this.RadioSrc;
        this.TsunamiRadioBufferLength;
        this.hour;
        this.randomMusicDefault = Math.floor(Math.random() * (DefaultPlaylist.length - 1));
        this.TFpowReal = new Float32Array(2);
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
        //this.worker = new Worker("../'Web Worker'/TsunamiRadio.js");
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
        this.TsunamiAnalyser.getByteFrequencyData(this.TsunamiRadioDataArray);

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
    TsunamiRadioReady(RadioWorker) {
        this.TsunamiRadioTitle.innerHTML = "Welcome to TFN Radio";

        this.TsunamiLastButton.id = "TFradioPreviousButton";
        this.TsunamiLastButton.innerHTML = "Previous";
        this.TsunamiLastButton.addEventListener("click", async () => {
            RadioWorker.postMessage({
                type: "radio",
                system: "previous",
                file: this.TsunamiAudio.src
            });
        });
        this.TsunamiRadioButtons.appendChild(TsunamiLastButton);

        this.TsunamiRestartButton.id = "TFRadioRestartButton";
        this.TsunamiRestartButton.innerHTML = "Restart";
        this.TsunamiRestartButton.addEventListener("click", async () => {
            //something like timeupdate = 0 or something.
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
            RadioWorker.postMessage({
                type: "radio",
                system: "skip",
                file: this.TsunamiAudio.src
            })
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
                    RadioWorker.postMessage({ type: "radio", system: "file", file: "none", message: "the radio source is ''", buffer: "nothing should be buffering." });
                } else if (!this.TsunamiAudio.src) {
                    ("The radio source does not exist");
                    RadioWorker.postMessage({ type: "radio", system: "file" });
                } else if (this.TsunamiAudio.src == " ") {
                    console.log("The radio source is ' '");
                    RadioWorker.postMessage({ type: "radio", system: "file" });
                } else if (this.TsunamiAudio.src == "about:blank") {
                    console.log("The radio source is about:blank");
                    RadioWorker.postMessage({ type: "radio", system: "file" });
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
    MusicState() {
        if (this.TsunamiRadioAudio.state === "suspended") {
            context.resume();
        } else if (this.TsunamiRadioAudio.state === "running") {
            console.log("The audio context state is running");
            if (this.TsunamiAudio.waiting) {
                context.suspend();
            }
        } else {
            console.log("The Audio context state must be closed");
            if (this.TsunamiAudio.pause) {
                this.StopVisualizator();
            }
        }
    }
    emptiedAudio(empty) {
        console.log("The audio is empty");
    }
    loadstartAudio(ls) {
        this.RadioLoadStartTime = Date.now();
        console.log("Load start time recorded:", this.RadioLoadStartTime);
    }
    loadedmetadataAudio(lmd) {
        //this.RadioAnalyser.fftSize = 2048;
        this.TsunamiRadioBufferLength = this.TsunamiAnalyser.frequencyBinCount;
        this.TsunamiRadioDataArray = new Uint8Array(this.TsunamiRadioBufferLength);

        this.TfRadioCreateContexts(this.TsunamiAudio);
        this.TfRadioConnectNow();
        this.MusicState();
    }
    loadeddataAudio(od) {
        console.log("The audio data is loaded");
    }
    canplayAudio(cp) {
        this.MusicState();
        if (this.RadioCanvas !== null) {
            this.Visualizator();
        } else {
            this.Visualizator();
        }
    }
    canplaythroughAudio(cpt) {
        this.MusicState();
        this.startMusic();
    }
    playAudio(play) {
        this.MusicState();

    }
    pauseAudio(paused) {
        this.MusicState();
    }
    endedAudio(ended) {
        console.log("The audio should have ended");
    }
    waitingAudio(waiting) {
        this.MusicState();
    }
    playingAudio(playing) {
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
    timeupdateAudio(tu) {
        this.Timing = Math.floor(this.TsunamiAudio.currentTime);
        this.RadioProcessBar = (this.TsunamiAudio.currentTime / this.TsunamiAudio.duration) * 100;
        this.TaudioFtime = `Time: ${this.FormatAudioTime(this.Timing)}`
    }
    volumechangeAudio() {
        console.log("The volume has changed");
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
        return this.SongList1st;
    }
    HandleArrayBuffer(buffer) {
        if (this.TsunamiRadioAudio.state === "suspended") {
            this.TsunamiRadioAudio.resume();

            try {
                this.TFaudioBuffer = this.TsunamiRadioAudio.decodeAudioData(buffer);

                //this.RadioChannel1 = this.TFaudioBuffer.getChannelData(0);
                //this.TfRcCopy1 = new Float32Array(this.RadioChannel1);

                //this.RadioChannel2 = this.TFaudioBuffer.getChannelData(1);
            } catch (error) {

                console.error("Error decoding audio data: ", error);
            } finally {
                return this.TfRcCopy1;
            }
        }
    }
    RadioWorkerArrayBuffer(buffer) {
        //decode audio data (get AudioBuffer);
        let decode = this.HandleArrayBuffer(buffer);
        //Visualizator
        this.TFpwoImag = new Float32Array(buffer);
        return decode;
    }
    TfScheduleBuffer(buffer) {
        this.TsunamiCtxSrc = this.TsunamiRadioAudio.createBufferSource();
        this.TsunamiCtxSrc.buffer = buffer;
    }
    TfRadioConnectNow(element) {
        this.TsunamiRadioAudio = new AudioContext();
        this.TsunamiRadioMedia = this.TsunamiRadioAudio.createMediaElementSource(element);
        this.TsunamiRadioMedia.connect(this.TsunamiAnalyser);
        //this.TsunamiAnalyser.connect(this.TsunamiPanner);
        //this.TsunamiPanner.connect(this.TsunamiDelay);
        //this.TsunamiDelay.connect(this.TsunamiCompressor);
        //this.TsunamiCompressor.connect(this.TsunamiGain);
        this.TsunamiAnalyser.connect(this.TsunamiRadioAudio.destination);
    }
    TfRadioCreateContexts() {
        this.TsunamiRadioMedia = this.TsunamiRadioAudio.createMediaElementSource(element);
        this.TsunamiAnalyser = this.TsunamiRadioAudio.createAnalyser(this.audioAnalyserOptions);
        this.TsunamiPanner = this.TsunamiRadioAudio.createStereoPanner();
        this.TsunamiDelay = this.TsunamiRadioAudio.createDelay();
        this.TsunamiCompressor = this.TsunamiRadioAudio.createDynamicsCompressor();
    }
    TfRadioEventListeners(element) {

        element.addEventListener("emptied", async (emptied) => {
            this.emptiedAudio(emptied);
        }); //this event is sent if the media has already been loaded( or partially loaded), and the HTMLMediaElement.load method is called to reload it.

        element.addEventListener("loadstart", async (loadstart) => {
            this.loadstartAudio(loadstart);
        }); // Fired when the browser has started to load the resource.

        element.addEventListener("loadedmetadata", async (metadata) => {
            this.loadedmetadataAudio(metadata);
        }); //The metadata has been loaded.

        element.addEventListener("loadeddata", (data) => {
            this.loadeddataAudio(data);
        }); //The first frame of the media has finished loading.

        element.addEventListener("canplay", (canplay) => {
            this.canplayAudio(canplay);
        }); // The browser can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content.

        element.addEventListener("canplaythrough", async (canplaythrough) => {
            this.canplaythroughAudio(canplaythrough);
        }); //The browser estimates it can play the media up to its ends without stopping for content buffering.

        element.addEventListener("play", (play) => {
            this.playAudio(play);
        }); //Playback has begun.

        element.addEventListener("pause", (pause) => {
            this.pauseAudio(pause);
        }); // Playback has been paused.

        element.addEventListener("ended", async (ended) => {
            this.endedAudio(ended);
        }); //Playback has stopped because of the end of the media was reached.

        element.addEventListener("waiting", (waiting) => {
            console.log("The audio has been waiting because: " + waiting);
            this.waitingAudio(waiting);
        }); //Playback has stopped because of a temporary lack of data.

        element.addEventListener("playing", (playing) => {
            this.playingAudio(playing);
        }); // Playback is ready to start after having been paused or delayed due to lack of data.

        element.addEventListener("stalled", (stalled) => {
            console.log("the audio has stalled because: " + stalled);
            this.stalledAudio(stalled);
        });//The user agent is trying to fetch media data, but data is unexpectedly not forthcoming.

        element.addEventListener("suspended", (suspend) => {
            console.log("The audio has suspened because:" + suspend);
            this.suspendAudio(suspend);
        }); //Media data loading has been suspended.

        element.addEventListener("timeupdate", (timeupdate) => {
            this.timeupdateAudio(timeupdate);
        }); //The time indicated by the currentTime attribute has been updated.

        element.addEventListener("volumechange", (volumechange) => {
            this.volumechangeAudio(volumechange);
        });
    }
    BeginRadio(song) {
        this.TsunamiAudio.src = song;
        this.TfRadioEventListeners(this.TsunamiAudio);
    }
}