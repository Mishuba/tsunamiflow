export TsunamiFlowRadio extends TsunamiFlowNation {

      constructor(options = {}) {

      }
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
}