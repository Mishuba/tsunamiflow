import { TsDomCanvas } from "./Teen/Child/Canvas.js";

export class StripeDonation extends TsDomCanvas {
    #stripePublicKey = "pk_live_51LEZXZDEt62FFVusTpTno0riC4cY20IoRtuiM2UnA3AHUdwAAxRj3qaev1RUwonD1pSzOOLmDYUXg9NiOBngYfUy005Tw1msUZ";
    #backendUrl = "https://world.tsunamiflow.club/StripeStuff.php";
    static #stripePromise = null;

    stripe = null;
    cardElement = null;
    customerId = localStorage.getItem("stripeCustomerId") || null;
    queue = []; // Offline/retry queue
    transport = "xml"; // default
    constructor(options = {}) {
        super(options);
        if (options.stripePublicKey) {
            this.stripePublicKey = options.stripePublicKey;
        }
        if (options.backendUrl) {
            this.backendUrl = options.backendUrl;
        }
        this.stripePromise = null;
    }

    // Load Stripe JS once
    async loadTFMoney() {
        if (window.Stripe) return window.Stripe;
        if (!this.stripePromise) {
            this.stripePromise = new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src = "https://js.stripe.com/v3";
                script.onload = () => resolve(window.Stripe);
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }
        return this.stripePromise;
    }

    async initMoney() {
        await this.loadTFMoney();
        this.stripe = Stripe(this.stripePublicKey);
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
            const payload = this.tycadome(
                "payment" + this.customerId,
                "stripe.payment",
                "createPaymentIntent",
                {
                    worker: "none" //"site"
                },
                {

                },
                "async",
                {
                    amount: Math.round(amount * 100),
                    currency,
                    saveCustomer,
                    email,
                    metadata,
                    customerId: this.customerId
                }
            )
            const data = await this.requestWorld("POST", false, payload, { "ContentType": "application/x-www-form-urlencoded" }, "xml");
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
            if ("store") {

            }

            if ("community") {

            }

        }
    }

    async subscribe(email, priceId, saveCustomer = true, metadata = {}, options = {}) {
        if (!this.stripe || !this.cardElement) throw new Error("Stripe not ready");
        if (!email) throw new Error("Email required");

        this.emit("loading", true);
        try {

            const payload = this.tycadome(
                "id",
                "money",
                "stripe.substription",
                {
                    worker: "none",
                },
                {
                    priority: "low",
                },
                "async",
                {
                    action: "createSubscription",
                    email,
                    priceId,
                    saveCustomer,
                    metadata,
                    ...options
                }
            )
            if (this.customerId) payload.id = this.customerId;

            const data = await this.requestWorld("POST", false, payload, "application/json", "xml");
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