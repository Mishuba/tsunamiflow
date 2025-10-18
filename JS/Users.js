export class User {
    constructor(username = "", password = "") {
        this.username = username;
        this.password = password;

        // Restore saved login state if any
        const savedUser = localStorage.getItem("TFuser");
        if (savedUser) {
            const { username, password } = JSON.parse(savedUser);
            this.username = username;
            this.password = password;
        }

        // Wait for DOM
        document.addEventListener("DOMContentLoaded", () => {
            this.FreeSubmitButton = document.getElementById("TFCompleteForm");
            this.tfFN = document.getElementById("TfFirstName");
            this.tfLN = document.getElementById("TfLastName");
            this.tfNN = document.getElementById("TfNickName");
            this.tfGen = document.getElementById("TfGender");
            this.tfEM = document.getElementById("TfEmail");
            this.tfBirth = document.getElementById("TfBirthday");
            this.tfUN = document.getElementById("TFuserName");
            this.tfPsw = document.getElementById("TFpassword");
            this.tfMembershipLevel = document.getElementById("TFMembershipLevel");

            this.extraFields = {
                ChineseZodiacSign: document.getElementById("ChineseZodiacSign"),
                WesternZodiacSign: document.getElementById("WesternZodiacSign"),
                SpiritAnimal: document.getElementById("SpiritAnimal"),
                CelticTreeZodiacSign: document.getElementById("CelticTreeZodiacSign"),
                NativeAmericanZodiacSign: document.getElementById("NativeAmericanZodiacSign"),
                VedicAstrologySign: document.getElementById("VedicAstrologySign"),
                GuardianAngel: document.getElementById("GuardianAngel"),
                ChineseElement: document.getElementById("ChineseElement"),
                EyeColorMeaning: document.getElementById("EyeColorMeaning"),
                GreekMythologyArchetype: document.getElementById("GreekMythologyArchetype"),
                NorseMythologyPatronDeity: document.getElementById("NorseMythologyPatronDeity"),
                EgyptianZodiacSign: document.getElementById("EgyptianZodiacSign"),
                MayanZodiacSign: document.getElementById("MayanZodiacSign"),
                LoveLanguage: document.getElementById("LoveLanguage"),
                Birthstone: document.getElementById("Birthstone"),
                BirthFlower: document.getElementById("BirthFlower"),
                BloodType: document.getElementById("BloodType"),
                AttachmentStyle: document.getElementById("AttachmentStyle"),
                CharismaType: document.getElementById("CharismaType"),
                BusinessPersonality: document.getElementById("BusinessPersonality"),
                DISC: document.getElementById("DISC"),
                SocionicsType: document.getElementById("SocionicsType"),
                LearningStyle: document.getElementById("LearningStyle"),
                FinancialPersonalityType: document.getElementById("FinancialPersonalityType"),
                PrimaryMotivationStyle: document.getElementById("PrimaryMotivationStyle"),
                CreativeStyle: document.getElementById("CreativeStyle"),
                ConflictManagementStyle: document.getElementById("ConflictManagementStyle"),
                TeamRolePreference: document.getElementById("TeamRolePreference")
            };
        });
    }

    signup() {
        try {
            const SubFormData = new FormData();
            const fields = ["tfFN", "tfLN", "tfNN", "tfGen", "tfEM", "tfBirth", "tfUN", "tfPsw", "tfMembershipLevel"];
            fields.forEach(f => {
                if (this[f]) SubFormData.append(f, this[f].value);
            });

            for (const [key, elem] of Object.entries(this.extraFields)) {
                if (elem) SubFormData.append(key, elem.value);
            }

            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
                        console.log("Signup response:", response);
                    } else console.error("Signup request failed:", xhr.statusText);
                }
            };
            xhr.open("POST", "./../server.php", true);
            xhr.send(SubFormData);
        } catch (err) {
            console.error("Signup error:", err);
        }
    }

    login(saveSession = true) {
        if (!this.username || !this.password) {
            console.warn("Username or password is empty.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("username", this.username);
            formData.append("password", this.password);

            const xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        const res = xhr.responseText.trim();
                        if (res === "success" || res.includes("Welcome")) {
                            console.log("Login successful");

                            // Save session
                            if (saveSession) {
                                const data = JSON.stringify({ username: this.username, password: this.password });
                                localStorage.setItem("TFuser", data);
                                sessionStorage.setItem("TFuser", data);
                            }

                            document.getElementById("TFloginIcon").innerHTML = res;
                        } else {
                            console.warn("Login failed:", res);
                        }
                    } else {
                        console.error("Login request error:", xhr.statusText);
                    }
                }
            };
            xhr.open("POST", "server.php", true);
            xhr.send(formData);
        } catch (err) {
            console.error("Login error:", err);
        }
    }

    logout() {
        localStorage.removeItem("TFuser");
        sessionStorage.removeItem("TFuser");
        this.username = "";
        this.password = "";
        console.log("User logged out.");
    }

    PostThoughts() {
        const thoughtInput = document.getElementById("TFthought");
        if (!thoughtInput) return;

        const formData = new FormData();
        formData.append("thought", thoughtInput.value);

        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) console.log("Thought posted:", xhr.responseText);
                else console.error("Failed to post thought:", xhr.statusText);
            }
        };
        xhr.open("POST", "server.php", true);
        xhr.send(formData);
    }
}