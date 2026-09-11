self.onmessage = (event) => {
    const message = event.data;

    if (message.type === "transform") {
        // Here you would implement media manipulation logic
        const canvas = document.getElementById('videoCanvas');
        const context = canvas.getContext('2d');
        const TFselfVideoWrtc = document.getElementById("local_video");
        const TFremoteVideoWrtc = document.getElementById("received_video");

        function drawVideosOnCanvas() {
            // Draw the local video in the top-left corner
            context.drawImage(TFselfVideoWrtc, 0, 0, canvas.width / 2, canvas.height / 2);

            // Draw the remote video in the top-right corner
            context.drawImage(TFremoteVideoWrtc, canvas.width / 2, 0, canvas.width / 2, canvas.height / 2);
        }

        function onTrackReceived(event) {
            // This will execute when a new media track is received from the remote peer
            if (event.streams && event.streams[0]) {
                // Set the remote stream to the remote video element
                TFremoteVideoWrtc.srcObject = event.streams[0];

                // Continuously draw videos on the canvas
                setInterval(drawVideosOnCanvas, 30);  // Redraw every 30ms to keep the canvas updated
            }
        }

        TFpcWrtc.ontrack = onTrackReceived;

        // For example, if you're dealing with video, you can process the video stream using WebGL, Canvas, etc.
        console.log("Received transform message:", message);

        // In a real-world scenario, you would manipulate the media track here.

        // This could involve encoding, scaling, etc.

        // Post a message back to the main thread (WebRTC) when transformation is done.
        self.postMessage({
            type: "transformed",
            track: message.track, // For example, send back the modified track
        });
    }
};
