export class ScreenShare {
    constructor(videoElement = null) {
        this.video = videoElement; // The <video> element to show the screen
        this.stream = null;        // MediaStream of the screen
    }

    // Start screen sharing
    async start() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
            throw new Error("Screen sharing is not supported in this browser.");
        }

        try {
            // Request screen media
            this.stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    cursor: "always" // Options: 'always', 'motion', 'never'
                },
                audio: false // Set to true if you want to share system audio
            });

            // Attach to video element
            if (this.video) {
                this.video.srcObject = this.stream;
                this.video.play();
            }

            // Handle when user stops sharing from browser UI
            this.stream.getVideoTracks()[0].addEventListener("ended", () => {
                this.stop();
            });

            return this.stream;
        } catch (err) {
            console.error("Failed to start screen share:", err);
            throw err;
        }
    }

    // Stop screen sharing
    stop() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.video) {
            this.video.srcObject = null;
        }
    }

    // Optional: Return current stream
    getStream() {
        return this.stream;
    }
}