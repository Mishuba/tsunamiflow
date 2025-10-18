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
        const formData = new FormData();

        // Basic fields
        ["tfFN","tfLN","tfNN","tfGen","tfEM","tfBirth","tfUN","tfPsw","tfMembershipLevel"].forEach(f => {
            if (this[f]) formData.append(f, this[f].value);
        });

        // Extra fields
        for (let [key, elem] of Object.entries(this.extraFields)) {
            if (elem) formData.append(key, elem.value);
        }

        // Add type flag for PHP
        formData.append("type", "Subscribers Signup");

        const membership = (this.tfMembershipLevel?.value || "free").toLowerCase();

        if (membership === "free") {
            // Free membership: direct PHP insert
            fetch("./../server.php", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(resp => {
                if (resp.success) console.log("Free membership created:", resp.message);
                else console.error("Signup failed:", resp.message || resp);
            })
            .catch(err => console.error("Signup error:", err));
        } else {
            // Paid membership: create Stripe Checkout
            const costMap = { regular: 400, vip: 700, team: 1000 };
            const amount = costMap[membership] || 2000;

            // Create checkout session via PHP
            formData.append("membershipLevel", membership);
            fetch("./../server.php", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(resp => {
                if (resp.url) {
                    // Redirect to Stripe Checkout
                    window.location.href = resp.url;
                } else {
                    console.error("Checkout creation failed:", resp.message || resp);
                }
            })
            .catch(err => console.error("Stripe session error:", err));
        }

    } catch (err) {
        console.error("Signup error:", err);
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