export class WorkerManager {
    constructor(deps) {
        this.timeWorker = null;
        this.radioWorker = null;

        // External dependencies injected on purpose
        this.Radio = deps.Radio;
        this.TfWeather = deps.TfWeather;
        this.WordTimes = deps.WordTimes;
        this.RadioTimes = deps.RadioTimes;
        this.WordOfTheDay = deps.WordOfTheDay;
        this.NewsTimer = deps.NewsTimer;
        this.TsunamiAudioCtx = deps.TsunamiAudioCtx;

        this.MyNewTFTime = deps.MyNewTFTime;
        this.TfWotd = deps.TfWotd;
    }

    init(audioElem) {
        if (typeof Worker === "undefined") {
            console.warn("No Web Worker support");
            return;
        }

        if (typeof EventSource === "undefined") {
            console.warn("Server Sent Events not supported");
            return;
        }

        this.initTimeWorker(audioElem);
    }

    initTimeWorker(audioElement) {
        if (!this.timeWorker) {
            this.timeWorker = new Worker("WebWorker/Timer.js", { type: "module" });
            this.timeWorker.onmessage = (e) => this.handleTimeMessage(e, audioElement);
            this.timeWorker.onerror = (e) => this.handleError("TimeWorker", e);
        }
    }

    initRadioWorker() {
        if (!this.radioWorker) {
            this.radioWorker = new Worker("WebWorker/TsunamiRadio.js", { type: "module" });
            this.radioWorker.onmessage = (e) => this.handleRadioMessage(e);
            this.radioWorker.onerror = (e) => this.handleError("RadioWorker", e);
        }
    }

    async handleTimeMessage(event, elem) {
        const { time: TimerTime, type } = event.data;

        this.MyNewTFTime.innerHTML = TimerTime;
        this.initRadioWorker();

        if (type === "Tf Schedule") {
            await this.handleSchedule(TimerTime);
        } else if (type === "Tf Time") {
            this.handleGenericTime(elem);
        } else {
            this.handleFallback();
        }
    }

    async handleSchedule(TimerTime) {
        for (const word of this.WordTimes) {
            this.TfWotd.innerHTML = await this.WordOfTheDay(TimerTime);
            if (TimerTime === word) break;
        }

        this.NewsTimer();

        for (const tfRT of this.RadioTimes) {
            if (TimerTime === tfRT) {
                this.Radio.MusicNetworkState(this.radioWorker, this.Radio.TsunamiAudio);
                return;
            }
        }

        this.ensureRadioPlaying();
    }

    handleGenericTime(audioElem) {
        this.NewsTimer();
        document.getElementById("TFweather").innerHTML =
            this.TfWeather.requestLocation();
        this.Radio.MusicNetworkState(this.radioWorker, audioElem);
    }

    handleFallback() {
        this.NewsTimer();
        this.TfWeather.requestLocation();
        this.Radio.MusicNetworkState(this.radioWorker, this.Radio.TsunamiAudio);
    }

    ensureRadioPlaying() {
        const audio = this.Radio.TsunamiAudio;

        if (!audio?.src || audio.ended) {
            this.Radio.MusicNetworkState(this.radioWorker, audio);
        }
    }

    async handleRadioMessage(event) {
        const { type, system, buffer } = event.data;

        if (type !== "radio") return;

        if (system === "file") {
            const update = this.Radio.RadioWorkerReceivedMessage(event);
            this.Radio.BeginRadio(this.Radio.TsunamiAudio, update);
        }

        if (system === "arraybuffer") {
            this.Radio.TfScheduleBuffer(buffer, this.TsunamiAudioCtx);

            const pcm = this.Radio.RadioWorkerArrayBuffer(buffer, this.TsunamiAudioCtx);

            this.radioWorker.postMessage({
                type: "radio",
                system: "pcm",
                buffer: pcm,
                sampleRate: buffer.sampleRate
            }, [pcm]);
        }
    }

    handleError(source, error) {
        console.error(
            `[${source}] ${error.message}`,
            error.filename,
            error.lineno
        );
    }
}