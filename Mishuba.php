<?php
require "config.php";
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title> Mishuba Go Live </title>
        <style>

        </style>
    </head>
    <body>
        <h1>Go Live</h1>
        <video id="MishubaLive" autoplay muted playsinline></video>

        <button id="StartLiveButton"> Start Live </button>
        <button it="StopLiveButton">Stop Live</button>

        <h2>Stream Info</h2>
        <form id="metaForm" action="" method="">
            <label>Title</label>
            <br />
            <input name="title" id="title" placeholder="Stream Title" />

            <label>Description</label>
            <br />
            <textarea name="description" id="description" placeholder="Stream Description"></textarea>

            <button type="submit">Update Twitch Stream</button>
            
            <script>
                let StartButton = document.getElementById("StartLiveButton");
                let StopBUtton = document.getElementById("StopLiveButton");

                let wss = null;
                let mediaRecorder = null;
                let loaclStream = null;

                StartButton.addEventListener("click", start);
                StopButton.addEventListener("click", stop);

                document.getElementById("metaForm").addEventListener("submit", async (event) => {
                    event.preventDefault();

                    const title = document.getElementById("description").value || "";

                    try {
                        //send httprequest to update twitch information endpoint.
                        //POST
                        //Header (Content-Type: application/json)
                        //JSON.stringify({The, information, right: ok});

                    } catch(error) {
                        log("Meta update error", error);
                        alert("Failed to update Twitch metadata");
                    }
                });

                async function start(){
                    StartButton.disabled = true;
                    log("Requesting camera/mic ... ");
                    try {
                        localStream = await navigator.mediaDevice.getUserMedia({audio: true, video: true});
                    }catch (error) {
                        log("GetUserMedia error", error);
                        StartButton.disabled = false;
                        return;
                    }

                    let source = document.createElement("video");
                    source.srcObject = localStream;

                    wss = new WebSocket(<?php echo (getenv("Ec2Websocket")); ?>); //wss://world.tsunamiflow.club/websocket?secret="Mishuba2FlyLive"

                    wss.binaryType = "arrayBuffer";

                    wss.onopen = () => {
                        log("wss open, starting MediaRecorder...");

                        let mime = "video/webm;codecs=vp8,opus";

                        if(!MediaRecorder.isTypeSupported(mime)) {
                            mime = "video/webm";
                        }

                        try {
                            mediaRecorder = new MediaRecorder(localStream, { mimeType: mime});
                        } catch (error) {
                            log("MediaRecorder constructor error:", error);
                            alert("MediaRecorder not supported / permission denied");
                            return;
                        }

                        mediaRecorder.ondataavailable = async (event) => {
                            if (!event.data || event.data.size === 0) {
                                return;
                            }

                            try {
                                const buffer = await event.data.arrayBuffer();

                                if (wss && wss.readyState === WebSocket.OPEN) {
                                    wss.send(buffer);
                                }
                            } catch (error) {
                                log("send chunk error", e);
                            }
                        };

                        mediaRecorder.onstop = () => {
                            log("MediaRecorder stopped");

                            if(wss && wss.readyState === WebSocket.OPEN) {
                                //Tell Server Stream Ended
                                try {
                                    wss.send(JSON.stringify({event: "END"}));
                                } catch (error) {

                                }
                            }
                        };

                        //small 100ms chunks
                        mediaRecorder.start(1000);
                        StopBUtton.disabled = false;
                        log("Recording started");

                        wss.onmessage = (message) => {
                            try {
                                const text = (typeof message.data === "string") ? message.data : null;

                                if (text) {
                                    log("Server:" , text);
                                } 
                            } catch(error) {

                            }
                        };

                        wss.onclose = () => {
                            log("WSS closed");
                            stop();
                        };

                        wss.onerror = (error) => {
                            log("WSs error", error);
                        };
                    }
                    
                    function stop() {
                        StopBUtton.disabled = true;
                        StartButton.disabled = false;
                        
                        if(mediaRecorder && mediaRecorder.state !== "inactive") {
                            mediaRecorder.stop();
                        }

                        if (localStream) {
                            localStream.getTracks().forEach(t => t.stop());
                            source.srcObject = null;
                            localStream = null;
                        }

                        if (wss && wss.readyState === WebSocket.OPEN) {
                            try {
                                wss.close();
                            } catch (error) {

                            }

                            wss = null;
                            log("Stopped");
                        }
                    }
                }
            </script>

        </form>
    </body>