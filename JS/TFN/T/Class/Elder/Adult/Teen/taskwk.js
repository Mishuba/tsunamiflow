export class TaskWorker {
    workers = null;
    TimerLoop = null;
    TimerTrigger = new Set();
    constructor(options = {}) {
        if (options.workers) {
            this.workers = options.workers;

        }
        const now = new Date();

        const hour = now.getHours();
        const minute = now.getMinutes();

        const key = `${hour}:${minute}`;

        if (minute % 5 === 0 && !this.TimerTrigger.has(key)) {
            this.TimerTrigger.add(key);

            // trigger
        }
    }

    createSafeWorker(modulePath, classicPath, shared = false) {
        try {
            if (shared === false) {
                let ihj = new Worker(
                    new URL(modulePath, import.meta.url),
                    { type: "module" }
                );
                console.log("worker " + new URL(modulePath, import.meta.url) + " created.");
                return ihj;
            } else {
                let ihj = new SharedWorker(
                    new URL(modulePath, import.meta.url),
                    { type: "module" }
                );
                console.log("worker " + new URL(modulePath, import.meta.url) + " created.");
                return ihj;
            }
        } catch (err) {
            console.warn("Module worker failed. Falling back:", err);
            if (shared === false) {
                return new Worker(classicPath);
            } else {
                return new SharedWorker(classicPath);
            }
        }
    }

    async OnMainMessage(e) {

    };
    async OnWorkerMessage(e) {

    }
} 