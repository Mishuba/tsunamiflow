
//Version 1 Below
// WebRTC for live video and live chat
let connectButton, disconnectButton, sendButton, messageInputBox, receiveBox;
let sendChannel, receiveChannel, remoteConnection;
let targetUsername = null;

const TFconfig = {
    iceServers: [
        { //env variable
            urls: "stun:stun.cloudflare.com:3478"
        }
    ],
    bundlePolicy: "max-bundle"
};

let TFpcWrtc = new RTCPeerConnection(TFconfig);
const TFconstraintsWrtc = { audio: true, video: true };
const TFselfVideoWrtc = document.getElementById("local_video");
const TFremoteVideoWrtc = document.getElementById("received_video");
const TFsignalerWrtc = new WebSocket("wss://world.tsunamiflow.club/websocket");

const supportsEncodedTransforms = window.RTCRtpSender && "transform" in RTCRtpSender.prototype;

function sendToServer(msg) {
    const msgJSON = JSON.stringify(msg);
    try {
        TFsignalerWrtc.send(msgJSON);
    } catch (err) {
        console.error("Error sending message to WebSocket server: ", err);
        alert("Error sending message to the server.");
    }
}

function handleGetUserMediaError(e) {
    switch (e.name) {
        case "NotFoundError":
            alert("Unable to open your call because no camera and/or microphone were found.");
            break;
        case "SecurityError":
        case "PermissionDeniedError":
            alert("Permission to use camera and/or microphone was denied.");
            break;
        default:
            alert(`Error opening your camera and/or microphone: ${e.message}`);
            break;
    }
    closeVideoCall();
}

async function TFtranformationWrtc() {
    try {
        const desc = new RTCSessionDescription(msg.sdp);
        await TFpcWrtc.setRemoteDescription(desc);
        await navigator.mediaDevices.getUserMedia(TFconstraintsWrtc);
    } catch (err) {
        console.error("Error setting remote description or getting user media: ", err);
        alert("Error during WebRTC setup.");
        return;
    }

    if (supportsEncodedTransforms) {
        TFpcWrtc.ontrack = (TFeventWrtc) => {
            try {
                const TFtrackWorkWrtc = new Worker("/JS/NewsTransformWorker.js");
                TFeventWrtc.receiver.transform = new RTCRtpScriptTransform(TFtrackWorkWrtc, { name: "receiverTransform" });
                if (TFeventWrtc.streams && TFeventWrtc.streams[0]) {
                    TFremoteVideoWrtc.srcObject = TFeventWrtc.streams[0];
                }
            } catch (err) {
                console.error("Error handling incoming media track: ", err);
                alert("An error occurred while processing the incoming video stream.");
            }
        };
    } else {
        TFpcWrtc.ontrack = ({ TFtrackWrtc, TFstreamWrtc }) => {
            try {
                const [TFtrack] = TFstreamWrtc.getTracks();
                TFpcWrtc.addTrack(TFtrack, TFstreamWrtc);
                TFremoteVideoWrtc.srcObject = TFstreamWrtc;
            } catch (err) {
                console.error("Error adding track: ", err);
                alert("An error occurred while processing the incoming video stream.");
            }
        };
    }
}

TFpcWrtc.oniceconnectionstatechange = (event) => {
    switch (TFpcWrtc.iceConnectionState) {
        case "closed":
            console.log("Connection closed");
            closeVideoCall();
            break;
        case "failed":
            console.error("ICE connection failed");
            alert("The connection failed. Please try again.");
            TFpcWrtc.restartIce();
            break;
        case "disconnected":
            console.warn("ICE connection disconnected");
            alert("You have been disconnected.");
            break;
        default:
            break;
    }
};

TFpcWrtc.onicecandidate = async ({ candidate }) => {
    try {
        if (candidate) {
            await TFpcWrtc.addIceCandidate(candidate);
            sendToServer({ candidate });
        }
    } catch (err) {
        console.error("Error adding ICE candidate: ", err);
        alert("Error occurred while processing ICE candidate.");
    }
};

TFsignalerWrtc.onmessage = async ({ data: { description, candidate } }) => {
    try {
        if (description) {
            await TFpcWrtc.setRemoteDescription(description);
            if (description.type === "offer") {
                await TFpcWrtc.setLocalDescription();
                sendToServer({ description: TFpcWrtc.localDescription });
            }
        } else if (candidate) {
            await TFpcWrtc.addIceCandidate(candidate);
        }
    } catch (err) {
        console.error("Error handling WebSocket message: ", err);
        alert("Error handling WebSocket message.");
    }
};

function closeVideoCall() {
    try {
        if (TFpcWrtc) {
            TFpcWrtc.close();
            TFpcWrtc = null;
        }

        if (TFremoteVideoWrtc.srcObject) {
            TFremoteVideoWrtc.srcObject.getTracks().forEach((track) => track.stop());
        }

        if (TFselfVideoWrtc.srcObject) {
            TFselfVideoWrtc.srcObject.getTracks().forEach((track) => track.stop());
        }

        sendChannel.close();
        sendChannel = null;

        receiveChannel.close();
        receiveChannel = null;

        remoteConnection.close();
        remoteConnection = null;
    } catch (err) {
        console.error("Error during cleanup: ", err);
    }

    connectButton.disabled = false;
    disconnectButton.disabled = true;
    sendButton.disabled = true;
    messageInputBox.value = "";
    messageInputBox.disabled = true;
    document.getElementById("hangup-button").disabled = true;

    sendToServer({
        name: localStorage["username"],
        target: targetUsername,
        type: "hang-up",
    });
}

function wRTCdisconnectPeers() {
    closeVideoCall();
}

function wRTCsendMessage() {
    const message = messageInputBox.value;
    sendChannel.send(message);
    messageInputBox.value = "";
    messageInputBox.focus();
}

function handleReceiveMessage(event) {
    const messageElement = document.createElement("p");
    messageElement.textContent = event.data;
    receiveBox.appendChild(messageElement);
}

function handleUserListMsg(msg) {
    const listElem = document.querySelector(".user-list-box");
    listElem.innerHTML = "";
    msg.users.forEach((username) => {
        const item = document.createElement("li");
        item.textContent = username;
        listElem.appendChild(item);
    });
}

function invite(evt) {
    const targetUser = evt.target.textContent;
    if (targetUser === localStorage["username"]) {
        alert("You can't call yourself!");
    } else if (TFpcWrtc) {
        alert("You are already in a call!");
    } else {
        targetUsername = targetUser;
        startVideoCall();
    }
}

function startVideoCall() {
    if (!targetUsername) {
        alert("Target user is not set.");
        return;
    }

    // Enable the video/audio input
    navigator.mediaDevices.getUserMedia(TFconstraintsWrtc)
        .then((stream) => {
            // Display local video
            TFselfVideoWrtc.srcObject = stream;

            // Add the local stream track to the peer connection
            stream.getTracks().forEach(track => {
                TFpcWrtc.addTrack(track, stream);
            });

            // Create data channels for messaging
            sendChannel = TFpcWrtc.createDataChannel("chat", {
                ordered: true,  // Guarantee delivery order
            });

            // Setup data channel event handlers
            sendChannel.onopen = () => {
                console.log("Data channel opened.");
                sendButton.disabled = false;
            };

            sendChannel.onclose = () => {
                console.log("Data channel closed.");
            };

            sendChannel.onmessage = handleReceiveMessage;

            // Start creating an offer and send it
            makeOffer();
        })
        .catch((err) => {
            console.error("Error accessing media devices: ", err);
            alert("Unable to access media devices.");
        });
}

function makeOffer() {
    TFpcWrtc.createOffer()
        .then((offer) => {
            return TFpcWrtc.setLocalDescription(offer);
        })
        .then(() => {
            sendToServer({
                name: localStorage["username"],
                target: targetUsername,
                type: "video-offer",
                description: TFpcWrtc.localDescription,
            });
        })
        .catch((err) => {
            console.error("Error creating or sending offer: ", err);
            alert("Error while trying to create an offer.");
        });
}


function checkHlsSupport() {
    if (Hls.isSupported()) {
        const videoPlayer = new Hls();
        TFpcWrtc.ontrack = (event) => {
            const stream = event.streams[0];
            TFremoteVideoWrtc.srcObject = stream;
        };
    }
}

function StartWebRTCup() {
    connectButton = document.getElementById("wRTCconnectButton");
    disconnectButton = document.getElementById("wRTCdisconnectButton");
    sendButton = document.getElementById("wRTCsendButton");
    messageInputBox = document.getElementById("wRTCmessage");
    receiveBox = document.getElementById("wRTCreceive-box");

    connectButton.addEventListener("click", TFtranformationWrtc, false);
    disconnectButton.addEventListener("click", wRTCdisconnectPeers, false);
    sendButton.addEventListener("click", wRTCsendMessage, false);
}

function init() {
    StartWebRTCup();
    checkHlsSupport();
}

init();