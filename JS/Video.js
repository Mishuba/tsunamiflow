export class TfVideo {
    constructor() {
        //Audio
        this.VideoAudioElement;
        this.VideoAudioContext;
        this.VideoAudioAnalyser;
        this.VideoAnalyserOption = {
            fftSize: 2048, //32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768 // defaults to 2048.
            maxDecibels: 0, // 0 is the loudest
            minDecibels: -100, // 0 is the loudest 
            smoothingTimeConstant: 0.5, // between 0 and 1
            //channelCount: ,
            channelCountMode: "max",
            //channelInterpretation: ,
            //disableNormalization: true
        }
        this.VideoAudioMedia;
        this.VideoAudioMediaDestination;
        this.VideoAudioMediaSource;
        this.VideoAudiopwoImag;
        this.VideoAudioBuffer;
        this.VideoAudioBufferLength;
        this.VideoAudioDataArray;

        this.VideoElement;
        this.VideoContext;
        this.VideoMedia;
        //create
        this.VideoSystemControllerButton;
        this.VideoSystemControllerStopButton;
        this.tfVidImgUploadButton;
        this.tfVidImgRemoveImgButton;

        this.tfVideoStuff;


        //Webcam
        this.WebcamStartButton;
        ;
        this.WebcamStopButton;
        this.whichCamera = true;
        this.WebcamStreamVideoAndAudio;
        this.WebcamAudioStream;
        this.WebcamVideoStream;
        this.useChromaKeyWebcam = false;
        this.TfWebcam;

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
        //Canvas
        this.VideoAudioCanvas;
        this.VideoAudioX = 0;
        this.VideoAudioY;
        this.VideoAudioDx;
        this.VideoAudioDy;
        this.VideoAudioRadius;
        this.VideoAudioBaseRadius;
        this.VideoAudioColor;
        this.VideoAudioVisualizatorController;
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
        //Video
        this.backgroundVideo = null;
        this.backgroundVideoButton;
        this.removeBackgroundVideoButton;

        //Stream
        this.VideoProcessedStream;
        this.VideoAudioProcessedStream;
        this.LiveStream;

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
        this.VideoWebSocket;
        this.VideoWebSocketMessage;
        //WebRTC
        this.VideoPc;
        this.VideoPcAnswer;
        this.VideoPcOffer;
        this.VideoFriendPc;
        this.VideoFriendPcOffer;
    }
    VideoNetworkState(element) {
        /*
        if (element.networkState === element.NETWORK_NO_SOURCE) {
            console.log("The Tsunami Community Video Network State is NETWORK_NO_SOURCE");
        } else if (element.networkState === element.NETWORK_IDLE) {
            console.log("The Tsunami Community Video Network State is NETWORK_IDLE");
        } else if (element.networkState === element.NETWORK_LOADING) {
            console.log("The Tsunami Community Video Network State is NETWORK_LOADING");
        }
        */
        if (element.readyState === 0) {
            console.log("Radio readyState is HAVE_NOTHING aka no data yet.");
            if (element.networkState == 0) {
                console.log("Radio networkState has NETWORK_EMPTY");
                if (element.src == "") {
                    console.log("The radio source is ''");
                } else if (!element.src) {
                    ("The radio source does not exist");
                } else if (element.src == " ") {
                    console.log("The radio source is ' '");
                } else if (element.src == "about:blank") {
                    console.log("The radio source is about:blank");
                }
                else {
                    console.log("Something else is going on and I dont know what it is.");
                }
            } else if (element.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (element.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE");
                //No valid source
            }
        } else if (element.readyState === 1) {
            console.log("Radio readyState is HAVE_METADATA");
            if (element.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (element.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (element.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE (but during the have metadata point.");
                //No valid source
            }
        } else if (element.readyState === 2) {
            console.log("Radio readyState is HAVE_CURRENT_DATA");
            if (element.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (element.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (element.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE but during the have ;loading point.");
                //No valid source
            }
        } else if (element.readyState === 3) {
            console.log("Radio readyState is HAVE_FUTURE_DATA");
            if (element.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (element.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE during the canplay point.");
                //No valid source
            }
        } else if (element.readyState === 4) {
            console.log("Radio readyState is HAVE_ENOUGH_DATA");
            if (element.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (element.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (element.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE during the canplaythrough point.");
                //No valid source
            }

            if (element.ended) {
                if (element.src = "") {

                } else if (element.src = undefined) {

                } else if (!element.src) {

                } else {

                }
            } else {
                if (element.paused) {
                    if (element.currentTime === 0) {
                        console.log("Tsunami Radio has not started yet.");
                    } else {
                        console.log("Paused at " + element.currentTime);
                    }
                } else {
                    console.log("A song is still playing. Make the next song play using the functions");
                }
            }
        } else {
            if (element.networkState === 3) {
                console.log("The network could not find the source.");
            } else {
                console.log("Some unknown error is going on with the Radio");
            }
        }
    }
    VideoState(element, context) {
        console.log("pointless change VideoState() to VideoLoadStarted()");
        if (context.state === "suspended") {
            context.resume();
        } else if (context.state === "running") {
            console.log("The audio context state is running");
            if (element.waiting) {
                context.suspend();
            }
        } else {
            console.log("The Audio context state must be closed");
            if (element.pause) {
                this.StopVisualizator();
            }
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
    AudioVisualizer(canvas, ctx, analyser, dataArray, bufferLength, radius, baseRadius, x, y, dx, dy, color) {
        let particles = [];

        async function updateVisualizer(volume, baseRadius, x, y, dx, dy) {
            radius = baseRadius + volume / 50;
            x += dx;
            y += dy;

            if (x + radius > canvas.width || x - radius < 0) {
                dx = -dx;
            }

            if (y + radius > canvas.height || y - radius < 0) {
                dy = -dy;
            }
        }

        async function drawVisualizer(ctx, x, y, radius, color) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2, false);
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 20;
            ctx.fill();
        }

        async function tfParticles(x, y, dx, dy, radius, color) {
            return { x, y, dx, dy, radius, color };
        }

        async function particle(canvas, x, y, dx, dy, radius, color, particles) {
            for (let i = 0; i < 100; i++) {

                x = Math.random() * canvas.width;
                y = Math.random() * canvas.height;
                dx = (Math.random() - 0.5) * 0.5;
                dy = (Math.random() - 0.5) * 0.5;
                radius = Math.random() * 0.5 + 0.2;
                color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, 0.8)`;
                particles.push(tfParticles(x, y, dx, dy, radius, color));
            }
        }

        particles(canvas, x, y, dx, dy, radius, color, particles);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "rgb(10,10,30)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Get Average volume for particle reaction
        let Total = 0;
        for (let i = 0; i < dataArray.length; i++) {
            Total += dataArray[i];
        }
        let averageVolume = Total / dataArray.length;

        for (let i = 0; i < particles.length; i++) {
            particles[i] = updateVisualizer(averageVolume, radius, baseRadius, x, y, dx, dy, canvas);

            particles[i] = drawVisualizer(ctx, x, y, radius, color);
        }

        let barWidth = (100 / bufferLength) * 2.5;
        let barHeight;
        let X = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            let R = barHeight + 25 * (i / bufferLength);
            let G = 250 * (i / bufferLength);
            let B = 50;

            ctx.fillStyle = `rgb(${R}, ${G}, ${B})`;
            ctx.fillRect(X, 100 - barHeight, barWidth, barHeight);

            X += barWidth + 1;
        }

        this.VideoAudioVisualizerController = requestAnimationFrame(async () => {
            this.AudioVisualizer(canvas, ctx, analyser, dataArray, bufferLength, radius, baseRadius, x, y, dx, dy, color, particles);
        })
    }
    StopVisualizer() {
        cancelAnimationFrame(this.VideoAudioVisualizerController);
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
        const rgb = parseInt(hex.slice(1), 16);
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
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        frameCounter = 0
        this.useChromaKeyWebcam = false;
    }
    VideoScreenSharing() {
        console.log("Start Video Sharing");
        navigator.mediaDevices.getDisplayMedia(TmediaFstreamConstraints).then(async (stream) => {
            //use stream
        });
    }
    VideoWebRTC(stream) {
        this.VideoDevice = new RTCPeerConnection();
        stream.getTracks().forEach(track => this.VideoDevice.addTrack(track, stream));
    }
    startRecording() {
        console.log("start recording");
        //Do this once the record button is pressed
        //MediaRecorder 
        this.VideoMime = "video/webm; codecs=vp8,opus";
        this.mediaRecorder = new MediaRecorder(this.WebcamStreamVideoAndAudio, { mimeType: this.VideoMime, videoBitsPerSecond: 1500000 });

        this.VideoWebSocket.binaryType = "arraybuffer";
        this.VideoWebSocket.onopen = async () => {
            this.mediaRecorder.start(1000);
            console.log("recorder started");

            this.VideoFriendPc = new RTCPeerConnection();

            this.VideoFriendPcOffer = this.VideoFriendPc.createOffer();
            this.VideoFriendPc.setLocalDescription(this.VideoFriendPcOffer);

            this.VideoWebSocket.send(JSON.stringify({ 'offer': this.VideoFriendPcOffer }));
        };

        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0 && this.VideoWebSocket.readyState === WebSocket.OPEN) {
                //send raw Blob / ArrayBuffer
                //Blob
                this.recordedChunks.push(event.data);


                //ArrayBuffer
                event.data.arrayBuffer().then(async (buff) => {
                    this.VideoWebSocket.send(buff);
                });

                this.mediaRecorder.start();
                IsRecording = true;
                RecordingStartBtn.disabled = true;
                RecordingStartBtn.style.display = "none";
                RecordingSpotBtn.disabled = false;
                RecordingStopBtn.style.display = "inline";
            }
        };

        this.VideoWebSocket.onmessage = (TF) => {
            console.log("WebSocket Message Sent");

            this.VideoWebSocketMessage = JSON.parse(TF.data);
            console.log("Received data:", this.VideoWebSocketMessage);

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
                TfWebSocket.send(JSON.stringify({ 'offer': this.VideoPcOffer }));
            } else if (data.type === "stop-offer") {

            } else {

            }
        };

        this.VideoWebSocket.onclose = () => {
            console.log("WebSocket closed.");
        };

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
            IsRecording = false;
            RecordingStartBtn.disabled = false;
            RecordingStartBtn.style.display = "inline";
            RecordingSpotBtn.disabled = true;
            RecordingStopBtn.style.display = "none";
        }

        this.VideoWebSocket.onerror = (error) => {
            console.log(`WebSocket connection is not working.  error: ${error}`);
        }
    }
    stopRecording() {
        console.log("Stop Recording");
    }
    DownloadRecording() {
        console.log("Placeholder for download Video");
    }
    UploadImage(e) {
        const file = e.target.files[0];
        if (file) {
            TbackgroundFImage = new Image();
            TbackgroundFImage.src = URL.createObjectURL(file);
            TframeStBtn.style.display = 'inline'; // Show start button
            TframeByeImg.style.display = 'inline'; // Show remove image button
        }
    }
    RemoveImage() {
        console.log("placeholder for RemoveImage");
        TbackgroundFImage = null;
        hpCC.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear the canvas
        TframeStBtn.style.display = 'none'; // Hide start button
        TframeByeImg.style.display = 'none'; // Hide remove button
    }
    UploadVideo(e) {
        const file = e.target.files[0];
        if (file) {
            TbackgroundFVideo = document.createElement('video');
            TbackgroundFVideo.src = URL.createObjectURL(file);
            TbackgroundFVideo.muted = true; // Mute the video
            TbackgroundFVideo.loop = true; // Loop the video
            TbackgroundFVideo.load(); // Load the video
            TframeStBtn.style.display = 'inline'; // Show start button
            TframeByeVid.style.display = 'inline'; // Show remove video button
        }
    }
    RemoveVideo() {
        console.log("Placeholder for remove video");
        if (TbackgroundFVideo) {
            TbackgroundFVideo.pause();
            TbackgroundFVideo.currentTime = 0; // Reset the video to the beginning
            TbackgroundFVideo = null; // Clear the video reference
            hpCC.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear the canvas
        }
        TframeStBtn.style.display = 'none'; // Hide start button
        TframeByeVid.style.display = 'none'; // Hide remove button
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

        TFcolorPicker.addEventListener('input', (e) => {
            this.ColorPickerChromaKey(e);
        }); //Choose a color for the chroma key green screen

        TfCpBtn.addEventListener('click', () => {
            this.ApplyTfChromaKey();
        });// Use chroma key color for webcam

        TfCpRm.addEventListener('click', () => {
            this.RemoveChromaKeyColor();
        }); // Remove chroma key color button

        //Green Screen Ends
        TframeSpBtn.addEventListener('click', () => {

        });//Create Record Button

        TframeStRec.addEventListener('click', () => {
            this.startRecording();
        }); //Start Recording

        TframeSpRec.addEventListener('click', () => {
            this.stopRecording();
        }); //Stop Recording

        Tframe4u.addEventListener('click', () => {

        }); //I cant remember yet
        //Upload Image
        TframeULimg.addEventListener('change', (e) => {
            this.UploadImage();
        });
        //Upload VIdeo
        TframeULvid.addEventListener('change', (e) => {
            this.UploadVideo();
        });
        //Remove Image
        TframeByeImg.addEventListener('click', () => {
            this.removeImage();
        });
        //Remove Video
        TframeByeVid.addEventListener('click', () => {
            this.removeVideo();
        });
        //Control Camera
        document.getElementById("TcameraFlipButton").onclick = () => {
            whichCamera = !whichCamera;
        }

        TframeCtrBtn.addEventListener('click', () => {

        });
    }
    VideoSystemStart() {
        console.log("Placeholder for system start");
        if (isPlaying) {
            isPlaying = false;
            cancelAnimationFrame(animationId);
            tfVidStuff.pause();
            if (TbackgroundFVideo) {
                TbackgroundFVideo.pause();
            }
        } else {
            isPlaying = true;

            // Play the webcam feed if it's active
            if (webcamStream) {
                tfVidStuff.play();
            }

            // Always play the background video if it exists
            if (TbackgroundFVideo) {
                TbackgroundFVideo.play();
            }

            animate();
        }
    }
    VideoSystemStop() {
        this.isPlaying = false;
        //cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (webcamStream) {
            const tracks = webcamStream.getTracks();
            tracks.forEach(track => track.stop());
            tfVidStuff.srcObject = null;
            webcamStream = null;
        }

        this.VideoSystemControllerStopButton.style.display = "none";
    }
    VideoWebCodecs(stream) {
        this.VideoProcessor = new MediaStreamTrackProcess({
            track: stream.getVideoTracks()[0]
        });
        this.VideoReader = this.VideoProcessor.readable.getReader();
    }
    LetsBegin(stream, audioContext, videoElement) {
        //create audio Element and video Element Here
        //video
        videoElement.srcObject = stream;
        audioContext
        wcS = webcamStream;
        // create video canvas

        //Audio
        this.VideoAudioCanvas = canvas1;

        //Use event listener on video Element
        this.VideoEventListeners(videoElement);

        //Create buttons for event listener. 
        this.VideoButtonsEventListeners();
    }
}