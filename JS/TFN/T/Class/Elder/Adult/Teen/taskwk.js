export class TaskWorker {
    workers = null;
    TimerLoop = null;
    TimerTrigger = new Set();
    constructor(options = {}) {
        if (options.workers) {
            this.workers = options.workers;

        } else {
            this.workers = {
                input: new Worker(
                    new URL("./kid/GameInputWebWorker.js", import.meta.url),
                    { type: "module" }
                ),
                media: new Worker(
                    new URL("./kid/MediaWebWorker.js", import.meta.url),
                    { type: "module" }
                ),
                world: new Worker(
                    new URL("./kid/GameWorldWebWorker.js", import.meta.url),
                    { type: "module" }
                ),
                ai: new Worker(
                    new URL("./kid/AiWebWorker.js", import.meta.url),
                    { type: "module" }
                )
            };
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
    async startTime() {
        let TheTimeIGuess = new Promise((resolve) => {
            let currentTime = new Date();
            let TsunamiTimes = currentTime.toTimeString().slice(0, 5);// "HH:MM";

            if (this.TimerLoop === null) {
                this.TimerLoop = setInterval(() => {
                    currentTime = new Date();
                    TsunamiTimes = currentTime.toTimeString().slice(0, 5);
                }, 1000);
            } else {
                TsunamiTimes = currentTime.toTimeString().slice(0, 5);
            }
            resolve(TsunamiTimes);
        });

        let TheRealTime = await TheTimeIGuess;

        if (this.TimerTimes.includes(TheRealTime) && !this.TimerTrigger.has(TheRealTime)) {
            this.TimerTrigger.add(TheRealTime);
            console.log(`Triggering event for ${TheRealTime}`);


            let tf = this.tycadome(
                "tycadome-guest" /*+ Date.now()*/,
                "timer",
                "scheduled.timer",
                {
                    source: "web",
                    target: "device:web-001",
                    layer: "tf",
                    worker: "task",
                    backend: false
                },
                {
                    status: "pending",
                    priority: "low"
                },
                "async",
                {
                    system: "Tf Schedule",
                    time: TheRealTime,
                });
            self.postMessage(tf);
        } else {
            let tf = this.tycadome(
                "tycadome-guest" /*+ Date.now()*/,
                "timer",
                "scheduled.timer",
                {
                    source: "web",
                    target: "device:web-001",
                    layer: "tf",
                    worker: "task",
                    backend: false
                },
                {
                    status: "pending",
                    priority: "low"
                },
                "async",
                {
                    system: "Tf Schedule",
                    time: TheRealTime,
                });
            self.postMessage(tf);
        }

        if (TheRealTime === "23:59") {
            this.TimerTrigger.clear();
        }
    }
    async OnMainMessage(e) {
        const task = e.data;
        const target = task.meta?.worker;

        /*
        ----------------------------------------------------------------------
        Validate routing target
        ----------------------------------------------------------------------
        */

        if (!target || !this.workers[target]) {
            self.postMessage(
                tycadome(
                    task.id || crypto.randomUUID(),
                    "system",
                    "routing.error",
                    {
                        reason: "Invalid or missing meta.worker",
                        received: target
                    },
                    {
                        status: "failed",
                        priority: "low"
                    },
                    "async",
                    task
                )
            );
            return;
        }

        /*
        ----------------------------------------------------------------------
        Forward task to compute worker
        ----------------------------------------------------------------------
        */

        switch (target) {
            case "task":
                if (task.type === "timer") {
                    if (event.data.payload.system === "Tf Schedule") {
                        if (!this.TimerLoop) {
                            this.startTime();
                        }
                    }
                }

                break;
            default:
                this.workers[target].postMessage(task, task.transfer || []);
                break;
        }
    };
    async OnWorkerMessage(e) {
        self.postMessage(
            tycadome(
                e.data.id || crypto.randomUUID(),
                e.data.type || name,
                e.data.action || "completed",
                {
                    source: name,
                    layer: "compute",
                    worker: name
                },
                {
                    status: "pending",
                    priority: "low"
                },
                "async",
                e.data.payload || e.data
            )
        );
    }
    safeStringify(obj) {
        try {
            return JSON.stringify(obj);
        } catch (e) {
            try {
                return String(obj);
            } catch (e2) {
                return null;
            }
        }
    }
} 