import { StripeDonation } from "./tfPayments.js";
import { UniqueOriginal } from "./TfPrintful.js";
import { gameComponent } from "./planetuniverse.js";  
import { letsDoIt } from "./gamemechanics.js";  
import { ScreenShare } from "./ScreenSharer.js";  
import { TfMediaStream } from "./Streamer.js";  
import { TfWebRTCRecorder } from "./TfWebRtc.js";  
import { navButtons } from "./Objects.js";  
import { RadioTimes, WordTimes } from "./Arrays.js";  
//import { } from "./Classes.js";  
import { WordOfTheDay } from "./Words.js";  
import { NewsTimer } from "./News.js";  
import { Weather } from "./Weather.js";  
import { TfWebsocket } from "./TfWebSocket.js";  
import { TfEffects } from "./../WebWorker/Effects.js";  
import { User } from "./Users.js";  
import { TfMusic } from "./Audio.js";  
import { TfVideo } from "./Video.js";  
import { tfIframe } from "./TfIframe.js";  
import { HomepageUpdates, FirstGame } from "./sprite.js";  
import { WorkerManager } from "./../WebWorker/worker.js";  
import { TfWebcam } from "./webcam.js";  
import { TfRecorder } from "./recorder.js";  
import { TfAudioMixer } from "./Mixer.js";  
import { MishubaController } from "./default.js";  
  
if (navigator.cookieEnabled) {  
  //use cookies  
  console.log("Cookies are enabled");  
} else {  
  //don't use cookies   
  console.log("Cookies are not enabled");  
} 

 
/// create an xmlhttprequest for the client key and then put it below
let TsunamiPay = new StripeDonation("pk_live_51LEZXZDEt62FFVusTpTno0riC4cY20IoRtuiM2UnA3AHUdwAAxRj3qaev1RUwonD1pSzOOLmDYUXg9NiOBngYfUy005Tw1msUZ");

let TsunamiPrintful = new UniqueOriginal();

/*
  const data = JSON.parse(xhr.responseText);
  console.log("Printful items:", data.items);
renderPrintfulItems(data.items);
*/
const linkToSpriteSheet = "./Pictures/Games/Sprites/Stickman/Sheets/standingNwalking.png";  
const AckmaHawkBattleBackground = "./Pictures/Logo/Tsunami Flow Logo.png";  
const StickMan = new Image();  
StickMan.src = linkToSpriteSheet;  
  
let AckmaHawkSpriteSheet = "";  
  
let tfSSCX = 0; //Character State Location Row  
let AckmaHawkSpriteSheetState = 0;  
let tfSSCY = 0; //Character State Frame Column  
let AckmaHawkSpriteSheetFrame = 0;  
let tfSCW = 120; // Character Size in image file width  
let AckmaHawkSpritSheetWidth = 120;  
let tfSCH = 120; // Character Size in image file height  
let AckmaHawkSpriteSheetHeight = 120;  
let tfSPX = 60; //position of character Left and Right Movement  
let AckmaHawkCanvasX = 60; //CanvasWidth / 2  
let tfSPY = 160; // position of character Up and Down Movement  
let AckmaHawkCanvasY = 160; //CanvasHeight /2   
let tfSNW = 30; //Size of character The width   
let AckmaHawkCanvasWidth = 30; //CanvasWidth * 0.25;  
let tfSNH = 30; //Size of character The Height  
let AckmaHawkCanvasHeight = 30; //CanvasHeight * 0.25;  
let AckmaHawkType = "sprite";  

let AckmaHawkTextWidth = 280;  
let AckmaHawkTextHeight = 40;  
let AckmaHawkTextSize = "30px";  
let AckmaHawkTextStyle = "Consolas";  
let AckmaHawkTextAlign = "center"; //end, left, right, center  
let AckmaHawkTextBaseLine = "alphabetic"; //top, hanging, middle, ideographic, bottom  
let AckmaHawkTextDirection = "inherit"; //ltr, rtl  
let AckmaHawkLetterSpacing = 0;  
let AckmaHawkFontKerning = "auto";  
let AckmaHawkFontStretch = "normal"; //ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded  
let AckmaHawkFontVariantCaps = "normal" //small-caps, all-small-caps, petite-caps, all-petite-caps, unicase, titling-caps  
let AckmaHawkTextRendering = "auto"; //optimizeSpeed, optimizeLegibility, geometricPrecision  
let AckmaHawkWordSpacing = 0;  
let AckmaHawkTextSettings;  
let AckmaHawkDialog = "testing";  
let StickManDialog = [];  

let homePageArray = [  
  "Welcome to tsunamiflow.club",  
  "This is the homebase for Tsunami Flow",  
  "We are currently working on content for the website.",  
  "Come by often and check for updates.",  
  "Please be patient"  
];  

let PhysicalAbility = [  
  { name: "health", points: 1 },  
  { name: "stamina", points: 1 },  
  { name: "weight", points: 1 },  
  { name: "strength", points: 1 },  
  { name: "agility", points: 1 }  
];  

let AckmaHawkIntellectualIntelligence = [  
  { name: "Science", level: 0, experience: 0 },  
  { name: "Creativity", level: 0, experience: 0 },  
  { name: "Math", level: 0, Engineering: 0 },  
  { name: "Memory", level: 0, experience: 0 },  
  { name: "Awareness", level: 0, experience: 0 }  
];  

let AckmaHawkSocialIntelligence = [  
  { name: "Reflection", level: 0, experience: 0 },  
  { name: "honesty", level: 0, experience: 0 },  
  { name: "deception", level: 0, experience: 0 },  
  { name: "manipulation", level: 0, experience: 0 },  
  { name: "charisma", level: 0, experience: 0 }  
];  

let AckmaHawkEmotionalIntelligence = [  
  { name: "feelings", level: 0, experience: 0 },  
  { name: "mood", level: 0, experience: 0 },  
  { name: "temper", level: 0, experience: 0 },  
  { name: "attitude", level: 0, experience: 0 },  
  { name: "perspective", level: 0, experience: 0 }  
];  

let AckmaHawkExistentialIntelligence = [  
  { name: "consciousness", level: 0, experience: 0 },  
  { name: "time", level: 0, experience: 0 },  
  { name: "dimension", level: 0, experience: 0 },  
  { name: "space", level: 0, experience: 0 },  
  { name: "defense", level: 0, experience: 0 }  
];  

let AckmaHawkEnergeticIntelligence = [  
  { name: "fire", level: 0, experience: 0 },  
  { name: "water", level: 0, experience: 0 },  
  { name: "air", level: 0, experience: 0 },  
  { name: "lightning", level: 0, experience: 0 },  
  { name: "earth", level: 0, experience: 0 }  
];  

let AckmaHawkMetaCognitiveIntelligence = [  
  { name: "magic", level: 0, experience: 0 },  
  { name: "ESP", level: 0, experience: 0 },  
  { name: "dexterity", level: 0, experience: 0 },  
  { name: "genetic", level: 0, experience: 0 },  
  { name: "personal", level: 0, experience: 0 }  
];  

let AckmaHawkHeadArmor = 1;  
let AckmaHawkBodyArmor = 1;  
let AckmaHawkLegArmor = 1;  
let AckmaHawkarmArmor = 1;  
let AckmaHawkweakAttack = 1;  
let AckmaHawkstrongAttack = 1;  
let AckmaHawkspecialAttack = 1;  
let AckmaHawkknockBackSkill = 1;  
let AckmaHawkaoeSkill = 1;  
let AckmaHawkbuffSkill = 1;  
let AckmaHawkmainSkill = 1;  
let AckmaHawkevadeSkill = 1;  
let AckmaHawkrangeSkill = 1;  
let AckmaHawkdebuffSkill = 1;  
let AckmaHawkdefenseSkill = 1;  
let AckmaHawkultimateSkill = 1;  
let PlayerState = "stand";  

// items  
var fullHeal;  
var fullStamina;  
var fullMagic;  

// Armour  
var armourSet1;  
var armourSet2;  
var armourSet3;  
var armourSet4;  
var armourSet5;  
var armourSet6;  
var armourSet7;  
var armourSet8;  

let MishubaScreen = new ScreenShare();  
let TsunamiStream = new TfMediaStream();  
let TfRTC = new TfWebRTCRecorder();  
let Nifage = new User();  
let Effects = new TfEffects();  
let TfWeather = new Weather();  
let cam = new TfWebcam();  
let recorder = new TfRecorder();  

document.addEventListener("DOMContentLoaded", () => {  
  let MyNewTFTime = document.getElementById("TFtime");  
  let TfWotd = document.getElementById("tfWordOfTheDay");  
  let TsunamiRadio = document.getElementById("TFradioPlayer");  
  TsunamiRadio.crossOrigin = "anonymous";  
  let RadioTitle = document.getElementById("TfRadioStuff");  
  let RadioButtons = document.getElementById("CheckRadio");  
  const twoMore = document.getElementById("mainTsectionFdiv");  
  let RadioCanvas = document.getElementById("TFradioCanvas");  

  const TFiframe = document.createElement("iframe");  
  TFiframe.allow = "camera; microphone; geolocation";  
  TFiframe.allowFullscreen = true;  
  TFiframe.sandbox = "allow-scripts allow-same-origin";  

 let frameTF = new tfIframe(TFiframe, HomepageUpdates, FirstGame)
  

  let RadioLastButton = document.createElement("button");  
  let RadioRestartButton = document.createElement("button");  
  let RadioStartButton = document.createElement("button");  
  let RadioSkipButton = document.createElement("button");  

  let Socket = new TfWebsocket("wss://world.tsunamiflow.club/ws");  

  let Live = new TfVideo(Socket, Effects);
  
  let TsunamiAudioCtx = new(window.AudioContext || window.webkitAudioContext)();  
  let RadioAnalyser = TsunamiAudioCtx.createAnalyser();  
  RadioAnalyser.fftSize = 2048;  
  let RadioMedia = TsunamiAudioCtx.createMediaElementSource(TsunamiRadio);  
  let StreamDestination = TsunamiAudioCtx.createMediaStreamDestination();  
  let Radio = new TfMusic(TsunamiAudioCtx, RadioAnalyser, RadioMedia, StreamDestination);  
  let mixSounds = new TfAudioMixer(TsunamiAudioCtx);  

  let player1 = new gameComponent(tfSNW, tfSNH, "blue", tfSPX, tfSPY, "player", tfSSCX, tfSSCY, tfSCW, tfSCH, AckmaHawkTextSize, AckmaHawkTextStyle, AckmaHawkTextWidth, AckmaHawkTextHeight, AckmaHawkTextAlign, AckmaHawkTextBaseLine, AckmaHawkTextDirection, AckmaHawkLetterSpacing, AckmaHawkFontKerning, AckmaHawkFontStretch, AckmaHawkFontVariantCaps, AckmaHawkTextRendering, AckmaHawkWordSpacing, AckmaHawkTextSettings, homePageArray, PlayerState, AckmaHawkBattleBackground, "Tsunami", "Flow", "TF", PhysicalAbility, AckmaHawkIntellectualIntelligence, AckmaHawkSocialIntelligence, AckmaHawkEmotionalIntelligence, AckmaHawkExistentialIntelligence, AckmaHawkEnergeticIntelligence, AckmaHawkMetaCognitiveIntelligence, AckmaHawkHeadArmor, AckmaHawkBodyArmor, AckmaHawkarmArmor, AckmaHawkLegArmor, AckmaHawkweakAttack, AckmaHawkstrongAttack, AckmaHawkspecialAttack, AckmaHawkmainSkill, AckmaHawkevadeSkill, AckmaHawkdefenseSkill, AckmaHawkknockBackSkill, AckmaHawkrangeSkill, AckmaHawkaoeSkill, AckmaHawkbuffSkill, AckmaHawkdebuffSkill, AckmaHawkultimateSkill);  

let TfStickMan = new gameComponent(tfSNW, tfSNH, linkToSpriteSheet, tfSPX, tfSPY, "sprite", tfSSCX, tfSSCY, tfSCW, tfSCH, AckmaHawkTextSize, AckmaHawkTextStyle, AckmaHawkTextWidth, AckmaHawkTextHeight, AckmaHawkTextAlign, AckmaHawkTextBaseLine, AckmaHawkTextDirection, AckmaHawkLetterSpacing, AckmaHawkFontKerning, AckmaHawkFontStretch, AckmaHawkFontVariantCaps, AckmaHawkTextRendering, AckmaHawkWordSpacing, AckmaHawkTextSettings, StickManDialog, PlayerState, AckmaHawkBattleBackground, "Hubert", "Maxwell", "StickMan", PhysicalAbility, AckmaHawkIntellectualIntelligence, AckmaHawkSocialIntelligence, AckmaHawkEmotionalIntelligence, AckmaHawkExistentialIntelligence, AckmaHawkEnergeticIntelligence, AckmaHawkMetaCognitiveIntelligence, AckmaHawkHeadArmor, AckmaHawkBodyArmor, AckmaHawkarmArmor, AckmaHawkLegArmor, AckmaHawkweakAttack, AckmaHawkstrongAttack, AckmaHawkspecialAttack, AckmaHawkmainSkill, AckmaHawkevadeSkill, AckmaHawkdefenseSkill, AckmaHawkknockBackSkill, AckmaHawkrangeSkill, AckmaHawkaoeSkill, AckmaHawkbuffSkill, AckmaHawkdebuffSkill, AckmaHawkultimateSkill);    
    
let Mishuba = new gameComponent(AckmaHawkCanvasWidth, AckmaHawkCanvasHeight, AckmaHawkSpriteSheet, AckmaHawkCanvasX, AckmaHawkCanvasY, AckmaHawkType, AckmaHawkSpriteSheetState, AckmaHawkSpriteSheetFrame, AckmaHawkSpritSheetWidth, AckmaHawkSpriteSheetHeight, AckmaHawkTextSize, AckmaHawkTextStyle, AckmaHawkTextWidth, AckmaHawkTextHeight, AckmaHawkTextAlign, AckmaHawkTextBaseLine, AckmaHawkTextDirection, AckmaHawkLetterSpacing, AckmaHawkFontKerning, AckmaHawkFontStretch, AckmaHawkFontVariantCaps, AckmaHawkTextRendering, AckmaHawkWordSpacing, AckmaHawkTextSettings, AckmaHawkDialog, PlayerState, AckmaHawkBattleBackground, "Mishuba", "Feilong", "2Fly", PhysicalAbility, AckmaHawkIntellectualIntelligence, AckmaHawkSocialIntelligence, AckmaHawkEmotionalIntelligence, AckmaHawkExistentialIntelligence, AckmaHawkEnergeticIntelligence, AckmaHawkMetaCognitiveIntelligence, AckmaHawkHeadArmor, AckmaHawkBodyArmor, AckmaHawkarmArmor, AckmaHawkLegArmor, AckmaHawkweakAttack, AckmaHawkstrongAttack, AckmaHawkspecialAttack, AckmaHawkmainSkill, AckmaHawkevadeSkill, AckmaHawkdefenseSkill, AckmaHawkknockBackSkill, AckmaHawkrangeSkill, AckmaHawkaoeSkill, AckmaHawkbuffSkill, AckmaHawkdebuffSkill, AckmaHawkultimateSkill);    

let Stickman = new letsDoIt("Homepage Game", TfStickMan); ////default page setup with sprite

let workers = new WorkerManager({ Radio, TfWeather, WordTimes, RadioTimes, WordOfTheDay, NewsTimer, TsunamiAudioCtx, MyNewTFTime, TfWotd });

  let Controller = new MishubaController(Nifage, frameTF, Effects, Socket, Radio, mixSounds, TsunamiRadio, RadioCanvas, RadioTitle, RadioButtons, RadioLastButton, RadioRestartButton, RadioStartButton, RadioSkipButton, Live, null, null, FirstGame, TsunamiPrintful, TsunamiPay, workers, cam, TfRTC, recorder, TsunamiStream, MishubaScreen);
  
  Controller.iframe.frame.title = "Main Website Content";
  Controller.iframe.frame.id = "TsunamiContent";
  Controller.iframe.frame.name = "TsunamiMainFlowContent";
  Controller.iframe.frame.width = 925;
  Controller.iframe.frame.height = 430;
  Controller.iframe.frame.style.background = "white";
  Controller.iframe.frame.style.touchAction = "manipulation"; // prevent double-tap zoom and unwanted scrolling
  Controller.iframe.frame.style.pointerEvents = "auto"; // ensure pointer events fire
  

  // ... rest of your code continues exactly as above

if (twoMore) {    
    twoMore.appendChild(Controller.iframe.frame);    
  } else {    
    console.error("Element with id 'mainTsectionFdiv' not found.");    
  }    
    
  Controller.iframe.frame.src = "homepage.html";    
    
  Controller.iframe.MenuSwitch(Controller.iframe.frame);    
  Controller.bindNavBar();    
  Controller.bindAudio();
  Controller.bindUsers();
  Controller.bindStore().then(() => Controller.bindPayments());
    
  Controller.iframe.frame.addEventListener("load", () => {    
    console.log("Iframe loaded:", Controller.iframe.frame.src);    
    
    try {    
      console.log("contentWindow:", Controller.iframe.frame.contentWindow);    
      if (Controller.iframe.frame.src.endsWith("Community.html")) {    
        Controller.videoElem = Controller.find("TsunamiFlowVideoStuff", true);    
        Controller.videoCanv = Controller.find("TFcanvas", true);    
      }    
      Controller.iframe.frame.contentWindow.controller = Controller;    
      console.log("Controller injected into iframe");    
      Controller.bindVidSystem();    
    } catch (e) {    
      console.error("Cross-origin block:", e);    
    }    

  });    
  document.getElementById("TFthoughtsNow").addEventListener("submit", TsunamiThoughts => {    
    TsunamiThoughts.preventDefault();    
    //let tfUserThot = document.getElementById("TFthought");    
    //TfPostThot(tfUserThot);    
  });    
    
  document.body.addEventListener("click", () => {    
    if (TsunamiAudioCtx.state === "suspended") {    
      TsunamiAudioCtx.resume();    
    }    
  });    
    
  TfWeather.requestLocation();    
  //Controller.bindSignUp();    
  //Controller.bindCart();    
  Controller.bindWorker();    
});

//default character
//let HomepageUpdates = new letsDoIt("Tsunami Flow Updates", player1); //default i should just make this it's own class tbh. page setup without sprite

//Characters
    //Stickman

    //Mishuba
   // let mishuba = new letsDoIt("", Mishuba); //mishuba aka my user setup using images.
    //Know Tyme
    //Lockdown
    //Shadow

    //My book.
   // let ackmaHawk = new letsDoIt("", AckmaHawk); // my super hero setup 
  //  let halu = new letsDoIt("", Halu); //my super villain setup.
    //Duwen
// 

//Characters End

/*
    //Make canvas a blob
    function theBlobImage(blob) {
        const canvaBlobImage = document.createElement("img");
        const canvaURLblobImage = URL.createObjectURL(blob);

        canvaBlobImage.onload = () => {
        // no longer need to read the blob so it's revoked
        URL.revokeObjectURL(canvaURLblobImage);
        };

        canvaBlobImage.src = canvaURLblobImage;
        document.body.appendChild(canvaBlobImage);
    }

    FirstGame.canvas.toBlob(theBlobImage, image/jpg, 1); //this if for images.
        //Exceptions 
            //SecurityError

    //Make Canvas an image.

    //Context Stuff
    FirstGame.context.createImageData(width,height,settings);

    //imageData
        //An ImageData object containing the array of pixel values.
    let imageData = FirstGame.context.getImageData(sx, sy, sw, sh, settings);

    //Green Screen 
        for (let i = 0; i < imageData.data.length; i += 4) {
        //Modify pixel data
        imageData.data[i + 0] = 190; //red
        imageData.data[i + 1] = 0; //Green
        imageData.data[i + 2] = 210; //Blue
        imageData.data[i + 3] = 255; //A (what is a);
    }

    
    FirstGame.context.putImageData(imageData,dx,dy,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
    */
/*
    dx
    Horizontal position (x coordinate) at which to place the image data in the destination canvas.

    dy
    Vertical position (y coordinate) at which to place the image data in the destination canvas.

    dirtyX Optional
    Horizontal position (x coordinate) of the top-left corner from which the image data will be extracted. Defaults to 0.

    dirtyY Optional
    Vertical position (y coordinate) of the top-left corner from which the image data will be extracted. Defaults to 0.

    dirtyWidth Optional
    Width of the rectangle to be painted. Defaults to the width of the image data.

    dirtyHeight Optional
    Height of the rectangle to be painted. Defaults to the height of the image data.
*/

/*
FirstGame.context.
FirstGame.context.canvas;
FirstGame.context.save();
FirstGame.context.restore();
FirstGame.context.reset();
FirstGame.context.scale(x,y);
FirstGame.context.rotate(angle);
FirstGame.context.translate(x,y);
FirstGame.context.transform(a,b,c,d,e,f);
FirstGame.context.setTransform(a,b,c,d,e,f);
FirstGame.context.resetTransform();
FirstGame.context.globalAlpha;
FirstGame.context.globalCompositeOperation;
FirstGame.context.imageSmoothingEnabled;

    //do this inside the iframe.
        window.addEventListener("message", (event) => {
            const { type, info } = event.data;
 
            if (type === "game") {
                const game = letsDoIt.from(event.data.info);
            }
        });

        FirstGame.start() 
        //startGame(FirstGame); // Original but startGame code is deleted.
*/