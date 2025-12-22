export class TfVideo {
    constructor(Radio = null, VideoElement = null) {
        this.audioEngine = Radio;
        this.VideoElement = VideoElement;
        this.VideoSystemControllerButton;
        this.VideoSystemControllerStopButton;
        //Webcam
        this.WebcamStartButton;
        this.WebcamStopButton;
        this.TfWebcam;
        this.whichCamera = true;
        this.WebcamStreamVideoAndAudio;
        this.WebcamAudioStream;
        this.WebcamVideoStream;
        this.useChromaKeyWebcam = false;
        this.TmediaFstreamConstraints = {
            audio: {
                deviceId: "f",
                //groupId: "",
                autoGainControl: {
                    //exact: ,
                    ideal: true,
                },
                channelCount: {
                    //exact: 7.5,
                    min: 1,
                    ideal: 6,
                    max: 12,
                },
                echoCancellation: true,
                //latency: ,
                //noiseSuppression: variable,
                //sampleRate: {},
                sampleSize: {
                    min: 8,
                    ideal: 16,
                    max: 32
                },
            },
            image: {
                deviceId: "n",
                //groupId: "",
                whiteBalanceMode: {
                    ideal: "none",
                    //exact: ,
                }, // "manual", "single-shot", "continuous"
                exposureMode: "none", // "manual", "single-shot", "continuous"
                focusMode: "none", // "manual", "single-shot", "continuous"
                //pointsOInterest: { x: , y: , },
                //exposureCompensation: , //
                //colorTemperature: , //Integer
                //iso: ,//
                //brightness: ,//
                //contrast: ,//
                //saturation: ,//
                //sharpness: ,//
                //focusDistance: ,//
                //zoom: ,//
                //torch: ,//
            },
            video: {
                deviceId: "t",
                //groupId: "",
                //aspectRadio: { },
                width: {
                    min: 400,
                    ideal: 600,
                    max: 1280,
                },
                height: {
                    min: 400,
                    ideal: 600,
                    max: 720,
                },
                framerate: {
                    exact: 7.5,
                    min: 15,
                    ideal: 30,
                    max: 60,
                },
                facingMode: this.whichCamera ? "" || "" : "user" || "environment", // "user" for front camera, "environment" for back camera
            }
        };
        this.VideoCanvas;
        //ChromaKey
        this.chromaKeyColorWebcam = {
            r: 0,
            g: 255,
            b: 0
        };
        this.chromaColorPicker;
        this.useChromaColor;
        this.removeChromaColor;

        //background
        //Image
        this.backgroundImg = null;
        this.tfVidImgUploadButton;
        this.tfVidImgRemoveImgButton;
        this.backgroundVideo = null;
        this.uploadBackgroundVideoButton;
        this.removeBackgroundVideoButton;
        //recording
        this.startRecordingButton;
        this.stopRecordingButton;
        this.frameIsRecording = false;
        this.isPlaying = false;
        this.mediaRecorder;
        this.videoMime;
        this.recordedChunks = [];
        this.DownloadVideoRecordingButton;

        //websocket
        this.VideoWebSocket = null;
        //WebRTC
        this.VideoPc;
        this.VideoPcAnswer;
        this.VideoPcOffer;
        this.VideoFriendPc;
        this.VideoFriendPcOffer;
    }
    StartWebcam() {
      this.TfWebcam = await navigator.mediaDevices.getUserMedia(this.TmediaFstreamConstraints);
    }
    VideoNetworkState(element) {
        if (!element) {
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
startWebsocket(keyInput, roleSelect) {
  const key = keyInput.value;
  const role = roleSelect.value;

  this.VideoWebSocket = new WebSocket(`wss://world.tsunamiflow.club:8443/?key=${key}&role=${role}`);
  this.VideoWebSocket.binaryType = 'arraybuffer';
  this.VideoWebSocket.onopen = async () => {
      //log("🎥 Streaming started");
      /*
      this.VideoWebSocket.send(JSON.stringify({ 'offer': this.VideoFriendPcOffer }));
      */
      
    };
    
    this.VideoWebSocket.onmessage = (TF) => {
      console.log("WebSocket Message Sent");
      this.VideoWebSocketMessage = JSON.parse(TF.data);
      console.log("Received data:", this.VideoWebSocketMessage);
    };

    this.VideoWebSocket.onerror = (error) => {
      console.log(`WebSocket connection is not working.  error: ${error}`);
    };
}
    stopWebsocket() {
        this.mediaRecorder.stop();
        this.VideoWebSocket.send(JSON.stringify({ type: 'stop' }));
        this.VideoWebsocket.close();
        //log("🛑 Streaming stopped");
    }
    emptiedVideo() {
        this.VideoNetworkState();
    }
    loadVideo() {
        this.VideoNetworkState();
    }
    loadedVideoMetadata(element) {
        this.VideoNetworkState(element);
        element.videoWidth;
        element.videoHeight;
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
        this.StopVisualizer();
    }
    VideoEnded() {
        this.VideoState();
        this.StopVisualizer();
        console.log("The video has ended");
    }
    VideoWaiting() {
        this.VideoState();
    }
    VideoPlaying(element, context, canvas, ctx, analyser, dataArray, bufferLength, radius, baseRadius, x, y, dx, dy, color) {
        this.VideoState();
        this.AudioVisualizer(canvas, ctx, analyser, dataArray, bufferLength, radius, baseRadius, x, y, dx, dy, color);
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
    UpdateVideoTime() {
        let TimingVideo = Math.floor(this.tfVideoStuff.currentTime);
        let UsingTfVidTk = `Time: ${this.FormatVideoTime(TimingVideo)}`;
        let VideoProcessBar = (this.tfVideoStuff.currentTime / this.tfVideoStuff.duration) * 100;
    }
    VideoVolumeChange() {
        console.log("The video volume has changed");
    }
    VideoEventListeners(element) {
        this.tfVideoStuff = document.createElement("video");
        this.tfVideoStuff.id = "TsunamiFlowVideoStuff";
        this.tfVideoStuff.controls = true;
        this.tfVideoStuff.autoplay = false;
        this.tfVideoStuff.loop = false;
        this.tfVideoStuff.muted = false;
        this.tfVideoStuff.poster = "";
        element.addEventListener("emptied", async () => {
            console.log("The Tsunami Community Video has been emptied.");

        }); //The media has become empty; for example, this event is sent if the media has already been loaded( or partially loaded), and the HTMLMediaElement.load method is called to reload it.

        element.addEventListener("load", async () => {

        }); //The resource has been loaded.
        element.addEventListener("loadstart", async () => {
            console.log("The Tsunami Community Video has started loading.");

        });//Fired when the browser has started to load the resource.

        element.addEventListener("loadedmetadata", async (metadata) => {
            console.log("The Tsunami COmmunity Video metadata has started to load.");
        });

        element.addEventListener("loadeddata", async () => {
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
            this.playVideo(canvas, ctx, analyser, dataArray, bufferLength, radius, baseRadius, x, y, dx, dy, color);
            //Capture processed canvas as MediaStream with button
            let processedStream = canvas.captureStream(30);
        }); //Playback has begun.

        element.addEventListener("pause", async () => {
            this.pauseVideo();
        }); //playback has been paused.

        element.addEventListener("ended", async () => {
            console.log("The video should have ended");
            this.VideoEnded();
        });

        element.addEventListener("waiting", async (waiting) => {
            console.log("The Video should be waiting");
        }); //Playback has stopped because of a temporary lack of data.

        element.addEventListener("playing", async () => {
            console.log("The video should be playing");
        }); //Playback is ready to start after having been paused or delayed due to lack of data.

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
        const Tfhex = chroma.target.value;
        const rgb = parseInt(Tfhex.slice(1), 16);
        this.chromaKeyColorWebcam.r = (rgb >> 16) & 255;
        this.chromaKeyColorWebcam.g = (rgb >> 8) & 255;
        this.chromaKeyColorWebcam.b = rgb & 255;
    }
    usePickedColor() {
        this.useChromaKeyWebcam = true;
        this.VideoSystemControllerButton.style.display = "inline";
    }
    ApplyTfChromaKey(thing) {
        if (thing === "webcam") {
            const frame = hpCC.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            const data = frame.data;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                // Check if pixel matches the chroma key color for webcam
                if (r === chromaKeyColorWebcam.r && g === chromaKeyColorWebcam.g && b === chromaKeyColorWebcam.b) {
                    data[i + 3] = 0; // Set alpha to 0
                }
            }
            hpCC.putImageData(frame, 0, 0);
        } else if (thing === "canvas") {
            //Apply chromakey after webcam is put on the canvas instead of before.
            let frameSkipCount = 2;
            let frameCounter = 0;
            if (this.tfVideoStuff.paused || this.tfVideoStuff.ended) {
                hpCC.drawImage(this.tfVideoStuff, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                const imageData = hpCC.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                const data = imageData.data;
                const chromaColor = hexToRgb(colorPicker.value);
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i] === chromaColor.r && data[i + 1] === chromaColor.g && data[i + 2] === chromaColor.b) {
                        data[i + 3] = 0; // Set alpha to 0 for transparency
                    }
                }
                hpCC.putImageData(imageData, 0, 0);
            requestAnimationFrame(animate);
            } else {
                hpCC.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                // Draw the uploaded background video or image
                if (backgroundVideo) {
                    hpCC.drawImage(backgroundVideo, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                } else if (backgroundImage) {
                    hpCC.drawImage(backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                }
                // Draw the webcam feed if it's active
                if (isPlaying) {
                    hpCC.drawImage(video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                }
                // Apply chroma key for webcam, video, and image based on flags
                if (frameCounter % frameSkipCount === 0) {
                    if (useChromaKeyWebcam) applyChromaKeyWebcam();
                }
                frameCounter++;
                // Continue the animation loop
                animationId = requestAnimationFrame(animate);
            }
        } else if (thing === "video") {
            //current code below is drawing the video to the canvas, and then getting the pixel data, and then turning it into GreenScreen or aka manipulating it.
            //Draw the video directly to canvas.
            ctx.drawImage(this.tfVideoStuff, 0, 0, canvas.width, canvas.height);
            //Get pixel data.
            const TfVidDrawFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
            //mainpulate pixel
            ctx.putImageData(TfVidDrawFrame, 0, 0);
            requestAnimationFrame(DrawVideo);
        } else {
            //nothing 
        }
    }
    RemoveChromaKeyColor() {
        ctx.clearRect(0, 0, this.VideoCanvas.width, this.VideoCanvas.height);
        frameCounter = 0
        this.useChromaKeyWebcam = false;
    }
    startRecording() {
        console.log("start recording");
        this.VideoMime = "video/webm; codecs=vp8,opus";
        this.mediaRecorder = new MediaRecorder(this.TfWebcam, { mimeType: this.VideoMime, videoBitsPerSecond: 1500000 });
        this.mediaRecorder.ondataavailable = event => {
            if (event.data.size) {
              if (event.data && event.data.size > 0 && this.VideoWebSocket.readyState === WebSocket.OPEN) {
                //send raw Blob / ArrayBuffer
                //Blob
                this.recordedChunks.push(event.data);
                //ArrayBuffer
                event.data.arrayBuffer().then(async (buff) => {
                  this.VideoWebSocket.send(buff);
                 });
                }
           }
       };
       this.mediaRecorder.start(250);
       //IsRecording = true;
       //RecordingStartBtn.disabled = true;
       //RecordingStartBtn.style.display = "none";
       //RecordingSpotBtn.disabled = false;
       //RecordingStopBtn.style.display = "inline";
    }
    stopRecording() {
        console.log("Stop Recording");
        this.mediaRecorder.onstop = async () => {
        this.VideoWebSocket.close();
        this.VideoStreamBlob = new Blob(this.recordedChunks, { type: "video/webm" });
        this.VideoStreamBlobUrl = URL.createObjectURL(this.VideoStreamBlob);
        let VideoStreamBlobUrlHref = document.createElement("a");
        VideoStreamBlobUrlHref.href = this.VideoStreamBlobUrl;
        VideoStreamBlobUrlHref.style.display = "block";
        VideoStreamBlobUrlHref.textContext = "Download Video";
        VideoStreamBlobUrlHref.download = "recorded.webm";
        document.body.appendChild(VideoStreamBlobUrlHref);
        VideoStreamBlobUrlHref.click();
        URL.revoke.ObjectURL(VideoStreamBlobUrl);
        //IsRecording = false;
        //RecordingStartBtn.disabled = false;
        //RecordingStartBtn.style.display = "inline";
        //RecordingSpotBtn.disabled = true;
        //RecordingStopBtn.style.display = "none";
    }
    }
    DownloadRecording() {
        console.log("Placeholder for download Video");
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
    RemoveImage() {
        console.log("placeholder for RemoveImage");
        this.backgroundImg = null;
        this.CanvasContent.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear the canvas
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
    RemoveVideo() {
        console.log("Placeholder for remove video");
        if (this.backgroundVideo) {
            this.backgroundVideo.pause();
            this.backgroundVideo.currentTime = 0; // Reset the video to the beginning
            this.backgroundVideo = null; // Clear the video reference
            hpCC.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear the canvas
        }
        //TframeStBtn.style.display = 'none'; // Hide start button
        //TframeByeVid.style.display = 'none'; // Hide remove button
    }
    VideoButtonsEventListeners() {
        console.log("placeholder for main");
        this.VideoSystemControllerButton = document.createElement("button");
        this.VideoSystemControllerStopButton = document.createElement("button");
        this.VideoSystemControllerButton.id = "TfControlShit";
        this.VideoSystemControllerStopButton.id = "TfControlStopStart";
        this.tfVidImgUploadButton = document.createElement("button");
        this.tfVidImgUploadButton.id = "TfUploadImages";
        this.tfVidImgRemoveImgButton = createElement("button");
        this.tfVidImgRemoveImgButton.id = "rmvTFimg";
        this.VideoSystemControllerButton = document.createElement("button");
        this.VideoSystemControllerStopButton = document.createElement("button");
        this.VideoSystemControllerButton.id = "TfControlShit";
        this.VideoSystemControllerStopButton.id = "TfControlStopStart";
        this.tfVidImgUploadButton = document.createElement("button");
        this.tfVidImgUploadButton.id = "TfUploadImages";
        this.tfVidImgRemoveImgButton = createElement("button");
        this.tfVidImgRemoveImgButton.id = "rmvTFimg";
        this.tfVideoStuff = document.createElement("video");
        this.tfVideoStuff.id = "TsunamiFlowVideoStuff";
        this.tfVideoStuff.controls = true;
        this.tfVideoStuff.autoplay = false;
        this.tfVideoStuff.loop = false;
        this.tfVideoStuff.muted = false;
        this.tfVideoStuff.poster = "";
        //Webcam
        this.WebcamStartButton = document.createElement("button");
        this.WebcamStartButton.id = "TfStartShit";
        this.WebcamStopButton = document.createElement("button");
        this.WebcamStopButton.id = "TfStopShit";
        //TFcolorPicker.addEventListener('input', (e) => {this.ColorPickerChromaKey(e);}); //Choose a color for the chroma key green screen
        //TfCpBtn.addEventListener('click', () => {this.ApplyTfChromaKey();});// Use chroma key color for webcam

        //TfCpRm.addEventListener('click', () => {this.RemoveChromaKeyColor();}); // Remove chroma key color button

        //Green Screen Ends
        //TframeSpBtn.addEventListener('click', () => {});//Create Record Button

        //TframeStRec.addEventListener('click', () => {this.startRecording();}); //Start Recording

        //TframeSpRec.addEventListener('click', () => {this.stopRecording();}); //Stop Recording

        //Tframe4u.addEventListener('click', () => { }); //I cant remember yet
        
        //Upload Image
        //TframeULimg.addEventListener('change', (e) => {this.UploadImage();});
        //Upload VIdeo
        //TframeULvid.addEventListener('change', (e) => {this.UploadVideo();});
        //Remove Image
        //TframeByeImg.addEventListener('click', () => {this.removeImage();});
        //Remove Video
        //TframeByeVid.addEventListener('click', () => {this.removeVideo();});
        //Control Camera
        //document.getElementById("TcameraFlipButton").onclick = () => {this.whichCamera = !whichCamera;}

        //TframeCtrBtn.addEventListener('click', () => {});
    }
    VideoSystemStart() {
        console.log("Placeholder for system start");
        if (isPlaying) {
            isPlaying = false;
            cancelAnimationFrame(animationId);
            tfVidStuff.pause();
            if (this.backgroundVideo) {
                this.backgroundVideo.pause();
            }
        } else {
            //this.isPlaying = true;
            // Play the webcam feed if it's active
            if (this.TfWebcam) {
                tfVidStuff.play();
            }
            // Always play the background video if it exists
            if (this.backgroundVideo) {
                this.backgroundVideo.play();
            }
            animate();
        }
    }
    VideoSystemStop() {
        this.isPlaying = false;
        //cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, this.VideoCanvas.width, this.VideoCanvas.height);

        if (this.TfWebcam) {
            const tracks = this.TfWebcam.getTracks();
            tracks.forEach(track => track.stop());
            tfVidStuff.srcObject = null;
            this.TfWebcam = null;
        }

        this.VideoSystemControllerStopButton.style.display = "none";
    }
    VideoWebRTC(stream) {
        this.VideoPc = new RTCPeerConnection();
        
        this.VideoFriendPcOffer = this.VideoFriendPc.createOffer();
        this.VideoFriendPc.setLocalDescription(this.VideoFriendPcOffer);

        stream.getTracks().forEach(track => this.VideoPc.addTrack(track, stream));
  
        if (data.type === "offer") {
            this.VideoPc.setRemoteDescription(new RTCSessionDescription(data.offer));
            this.VideoPcAnswer = this.VideoPc.createAnswer();
            this.VideoPc.setLocalDescription(this.VideoPcAnswer);
             this.VideoWebSocket.send(JSON.stringify({ 'answer': this.VideoPcAnswer }));
        } else if (data.type === "answer") {
            this.VideoPc.setRemoteDescription(new RTCSessionDescription(data.answer));
        } else if (data.type === "candidate") {
            try {
                 this.VideoPc.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (e) {
                console.error("ICE Error:", e);
            }
        } else if (data.type === "start-offer") {
            this.VideoPcOffer = this.VideoPc.createOffer();
            this.VideoPc.setLocalDescription(this.VideoPcOffer);
            this.VideoWebSocket.send(JSON.stringify({ 'offer': this.VideoPcOffer }));
        } else if (data.type === "stop-offer") {
  
        } else {
  
        }
    }
    VideoWebCodecs(stream) {
        this.VideoProcessor = new MediaStreamTrackProcess({
            track: stream.getVideoTracks()[0]
        });
        this.VideoReader = this.VideoProcessor.readable.getReader();
    }
    VideoScreenSharing() {
        console.log("Start Video Sharing");
        navigator.mediaDevices.getDisplayMedia(this.TmediaFstreamConstraints).then(async (stream) => {
            //use stream
        });
    }
    LetsBegin(stream, audioContext, videoElement) {
        //videoElement.srcObject = stream;
        this.VideoEventListeners(videoElement);
        this.VideoButtonsEventListeners();
    }
}