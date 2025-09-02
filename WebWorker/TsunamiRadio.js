import { TfMusic } from "./../JS/Audio.js";

    let Radio = new TfMusic();
onmessage = async (event) => {
    Radio.messageReceived(event);
}