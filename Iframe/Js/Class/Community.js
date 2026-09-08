document.addEventListener("DOMContentLoaded", async () => {
    console.log("irame dom loaded");
    const controller = window.parent.ControlMishuba;
    controller.videoEngine.videoElement = controller.find("TsunamiFlowVideoStuff", controller.iframe.frame);
    controller.VideoCanvas = controller.find("TFcanvas", controller.iframe.frame);
    controller.VideoOffscreenCanvas = controller.VideoCanvas.transferControlToOffscreen();
    controller.worker.postMessage(
        controller.videoEngine.tycadome(
            "tycadome-guest" + Date.now(),
            "canvas",
            "load.video.canvas",
            {
                source: "web",
                target: "device:web-001",
                worker: "video"
            },
            {
                status: "pending",
                priority: "low"
            },
            "async",
            {
                system: "loading",
                canvas: controller.VideoOffscreenCanvas,
            },
            [
                controller.VideoOffscreenCanvas
            ]
        ),
        [controller.VideoOffscreenCanvas]);

    controller.bindVidSystem();
});