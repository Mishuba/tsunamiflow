import { StripeDonation } from "./Adult/Money.js";

export class User extends StripeDonation {
  username = null;
  password = null;
  savedUser = null;
  membershipLevels = {
    none: {
      cost: 0,
      payment: "none",
      show: [],
      displayText: "Please Select a Level",
      paymentText: ""
    },
    free: {
      cost: 0,
      payment: "none",
      show: [
        "free",
        "address",
        "costInfo"
      ],
      displayText: "$0.00",
      paymentText: "No payment required"
    },
    regular: {
      cost: 4,
      payment: "monthly",
      show: [
        "free",
        "regular",
        "address",
        "costInfo"
      ],
      displayText: "$4.00",
      paymentText: "Monthly payment"
    },
    vip: {
      cost: 7,
      payment: "monthly",
      show: [
        "free",
        "regular",
        "vip",
        "address",
        "costInfo"
      ],
      displayText: "$7.00",
      paymentText: "Monthly payment"
    },
    team: {
      cost: 10,
      payment: "monthly",
      show: [
        "free",
        "regular",
        "vip",
        "team",
        "address",
        "costInfo"],
      displayText: "$10.00",
      paymentText: "Monthly payment"
    },
  }
  constructor(options = {}) {
    super(options);

    // Restore saved login state if any
    this.savedUser = this.getLocalStorage("username");
    if (this.savedUser) {
      let { username } = JSON.parse(this.savedUser);
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

    const config = this.membershipLevels[level] || this.membershipLevels.none;

    // Show the necessary sections
    config.show.forEach(sectionName => {
      const el = sections[sectionName];
      if (el && el.style.display === "none") {
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
    const SubFormData = new FormData();

    for (const [tf, yj] of Object.entries(fields)) {
      if (yj) SubFormData.append(tf, yj.value);
    }

    for (const [key, elem] of Object.entries(extraFields)) {
      if (elem) SubFormData.append(key, elem.value);
    }
    this.sendToSharedWorker("xml", SubFormData);
  }

  login(saveSession = true) {
    if (!this.username || !this.password) {
      console.warn("Username or password is empty.");
      return;
    }

    const formData = new FormData();
    formData.append("username", this.username);
    formData.append("password", this.password);

    this.sendToSharedWorker("xml", formData);
    if (saveSession) {
      saveLoginState();
    }
  }

  saveLoginState() {
    this.setLocalStorage("username", this.username);
    this.setSession("username", this.username)
  }

  checkLoginState(username) {
    // Restore saved login state if any
    this.savedUser = this.getLocalStorage(username);
    if (this.savedUser) {
      const { username } = JSON.parse(this.savedUser);
      this.username = username;
    }
  }
  logout() {
    this.removeLocalStorage(this.username);
    this.clearSession();
    this.username = null;
    this.password = null;
    console.log("User logged out.");
  }
}