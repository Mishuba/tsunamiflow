export class User {
    constructor(username = null, password = null) {
        this.username = username;
        this.password = password;
        this.membershipLevels = {
            none: { cost: 0, payment: "none", show: [], displayText: "Please Select a Level", paymentText: "" },
            free: { cost: 0, payment: "none", show: ["free", "address", "costInfo"], displayText: "$0.00", paymentText: "No payment required" },
            regular: { cost: 4, payment: "monthly", show: ["free", "regular", "address", "costInfo"], displayText: "$4.00", paymentText: "Monthly payment" },
            vip: { cost: 7, payment: "monthly", show: ["free", "regular", "vip", "address", "costInfo"], displayText: "$7.00", paymentText: "Monthly payment" },
            team: { cost: 10, payment: "monthly", show: ["free", "regular", "vip", "team", "address", "costInfo"], displayText: "$10.00", paymentText: "Monthly payment" },
        }

        // Restore saved login state if any
        const savedUser = localStorage.getItem("TFuser");
        if (savedUser) {
            const { username } = JSON.parse(savedUser);
            this.username = username;
        }
    }
    hideAllSections(sections) {
        Object.values(sections).forEach(el => {
            if (el) {
                el.style.display = "none";
            } else {
                console.log("subscibers stuff");
            }
        });
    }
    updateMembership(membershipSelect, sections, membershipCostEl, paymentTypeEl) {
        const level = membershipSelect.value;
        this.hideAllSections(sections);

        const config = this.membershipLevels[level] || membershipLevels.none;

        // Show the necessary sections
        config.show.forEach(sectionName => {
            const el = sections[sectionName];
            if (el.style.display === "none") {
                el.style.display = "block";
            }
        });

        // Update cost/payment
        if (membershipCostEl) membershipCostEl.innerHTML = config.displayText;
        if (paymentTypeEl) paymentTypeEl.innerHTML = config.paymentText;
        //if (hiddenMC) hiddenMC.value = config.cost;
        //if (hiddenPT) hiddenPT.value = config.payment;
    }
    signup(fields, extraFields) {
        try {
            const SubFormData = new FormData();

            for (const [tf, yj] of Object.entries(fields)) {
                if (yj) SubFormData.append(tf, yj.value);
            }

            for (const [key, elem] of Object.entries(extraFields)) {
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
            xhr.open("POST", "https://world.tsunamiflow.club/server.php", true);
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
            xhr.open("POST", "https://world.tsunamiflow.club/server.php", true);
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
        xhr.open("POST", "https://world.tsunamiflow.club/server.php", true);
        xhr.send(formData);
    }
}