export let TfUserLanguage = navigator.language;
export let TfUserAgentInfo = navigator.userAgent; // put these in variables.js
export let TfOnlineStatus = navigator.onLine;
export let TFkeyboardUser = navigator.keyboard;

//Time
export let MyNewTFTime = document.getElementById("TFtime");

//Words
export let TheOtherWords = 1;
export let QuoteStuff = 0;
export let TfWotd = document.getElementById("tfWordOfTheDay");

//Main Images
export const TsunamiFlowLogo = "./Pictures/Logo/'Tsunami Flow Logo.png'";

//Weather
export let weatherSpot = document.getElementById("TFweather");
export const WABul = "https://api.weatherapi.com/v1";
export const WABurl = "https://api.weatherapi.com/v1";
export const WapiKey = "cf5a64c9095e425ab0f52816230110";
export const CWapi = "/current.json";

//Subscribers
// Define references to the form elements
export let FreeSubmitButton = document.getElementById("TFCompleteForm");
export let tfFN = document.getElementById("TfFirstName");
export let tfLN = document.getElementById("TfLastName");
export let tfNN = document.getElementById("TfNickName");
export let tfGen = document.getElementById("TfGender");
export let tfEM = document.getElementById("TfEmail");
export let tfBirth = document.getElementById("TfBirthday");
export let tfUN = document.getElementById("TFuserName");
export let tfPsw = document.getElementById("TFpassword");

// Membership level selection
export let tfMembershipLevel = document.getElementById("TFMembershipLevel");

// Additional fields based on membership level
// Free/Regular level fields
export let tfChineseZodiacSign = document.getElementById("ChineseZodiacSign");
export let tfWesternZodiacSign = document.getElementById("WesternZodiacSign");
export let tfSpiritAnimal = document.getElementById("SpiritAnimal");
export let tfCelticTreeZodiacSign = document.getElementById("CelticTreeZodiacSign");
export let tfNativeAmericanZodiacSign = document.getElementById("NativeAmericanZodiacSign");
export let tfVedicAstrologySign = document.getElementById("VedicAstrologySign");
export let tfGuardianAngel = document.getElementById("GuardianAngel");
export let tfChineseElement = document.getElementById("ChineseElement");
export let tfEyeColorMeaning = document.getElementById("EyeColorMeaning");
export let tfGreekMythologyArchetype = document.getElementById("GreekMythologyArchetype");
export let tfNorseMythologyPatronDeity = document.getElementById("NorseMythologyPatronDeity");
export let tfEgyptianZodiacSign = document.getElementById("EgyptianZodiacSign");
export let tfMayanZodiacSign = document.getElementById("MayanZodiacSign");

// Regular/VIP level fields
export let tfLoveLanguage = document.getElementById("LoveLanguage");
export let tfBirthstone = document.getElementById("Birthstone");
export let tfBirthFlower = document.getElementById("BirthFlower");
export let tfBloodType = document.getElementById("BloodType");
export let tfAttachmentStyle = document.getElementById("AttachmentStyle");
export let tfCharismaType = document.getElementById("CharismaType");

// VIP/Team level fields
export let tfBusinessPersonality = document.getElementById("BusinessPersonality");
export let tfDisc = document.getElementById("DISC");
export let tfSocionicsType = document.getElementById("SocionicsType");
export let tfLearningStyle = document.getElementById("LearningStyle");
export let tfFinancialPersonalityType = document.getElementById("FinancialPersonalityType");
export let tfPrimaryMotivationStyle = document.getElementById("PrimaryMotivationStyle");
export let tfCreativeStyle = document.getElementById("CreativeStyle");
export let tfConflictManagementStyle = document.getElementById("ConflictManagementStyle");
export let tfTeamRolePreference = document.getElementById("TeamRolePreference");
//export let MembershipCostFr = document.getElementById("hiddenMC");

//Audio
//Radio
export let RadioCanvas = document.getElementById("TFradioCanvas");
export let TsunamiRadio = document.getElementById("TFradioPlayer");
export let phpRadio = new XMLHttpRequest();
export let TsunamiRadioTitle = document.getElementById("TfRadioStuff");
export const TsunamiLastButton = document.createElement("button");
export const TsunamiRadioButtons = document.getElementById("CheckRadio");
export const TsunamiRestartButton = document.createElement("button");
export const TsunamiStartButton = document.createElement("button");
export const TsunamiSkipButton = document.createElement("button");

export let TsunamiRadioAudio = new AudioContext();
//Radio Ends

export let TFpwoReal = new Float32Array(2);

export let TFpwoImag = new Float32Array(2);

//Array Buffer
export let TFaudioBuffer = new ArrayBuffer(32);
export let TFtestingF32A = new Float32Array(TFaudioBuffer, 4, 4);
//console.log(TFtestingF32A.byteOffset);
//console.log(TFtestingF32A.length);
//console.log(TFtestingF32A.BYTES_PER_ELEMENT);

//From an Iterable
export let TFgameIterable = (function* () {
    yield* [1, 2, 3];
})();
export let float32FromIterable = new Float32Array(TFgameIterable);
//Regular Audio Ends//


//Game Audio 
export let GameWorldAudio = new AudioContext();

//Canvas 3d
/*
export const hp3cc = homepageCanvas.getContext("webgl");

if (hp3cc === null) {
    console.log("Your Browser does not support WebGL");
} else {
    console.log("Your browser does support WebGL");
    /*
        let C3dWidth = 300;
        let C3dHeight = 300;
        let C3LogoXpos = 0;
        let C3LogoYpos = 0;
        let C3LogoWidth = 10;
        let C3LogoHeight = 10;

        const vShaderExample = "attribute vec4 aVertexPosition; uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix; void main() { gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;}";
        
        // Fragment Shader Code
        const fShaderExample = "void main() { gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);}";


        function webglMovingScreen() {
            hp3cc.clearColor(1, 0, 0, 1);
            hp3cc.clear(hp3cc.COLOR_BUFFER_BIT);

            requestAnimationFrame(webglMovingScreen);
        }

        function TFcreateShader(gl, type, source) {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (success) {
                return shader;
            }
            console.log(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
        }
}
*/
//Stripe Payments
//Donation
export const TFDA = document.getElementById("DonationAmount");
export const TFdoEM = document.getElementById("TFemailDO");
export const TFdoNa = document.getElementById("TFnameDO");
export const TFdoCo = document.getElementById("TFcoDO");
//Donation Ends


//Store
//Printful
export let TStoreF = document.getElementById('tspf');
export let SPC = document.getElementById("tfSubPaymentCity");
export let SPCC = document.getElementById("tfSubPaymentCountry");
export let SPA1 = document.getElementById("tfSubPaymentAddress1");
export let SPA2 = document.getElementById("tfSubPaymentAddress2");
export let SPCtf = document.getElementById("tfSubPostalCode");
export let SS = document.getElementById("tfSubState");
export let SPN = document.getElementById("tfSubPhoneNumber");
export let MembershipCostFr = document.getElementById("hiddenMC");