export let TfUserLanguage = navigator.language;
export let TfUserAgentInfo = navigator.userAgent; // put these in variables.js
export let TfOnlineStatus = navigator.onLine;
export let TFkeyboardUser = navigator.keyboard;

//Time
export let MyNewTFTime = document.getElementById("TFtime");

//Main Images
export const TsunamiFlowLogo = "./Pictures/Logo/'Tsunami Flow Logo.png'";

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