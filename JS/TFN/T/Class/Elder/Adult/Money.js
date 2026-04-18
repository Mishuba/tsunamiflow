import { TsDomCanvas } from "../Teen/Child/Base/T.js";

export class StripeDonation extends TsDomCanvas {
    #stripePublicKey = "pk_live_51LEZXZDEt62FFVusTpTno0riC4cY20IoRtuiM2UnA3AHUdwAAxRj3qaev1RUwonD1pSzOOLmDYUXg9NiOBngYfUy005Tw1msUZ";
    #backendUrl = "https://world.tsunamiflow.club/StripeStuff.php";
    static #stripePromise = null;

    stripe = null;
    cardElement = null;
    customerId = localStorage.getItem("stripeCustomerId") || null;
    queue = []; // Offline/retry queue
    transport = "xml"; // default
    constructor(stripePublicKey, backendUrl) {
        super();
        this.#stripePublicKey = stripePublicKey || this.#stripePublicKey;
        this.#backendUrl = backendUrl || this.#backendUrl;
    }

    // Load Stripe JS once
    static async load() {
        if (window.Stripe) return window.Stripe;
        if (!this.#stripePromise) {
            this.#stripePromise = new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = "https://js.stripe.com/v3";
                script.onload = () => resolve(window.Stripe);
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
        return this.#stripePromise;
    }

    async init() {
        await this.constructor.load();
        this.stripe = Stripe(this.#stripePublicKey);
    }

    async _fetchRequest(data) {
        const res = await fetch(this.#backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });

        let json;
        try { json = await res.json(); }
        catch { throw new Error("Invalid JSON response"); }

        if (!res.ok || json.error) throw json.error || "Unknown error";
        return json;
    }

    // ===== XHR VERSION =====
    _xhrRequest(data) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open("POST", this.#backendUrl, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.withCredentials = true;

            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) return;

                try {
                    const json = JSON.parse(xhr.responseText);

                    if (xhr.status === 200 && !json.error) {
                        resolve(json);
                    } else {
                        reject(json.error || "Unknown error");
                    }
                } catch {
                    reject("Invalid JSON response");
                }
            };

            xhr.onerror = () => reject("Network error");

            xhr.send(JSON.stringify(data));
        });
    }

    // ===== UNIFIED REQUEST =====
    async request(data, retries = 2) {
        try {
            if (this.transport === "xhr") {
                return await this._xhrRequest(data);
            } else {
                return await this._fetchRequest(data);
            }
        } catch (err) {
            if (retries > 0) {
                this.emit("retry", { data, retries });
                return this.request(data, retries - 1);
            }

            this.queue.push(data);
            throw err;
        }
    }


    mountCard(elementId) {
        if (!this.stripe) throw new Error("Stripe not initialized");
        if (this.cardElement) this.cardElement.unmount();
        const elements = this.stripe.elements();
        this.cardElement = elements.create("card");
        this.cardElement.mount(`#${elementId}`);
    }

    async donate(amount, currency = "usd", saveCustomer = true, email = null, metadata = {}) {
        if (!this.stripe || !this.cardElement) throw new Error("Stripe not ready");

        this.emit("loading", true);
        try {
            const payload = { action: "createPaymentIntent", amount: Math.round(amount * 100), currency, saveCustomer, email, metadata, customerId: this.customerId };
            const data = await this.request(payload);
            const { clientSecret, customerId } = data;

            if (saveCustomer && customerId) {
                this.customerId = customerId;
                localStorage.setItem("stripeCustomerId", customerId);
            }

            const result = await this.stripe.confirmCardPayment(clientSecret, { payment_method: { card: this.cardElement } });
            if (result.error) throw result.error;

            this.emit("success", result);
            return result;
        } catch (err) {
            this.emit("error", err);
            throw err;
        } finally {
            this.emit("loading", false);
        }
    }

    async subscribe(email, priceId, saveCustomer = true, metadata = {}, options = {}) {
        if (!this.stripe || !this.cardElement) throw new Error("Stripe not ready");
        if (!email) throw new Error("Email required");

        this.emit("loading", true);
        try {
            const payload = { action: "createSubscription", email, priceId, saveCustomer, metadata, ...options };
            if (this.customerId) payload.customerId = this.customerId;

            const data = await this.request(payload);
            const { clientSecret, subscriptionId, customerId, status } = data;

            if (saveCustomer && customerId) {
                this.customerId = customerId;
                localStorage.setItem("stripeCustomerId", customerId);
            }

            if (!clientSecret) {
                const result = { status: status || "active", message: "No payment required", subscriptionId };
                this.emit("success", result);
                return result;
            }

            const result = await this.stripe.confirmCardPayment(clientSecret, { payment_method: { card: this.cardElement } });
            if (result.error) {
                if (options.autoRetry !== false) this.queue.push(payload);
                throw result.error;
            }

            this.emit("success", result);
            return result;
        } catch (err) {
            this.emit("error", err);
            throw err;
        } finally {
            this.emit("loading", false);
        }
    }

    async cancelSubscription(subscriptionId, atPeriodEnd = true) {
        if (!subscriptionId) throw new Error("Subscription ID required");
        const payload = { action: "cancelSubscription", subscriptionId, atPeriodEnd };
        try {
            const result = await this.request(payload);
            this.emit("success", result);
            return result;
        } catch (err) {
            this.emit("error", err);
            throw err;
        }
    }

    async updateSubscription(subscriptionId, updates = {}) {
        if (!subscriptionId) throw new Error("Subscription ID required");
        const payload = { action: "updateSubscription", subscriptionId, updates };
        try {
            const result = await this.request(payload);
            this.emit("success", result);
            return result;
        } catch (err) {
            this.emit("error", err);
            throw err;
        }
    }

    destroyCard() {
        if (this.cardElement) {
            this.cardElement.unmount();
            this.cardElement = null;
        }
    }

    async flushQueue() {
        while (this.queue.length) {
            const data = this.queue.shift();
            try { await this.request(data); } catch { this.queue.push(data); break; }
        }
    }
}

export class Chat extends TfPrintful {

    constructor() {

    }
    LiveChat() { //

    }
    FeedChat() { //Your friends

    }
    GroupChat() { //Community

    }
    TeamChat() { //Your Team

    }
    OrganizationChat() { //YourOrganization

    }
    PageChat() {//Personal Page

    }
    TFuniverseChat() {//everybody

    }
}    