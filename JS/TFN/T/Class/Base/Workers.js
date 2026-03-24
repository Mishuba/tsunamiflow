export class Tsunami extends NaMi {
    worker = null;
<<<<<<< HEAD
   constructor (){
=======
    workerscriptURL = scriptURL;
    constructor (){
>>>>>>> fbeeb153ede79dd43b05a0382942a7b5849c54fd

    }
        startworkers() {
            if (!this.workerscriptURL) return;
            this.worker = new Worker(this.workerscriptURL);
    
            this.worker.onmessage = (event) => this.emit("message", event.data);
            this.worker.onerror = (err) => this.emit("error", err);
            console.log("Web Worker started");
        }
    
        postworkerMessage(data) {
            if (!this.worker) return;
            this.worker.postMessage(data);
        }
    
        terminateworker() {
            if (!this.worker) return;
            this.worker.terminate();
            this.worker = null;
            console.log("Web Worker terminated");
        }
}