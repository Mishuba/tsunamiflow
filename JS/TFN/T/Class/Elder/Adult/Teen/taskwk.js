export class TaskWorker {
    workers = null;
    TimerLoop = null;
    TimerTrigger = new Set();
    TimerTimes = ["00:00", "00:05", "00:10", "00:15", "00:20", "00:30", "00:40", "00:45", "00:50", "01:00", "01:05", "01:10", "01:15", "01:20", "01:30", "01:40", "01:45", "01:50", "02:00", "02:05", "02:10", "02:15", "02:20", "02:30", "02:40", "02:45", "02:50", "03:00", "03:05", "03:10", "03:15", "03:20", "03:30", "03:40", "03:45", "03:50", "04:00", "04:05", "04:10", "04:15", "04:20", "04:30", "04:40", "04:45", "04:50", "05:00", "05:05", "05:10", "05:15", "05:20", "05:30", "05:40", "05:45", "05:50", "06:00", "06:05", "06:10", "06:15", "06:20", "06:30", "06:40", "06:45", "06:50", "07:00", "07:05", "07:10", "07:15", "07:20", "07:30", "07:40", "07:45", "07:50", "08:00", "08:05", "08:10", "08:15", "08:20", "08:30", "08:40", "08:45", "08:50", "09:00", "09:05", "09:10", "09:15", "09:20", "09:30", "09:40", "09:45", "09:50", "10:00", "10:05", "10:10", "10:15", "10:20", "10:30", "10:40", "10:45", "10:50", "11:00", "11:05", "11:10", "11:15", "11:20", "11:30", "11:40", "11:45", "11:50", "12:00", "12:05", "12:10", "12:15", "12:20", "12:30", "12:40", "12:45", "12:50", "13:00", "13:05", "13:10", "13:15", "13:20", "13:30", "13:40", "13:45", "13:50", "14:00", "14:05", "14:10", "14:15", "14:20", "14:30", "14:40", "14:45", "14:50", "15:00", "15:05", "15:10", "15:15", "15:20", "15:30", "15:40", "15:45", "15:50", "16:00", "16:05", "16:10", "16:15", "16:20", "16:30", "16:40", "16:45", "16:50", "17:00", "17:05", "17:10", "17:15", "17:20", "17:30", "17:40", "17:45", "17:50", "18:00", "18:05", "18:10", "18:15", "18:20", "18:30", "18:40", "18:45", "18:50", "19:00", "19:05", "19:10", "19:15", "19:20", "19:30", "19:40", "19:45", "19:50", "20:00", "20:05", "20:10", "20:15", "20:20", "20:30", "20:40", "20:45", "20:50", "21:00", "21:05", "21:10", "21:15", "21:20", "21:30", "21:40", "21:45", "21:50", "22:00", "22:05", "22:10", "22:15", "22:20", "22:30", "22:40", "22:45", "22:50", "23:00", "23:05", "23:10", "23:15", "23:20", "23:30", "23:40", "23:45", "23:50",];
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
                    worker: "task"
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
                if (event.data.type === "timer") {
                    if (event.data.payload.system === "Tf Schedule") {
                        if (!this.TimerLoop) {
                            this.startTime();
                        }
                    }
                }

                break;
            default:
                this.workers[target].postMessage(
                    tycadome(
                        task.id,
                        task.type,
                        task.action,
                        task.meta,
                        {
                            status: "processing",
                            priority: "low"
                        },
                        task.mode || "async",
                        task.payload || {}
                    )
                );
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
                    worker: worker
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
}