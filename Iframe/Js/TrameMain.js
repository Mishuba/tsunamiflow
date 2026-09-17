export class homepage {
    TFpostMessageLinks = "https://tsunamiflow.club"; //
    wwwLink = "https://www.tsunamiflow.club";

    TFpostActualObject = null;
    messageOrigin = null;
    messageSource = null;
    game = null;
    homepageCanvas = null;
    constructor(options = {}) {
        if (options.homepageCanvas) {
            this.homepageCanvas = options.homepageCanvas;
        }
    }
    WindowResponseType(event) {
        switch (event.data.type) {
            case "start_updates":
                const game = letsDoIt.from(ev.data.info);
                game.start();
                break;
        }
    }
    StripeWindowResponse(event) {

    }
    onWindowMessage(event) {
        this.messageSource = event.source;
        this.messageOrigin = event.origin;
        switch (this.messageOrigin) {
            case this.TFpostMessageLinks:
            case this.wwwLink:
                WindowResponseType(event);
                break;
            case this.StripeOrigin:
                StripeWindowResponse(event);
                break;
            default:
                console.log(`Some outside source is trying to send a message.`);
                console.warn(event.data);
                break;
        }
    }
    DomLoad() {
        window.onmessage = async (event) => {

        }
    }
    ReceiveMessage(event) {
        console.log("Received message from main thread");

        switch (event.type) {
            case "community":
                switch (event.action) {
                    case "Video.System":
                        console.log("The community video system is being called");
                        switch (event.payload.system) {
                            case "webcam.start":

                                break;
                            case "webcam.stop":

                                break;

                            case "image.background":

                                break;

                            case "image.background.remove":

                                break;
                            case "video.background":

                                break;
                            case "video.background.remove":

                                break;

                            case "video.user":

                                break;
                            case "video.user.remove":

                                break;

                            default:

                                break;
                        }

                        break;
                }
                break;
        }
    }
}


document.addEventListener("DOMContentLoaded", async (ev) => {
    self.onmessage = async (event) => {
        me.ReceiveMessage(event);
    };

    self.onerror = async (error) => {
        console.error(error);
    }

    const me = new homepage();

    const homepageCanvas = document.getElementById("homecanvas");
    const ok = homepageCanvas.transferControlToOffscreen();
    window.parent.ControlMishuba.worker.postMessage(window.parent.ControlMishuba.soundEngine.tycadome(
        "tycadome-guest" + Date.now(),
        "canvas",
        "load.game.world.canvas",
        {
            source: "web",
            target: "device:web-001",
            worker: "world"
        },
        {
            status: "pending",
            priority: "low"
        },
        "async",
        {
            system: "homepage",
            canvas: ok,
            ai: window.parent.ControlMishuba.stickman
        },
        [
            ok
        ]
    ),
        [ok]);
});
