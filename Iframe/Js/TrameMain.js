export class homepage {
    TFpostMessageLinks = "https://tsunamiflow.club"; //
    wwwLink = "https://www.tsunamiflow.club";

    TFpostActualObject = null;
    messageOrigin = null;
    messageSource = null;
    constructor() {

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
                return console.log(`Some outside source is trying to send a message.`);
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
const me = new homepage();

document.addEventListener("DOMContentLoaded", async (ev) => {
    self.onmessage = async (event) => {
        me.ReceiveMessage(event);
    };

    self.onerror = async (error) => {
        console.error(error);
    }

})
