import { TfAudioContext } from "./TfAudioContext.js";
import { TfAudioWorkletNode } from "./TfAudioWorkletNode.js";
import { TfAudioElement } from "./TfAudioElement.js";
import { TfAudioMixer } from "./TfAudioMixer.js";
import { TfSpeechRecognition } from "./TfSpeechRecognition.js";
import { TfSpeechSynthesis } from "./TfSpeechSynthesis.js";
import { TfMicrophone } from "./TfMicrophone.js";

export class TfAudio extends TfSounds {

    constructor() {

        /* Core Engine */
        this.contextEngine = new TfAudioContext();
        this.context = null;

        /* Sources */
        this.elements = {};
        this.microphones = {};

        /* Processing */
        this.worklets = {};

        /* Mixer */
        this.mixer = null;

        /* Voice Systems */
        this.recognition = new TfSpeechRecognition();
        this.synthesis = new TfSpeechSynthesis();

        /* Event System */
        this.listeners = {};

        this.idCounter = 0;
    }

    /* -------------------------
       Initialize Audio Engine
    --------------------------*/

    create() {

        this.context = this.contextEngine.create();

        if (!this.mixer)
            this.mixer = new TfAudioMixer(this.context);

        this.emit("ready", this.context);

        return this.context;
    }

    /* -------------------------
       Add Audio Element
    --------------------------*/

    addElement(src, id = null) {

        if (!this.context) this.create();

        const elementId = id || `element-${++this.idCounter}`;

        const element = new TfAudioElement(src, this.context);

        this.elements[elementId] = element;

        element.connect(this.context);

        this.emit("elementAdded", elementId);

        return element;
    }

    /* -------------------------
       Add Microphone
    --------------------------*/

    async addMicrophone(id = null) {

        if (!this.context) this.create();

        const micId = id || `mic-${++this.idCounter}`;

        const mic = new TfMicrophone();

        const stream = await mic.start();

        const sourceId = this.contextEngine.addStreamSource(stream);

        this.microphones[micId] = {
            mic,
            sourceId
        };

        this.emit("microphoneAdded", micId);

        return mic;
    }

    /* -------------------------
       Add Audio Worklet
    --------------------------*/

    async addWorklet(processorUrl, options = {}, id = null) {

        if (!this.context) this.create();

        const workletId = id || `worklet-${++this.idCounter}`;

        const worklet = new TfAudioWorkletNode({
            context: this.context,
            processorUrl,
            options
        });

        await worklet.init();

        worklet.connect(this.context.destination);

        this.worklets[workletId] = worklet;

        this.emit("workletAdded", workletId);

        return worklet;
    }

    /* -------------------------
       Mixer helpers
    --------------------------*/

    async mixerMic(id = null) {

        if (!this.mixer) this.create();

        return await this.mixer.addMic(id);
    }

    mixerElement(element, id = null) {

        if (!this.mixer) this.create();

        return this.mixer.addMediaElement(element.audio, id);
    }

    getMixedStream() {

        if (!this.mixer) return null;

        return this.mixer.getStream();
    }

    /* -------------------------
       Speech Recognition
    --------------------------*/

    startRecognition() {
        this.recognition.start();
    }

    stopRecognition() {
        this.recognition.stop();
    }

    /* -------------------------
       Speech Synthesis
    --------------------------*/

    speak(text, options = {}) {
        this.synthesis.speak(text, options);
    }

    stopSpeaking() {
        this.synthesis.cancel();
    }

    /* -------------------------
       Remove Sources
    --------------------------*/

    removeElement(id) {

        const element = this.elements[id];

        if (!element) return;

        element.destroy();

        delete this.elements[id];

        this.emit("elementRemoved", id);
    }

    removeMicrophone(id) {

        const data = this.microphones[id];

        if (!data) return;

        data.mic.stop();

        this.contextEngine.removeSource(data.sourceId);

        delete this.microphones[id];

        this.emit("microphoneRemoved", id);
    }

    /* -------------------------
       Shutdown
    --------------------------*/

    finish() {

        Object.values(this.elements).forEach(e => e.destroy());

        Object.values(this.microphones).forEach(m => m.mic.stop());

        this.contextEngine.finish();

        this.context = null;

        this.emit("closed");
    }

    /* -------------------------
       Event System
    --------------------------*/

    on(event, fn) {

        if (!this.listeners[event])
            this.listeners[event] = [];

        this.listeners[event].push(fn);
    }

    emit(event, data) {

        (this.listeners[event] || [])
            .forEach(fn => fn(data));
    }

    /* -------------------------
       Status
    --------------------------*/

    toJson() {

        return {
            contextState: this.context?.state || null,
            elements: Object.keys(this.elements),
            microphones: Object.keys(this.microphones),
            worklets: Object.keys(this.worklets),
            speechRecognition: this.recognition.toJson(),
            speechSynthesis: this.synthesis.toJson()
        };
    }
}