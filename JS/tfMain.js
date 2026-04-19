import { gameComponent } from "./TFN/N/Games/Class/planetuniverse.js";  
import { letsDoIt } from "./TFN/N/Games/Class/gamemechanics.js";  
import { HeaderWeather } from "./TFN/T/Class/weather.js";
import { tfIframe } from "./../Iframe/Js/TfIframe.js";  
import { HomepageUpdates, FirstGame } from "./TFN/N/Games/sprite.js";
import { TfPrintful } from "./TFN/T/Class/Tycadome.js";
import { TsunamiFlowImageEngine } from "./TFN/T/Class/Elder/Img.js";
import { TsunamiFlowDj } from "./TFN/T/Class/DjController.js";
import { TsunamiLiveVideoController } from "./TFN/T/Class/LiveVidController.js";
import { maxwell } from "./TFN/maxwell.js";  

let TFwordMishuba = {
    word: "Mishuba",
    definition: "A heterosexual North American entertainer.",
    quotes: [
        {
            text: "'My Inner Self Helps Unifies Beautiful Art' - Mishuba",
            history: {
                fact: { one: "Mishuba's parents were in the military which cause him to live in multiple places growing up. Mishuba lived in two countries(Germany and the United States of America), went to four elementary schools, four middle schools and two high schools; he also lived in six different states while living with his family.", two: "Outside of music Mishuba loves to play sports and video games, draw and write poetry." },
                myth: { one: "Mishuba is plotting on taking over the world.", two: "Mishuba has physic power." },
                legend: { one: "Mishuba was the first division one college athlete with a scholarship to also have a record deal.", two: "Mishuba is the reincarnation of ..." }
            }
        },
        {
            text: "You cannot stop greatness you can only prolong it. What is meant to be great will be great",
            history: {
                fact: { one: "His chinese name is 飞龙丁 (fei'long ding）, his first name means flying dragon and his last name is surname ding (the chinese people he was friends with in Xian, China gave him the last name 东风 （dong'feng）; but he wants to his last name to be Ding.", two: "" },
                myth: { one: "Mishuba has no idea what he is doing.", two: "Mishuba been lame his whole life." },
                legend: { one: "Mishuba went to china to fall in love with a woman", two: "Mishuba is able to see, feel, smell, and hear the people who have died in is life in his dreams in the spiritual plane." }
            }
        }
    ]
};
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

let TfStickMan = new gameComponent(tfSNW, tfSNH, linkToSpriteSheet, tfSPX, tfSPY, "sprite", tfSSCX, tfSSCY, tfSCW, tfSCH, AckmaHawkTextSize, AckmaHawkTextStyle, AckmaHawkTextWidth, AckmaHawkTextHeight, AckmaHawkTextAlign, AckmaHawkTextBaseLine, AckmaHawkTextDirection, AckmaHawkLetterSpacing, AckmaHawkFontKerning, AckmaHawkFontStretch, AckmaHawkFontVariantCaps, AckmaHawkTextRendering, AckmaHawkWordSpacing, AckmaHawkTextSettings, StickManDialog, PlayerState, AckmaHawkBattleBackground, "Hubert", "Maxwell", "StickMan", PhysicalAbility, AckmaHawkIntellectualIntelligence, AckmaHawkSocialIntelligence, AckmaHawkEmotionalIntelligence, AckmaHawkExistentialIntelligence, AckmaHawkEnergeticIntelligence, AckmaHawkMetaCognitiveIntelligence, AckmaHawkHeadArmor, AckmaHawkBodyArmor, AckmaHawkarmArmor, AckmaHawkLegArmor, AckmaHawkweakAttack, AckmaHawkstrongAttack, AckmaHawkspecialAttack, AckmaHawkmainSkill, AckmaHawkevadeSkill, AckmaHawkdefenseSkill, AckmaHawkknockBackSkill, AckmaHawkrangeSkill, AckmaHawkaoeSkill, AckmaHawkbuffSkill, AckmaHawkdebuffSkill, AckmaHawkultimateSkill);

document.addEventListener("DOMContentLoaded", () => {  
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

  let RadioLastButton = document.createElement("button");  
  let RadioRestartButton = document.createElement("button");  
  let RadioStartButton = document.createElement("button");  
  let RadioSkipButton = document.createElement("button");  

  let Stickman = new letsDoIt("Homepage Game", TfStickMan); ////default page setup with sprite

let TfSite = new HeaderWeather(); 
let frameTF = new tfIframe(TFiframe, HomepageUpdates, FirstGame);
let nifage = new TfPrintful();
let style = new TsunamiFlowImageEngine();
let nation = new TsunamiFlowDj({
  audioElement: TsunamiRadio
});
let network = new TsunamiLiveVideoController();

let max = {
  site: TfSite,
  iframe: frameTF,
  user: nifage,
  image: style,
  sound: nation,
  video: network,
  game: Stickman,
  AudioTitle: RadioTitle,
  AudioButtonSpot: RadioButtons,
  AudioPrevious: RadioLastButton,
  AudioOver: RadioRestartButton,
  AudioStart: RadioStartButton, 
  AudioSkip: RadioSkipButton,
  };
let Controller = new maxwell(max);
  Controller.site.EnHword(TFwordMishuba);
  
Controller.site.NewsArray.push("Mishuba was born at 6 pounds 5 ounces with a length of 20 inches. His head was 12 1/2 inches, chest was 11 1/2 inches on July 11, 1990 at Tallahassee Memorial Regional Medical Center INC. in Tallahassee, FLorida of the United States of America on Planet Earth.");
Controller.site.NewsArray.push("Mishuba played on the school basketball team from 7th grade to 10 grade. ");
Controller.site.NewsArray.push("Mishuba received his BA in Sociology from the University of South Carolina in 2014.");
Controller.site.NewsArray.push("Mishuba received a Presidential Physical Fitness Award when he was 6 signed by Bill Clinton while in elementary school at Holbrook in Fort Bragg, North Carolina.");
Controller.site.NewsArray.push("Mishuba was a percussionist in the school band from 7th grade to 10 grade. Mishuba says 'He can play any perucssion instrument'.");
Controller.site.NewsArray.push("Mishuba went to Holbrook Elementary in North Carolina, Riley elementary in Florida and Jefferson Elementary in Kansas.");
Controller.site.NewsArray.push("Mishuba was the 400m state champion for 3a in 2008 and the 400m state champion for 4a in 2009.");
Controller.site.NewsArray.push("Mishuba went to Fort Riley Middle School in Kansas, Liberty HIll MIddle School in Texas and Union Grove Middle School.");
Controller.site.NewsArray.push("Mishuba was athlete of the year in 2008 for track & field for South Carolina.");
Controller.site.NewsArray.push("Mishuba played on the school football team from 7th grade to 12 grade.");
Controller.site.NewsArray.push("Mishuba graduated from Blythewood High School.");
Controller.site.NewsArray.push("Mishuba run track for the Univeristy of South Carolina. <a href='https://gamecocksonline.com/sports/track-and-field/roster/chris-maxwell/2677'> Click here to find out more </a>");
Controller.site.NewsArray.push("Mishuba received a silver on his WorkKey Career Readiness Certificate in the 11th grade.");
Controller.site.NewsArray.push("Mishuba ran track and field from 7th grade up until he graduated from undergraduate school.");
Controller.site.NewsArray.push("Mishuba went to Harker Heights High School in Texas and Blythewood High School in South Carolina.");
Controller.site.NewsArray.push("Mishuba received his Professional TEFL Certification in 2017. His Certificate NO. is <a href='teacherlink.teachingnomad.com/certificates'> TN1700-043  </a>");
Controller.site.NewsArray.push("Mishuba received his MS in Entertainment Business from Full Sail University in 2020.");
  Controller.iframe.frame.title = "Main Website Content";
  Controller.iframe.frame.id = "TsunamiContent";
  Controller.iframe.frame.name = "TsunamiMainFlowContent";
  Controller.iframe.frame.width = 925;
  Controller.iframe.frame.height = 430;
  Controller.iframe.frame.style.background = "white";
  Controller.iframe.frame.style.touchAction = "manipulation"; // prevent double-tap zoom and unwanted scrolling
  Controller.iframe.frame.style.pointerEvents = "auto"; // ensure pointer events fire
  
if (twoMore) {    
    twoMore.appendChild(Controller.iframe.frame);    
  } else {    
    console.error("Element with id 'mainTsectionFdiv' not found.");    
  }    
    
  Controller.iframe.frame.src = "Iframe/Pages/homepage.html";    
    
  Controller.iframe.MenuSwitch(Controller.iframe.frame);    
  /*
  Controller.bindNavBar();    
  Controller.bindAudio();
  Controller.bindUsers();
  Controller.bindStore().then(() => Controller.bindPayments());
    */
  Controller.iframe.frame.addEventListener("load", () => {    
    console.log("Iframe loaded:", Controller.iframe.frame.src);    
    
    try {    
      console.log("contentWindow:", Controller.iframe.frame.contentWindow);    
      if (Controller.iframe.frame.src.endsWith("Community.html")) {    
        Controller.videoElem = Controller.find("TsunamiFlowVideoStuff", true);    
        Controller.videoCanv = Controller.find("TFcanvas", true);  
              Controller.bindVidSystem();    
      }    
      Controller.iframe.frame.contentWindow.controller = Controller;    
      console.log("Controller injected into iframe");    
    } catch (e) {    
      console.error("Cross-origin block:", e);    
    }    

if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
        try {
            const reg = await navigator.serviceWorker.register("/service-worker.js");
            console.log("SW registered:", reg);
        } catch (err) {
            console.error("SW registration failed:", err);
        }
    });
}
  });    

  Controller.site.requestLocation();    
  //Controller.bindSignUp();    
  //Controller.bindCart();
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