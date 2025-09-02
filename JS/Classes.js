export class Weather {
    constructor() {
        this.weatherElement = document.getElementById("TFweather");
        this.DSLO = {
            enabledHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
        this.WABul = "https://api.weatherapi.com/v1";
        this.WABurl = "https://api.weatherapi.com/v1";
        this.WapiKey = "cf5a64c9095e425ab0f52816230110";
        this.CWapi = "/current.json";
    }
    LatAndLong(working) {
        // use the latitude and longitude location points. 
        let TFlat = working.coords.latitude;
        let TFlong = working.coords.longitude;
        let TFcoords = working.coords;
        //use the latitude and longitude location points.
        let something = `${this.WABurl}${this.CWapi}?key=${this.WapiKey}&q=${TFlat},${TFlong}&aqi=no`;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', something);

        xhr.onload = async function (e) {
            if (this.status == 200) {
                // get the JSON reponse
                //parse when receiving 
                //stringify when sending
                let infoWeather = ('response', JSON.parse(this.response));

                let IWname = infoWeather.location.name;
                let IWregion = infoWeather.location["region"];
                let IWcountry = infoWeather.location["country"];

                //current
                let IWcTC = infoWeather.current["temp_c"];
                let IWcTF = infoWeather.current["temp_f"];
                let IWcText = infoWeather.current["condition"]["text"];
                let IWcIcon = infoWeather.current["condition"]["icon"];


                // Display on web page
                this.weatherElement.innerHTML = `${IWname}, ${IWregion}, ${IWcountry} <br>${IWcText} C: ${IWcTC} F: ${IWcTF} <img src=${IWcIcon}>`;

                //Make the response do cool stuf.
            }
        };
        xhr.send();
        }
        City(CityName) {
        let something = `${this.WABul}${this.CWapi}?key=${this.WapiKey}&q=${CityName}&aqi=no`;

        const userCity = new XMLHttpRequest();
        userCity.open("POST", something);
        userCity.onload = function (e) {
            if (this.status == 200) {
                //get  the JSON response
                let infoWeather = ('response', JSON.stringify(this.response));
                let IWname = infoWeather.location.name;
                let IWregion = infoWeather.location["region"];
                let IWcountry = infoWeather.location["country"];

                //current
                let IWcTC = infoWeather.current["temp_c"];
                let IWcTF = infoWeather.current["temp_f"];
                let IWcText = infoWeather.current["condition"]["text"];
                let IWcIcon = infoWeather.current["condition"]["icon"];


                // Display on web page
                weatherElement.innerHTML = `${IWname}, ${IWregion}, ${IWcountry} <br>${IWcText} C: ${IWcTC} F: ${IWcTF} <img src=${IWcIcon}>`;

                //Make the response do cool stuff. 
            }
        };
        userCity.send();
    }
    Error(e) {
        switch(e.code){
            case e.PERMISSION_DENIED:

            break;
            case e.POSITION_UNAVAILABLE:

            break;
            case e.TIMEOUT:

            break;
            case e.UNKNOWN_ERROR:

            break;
            default:
                console.error(e);
            break;
        }
    }
    requestLocation() {
        if (!navigator.geolocation) {
            console.log("geo not working");
        } else {
            console.log("geo working");
            navigator.permissions.query({
                name: "geolocation"
            }).then(result => {
                if (result.state === "granted") {
                    console.log("geolocation is accessible and you are able to use it for different things. granted");
                    console.log("getting the information on the current position.");
                    navigator.geolocation.getCurrentPosition(DSWL, DEWL, DSLO);
                } else if (result.state === "prompt") {
                    console.log("geolocation needs to be requested");
                    if (confirm("TF is asking if you will allow it to access your location.")) {
                        navigator.geolocation.getCurrentPosition(this.LatAndLong, this.Error, this.DSLO);
                    } else {
                        let letmegetloc = prompt("If you want weather updates please type your city name with no spaces if not just press enter. (Your Location will not be accessed");
                        if (!letmegetloc === "" || " ") {
                            this.City(letmegetloc);
                        } else {
                            console.log("the weather will not work.");
                        }
                    };
                } else {
                    console.log("geo denied");
                    let letmegetloc = prompt("If you want weather updates please type your city name with no spaces if not just press enter. (Your Location will not be accessed");
                    if (!letmegetloc === "" || " ") {
                        this.City(letmegetloc);
                    } else {
                        console.log("the weather will not work.");
                    }
                }
            });
        };
    }
}
/*
export class Art {
    constructor() {

    }
}
*/
export class TfVideo {
    constructor() {
        //create
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
        this.
        //tfVideoStuff.poster = "";
        
        //Webcam
        this.WebcamStartButton = document.createElement("button");
        this.WebcamStartButton.id = "TfStartShit";
        this.WebcamStopButton = document.createElement("button");
        this.WebcamStopButton.id = "TfStopShit";
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
                //facingMode: whichCamera ? "" || "";
            }
        };
        //ChromaKey
        this.chromaKeyColorWebcam = {
            r:0,
            g: 255,
            b: 0
        }
        this.chromaColorPicker = document.createElement("button");
        this.chromaColorPicker.id = "TFchormaKey";
        this.useChromaColor = document.createElement("button");
        this.useChromaColor.id = "TuseFthisKeyColor";
        this.removeChromaColor = document.create.Element("button");
        this.removeChromaColor.id = "rmvTFchromaKey";

        //background
        this.backgroundVideo = null;
        this.backgroundVideoButton = document.createElement("button");
        this.backgroundVideoButton.id = "TfUploadShit";
        this.removeBackgroundVideoButton = document.createElement("button");
        this.removeBackgroundVideoButton.id = "rmTFvid";

        //Stream
        this.emptyStream;
        this.stream;
        this.stream1;
        this.stream2;

        //WebRTC
        this.VideoProcessor;
        this.VideoReader;
        this.VideoDevice;

        //recording
        this.startRecordingButton = document.createElement("button");
        startRecordingButton.id = "TfStartRecPlz";
        this.stopRecordingButton = document.createElement("button");
        this.stopRecordingButton.id = "TfStopRecPlz";
        this.frameIsRecording = false;
        this.isPlaying = false;
        this.mediaRecorder; 
        this.recordedChunks = [];
        this.DownloadVideoRecordingButton = document.createElement("button");
        this.DownloadVideoRecordingButton.id = "IframeDownload";
    }
    UploadImage(){
        /*
        
        const file = e.target.files[0];
        if (file) {
            TbackgroundFImage = new Image();
            TbackgroundFImage.src = URL.createObjectURL(file);
            TframeStBtn.style.display = 'inline'; // Show start button
            TframeByeImg.style.display = 'inline'; // Show remove image button
        }
        */
    }
    UploadVideo(){
    /*
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
    */
    }
    VideoNetworkState() {
        /*
        if (this.tfVideoStuff.networkState === this.tfVideoStuff.NETWORK_NO_SOURCE) {
            console.log("The Tsunami Community Video Network State is NETWORK_NO_SOURCE");
        } else if (this.tfVideoStuff.networkState === this.tfVideoStuff.NETWORK_IDLE) {
            console.log("The Tsunami Community Video Network State is NETWORK_IDLE");
        } else if (this.tfVideoStuff.networkState === this.tfVideoStuff.NETWORK_LOADING) {
            console.log("The Tsunami Community Video Network State is NETWORK_LOADING");
        }
        */
        if (this.tfVideoStuff.readyState === 0) {
            console.log("Radio readyState is HAVE_NOTHING aka no data yet.");
            if (this.tfVideoStuff.networkState == 0) {
                console.log("Radio networkState has NETWORK_EMPTY");
                if (this.tfVideoStuff.src == "") {
                    console.log("The radio source is ''");
                } else if (!this.tfVideoStuff.src) {
                    ("The radio source does not exist");
                } else if (this.tfVideoStuff.src == " ") {
                    console.log("The radio source is ' '");
                } else if (this.tfVideoStuff.src == "about:blank") {
                    console.log("The radio source is about:blank");
                }
                else {
                    console.log("Something else is going on and I dont know what it is.");
                }
            } else if (this.tfVideoStuff.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (this.tfVideoStuff.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE");
                //No valid source
            }
        } else if (this.tfVideoStuff.readyState === 1) {
            console.log("Radio readyState is HAVE_METADATA");
            if (this.tfVideoStuff.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (this.tfVideoStuff.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (this.tfVideoStuff.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE (but during the have metadata point.");
                //No valid source
            }
        } else if (this.tfVideoStuff.readyState === 2) {
            console.log("Radio readyState is HAVE_CURRENT_DATA");
            if (this.tfVideoStuff.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (this.tfVideoStuff.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (this.tfVideoStuff.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE but during the have ;loading point.");
                //No valid source
            }
        } else if (this.tfVideoStuff.readyState === 3) {
            console.log("Radio readyState is HAVE_FUTURE_DATA");
            if (this.tfVideoStuff.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (this.tfVideoStuff.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE during the canplay point.");
                //No valid source
            }
        } else if (this.tfVideoStuff.readyState === 4) {
            console.log("Radio readyState is HAVE_ENOUGH_DATA");
            if (this.tfVideoStuff.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (this.tfVideoStuff.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (this.tfVideoStuff.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE during the canplaythrough point.");
                //No valid source
            }

            if (this.tfVideoStuff.ended) {
                if (this.tfVideoStuff.src = "") {

                } else if (this.tfVideoStuff.src = undefined) {

                } else if (!this.tfVideoStuff.src) {

                } else {

                }
            } else {
                if (this.tfVideoStuff.paused) {
                    if (this.tfVideoStuff.currentTime === 0) {
                        console.log("Tsunami Radio has not started yet.");
                    } else {
                        console.log("Paused at " + this.tfVideoStuff.currentTime);
                    }
                } else {
                    console.log("A song is still playing. Make the next song play using the functions");
                }
            }
        } else {
            if (this.tfVideoStuff.networkState === 3) {
                console.log("The network could not find the source.");
            } else {
                console.log("Some unknown error is going on with the Radio");
            }
        }
    }
    VideoState() {
        console.log("pointless change VideoState() to VideoLoadStarted()");
    }
    emptiedVideo() {
        this.VideoNetworkState();
    }
    loadVideo() {
        this.VideoNetworkState();
    }
    VideoLoadStarted() {
        /*
        if (this.tfVideoStuff.state === "suspended") {
            //this.tfVideoStuff.resume();
        } else if (this.tfVideoStuff.state === "running") {
            console.log("The Tsunami Commjnity Video Context state is running");
        } else {
            console.log("The Tsunami COmmunity Video COntext state must be closed");
        }
        */
    }
    loadedVideoMetadata(metadata){
        this.VideoNetworkState();
        this.tfVideoStuff.videoWidth;
        this.tfVideoStuff.videoHeight;
        /*
        //Start stuff here.
        //Combining stream
        const CombinedVidAndAudioStreams = new MediaStream([
            this.stream1.getVideoTracks()[0],
            this.stream2.getAudioTracks()[0]
        ]);

        this.stream1.getSettings();
        this.stream1.applyConstraints(TmediaFstreamConstraints);

        metadata.getAudioTracks().forEach(async (track) => {
            track.enabled = true;

        }); //mute
        metadata.getVideoTracks().forEach(track => track.enabled = true);
        */

        //Attach the Audio to the Audio Context or the geeAudioTracks thing.

        /*
        //Attach the video to the video Context
        const StreamingStuff = new MediaStream();
        StreamingStuff.addTrack(stream);
        StreamingStuff.addEventListener("addtrack", async (track) => {
            console.log("Track Added " + track.track);
        });
        StreamingStuff.addEventListener("removetrack", async (track) => {
            console.log("Track removed " + track.track);
        })
        const videoTracks = StreamingStuff.getVideoTracks();
        */
        /*
            videoTracks[0].enabled;
            videoTracks[0].readyState;
            videoTracks[0].label;
            videoTracks[0].kind;
    
            videoTracks[0].applyConstraints();
    
            videoTracks[0].stop();
        
        videoTracks.addEventListener("ended", async (ended) => {
            console.log("Video Eneded");
        });

        videoTracks.addEventListener("muted", async (muted) => {
            console.log("The video is muted");
        });

        videoTracks.addEventListener("unmuted", async (unmuted) => {
            console.log("The video is unmuted");
        })
        */

        //ctx.drawImage(tfVideoStuff, 0, 0, canvas.width, canvas.height);
    }
    loadedVideoData() {
        this.VideoState();
    }
    canPlayVideo() {
        if(this.canvas !== null) {
            

        } else {
            this.canvas = document.createElement("canvas");
        }
    }
    canPlayVideoThrough(){
        this.VideoState();
        this.tfVideoStuff.play();
    }
    playVideo(){
        this.VideoState();
        if (this.isRecording) {

        } else {
            //Media Recorder
            const tfVidRecorder = new MediaRecorder(stream);
            let tfVidChunks = [];

            tfVidRecorder.ondataavailable = async (e) => {
                tfVidChunks.push(e.data);
                tfVidRecorder.onstop = async (e) => {
                    const tfVidBlob = new Blob(tfVidChunks, {
                        type: "video/webm"
                    });
                    const tfVidUrl = URL.createObjectURL(tfVidBlob);
                    const tfAhref = document.createElement("a");
                    tfAhref.href = TfVidUrl;
                    tfAhref.download = "recorded.webm";
                    tfAhref.click();
                };
                tfVidRecorder.start();
            };
        }
    }
    pauseVideo(){
        this.VideoState();
    }
    VideoEnded(){
        console.log("The video has ended");
    }
    VideoWaiting(){
        this.VideoState();
    }
    VideoPlaying(){
        this.VideoState();
    }
    VideoStalled(){
        console.log("The video has stalled");
    }
    VideoSuspended(){
        this.VideoNetworkState();

    }
    FormatVideoTime(seconds) { 
        let m = Math.floor(seconds / 60); let s = seconds % 60; return `${m}:${s.toString().padStart(2,"0")}`;
    }
    UpdateVideoTime(){
        /*
        let TimingVideo = Math.floor(this.tfVideoStuff.currentTime);
        let UsingTfVidTk = `Time: ${this.FormatVideoTime(TimingVideo)}`;
        let VideoProcessBar = (this.tfVideoStuff.currentTime / this.tfVideoStuff.duration) * 100;
        */
    }
    VideoVolumeChange(){
        console.log("The video volume has changed");
    }
    processVideoFrames(){
        console.log("not done working on this");
        /*
        while (true) {
            //const { value: frame, done } = await tfVidReader.read();

            /*
            if (done) {
                break;
            } else {

            }
            frame.close();
            
        }
        */
    }
    usePickedColor() {
        this.useChromaKeyWebcam = true;
        this.VideoSystemControllerButton.style.display = "inline";
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
    ColorPickerChromaKey(chroma){
        const Tfhex = chroma.target.value;
        const rgb = parseInt(hex.slice(1), 16);
        this.chromaKeyColorWebcam.r = (rgb >> 16) & 255;
        this.chromaKeyColorWebcam.g = (rgb >> 8) & 255;
        this.chromaKeyColorWebcam.b = rgb & 255;
    }
    ApplyTfChromaKey(thing){

        if(thing === "webcam"){
            /*
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
            */
        } else if (thing === "canvas"){
            //Apply chromakey after webcam is put on the canvas instead of before. 
                /*
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
            */

        } else if (thing === "video") {
            //current code below is drawing the video to the canvas, and then getting the pixel data, and then turning it into GreenScreen or aka manipulating it.
            //Draw the video directly to canvas.
            //ctx.drawImage(this.tfVideoStuff, 0, 0, canvas.width, canvas.height); 
            
            //Get pixel data.
            //const TfVidDrawFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);

            //mainpulate pixel
            //ctx.putImageData(TfVidDrawFrame, 0 ,0);
            requestAnimationFrame(DrawVideo);
        } else {
            //nothing 
        }
    }
    RemoveChromaKeyColor() {
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        //frameCounter = 0
        this.useChromaKeyWebcam = false;
    }
    startWebcam(){
        this.WebcamStreamVideoAndAudio = navigator.mediaDevices.getUserMedia(this.TmediaFstreamConstraints).then(async (stream) => {
        //AudioStream
        //this.WebcamAudioStream = new MediaStream(stream);
        
        //mediaStream
        //this.emptyStream = new MediaStream();
        this.WebcamVideoStream = new MediaStream(stream);

        this.tfVideoStuff.srcObject = stream;
        //this.tfVideoStuff.play();
        //animate();

        this.tfVideoStuff.addEventListener("emptied", async () => {
            console.log("The Tsunami Community Video has been emptied.");

        }); //The media has become empty; for example, this event is sent if the media has already been loaded( or partially loaded), and the HTMLMediaElement.load method is called to reload it.

        this.tfVideoStuff.addEventListener("load", async () => {

        }); //The resource has been loaded.
        this.tfVideoStuff.addEventListener("loadstart", async () => {
            console.log("The Tsunami Community Video has started loading.");

        });//Fired when the browser has started to load teh resource.

        this.tfVideoStuff.addEventListener("loadedmetadata", async (metadata) => {
            console.log("The Tsunami COmmunity Video metadata has started to load.");


        });

        this.tfVideoStuff.addEventListener("loadeddata", async () => {
            console.log("The data has loaded");

        }); // The first frame of the mdeia has finished loading.

        this.tfVideoStuff.addEventListener("canplay", async () => {
            console.log("The Tsunami Video Community can play this part.");

            //create canvas
        });

        this.tfVideoStuff.addEventListener("canplaythrough", async () => {

        }); //The browser estimates it can play the media up to its ends without stopping for content buffering.

        this.tfVideoStuff.addEventListener("play", () => {
            console.log("The Video should be playing");
        }); //Playback has begun.

        this.tfVideoStuff.addEventListener("pause", async () => {

        }); //playback has been paused.

        this.tfVideoStuff.addEventListener("ended", async () => {
            console.log("The video should have ended");
        });

        this.tfVideoStuff.addEventListener("waiting", async (waiting) => {
            console.log("The Video should be waiting");
        }); //Playback has stopped because of a temporary lack of data.

        this.tfVideoStuff.addEventListener("playing", async () => {
            console.log("The video should be playing");
        }); //Playback is ready to start after having been paused or delayed due to lack of data.

        this.tfVideoStuff.addEventListener("stalled", async (stalled) => {
            console.log(`The Tsunami Community Video has stalled for some reason. ${stalled} <br /> here is the supposed song path: input the real path here later.`);
        });

        this.tfVideoStuff.addEventListener("suspended", async (suspend) => {

        });

        this.tfVideoStuff.addEventListener("timeupdate", () => {
            //function 


        });

        this.tfVideoStuff.addEventListener("volumechange", async () => {

        });
        }).catch(async (error) => {
            console.error(error);
        });
    }
    stopWebcam(){
        console.log("Stop the webcam");
    }
    VideoWebCodecs(stream){
        this.VideoProcessor = new MediaStreamTrackProcess({
            track: stream.getVideoTracks()[0]
        });
        this.VideoReader = this.VideoProcessor.readable.getReader();
    }
    VideoWebRTC(stream) {
        this.VideoDevice = new RTCPeerConnection();
        stream.getTracks().forEach(track => this.VideoDevice.addTrack(track, stream));
    }
    VideoScreenSharing(){
        console.log("Start Video Sharing");
        //navigator.mediaDevices.getDisplayMedia(TmediaFstreamConstraints).then(async (stream) => { // use stream})
    }
    startRecording(){
        console.log("start recording");

        /*
        recordedChunks = [];
        let canvasStream = homepageCanvas.captureStream();
        let mediaStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...this.tfVideoStuff.srcObject.getAudioTracks() // Include audio from video stream
        ]);
        mediaRecorder = new MediaRecorder(mediaStream);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
            const randomSrc = URL.createObjectURL(recordedBlob);
            const a = document.createElement("a");
            a.style.display = 'none';
            a.href = url;
            a.download = 'recording.webm';
            document.body.appendChild(a);
            a.click();
            URL.revoke.ObjectURL(url);
            Tframe4u.href = randomSrc;
            Tframe4u.download = "RecordedVideo.webm";
            Tframe4u.style.display = 'block';
            Tframe4u.textContent = 'Download Video';
        };

        mediaRecorder.start();
        TframeIsRecording = true;
        TframeStRec.disabled = true;
        TframeStRec.style.display = "none";
        TframeSpRec.disabled = false;
        TframeSpRec.style.display = "inline";

        */
    }
    stopRecording(){
        console.log("Stop Recording");
    /*
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            TframeIsRecording = false;
            TframeStRec.disabled = false;
            TframeStRec.style.display = "inline";
            TframeSpRec.disabled = true;
            TframeSpRec.style.display = "none";
        }
    */
    }
    DownloadRecording(){
        console.log("Placeholder for download Video");
        /*
        const link = document.createElement('a');
        link.download = 'canvas-video.webm'; // make this a variable like prompot or something 
        link.href = hpCC.toDataURL('video/webm');
        link.click();
        */
    }
    RemoveImage(){
        console.log("placeholder for RemoveImage");
        /*
        TbackgroundFImage = null;
        hpCC.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear the canvas
        TframeStBtn.style.display = 'none'; // Hide start button
        TframeByeImg.style.display = 'none'; // Hide remove button
        */
    }
    RemoveVideo(){
        console.log("Placeholder for remove video");
    /*
        if (TbackgroundFVideo) {
            TbackgroundFVideo.pause();
            TbackgroundFVideo.currentTime = 0; // Reset the video to the beginning
            TbackgroundFVideo = null; // Clear the video reference
            hpCC.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear the canvas
        }
        TframeStBtn.style.display = 'none'; // Hide start button
        TframeByeVid.style.display = 'none'; // Hide remove button
    */
    }
    VideoSystemStart() {
        console.log("Placeholder for system start");
    /*
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
    */
    }
    VideoSystemStop() {
        this.isPlaying = false;
        //cancelAnimationFrame(animationId);
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        /*
        if (webcamStream) {
            const tracks = webcamStream.getTracks();
            tracks.forEach(track => track.stop());
            tfVidStuff.srcObject = null;
            webcamStream = null;
        }
        */
       this.VideoSystemControllerStopButton.style.display = "none";
    }
    IDontKnowYetButMainAddEventListenersIThink(){
        console.log("placeholder for main")
    /*
        TFcolorPicker.addEventListener('input', (e) => {

        });

        // Use chroma key color for webcam
        TfCpBtn.addEventListener('click', () => {

        });

        // Remove chroma key color button
        TfCpRm.addEventListener('click', () => {

        });

        //Green Screen Ends

        TframeSpBtn.addEventListener('click', () => {

        });

        TframeStRec.addEventListener('click', () => {

        });

        TframeSpRec.addEventListener('click', () => {

        });

        Tframe4u.addEventListener('click', () => {

        });

        TframeULimg.addEventListener('change', (e) => {

        });

        TframeULvid.addEventListener('change', (e) => {

        });

        TframeByeImg.addEventListener('click', () => {

        });

        TframeByeVid.addEventListener('click', () => {

        });

        document.getElementById("TcameraFlipButton").onclick = () => {
            whichCamera = !whichCamera;
        }

        TframeCtrBtn.addEventListener('click', () => {

        });
    */
    }
}

export class tfVGbaby {

    cry() {
        console.log("crying");
    }
    laugh() {
        console.log("laughing");
    }
    crawl() {
        console.log("crawling");
    }
}

export class tfVGtoddler extends tfVGbaby {
    constructor() {

    }
}

export class tfVGkid extends tfVGtoddler {
    constructor() {

    }
}

export class tfVGpreteen extends tfVGkid {
    constructor() {

    }
}

export class tfVGteen extends tfVGpreteen {
    constructor() {

    }
}

export class tfVGyoungAdult extends tfVGteen {
    constructor() {

    }
}

export class tfVGadult extends tfVGyoungAdult {
    constructor() {

    }
}

export class tfVGmatureAdult extends tfVGadult {
    constructor() {

    }
}

export class tfVGolderAdult extends tfVGmatureAdult {
    constructor() {

    }
}

export class tfVGelderAdult extends tfVGolderAdult {
    constructor() {

    }
}

export class tfVGlegendaryAdult extends tfVGelderAdult {
    constructor() {

    }
}

export class tfVGmythicalAdult extends tfVGlegendaryAdult {
    constructor() {

    }
}