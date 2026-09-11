// Import all the core modules
import { TfOffThreadCompute } from './TfOffThreadCompute.js';
import { TfAudio } from './TfAudio.js';
import { TsunamiNavigator } from './TsunamiNavigator.js';
import { TsunamiWorldNetworks } from './TsunamiWorldNetworks.js';
import { TfSecurity } from './TfSecurity.js';
import { TFStorageHub } from './TFStorageHub.js';
import { TfUinput } from './TfUinput.js';
import { TfVideo } from './TfVideo.js';
import { TsunamiWindow } from './TsunamiWindow.js';

export class F {
    constructor(options = {}) {
        // ===== Compute / Workers =====
        this.compute = new TfOffThreadCompute(options.compute || {});

        // ===== Audio =====
        this.audio = new TfAudio();

        // ===== Video / Camera / Stream =====
        this.video = new TfVideo(options.video || {});

        // ===== Networks =====
        this.networks = new TsunamiWorldNetworks(options.networks || {});

        // ===== Navigation / Device Info / ML =====
        this.navigator = new TsunamiNavigator();

        // ===== Security / Permissions / WebAuthn =====
        this.security = new TfSecurity();

        // ===== Storage =====
        this.storage = new TFStorageHub(options.storage || {});

        // ===== User Input =====
        this.uinput = new TfUinput(options.uinput || {});

        // ===== Window / Graphics / Canvas Performance =====
        this.window = options.windowCanvas ? new TsunamiWindow(options.windowCanvas, options.windowOptions || {}) : null;

        // ===== Event System =====
        this.listeners = {};
    }

    /* ------------------------
       Unified Event System
    ------------------------ */
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        (this.listeners[event] || []).forEach(cb => cb(data));
    }

    /* ------------------------
       Utility / Status
    ------------------------ */
    isReady() {
        return {
            compute: this.compute.isReady(),
            audio: !!this.audio.context,
            video: !!this.video.stream,
            networks: this.networks.isReady(),
            navigator: !!this.navigator,
            security: this.security.isReady(),
            storage: !!this.storage,
            uinput: !!this.uinput,
            window: !!this.window
        };
    }

    toJson() {
        return {
            compute: this.compute,
            audio: this.audio.toJson(),
            video: this.video.toJson(),
            networks: this.networks,
            navigator: this.navigator.capabilities,
            security: this.security.isReady(),
            storage: this.storage,
            uinput: this.uinput.toJson(),
            window: this.window ? { graphics: this.window.graphics.toJson() } : null
        };
    }
}