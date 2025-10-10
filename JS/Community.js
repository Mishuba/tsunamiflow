import { TfVideo } from "./Video.js";

let VideoElement = document.getElementById("TsunamiFlowVideoStuff");

let MishubaVideo = new TfVideo();

export async function StartVideoOrWebcam(Shuba, videoElement) {
    //Shuba.VideoAudioElement = audioElement;//Create Audio Element;
    Shuba.VideoElement = videoElement;
    Shuba.VideoAudioContext = new (window.AudioContext || window.webkitAudioContext)();

    Shuba.VideoWebSocket = new WebSocket("wss://world.tsunamiflow.club/websocket");

    Shuba.VideoNetworkState(Shuba.VideoElement);

    Shuba.TfWebcam = navigator.mediaDevices.getUserMedia(Shuba.TmediaFstreamConstraints).then(async (stream) => {
        Shuba.WebcamVideoStream = new MediaStream(stream);
        Shuba.VideoAudioAnalyser = Shuba.VideoAudioContext.createAnalyser();
        Shuba.VideoAudioAnalyser.fftSize = 2048;
        Shuba.VideoAudioMedia = Shuba.VideoAudioContext.createMediaStreamSourceStream(stream);
        Shuba.VideoAudioMediaDestination = Shuba.VideoAudioContext.createMediaStreamDestination();
        Shuba.VideoAudioAnalyser.connect(Shuba.VideoAudioMediaDestination);

        Shuba.LetsBegin(Shuba.WebcamStreamVideoAndAudio, Shuba.VideoElement);

        //Shuba.WebcamAudioStream = Shuba.VideoAudioMediaDestination.stream.getAudioTracks();
        //Shuba.WebcamStreamVideoAndAudio = new MediaStream([
        //    ...Shuba.VideoProcessedStream.getVideoTracks(),
        //    ...Shuba.WebcamAudioStream;
        //]);

    }).catch(error => console.error("Camera Error:", error));
}

StartVideoOrWebcam(MishubaVideo, VideoElement);

/*
This is for the ffpmeg link to file to improve the live stream function of the website. 
// /var/www/scripts/ffpmeg-restream.sh 

I keep forgetting about this file. 
"/etc/streamkeys.json"
*/