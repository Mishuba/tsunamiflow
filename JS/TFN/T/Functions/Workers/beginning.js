export function createSafeWorker(modulePath, classicPath, shared = false) {
    try {
        var ihj
        if (shared === false) {
            if (window.Worker) {
                ihj = new Worker(
                    new URL(modulePath, import.meta.url),
                    { type: "module" });
                console.log("worker " + new URL(modulePath, import.meta.url) + " created.");
            } else {

            }
        } else {
            let ihj = new SharedWorker(
                new URL(modulePath, import.meta.url),
                { type: "module" }
            );
            console.log("worker " + new URL(modulePath, import.meta.url) + " created.");
        }
    } catch (err) {
        console.warn("Module worker failed. Falling back:", err);
        if (shared === false) {
            if (window.Worker) {
                ihj = new Worker(classicPath);
            } else {

            }
        } else {
            if (window.SharedWorker) {
                ihj = new SharedWorker(classicPath);
            } else {

            }
        }
    } finally {
        return ihj;
    }
}