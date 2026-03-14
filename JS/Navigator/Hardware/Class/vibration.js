export class TfVibration {
    constructor() {
        this.supported = !!navigator.vibrate;
    }

    vibrate(pattern = 200) {
        if (!this.supported) return;
        navigator.vibrate(pattern);
    }

    cancel() {
        if (!this.supported) return;
        navigator.vibrate(0);
    }
}