import { mediaWorker } from "JS/TFN/T/Class/Elder/Adult/Teen/tfnation.js";

const mediawk = new mediaWorker();

self.onmessage = (e) => {
    mediawk.MessageReceived(e);
}