
let offscreenctx = null;
let backgroundImg = null;


function UseImage(canvas, corner = false) {
    //this.initOffscreen();
    //this.resizeoffscreen(canvas.width, canvas.height);
    if (corner) {
        const logoW = canvas.width / 4;
        const logoH = canvas.height / 4;
        offscreenctx.drawImage(backgroundImg, canvas.width - logoW - 10, 10, logoW, logoH);
    } else {
        offscreenctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    }
}


self.onerror = async (e) => {
    try {
        const err = e?.error || e;
        self.postMessage(tycadome(
            "tycadome-guest" /*+ Date.now()*/,
            "error",
            "image.worker.error",
            {
                source: "web",
                target: "device:web-001",
                layer: "tf",
                worker: "image"
            },
            {
                status: "pending",
                priority: "low"
            },
            "async",
            {
                system: "Image Worker",
                message: err?.message || String(err),
                filename: err?.fileName || null,
                lineno: err?.lineNumber || null,
                colno: err?.columnNumber || null,
                stack: err?.stack || null,
                rawEvent: e
            }));

    } catch (postErr) {
        console.error("Worker onerror failed to post:", postErr);
        console.trace();
    }
    console.error("Worker error:", e);
    console.trace();
};