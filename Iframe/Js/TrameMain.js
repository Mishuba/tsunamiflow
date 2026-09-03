/*
class tRame {

    constructor() {

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

self.onmessage = async (event) => {
    me.ReceiveMessage(event)
}
*/
