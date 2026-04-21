import { mediaWorker } from "./../Class/Elder/Adult/Teen/tfnation.js";
const mediawk = new mediaWorker();

self.onmessage = (e) => {
    mediawk.MessageReceived(e);
}