export class TfVideo {
    constructor(Socket = null, Radio = null, VideoElement = null, TfCanvas = null) {
        //implemented classes
        this.VideoSocket = Socket;
        this.audioEngine = Radio;
        //dom elements
        this.tfVidStuff = VideoElement;
        this.TimingVideo;
        this.UsingTfVidTk;
        this.VideoProcessBar;
        //buttons
        this.VideoSystemControllerButton;
        this.VideoSystemControllerStopButton;
        this.useChromaKeyWebcam = false;
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
        this.frameSkipCount = 2;
        this.frameCounter = 0;
        this.animationId;
        //Image
        this.backgroundImg = null;
        //video
        this.backgroundVideo = null;
        this.VideoCanvas = TfCanvas;
        this.TfVidDrawFrame;
        this.VideoProcessor;
        this.VideoReader;
        this.isPlaying = false;
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
    emptiedVideo(element) {
        this.VideoNetworkState(element);
    }
    loadVideo(element) {
        this.VideoNetworkState(element);
    }
    loadedVideoMetadata(element) {
        this.VideoNetworkState(element);
        this.VideoCanvas.width = element.videoWidth;
        this.VideoCanvas.height = element.videoHeight;
    }
    loadedVideoData(element, context) {
        this.VideoState(element, context);
    }
    canPlayVideo(element, context) {
        this.VideoState(element, context);
    }
    canPlayVideoThrough(element, context) {
        this.VideoState(element, context);
    }
    playVideo(element, context) {
        this.VideoState(element, context);
    }
    pauseVideo(element, context) {
        this.VideoState(element, context);
    }
    VideoEnded(element, context) {
        this.VideoState(element, context);
        console.log("The video has ended");
    }
    VideoWaiting(element, context) {
        this.VideoState(element, context);
    }
    VideoPlaying(element, context) {
        this.VideoState(element, context);
    }
    VideoStalled() {
        console.log("The video has stalled");
    }
    VideoSuspended(element) {
        this.VideoNetworkState(element);
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
        this.chromaKeyColorWebcam.r = (this.rgb >> 16) & 255;
        this.chromaKeyColorWebcam.g = (this.rgb >> 8) & 255;
        this.chromaKeyColorWebcam.b = this.rgb & 255;
    }
    usePickedColor(useChroma) {
        this.useChromaKeyWebcam = true;
        useChroma.style.display = "inline";
    }
    
    ApplyTfChromaKey(thing, ctx, canvas_width, canvas_height, stream) {
        if (thing === "webcam") {
            this.chromaFrame = ctx.getImageData(0, 0, canvas_width, canvas_height);
            this.chromaData = this.chromaFrame.data;
            for (let i = 0; i < this.chromaData.length; i += 4) {
                const r = this.chromaData[i];
                const g = this.chromaData[i + 1];
                const b = this.chromaData[i + 2];
                // Check if pixel matches the chroma key color for webcam
                if (r === this.chromaKeyColorWebcam.r && g === this.chromaKeyColorWebcam.g && b === this.chromaKeyColorWebcam.b) {
                    this.chromaData[i + 3] = 0; // Set alpha to 0
                }
            }
            ctx.putImageData(this.chromaFrame, 0, 0);
        } else if (thing === "canvas") {
            //Apply chromakey after webcam is put on the canvas instead of before.
            if (this.tfVidStuff.paused || this.tfVidStuff.ended) {
                ctx.drawImage(this.tfVidStuff, 0, 0, canvas_width, canvas_height);
                const imageData = ctx.getImageData(0, 0, canvas_width, canvas_height);
                this.chromaData = imageData.data;
                const chromaColor = this.chromaKey(this.Tfhex);
                for (let i = 0; i < this.chromaData.length; i += 4) {
                    if (this.chromaData[i] === chromaColor.r && this.chromaData[i + 1] === chromaColor.g && this.chromaData[i + 2] === chromaColor.b) {
                        this.chromaData[i + 3] = 0; // Set alpha to 0 for transparency
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                this.animationId = requestAnimationFrame(() => {
                    this.ApplyTfChromaKey(thing, ctx, canvas_width, canvas_height, stream);
                });
            } else {
                ctx.clearRect(0, 0, canvas_width, canvas_height);
                // Draw the uploaded background video or image
                if (this.backgroundVideo) {
                    ctx.drawImage(this.backgroundVideo, 0, 0, canvas_width, canvas_height);
                } else if (this.backgroundImg) {
                    ctx.drawImage(this.backgroundImg, 0, 0, canvas_width, canvas_height);
                }
                // Draw the webcam feed if it's active
                if (this.isPlaying === true) {
                    ctx.drawImage(stream, 0, 0, canvas_width, canvas_height);
                }
                // Apply chroma key for webcam, video, and image based on flags
                if (this.frameCounter % this.frameSkipCount === 0) {
                    if (this.useChromaKeyWebcam) { 
                    this.ColorPickerChromaKey(this.Tfhex);
                    } else {
                        
                    }
                }
                this.frameCounter++;
                // Continue the animation loop
                this.animationId = requestAnimationFrame(() => {
                    this.ApplyTfChromaKey(thing, ctx, canvas_width, canvas_height, stream);
                });
            }
        } else if (thing === "video") {
            //current code below is drawing the video to the canvas, and then getting the pixel data, and then turning it into GreenScreen or aka manipulating it.
            //Draw the video directly to canvas.
            ctx.drawImage(this.tfVidStuff, 0, 0, canvas_width, canvas_height);
            //Get pixel data.
            this.TfVidDrawFrame = ctx.getImageData(0, 0, canvas_width, canvas_height);
            //mainpulate pixel
            ctx.putImageData(this.TfVidDrawFrame, 0, 0);
            this.animationId = requestAnimationFrame(() => {
                this.ApplyTfChromaKey(thing, ctx, canvas_width, canvas_height, stream);
            });
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
    VideoSystemStart(element, stream) {
        if (this.isPlaying === true) {
            this.isPlaying = false;
            cancelAnimationFrame(this.animationId);
            element.pause();
            if (this.backgroundVideo) {
                this.backgroundVideo.pause();
            }
        } else {
            this.isPlaying = true;
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
        cancelAnimationFrame(this.animationId);
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
        const track = stream.getVideoTracks()[0];
        this.VideoProcessor = new MediaStreamTrackProcessor({ track });
        this.VideoReader = this.VideoProcessor.readable.getReader();
    }
    LetsBegin() {
        //videoElement.srcObject = stream;
        this.VideoEventListeners(this.tfVidStuff, this.VideoCanvas);
        this.VideoButtonsEventListeners();
    }
}