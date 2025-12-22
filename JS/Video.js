export class TfVideo {
    constructor(Radio = null, VideoElement = null, TfCanvas) {
        //implemented classes
        this.audioEngine = Radio;
        //dom elements
        this.tfVidStuff = VideoElement;
        this.TimingVideo;
        this.UsingTfVidTk;
        this.VideoProcessBar;
        //buttons
        this.VideoSystemControllerButton;
        this.VideoSystemControllerStopButton;
        this.useChromaKeyWebcam;
        this.chromaColorPicker;
        this.useChromaColor;
        this.removeChromaColor;
        this.uploadBackgroundImageBtn;
        this.removeBackgroundImageBtn;
        this.uploadBackgroundVideoBtn;
        this.removeBackgroundVideoBtn;
        //ChromaKey
        this.chromaKeyColorWebcam = {
            r: 0,
            g: 255,
            b: 0
        };
        this.chromaFrame;
        this.chromaData;
        this.Tfhex;
        this.rgb;
        this.frameSkipCount;
        this.frameCounter;
        this.animationId;
        //Image
        this.backgroundImg = null;
        //video
        this.backgroundVideo = null;
        this.VideoCanvas = TfCanvas;
        this.TfVidDrawFrame;
        this.VideoProcessor;
        this.VideoReader;
    }
    VideoNetworkState(element) {
        if (element === null) {
            return;
        }
  // ---- NETWORK STATE ----
        switch (element.networkState) {
            case element.NETWORK_EMPTY:
                console.log("Video network: EMPTY (no source)");
            break;
            case element.NETWORK_IDLE:
                console.log("Video network: IDLE");
            break;
            case element.NETWORK_LOADING:
                console.log("Video network: LOADING");
            break;
            case element.NETWORK_NO_SOURCE:
                console.warn("Video network: NO SOURCE");
            break;
        }
  // ---- READY STATE ----
        switch (element.readyState) {
            case element.HAVE_NOTHING:
                console.log("Video readyState: HAVE_NOTHING");
            break;
            case element.HAVE_METADATA:
                console.log("Video readyState: HAVE_METADATA");
            break;
            case element.HAVE_CURRENT_DATA:
                console.log("Video readyState: HAVE_CURRENT_DATA");
            break;
            case element.HAVE_FUTURE_DATA:
                console.log("Video readyState: HAVE_FUTURE_DATA");
            break;
            case element.HAVE_ENOUGH_DATA:
                console.log("Video readyState: HAVE_ENOUGH_DATA");
            break;
        }
  // ---- PLAYBACK STATE ----
        if (element.ended) {
            console.log("Video playback ended normally");
            return;
        }
        if (element.paused) {
            if (element.currentTime === 0) {
                console.log("Video not started yet");
            } else {
                console.log(`Video paused at ${element.currentTime.toFixed(2)}s`);
            }
            return;
        }
        console.log("Video is playing");
    }
VideoState(element, context) {
  if (!context) {
    console.warn("AudioContext missing");
    return;
  }
  
  if (context.state === "suspended" && !element.paused) {
    context.resume();
    console.log("AudioContext resumed for video");
  }
  
  if (context.state === "running" && element.paused && element.currentTime === 0) {
    console.log("Video idle, AudioContext left running");
  }
}
    emptiedVideo() {
        this.VideoNetworkState();
    }
    loadVideo() {
        this.VideoNetworkState();
    }
    loadedVideoMetadata(element) {
        this.VideoNetworkState(element);
        this.VideoCanvas.width = element.videoWidth;
        this.VideoCanvas.height = element.videoHeight;
    }
    loadedVideoData() {
        this.VideoState();
    }
    canPlayVideo() {
        this.VideoState();
    }
    canPlayVideoThrough() {
        this.VideoState();
    }
    playVideo() {
        this.VideoState();
    }
    pauseVideo() {
        this.VideoState();
    }
    VideoEnded() {
        this.VideoState();
        console.log("The video has ended");
    }
    VideoWaiting() {
        this.VideoState();
    }
    VideoPlaying() {
        this.VideoState();
    }
    VideoStalled() {
        console.log("The video has stalled");
    }
    VideoSuspended() {
        this.VideoNetworkState();
    }
    FormatVideoTime(seconds) {
        let m = Math.floor(seconds / 60); let s = seconds % 60; return `${m}:${s.toString().padStart(2, "0")}`;
    }
    UpdateVideoTime(element) {
        this.TimingVideo = Math.floor(element.currentTime);
        this.UsingTfVidTk = `Time: ${this.FormatVideoTime(this.TimingVideo)}`;
        this.VideoProcessBar = (element.currentTime / element.duration) * 100;
    }
    VideoVolumeChange() {
        console.log("The video volume has changed");
    }
    VideoEventListeners(element, canvas) {
        if (element === null) {
            element = document.createElement("video");
        } 
        element.id = "TsunamiFlowVideoStuff";
        element.controls = true;
        element.autoplay = false;
        element.loop = false;
        element.muted = false;
        element.poster = "";
        element.addEventListener("emptied", async () => {
            console.log("The Tsunami Community Video has been emptied.");

        });

        element.addEventListener("load", async () => {

        });
        
        element.addEventListener("loadstart", async () => {
            console.log("The Tsunami Community Video has started loading.");

        });

        element.addEventListener("loadedmetadata", async (metadata) => {
            console.log("The Tsunami COmmunity Video metadata has started to load.");
        });

        element.addEventListener("loadeddata", async (data) => {
            console.log("The data has loaded");

        }); // The first frame of the mdeia has finished loading.

        element.addEventListener("canplay", async () => {
            console.log("The Tsunami Video Community can play this part.");

            //create canvas for audio and video
        });

        element.addEventListener("canplaythrough", async () => {

        }); //The browser estimates it can play the media up to its ends without stopping for content buffering.

        element.addEventListener("play", () => {
            console.log("The Video should be playing");
            //this.playVideo();
            //Capture processed canvas as MediaStream with button
            this.processedStream = canvas.captureStream(30);
        });

        element.addEventListener("pause", async () => {
            //this.pauseVideo();
        }); //playback has been paused.

        element.addEventListener("ended", async () => {
            console.log("The video should have ended");
            //this.VideoEnded();
        });

        element.addEventListener("waiting", async (waiting) => {
            console.log("The Video should be waiting");
        });

        element.addEventListener("playing", async () => {
            console.log("The video should be playing");
        });

        element.addEventListener("stalled", async (stalled) => {
            console.log(`The Tsunami Community Video has stalled for some reason. ${stalled} <br /> here is the supposed song path: input the real path here later.`);
        });

        element.addEventListener("suspended", async (suspend) => {

        });

        element.addEventListener("timeupdate", () => {
            //function 
        });

        element.addEventListener("volumechange", async () => {

        });
    }
    chromaKey(hex) {
        let trf = 0, tgf = 0, tbf = 0;
        if (hex.length === 4) {
            trf = parseInt(hex[1] + hex[1], 16);
            tgf = parseInt(hex[2] + hex[2], 16);
            tbf = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            trf = parseInt(hex[1] + hex[2], 16);
            tgf = parseInt(hex[3] + hex[4], 16);
            tbf = parseInt(hex[5] + hex[6], 16);
        }
        return { trf, tgf, tbf };
    }
    ColorPickerChromaKey(chroma) {
        this.Tfhex = chroma.target.value;
        this.rgb = parseInt(this.Tfhex.slice(1), 16);
        this.chromaKeyColorWebcam.r = (rgb >> 16) & 255;
        this.chromaKeyColorWebcam.g = (rgb >> 8) & 255;
        this.chromaKeyColorWebcam.b = rgb & 255;
    }
    usePickedColor(useChroma) {
        this.useChromaKeyWebcam = true;
        useChroma.style.display = "inline";
    }
    ApplyTfChromaKey(thing, ctx, canvas_width, canvas_height) {
        if (thing === "webcam") {
            this.chromaFrame = ctx.getImageData(0, 0, canvas_width, canvas_height);
            this.chromaData = this.chromaFrame.data;
            for (let i = 0; i < this.chromaData.length; i += 4) {
                const r = this.chromaData[i];
                const g = this.chromaData[i + 1];
                const b = this.chromaData[i + 2];
                // Check if pixel matches the chroma key color for webcam
                if (r === this.chromaKeyColorWebcam.r && g === this.chromaKeyColorWebcam.g && b === this.chromaKeyColorWebcam.b) {
                    data[i + 3] = 0; // Set alpha to 0
                }
            }
            ctx.putImageData(this.chromaFrame, 0, 0);
        } else if (thing === "canvas") {
            //Apply chromakey after webcam is put on the canvas instead of before.
            this.frameSkipCount = 2;
            this.frameCounter = 0;
            if (this.tfVideoStuff.paused || this.tfVideoStuff.ended) {
                ctx.drawImage(this.tfVideoStuff, 0, 0, canvas_width, canvas_height);
                const imageData = ctx.getImageData(0, 0, canvas_width, canvas_height);
                this.chromaData = imageData.data;
                const chromaColor = this.chromaKey(colorPicker.value);
                for (let i = 0; i < this.chromaData.length; i += 4) {
                    if (this.chromaData[i] === chromaColor.r && data[i + 1] === chromaColor.g && data[i + 2] === chromaColor.b) {
                        this.chromaData[i + 3] = 0; // Set alpha to 0 for transparency
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                this.animationId = requestAnimationFrame( );
            } else {
                ctx.clearRect(0, 0, canvas_width, canvas_height);
                // Draw the uploaded background video or image
                if (backgroundVideo) {
                    ctx.drawImage(backgroundVideo, 0, 0, canvas_width, canvas_height);
                } else if (backgroundImage) {
                    ctx.drawImage(backgroundImage, 0, 0, canvas_width, canvas_height);
                }
                // Draw the webcam feed if it's active
                if (isPlaying) {
                    ctx.drawImage(video, 0, 0, canvas_width, canvas_height);
                }
                // Apply chroma key for webcam, video, and image based on flags
                if (this.frameCounter % this.frameSkipCount === 0) {
                    if (useChromaKeyWebcam) applyChromaKeyWebcam();
                }
                this.frameCounter++;
                // Continue the animation loop
                this.animationId = requestAnimationFrame( );
            }
        } else if (thing === "video") {
            //current code below is drawing the video to the canvas, and then getting the pixel data, and then turning it into GreenScreen or aka manipulating it.
            //Draw the video directly to canvas.
            ctx.drawImage(this.tfVideoStuff, 0, 0, canvas_width, canvas_height);
            //Get pixel data.
            this.TfVidDrawFrame = ctx.getImageData(0, 0, canvas_width, canvas_height);
            //mainpulate pixel
            ctx.putImageData(this.TfVidDrawFrame, 0, 0);
            this.animationId = requestAnimationFrame( );
        } else {
            //nothing 
        }
    }
    RemoveChromaKeyColor(ctx, canvas_width, canvas_height) {
        ctx.clearRect(0, 0, canvas_width, canvas_height);
        this.frameCounter = 0
        this.useChromaKeyWebcam = false;
    }
    UploadImage(e) {
        const file = e.target.files[0];
        if (file) {
            this.backgroundImg = new Image();
            this.backgroundImg.src = URL.createObjectURL(file);
            //TframeStBtn.style.display = 'inline'; // Show start button
            //TframeByeImg.style.display = 'inline'; // Show remove image button
        }
    }
    RemoveImage(ctx, canvas_width, canvas_height) {
        this.backgroundImg = null;
        ctx.clearRect(0, 0, canvas_width, canvas_height);
        //TframeStBtn.style.display = 'none'; // Hide start button
        //TframeByeImg.style.display = 'none'; // Hide remove button
    }
    UploadVideo(e) {
        const file = e.target.files[0];
        if (file) {
            this.backgroundVideo = document.createElement('video');
            this.backgroundVideo.src = URL.createObjectURL(file);
            this.backgroundVideo.muted = true; // Mute the video
            this.backgroundVideo.loop = true; // Loop the video
            this.backgroundVideo.load(); // Load the video
            //TframeStBtn.style.display = 'inline'; // Show start button
            //TframeByeVid.style.display = 'inline'; // Show remove video button
        }
    }
    RemoveVideo(ctx, canvas_height, canvas_width) {
        console.log("Placeholder for remove video");
        if (this.backgroundVideo) {
            this.backgroundVideo.pause();
            this.backgroundVideo.currentTime = 0; // Reset the video to the beginning
            this.backgroundVideo = null; // Clear the video reference
            ctx.clearRect(0, 0, canvas_width, canvas_height); // Clear the canvas
        }
        //TframeStBtn.style.display = 'none'; // Hide start button
        //TframeByeVid.style.display = 'none'; // Hide remove button
    }
    VideoButtonsEventListeners(element, startSystem, stopSystem, uploadImg, removeImg, startWebcam, cameraControl, stopWebcam, chromaColor, useChroma, removeChroma, uploadImg, removeImg, uploadVid, removeVid, startRec, stopRec, downloadRec) {
        console.log("placeholder for main");
        if (startSystem === null) {
            startSystem = document.createElement("button");
        }
        startSystem.id = "TfControlShit";
        if (stopSystem === null) {
            stopSystem = document.createElement("button");
        }
        stopSystem.id = "TfControlStopStart";
        
        if (uploadImg === null) {
            uploadImg = document.createElement("button");
        }
        uploadImg.id = "TfUploadImages";
        
        if (removeImg === null) {
           removeImg = createElement("button"); 
        }
        removeImg.id = "rmvTFimg";
        
        if (element === null) {
            element = document.createElement("video");   
        }
        element.id = "TsunamiFlowVideoStuff";
        element.controls = true;
        element.autoplay = false;
        element.loop = false;
        element.muted = false;
        element.poster = "";
        //Webcam
        
        if (startWebcam === null) {
            startWebcam = document.createElement("button");  
        }
        startWebcam.id = "Start Webcam";
        
        if (cameraControl === null) {
            //create camera control flip buttom
        }
        
        cameraControl.addEventListener('click', () => {
            this.whichCamera = !whichCamera; 
        });
        
        if (stopWebcam) {
            stopWebcam = document.createElement("button");  
        }
        stopWebcam.id = "TfStopShit";
        
        chromaColor.addEventListener('input', (e) => {this.ColorPickerChromaKey(e);}); 
        useChroma.addEventListener('click', () => {this.ApplyTfChromaKey();});
        removeChroma.addEventListener('click', () => {
            this.RemoveChromaKeyColor();
        });
        
        if (uploadImg === null) {
            //create upload img button
        }
        uploadImg.addEventListener('change', (e) => {
            this.UploadImage();
        });

        if (removeImg === null) {
            // create remove kmg button
        }
        removeImg.addEventListener('click', () => {
            this.removeImage();
        });
        
        if (uploadVid === null) {
            
        }
        uploadVid.addEventListener('change', (e) => {this.UploadVideo();});
    
        if (removeVid === null) {
            // create remove vid button
        }
        removeVid.addEventListener('click', () => {
            this.removeVideo();
        });
        
        if (startRec === null) {
           //Create Record Button 
        }
        startRec.addEventListener('click', () => {
            //Start Recording
        });

        if (stopRec === null) {
          //Create Stop Recording
        }
        stopRec.addEventListener('click', () => {
            //Stop Recording
        }); 
        
        if (downloadRec === null) {
            // create download recording button
        }
        downloadRec.addEventListener('click', () => {
            // downloading recording
        });
    }
    VideoSystemStart(element, stream, isPlaying) {
        if (isPlaying) {
            isPlaying = false;
            cancelAnimationFrame(this.animationId);
            element.pause();
            if (this.backgroundVideo) {
                this.backgroundVideo.pause();
            }
        } else {
            isPlaying = true;
            if (stream) {
                element.play();
            }

            if (this.backgroundVideo) {
                this.backgroundVideo.play();
            }
            // start combined method here 
        }
    }
    VideoSystemStop(stopSystem, element, stream, ctx, canvas_height, canvas_width) {
        //cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, canvas_width, canvas_height);
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            element.srcObject = null;
            stream = null;
        }
        stopSystem.style.display = "none";
    }
    VideoWebCodecs(stream) {
        this.VideoProcessor = new MediaStreamTrackProcess({
            track: stream.getVideoTracks()[0]
        });
        this.VideoReader = this.VideoProcessor.readable.getReader();
    }
    LetsBegin() {
        //videoElement.srcObject = stream;
        this.VideoEventListeners(videoElement);
        this.VideoButtonsEventListeners();
    }
}