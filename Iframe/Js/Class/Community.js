document.addEventListener("DOMContentLoaded", async () => {
    console.log("irame dom loaded");
    const controller = window.parent.ControlMishuba;
    controller.bindVidSystem();
});