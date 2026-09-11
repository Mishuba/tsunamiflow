export class TfPictureInPicture {

    constructor({
        videoElement = null,
        autoBindEvents = true
    } = {}) {

        this.videoElement = videoElement;
        this.supported = !!document.pictureInPictureEnabled;

        this.pipWindow = null;

        this.listeners = {};

        if (!this.supported) {
            console.warn("Picture-in-Picture API not supported");
        }

        if (videoElement && autoBindEvents) {
            this._bindEvents(videoElement);
        }
    }

    /* ----------------------------
       Bind Video Events
    ---------------------------- */

    _bindEvents(video) {

        video.addEventListener("enterpictureinpicture", (event) => {

            this.pipWindow = event.pictureInPictureWindow;

            this.emit("enter", this.pipWindow);

            if (this.pipWindow) {

                this.pipWindow.addEventListener("resize", () => {

                    this.emit("resize", {
                        width: this.pipWindow.width,
                        height: this.pipWindow.height
                    });

                });
            }

        });

        video.addEventListener("leavepictureinpicture", () => {

            this.pipWindow = null;

            this.emit("exit");

        });
    }

    /* ----------------------------
       Attach Video Element
    ---------------------------- */

    attach(videoElement) {

        this.videoElement = videoElement;

        this._bindEvents(videoElement);
    }

    /* ----------------------------
       Enter PiP
    ---------------------------- */

    async enter(video = this.videoElement) {

        if (!this.supported) return;
        if (!video) throw new Error("No video element attached");

        try {

            const pip = await video.requestPictureInPicture();

            this.pipWindow = pip;

            return pip;

        } catch (err) {

            console.error("PiP enter failed:", err);

            this.emit("error", err);
        }
    }

    /* ----------------------------
       Exit PiP
    ---------------------------- */

    async exit() {

        try {

            if (document.pictureInPictureElement) {

                await document.exitPictureInPicture();

                this.pipWindow = null;
            }

        } catch (err) {

            console.error("PiP exit failed:", err);

            this.emit("error", err);
        }
    }

    /* ----------------------------
       Toggle PiP
    ---------------------------- */

    async toggle(video = this.videoElement) {

        if (this.isActive()) {
            await this.exit();
        } else {
            await this.enter(video);
        }
    }

    /* ----------------------------
       State Helpers
    ---------------------------- */

    isActive() {

        return !!document.pictureInPictureElement;
    }

    getWindow() {

        return this.pipWindow;
    }

    /* ----------------------------
       Event System
    ---------------------------- */

    on(event, fn) {

        if (!this.listeners[event])
            this.listeners[event] = [];

        this.listeners[event].push(fn);
    }

    emit(event, data) {

        (this.listeners[event] || [])
            .forEach(fn => fn(data));
    }

    /* ----------------------------
       Debug
    ---------------------------- */

    toJson() {

        return {

            supported: this.supported,
            active: this.isActive(),
            width: this.pipWindow?.width || null,
            height: this.pipWindow?.height || null

        };
    }

}