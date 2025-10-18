export class User {
    constructor(username = "", password = "") {
        this.username = username;
        this.password = password;

        // Wait for DOM to load before querying elements
        document.addEventListener("DOMContentLoaded", () => {
            // Subscriber form elements
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

            // Additional fields by membership level
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
        let SubFormData = new FormData();

        // Basic fields
        const fields = ["tfFN", "tfLN", "tfNN", "tfGen", "tfEM", "tfBirth", "tfUN", "tfPsw", "tfMembershipLevel"];
        fields.forEach(f => {
            if (this[f]) SubFormData.append(f, this[f].value);
        });

        // Extra fields
        for (let [key, elem] of Object.entries(this.extraFields)) {
            if (elem) SubFormData.append(key, elem.value);
        }

        // Required for PHP to know this is a subscriber signup
        SubFormData.append("type", "Subscribers Signup");

        // Optional: include membership level explicitly for clarity
        if (this.tfMembershipLevel) SubFormData.append("membershipLevel", this.tfMembershipLevel.value);

        // Send the data
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    console.log("Signup response:", response);

                    if (response.success && response.url) {
                        // Paid membership → redirect to Stripe checkout
                        window.location.href = response.url;
                    } else if (response.success) {
                        // Free membership → show confirmation
                        alert(response.message || "Successfully registered as free member!");
                    } else {
                        // Error from PHP
                        alert(response.error || "Signup failed.");
                    }
                } else {
                    console.error("Signup request failed:", xhr.statusText);
                    alert("Signup request failed. Check console for details.");
                }
            }
        };
        xhr.open("POST", "./../server.php", true);
        xhr.send(SubFormData);
    } catch (err) {
        console.error("Signup error:", err);
        alert("Signup error. Check console for details.");
    }
}
    login() {
    if (!this.username || !this.password) {
        console.warn("Username or password is empty.");
        return;
    }

    const formData = new FormData();
    formData.append("NavUserName", this.username); // Match PHP expected keys
    formData.append("NavPassword", this.password);

    fetch("server.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(response => {
        if (response.status === "success" || response.message?.includes("logged in")) {
            console.log(`${this.username} is now logged in.`);
            // Optional: store session info in localStorage if needed
        } else {
            console.error("Login failed:", response.message || response);
        }
    })
    .catch(err => console.error("Login error:", err));
}

PostThoughts() {
    const thoughtInput = document.getElementById("TFthought");
    if (!thoughtInput) return;

    const formData = new FormData();
    formData.append("thought", thoughtInput.value);
    formData.append("type", "PostThought"); // Optional type flag for PHP

    fetch("server.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(response => {
        if (response.success) console.log("Thought posted:", response);
        else console.error("Failed to post thought:", response.message || response);
    })
    .catch(err => console.error("PostThought error:", err));
}
}