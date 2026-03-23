export TsunamiFlowRadio extends TsunamiFlowNation {

      constructor(options = {}) {

      }

//element
    connect(context) {

        if (!context) return;

        this.context = context;

        if (!this.source) {

            this.source = context.createMediaElementSource(this.audio);
            this.gain = context.createGain();

            this.source.connect(this.gain);
            this.gain.connect(context.destination);

        }
    }

    setVolume(value = 1) {
        if (this.gain) {
            this.gain.gain.value = value;
        } else {
            this.audio.volume = value;
        }
    }

    /* -----------------------------
       Playback Controls
    ------------------------------*/

    load(src) {
        this.audio.src = src;
        this.audio.load();
    }

    play() {
        return this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    seek(time) {
        this.audio.currentTime = time;
    }

    setLoop(loop = true) {
        this.audio.loop = loop;
    }

    setPlaybackRate(rate = 1) {
        this.audio.playbackRate = rate;
    }

    mute(state = true) {
        this.audio.muted = state;
    }

    /* -----------------------------
       State
    ------------------------------*/

    getCurrentTime() {
        return this.audio.currentTime;
    }

    getDuration() {
        return this.audio.duration;
    }

    isPlaying() {
        return !this.audio.paused;
    }
//element ends

/// context
    addElementSource(element, id = null) {
        if (!this.context) this.create();
        const sourceId = id || `source-${++this.idCounter}`;
        const source = this.context.createMediaElementSource(element);
        const gain = this.context.createGain();
        source.connect(gain).connect(this.output);

        this.sources[sourceId] = source;
        this.gains[sourceId] = gain;

        this.emit("sourceAdded", { id: sourceId, source, gain });
        return sourceId;
    }

    /* ----------------------------
       Add MediaStreamSource
    -----------------------------*/
    addStreamSource(stream, id = null) {
        if (!this.context) this.create();
        const sourceId = id || `source-${++this.idCounter}`;
        const source = this.context.createMediaStreamSource(stream);
        const gain = this.context.createGain();
        source.connect(gain).connect(this.output);

        this.sources[sourceId] = source;
        this.gains[sourceId] = gain;

        this.emit("sourceAdded", { id: sourceId, source, gain });
        return sourceId;
    }

    /* ----------------------------
       Control Gain
    -----------------------------*/
    setGain(id, value = 1) {
        if (this.gains[id]) this.gains[id].gain.value = value;
    }

    /* ----------------------------
       Remove Source
    -----------------------------*/
    removeSource(id) {
        if (this.sources[id]) {
            this.sources[id].disconnect();
            this.gains[id].disconnect();
            delete this.sources[id];
            delete this.gains[id];
            this.emit("sourceRemoved", id);
        }
    }

    /* ----------------------------
       Close Context
    -----------------------------*/
    finish() {
        if (this.context) {
            this.context.close();
            this.context = null;
            this.sources = {};
            this.gains = {};
            this.output = null;
            this.emit("closed");
        }
    }
//content ends

///worklet
    connect(destination) {
        if (!this.node) return;
        this.node.connect(destination);
    }

    disconnect() {
        if (!this.node) return;
        this.node.disconnect();
    }

    /* ----------------------------
       Send message to processor
    -----------------------------*/
    postMessage(message) {
        if (!this.node) return;
        this.node.port.postMessage(message);
    }
///worklet ends
}