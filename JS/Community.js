/*
let TfWebSocket = new WebSocket("wss://world.tsunamiflow.club/websocket");

TfWebSocket.onopen = () => {
    console.log("WebSocket connected!");
};


TfWebSocket.onmessage = (TF) => {
    console.log("WebSocket Message Sent");
};

TfWebSocket.onclose = () => {
    console.log("WebSocket closed.");
}

TfWebSocket.onerror = (error) => {
    console.log(`WebSocket connection is not working.  error: ${error}`);
}
*/
//Iframe Buttons
let TframeULvid = document.createElement("button");
TframeULvid.id = "TfUploadShit";
let TframeULimg = document.createElement("button");
TframeULimg.id = "TfUploadOtherShit";

let TframeCtrBtn = document.createElement("button");
TframeCtrBtn.id = "TfControlShit";

let TframeStBtn = document.createElement("button");
TframeStBtn.id = "TfStartShit";
let TframeSpBtn = document.createElement("button");
TframeSpBtn.id = "TfStopShit";

let TframeStRec = document.createElement("button");
TframeStRec.id = "TfStartRecPlz";
let TframeSpRec = document.createElement("button");
TframeSpRec.id = "TfStopRecPlz";

let TframeByeImg = document.createElement("button");
TframeByeImg.id = "rmvTFimg";

let TframeByeVid = document.createElement("button");
TframeByeVid.id = "rmTFvid";

let Tframe4u = document.createElement("button");
Tframe4u.id = "IframeDownload";

export let useChromaKeyWebcam = false;

//Video
export const tfVidStuff = document.createElement("video");
tfVidStuff.id = "TsunamiFlowVideoStuff";
tfVidStuff.controls = true;
tfVidStuff.autoplay = false;
tfVidStuff.loop = false;
tfVidStuff.muted = false;
tfVidStuff.poster = "./Pictures/Logo/Tsunami Flow Logo.png";

export let whichCamera = true;

export const TFcolorPicker = document.createElement("button");
TFcolorPicker.id = "TFchromaKey";

export const TfCpBtn = document.createElement("button");
TfCpBtn.id = "TuseFthisKeycolor";
export const TfCpRm = document.createElement("button");
TfCpRm.id = "rmvTFchromakey";

let TmediaFstreamConstraints = {
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

export const chromaKeyColorWebcam = { r: 0, g: 255, b: 0 };

/*
TFcolorPicker.addEventListener("input", (chroma) => {
    const hex = chroma.target.value;
    const rgb = parseInt(hex.slice(1), 16);
    chromaKeyColorWebcam.r = (rgb >> 16) & 255;
    chromaKeyColorWebcam.g = (rgb >> 8) & 255;
    chromaKeyColorWebcam.b = rgb & 255;
});
*/

let TbackgroundFVideo = null;
let TbackgroundFImage = null;
let webcamStream;

//Recording 
export let TframeIsRecording = false;

async function gettingVideoRight() {

}

TframeStBtn.addEventListener("click", async () => {
    //Get Camera and Mic
    navigator.mediaDevices.getUserMedia(TmediaFstreamConstraints).then(async (stream) => {
        //Put video in the source 
        tfVidStuff.srcObject = stream;
        tfVidStuff.src = stream;

        if (tfVidStuff.readyState === 0) {
            console.log("Radio readyState is HAVE_NOTHING aka no data yet.");
            if (tfVidStuff.networkState == 0) {
                console.log("Radio networkState has NETWORK_EMPTY");
                if (tfVidStuff.src == "") {
                    console.log("The radio source is ''");
                } else if (!tfVidStuff.src) {
                    ("The radio source does not exist");
                } else if (tfVidStuff.src == " ") {
                    console.log("The radio source is ' '");
                } else if (tfVidStuff.src == "about:blank") {
                    console.log("The radio source is about:blank");
                }
                else {
                    console.log("Something else is going on and I dont know what it is.");
                }
            } else if (tfVidStuff.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (tfVidStuff.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE");
                //No valid source
            }
        } else if (tfVidStuff.readyState === 1) {
            console.log("Radio readyState is HAVE_METADATA");
            if (tfVidStuff.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (tfVidStuff.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (tfVidStuff.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE (but during the have metadata point.");
                //No valid source
            }
        } else if (tfVidStuff.readyState === 2) {
            console.log("Radio readyState is HAVE_CURRENT_DATA");
            if (tfVidStuff.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (tfVidStuff.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (tfVidStuff.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE but during the have ;loading point.");
                //No valid source
            }
        } else if (tfVidStuff.readyState === 3) {
            console.log("Radio readyState is HAVE_FUTURE_DATA");
            if (tfVidStuff.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (tfVidStuff.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE during the canplay point.");
                //No valid source
            }
        } else if (tfVidStuff.readyState === 4) {
            console.log("Radio readyState is HAVE_ENOUGH_DATA");
            if (tfVidStuff.networkState == 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (tfVidStuff.networkState == 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (tfVidStuff.networkState == 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE during the canplaythrough point.");
                //No valid source
            }

            if (tfVidStuff.ended) {
                if (tfVidStuff.src = "") {

                } else if (tfVidStuff.src = undefined) {

                } else if (!tfVidStuff.src) {

                } else {

                }
            } else {
                if (tfVidStuff.paused) {
                    if (tfVidStuff.currentTime === 0) {
                        console.log("Tsunami Radio has not started yet.");
                    } else {
                        console.log("Paused at " + tfVidStuff.currentTime);
                    }
                } else {
                    console.log("A song is still playing. Make the next song play using the functions");
                }
            }
        } else {
            if (tfVidStuff.networkState === 3) {
                console.log("The network could not find the source.");
            } else {
                console.log("Some unknown error is going on with the Radio");
            }
        }
        //tfVidStuff.play();
        //tfVidStuff.pause();

        /*
        async function DrawVideo() {
            //Draw the video directly to canvas.
            ctx.drawImage(tfVidStuff, 0, 0, canvas.width, canvas.height); 
            
            //Get pixel data.
            const TfVidDrawFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);

            //mainpulate pixel
            tx.putImageData(TfVidDrawFrame, 0 ,0);
            requestAnimationFrame(DrawVideo);
        }
        */
        tfVidStuff.addEventListener("emptied", async () => {
            console.log("The Tsunami Community Video has been emptied.");
            if (tfVidStuff.networkState === tfVidStuff.NETWORK_NO_SOURCE) {
                console.log("The Tsunami Community Video Network State is NETWORK_NO_SOURCE");
            } else if (tfVidStuff.networkState === tfVidStuff.NETWORK_IDLE) {
                console.log("The Tsunami Community Video Network State is NETWORK_IDLE");
            } else if (tfVidStuff.networkState === tfVidStuff.NETWORK_LOADING) {
                console.log("The Tsunami Community Video Network State is NETWORK_LOADING");
            }
        }); //The media has become empty; for example, this event is sent if the media has already been loaded( or partially loaded), and the HTMLMediaElement.load method is called to reload it.

        tfVidStuff.addEventListener("load", async () => {
            console.log("The Tsunami Community Video has loaded.");
            if (tfVidStuff.networkState === tfVidStuff.NETWORK_IDLE) {
                console.log("The Tsunami Community Video Network State is NETWORK_IDLE");
            } else if (tfVidStuff.networkState === tfVidStuff.NETWORK_LOADING) {
                console.log("The Tsunami Community Video Network State is NETWORK_LOADING");
            } else if (tfVidStuff.networkState === tfVidStuff.NETWORK_NO_SOURCE) {
                console.log("The Tsunami Community Video Network State is NETWORK_NO_SOURCE");
            }
        }); //The resource has been loaded.
        tfVidStuff.addEventListener("loadstart", async () => {
            console.log("The Tsunami Community Video has started loading.");

        });//Fired when the browser has started to load teh resource.

        tfVidStuff.addEventListener("loadedmetadata", async (metadata) => {
            console.log("The Tsunami COmmunity Video metadata has started to load.");

            tfVidStuff.videoWidth;
            tfVidStuff.videoHeight;
            let stream1;
            let stream2;


            //Start stuff here.
            //Combining stream
            const CombinedVidAndAudioStreams = new MediaStream([
                stream1.getVideoTracks()[0],
                stream2.getAudioTracks()[0]
            ]);

            stream1.getSettings();
            stream1.applyConstraints(TmediaFstreamConstraints);

            stream.getAudioTracks().forEach(async (track) => {
                track.enabled = true;

            }); //mute
            stream.getVideoTracks().forEach(track => track.enabled = true);

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
            */
            videoTracks.addEventListener("ended", async (ended) => {
                console.log("Video Eneded");
            });

            videoTracks.addEventListener("muted", async (muted) => {
                console.log("The video is muted");
            });

            videoTracks.addEventListener("unmuted", async (unmuted) => {
                console.log("The video is unmuted");
            })

            ctx.drawImage(tfVidStuff, 0, 0, canvas.width, canvas.height);
        });

        tfVidStuff.addEventListener("loadeddata", async () => {
            console.log("The data has loaded");
            if (tfVidStuff.state === "suspended") {
                tfVidStuff.resume();
            } else if (tfVidStuff.state === "running") {
                console.log("The Tsunami Commjnity Video Context state is running");
            } else {
                console.log("The Tsunami COmmunity Video COntext state must be closed");
            }
        }); // The first frame of the mdeia has finished loading.

        tfVidStuff.addEventListener("canplay", async () => {
            console.log("The Tsunami Video Community can play this part.");

            if (tfVidStuff.state === "suspended") {
                console.log("The Tsunami Video Community context state is suspended");
                tfVidStuff.resume();
            } else if (tfVidStuff.state === "running") {
                console.log("The Tsunai Video Community context state is running");
            } else {
                console.log("The Tsunami Video COmmunity context state must be closed");
            }

            //Start Visualizer here aka canvas here 
            if (tfVidCanvas !== null) {
                //TfVideoVisualizer(stream);
            } else {
                console.log("The canvas is null so i am getting it again.");
                //Create tfVidCamvas

                //TfVideoVisualizer(stream);
            }
        });

        tfVidStuff.addEventListener("canplaythrough", async () => {
            if (tfVidStuff.state === "suspended") {
                //tfVidStuff.resume();
            } else if (tfVidStuff.state === "running") {
                console.log("the Tsunami Video COmmunity Context State is running");
            } else {
                console.log("The Tsunami Video Community Context state must be closed");
            }
            tfVidStuff.play();
        }); //The browser estimates it can play the media up to its ends without stopping for content buffering.

        tfVidStuff.addEventListener("play", () => {
            console.log("The Video should be playing");
            if (isRecording) {
                //Restart drawing if the video is played.
            } else {

            }
            if (tfVidStuff.state === "suspended") {
                tfVidStuff.resume();
            } else if (tfVidStuff.state === "running") {
                console.log("The Tsunami Video Community context state is running");
            } else {
                console.log("The Tsunami Video COmmunity Context state must be closed");
            }

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
        }); //Playback has begun.

        tfVidStuff.addEventListener("pause", async () => {
            console.log("the Tsunami Video COmmunity should be paused");
            if (tfVidStuff.state === "suspended") {
                //Stop Visualizer();
            } else if (tfVidStuff.state === "running") {
                console.log("the Tsunami Video COmmunity context state is running");
            } else {
                console.log("The Tsunami Video COmmunity context state must be closed");
                //Stop visualizer();
            }
        }); //playback has been paused.

        tfVidStuff.addEventListener("ended", async () => {
            console.log("The video should have ended");
        });

        tfVidStuff.addEventListener("waiting", async (waiting) => {
            console.log("The Video should be waiting");
            if (tfVidStuff.state === "suspended") {
                console.log("Tsunami COmmunity Video is waiting for some reason. " + waiting);

                console.log(`The Tsunami Community Video Context state is suspended`);

                //Video Context.resume();
            } else if (tfVidStuff.state === "running") {
                console.log("The Tsunami Community Video is waiting for some reason " + waiting);

                console.log(`The Tsunami Video COmmunity Context state is running`);

                //VideoContext.suspend();
            } else {
                console.log("The Tsunami COmmunity Video Context must be closed");
            }
        }); //Playback has stopped because of a temporary lack of data.

        tfVidStuff.addEventListener("playing", async () => {
            console.log("The video should be playing");
            //Ensure video is actively rendering before rendering before enabling interactions
            if (tfVidStuff.state === "suspended") {
                //audio or video context.resume();
            } else {

            }
        }); //Playback is ready to start after having been paused or delayed due to lack of data.

        tfVidStuff.addEventListener("stalled", async (stalled) => {
            console.log(`The Tsunami Community Video has stalled for some reason. ${stalled} <br /> here is the supposed song path: input the real path here later.`);
        });

        tfVidStuff.addEventListener("suspended", async (suspend) => {
            if (tfVidStuff.networkState === tfVidStuff.NETWORK_IDLE) {
                console.log("Tsunami Community Video has been suspended " + suspend);
            } else if (tfVidStuff.readyState < tfVidStuff.HAVE_ENOUGH_DATA) {
                //tfVidStuff.load();
            }
        });

        tfVidStuff.addEventListener("timeupdate", () => {
            //function FormatVideoTime(seconds) { let m = Math.floor(seconds / 60); let s = seconds % 60; return `${m}:${s.toString().padStart(2,"0")}`;};

            /*
            let TimingVideo = Math.floor(tfVidStuff.currentTime);
            let UsingTfVidTk = `Time: ${FormatVideoTime(TimingVideo)}`;
            let VideoProcessBar = (tfVidStuff.currentTime / tfVidStuff.duration) * 100;
            */
        });

        tfVidStuff.addEventListener("volumechange", async () => {

        });

        //WebRTC
        //const tfVidPc = new RTCPeerConnection();
        //stream.getTracks().forEach(track => tfVidPc.addTrack(track, stream));

        //Video

        //WebCodecs
        //const tfVidProcessor = new MediaStreamTrackProcess({track: stream.getVideoTracks()[0]});
        //const tfVidReader = tfVidProcessor.readable.getReader();

        async function processVideoFrames() {
            while (true) {
                //const { value: frame, done } = await tfVidReader.read();

                if (done) {
                    break;
                } else {

                }
                frame.close();
            }
        }

        //processVideoFrames();
        //WebCodecs Ends

        //return new Promise((resolve) => { tfVideStuff.onplaying = resolve; })
    }).catch(async (error) => {
        console.error(error);
    });

    //Get Screen Sharing
    //navigator.mediaDevices.getDisplayMedia(TmediaFstreamConstraints).then(async (stream) => { // use stream})
});