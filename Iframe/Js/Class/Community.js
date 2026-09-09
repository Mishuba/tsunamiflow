const controller = window.parent.ControlMishuba;
document.addEventListener("DOMContentLoaded", async () => {
    console.log("Iframe dom loaded");
    const VideoCanvas = document.getElementById("TFcanvas");
    const VideoOffscreenCanvas = VideoCanvas.transferControlToOffscreen();
    try {
        window.parent.ControlMishuba.worker.postMessage(
            window.parent.ControlMishuba.audioEngine.tycadome(
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
                    canvas: VideoOffscreenCanvas,
                },
                [
                    VideoOffscreenCanvas
                ]
            ),
            [VideoOffscreenCanvas]);
        controller.videoEngine.videoElement = document.getElementById("TsunamiFlowVideoStuff");
    } catch (err) {

    } finally {
        controller.bindVidSystem();
    }
    self.onmessage = async (event) => {

    }
    self.onmessageerror = (err) => {
        console.error("Error handling message in Community.js:", err);
    };
    self.onerror = (err) => {
        console.error("Error in Community.js:", err);
    }
});