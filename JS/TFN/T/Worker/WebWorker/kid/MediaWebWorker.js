import { mediaWorker } from "./../Class/Elder/Adult/Teen/tfnation.js";
let mediawk = new mediaWorker();

self.onmessage = (e) {
    mediawk.MessageReceived(e);
}