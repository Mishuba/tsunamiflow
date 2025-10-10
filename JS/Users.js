
export class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        //Subscribers
        // Define references to the form elements
        this.FreeSubmitButton = document.getElementById("TFCompleteForm");
        this.tfFN = document.getElementById("TfFirstName");
        this.tfLN = document.getElementById("TfLastName");
        this.tfNN = document.getElementById("TfNickName");
        this.tfGen = document.getElementById("TfGender");
        this.tfEM = document.getElementById("TfEmail");
        this.tfBirth = document.getElementById("TfBirthday");
        this.tfUN = document.getElementById("TFuserName"); //username
        this.tfPsw = document.getElementById("TFpassword"); //password

        // Membership level selection
        this.tfMembershipLevel = document.getElementById("TFMembershipLevel");

        // Additional fields based on membership level
        // Free/Regular level fields
        this.tfChineseZodiacSign = document.getElementById("ChineseZodiacSign");
        this.tfWesternZodiacSign = document.getElementById("WesternZodiacSign");
        this.tfSpiritAnimal = document.getElementById("SpiritAnimal");
        this.tfCelticTreeZodiacSign = document.getElementById("CelticTreeZodiacSign");
        this.tfNativeAmericanZodiacSign = document.getElementById("NativeAmericanZodiacSign");
        this.tfVedicAstrologySign = document.getElementById("VedicAstrologySign");
        this.tfGuardianAngel = document.getElementById("GuardianAngel");
        this.tfChineseElement = document.getElementById("ChineseElement");
        this.tfEyeColorMeaning = document.getElementById("EyeColorMeaning");
        this.tfGreekMythologyArchetype = document.getElementById("GreekMythologyArchetype");
        this.tfNorseMythologyPatronDeity = document.getElementById("NorseMythologyPatronDeity");
        this.tfEgyptianZodiacSign = document.getElementById("EgyptianZodiacSign");
        this.tfMayanZodiacSign = document.getElementById("MayanZodiacSign");

        // Regular/VIP level fields
        this.tfLoveLanguage = document.getElementById("LoveLanguage");
        this.tfBirthstone = document.getElementById("Birthstone");
        this.tfBirthFlower = document.getElementById("BirthFlower");
        this.tfBloodType = document.getElementById("BloodType");
        this.tfAttachmentStyle = document.getElementById("AttachmentStyle");
        this.tfCharismaType = document.getElementById("CharismaType");

        // VIP/Team level fields
        this.tfBusinessPersonality = document.getElementById("BusinessPersonality");
        this.tfDisc = document.getElementById("DISC");
        this.tfSocionicsType = document.getElementById("SocionicsType");
        this.tfLearningStyle = document.getElementById("LearningStyle");
        this.tfFinancialPersonalityType = document.getElementById("FinancialPersonalityType");
        this.tfPrimaryMotivationStyle = document.getElementById("PrimaryMotivationStyle");
        this.tfCreativeStyle = document.getElementById("CreativeStyle");
        this.tfConflictManagementStyle = document.getElementById("ConflictManagementStyle");
        this.tfTeamRolePreference = document.getElementById("TeamRolePreference");
    }
    signup(fn, ls, nn, gen, em, birth, un, psw, membershipLevel, chineseZodiacSign, westernZodiacSign, spiritAnimal, celticTreeZodiacSign, nativeAmericanZodiacSign, vedicAstrologySign, guardianAngel, chineseElement, eyeColorMeaning, greekMythologyArchetype, norseMythologyPatronDeity, egyptianZodiacSign, mayanZodiacSign, loveLanguage, birthstone, birthFlower, bloodType, attachmentStyle, charismaType, businessPersonality, disc, socionicsType, learningStyle, financialPersonalityType, primaryMotivationStyle, creativeStyle, conflictManagementStyle, teamRolePreference, SPC, SPCC, SPA1, SPA2, SPCtf, SS, SPN, MembershipCostFr, SCidFR) {
        let SubFormData = new FormData();
        SubFormData.append("TFRegisterFirstName", fn.value);
        SubFormData.append("TFRegisterLastName", ls.value);
        SubFormData.append("TFRegisterNickName", nn.value);
        SubFormData.append("TFRegisterGender", gen.value);
        SubFormData.append("TFRegisterEmail", em.value);
        SubFormData.append("TFRegisterBirthday", birth.value);
        SubFormData.append("TFRegisterUsername", un.value);
        SubFormData.append("TFRegisterPassword", psw.value);
        SubFormData.append("membershipLevel", membershipLevel.value);
        SubFormData.append("ChineseZodiacSign", chineseZodiacSign.value);
        SubFormData.append("WesternZodiacSign", westernZodiacSign.value);
        SubFormData.append("SpiritAnimal", spiritAnimal.value);
        SubFormData.append("CelticTreeZodiacSign", celticTreeZodiacSign.value);
        SubFormData.append("NativeAmericanZodiacSign", nativeAmericanZodiacSign.value);
        SubFormData.append("VedicAstrologySign", vedicAstrologySign.value);
        SubFormData.append("GuardianAngel", guardianAngel.value);
        SubFormData.append("ChineseElement", chineseElement.value);
        SubFormData.append("EyeColorMeaning", eyeColorMeaning.value);
        SubFormData.append("GreekMythologyArchetype", greekMythologyArchetype.value);
        SubFormData.append("NorseMythologyPatronDeity", norseMythologyPatronDeity.value);
        SubFormData.append("EgyptianZodiacSign", egyptianZodiacSign.value);
        SubFormData.append("MayanZodiacSign", mayanZodiacSign.value);
        SubFormData.append("LoveLanguage", loveLanguage.value);
        SubFormData.append("Birthstone", birthstone.value);
        SubFormData.append("BirthFlower", birthFlower.value);
        SubFormData.append("BloodType", bloodType.value);
        SubFormData.append("AttachmentStyle", attachmentStyle.value);
        SubFormData.append("CharismaType", charismaType.value);
        SubFormData.append("BusinessPersonality", businessPersonality.value);

        SubFormData.append("DISC", disc.value);
        SubFormData.append("SocionicsType", socionicsType.value);
        SubFormData.append("LearningStyle", learningStyle.value);
        SubFormData.append("FinancialPersonalityType", financialPersonalityType.value);
        SubFormData.append("PrimaryMotivationStyle", primaryMotivationStyle.value);
        SubFormData.append("CreativeStyle", creativeStyle.value);
        SubFormData.append("ConflictManagementStyle", conflictManagementStyle.value);
        SubFormData.append("TeamRolePreference", teamRolePreference.value);
        SubFormData.append("tfSubPaymentCity", SPC.value);
        SubFormData.append("tfSubPaymentCountry", SPCC.value);
        SubFormData.append("tfSubPaymentAddress1", SPA1.value);
        SubFormData.append("tfSubPaymentAddress2", SPA2.value);
        SubFormData.append("tfSubPostalCode", SPCtf.value);
        SubFormData.append("tfSubState", SS.value);
        SubFormData.append("tfSubPhoneNumber", SPN.value);
        SubFormData.append("hiddenMC", MembershipCostFr.value);
        SubFormData.append("SCidFR", SCidFR);
        //SubFormData.append("TFRegisterFreeLevelButton", tfButton);
        //Ends
        let MyXML = new XMLHttpRequest();
        MyXML.onreadystatechange = async function () {
            if (this.readyState == 4 && this.status == 200) {
                let tSubFdataOk = JSON.parse(this.responseText);

                //DO Something it the response.
                /*
                    if(success) {
                    //successful 

                    } else if (not successful) {
                    //nonsuccessful 

                    } else {
                    //error 

                    }
                */
            }
        }
        MyXML.open("POST", `./../server.php`, true);
        MyXML.send(SubFormData);
    }
    login() {
        if (this.username == "" || this.password == "") {
            // You may want to handle the case where username or password is empty
        } else {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    document.getElementById("TFloginIcon").innerHTML = this.responseText;
                    // create a cookie to keep the user logged in when I regenerate the session.
                    // set sessionstorage, sessionids,and localstorageid, userPreferences, get computer info
                }
            };
            xhr.open("POST", `server.php?phpnun=${this.username}&phpnpsw=${this.password}`, true);
            xhr.send();
        }
    }
    PostThoughts() {
        console.log("Post Thoughts")
    }
}