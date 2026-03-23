export class Tsunami extends NaMi {
    worker = null;
    constructor (){

    }
        start() {
            if (!this.scriptURL) return;
            this.worker = new Worker(this.scriptURL);
    
            this.worker.onmessage = (event) => this.emit("message", event.data);
            this.worker.onerror = (err) => this.emit("error", err);
            console.log("Web Worker started");
        }
    
        postMessage(data) {
            if (!this.worker) return;
            this.worker.postMessage(data);
        }
    
        terminate() {
            if (!this.worker) return;
            this.worker.terminate();
            this.worker = null;
            console.log("Web Worker terminated");
        }
}