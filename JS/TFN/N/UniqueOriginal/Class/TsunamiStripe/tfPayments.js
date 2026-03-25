export class StripeDonation {
    #stripePublicKey = "pk_live_51LEZXZDEt62FFVusTpTno0riC4cY20IoRtuiM2UnA3AHUdwAAxRj3qaev1RUwonD1pSzOOLmDYUXg9NiOBngYfUy005Tw1msUZ";
    #backendUrl = "https://world.tsunamiflow.club/StripeStuff.php";
    static #stripePromise = null;

    // Event hooks
    onLoading = null;
    onSuccess = null;
    onError = null;

    constructor(stripePublicKey, backendUrl) {
        this.#stripePublicKey = stripePublicKey || this.#stripePublicKey;
        this.#backendUrl = backendUrl || this.#backendUrl;
        this.stripe = null;
        this.cardElement = null;
        this.customerId = localStorage.getItem('stripeCustomerId') || null;
    }

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

    async request(data) {
        const res = await fetch(this.#backendUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data)
        });

        let json;
        try { json = await res.json(); } 
        catch { throw new Error("Invalid JSON response"); }

        if (!res.ok || json.error) throw json.error || "Unknown error";
        return json;
    }

    mountCard(elementId) {
        if (!this.stripe) throw new Error("Stripe not initialized");
        if (this.cardElement) this.cardElement.unmount();

        const elements = this.stripe.elements();
        this.cardElement = elements.create('card');
        this.cardElement.mount(`#${elementId}`);
    }

    // Donate (one-time)
    async donate(amount, currency = 'usd', saveCustomer = true, email = null) {
        if (!this.stripe) throw new Error("Stripe not initialized");
        if (!this.cardElement) throw new Error("Card element not mounted");

        this.onLoading?.(true);
        try {
            const payload = {
                action: 'createPaymentIntent',
                amount: Math.round(amount * 100),
                currency,
                saveCustomer,
                email,
                customerId: this.customerId
            };

            const data = await this.request(payload);
            const { clientSecret, customerId } = data;

            if (saveCustomer && customerId) {
                this.customerId = customerId;
                localStorage.setItem('stripeCustomerId', customerId);
            }

            const result = await this.stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: this.cardElement }
            });

            if (result.error) throw result.error;

            this.onSuccess?.(result);
            return result;

        } catch (err) {
            this.onError?.(err);
            throw err;

        } finally {
            this.onLoading?.(false);
        }
    }

    // Subscribe (recurring)
    async subscribe(email, priceId, saveCustomer = true) {
        if (!this.stripe) throw new Error("Stripe not initialized");
        if (!this.cardElement) throw new Error("Card element not mounted");

        this.onLoading?.(true);
        try {
            const payload = { action: 'createSubscription', email, priceId, saveCustomer };
            if (this.customerId) payload.customerId = this.customerId;

            const data = await this.request(payload);
            const { clientSecret, subscriptionId, customerId } = data;

            if (saveCustomer && customerId) {
                this.customerId = customerId;
                localStorage.setItem('stripeCustomerId', customerId);
            }

            if (!clientSecret) {
                const result = { status: 'success', message: 'No payment required', subscriptionId };
                this.onSuccess?.(result);
                return result;
            }

            const result = await this.stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: this.cardElement }
            });

            if (result.error) throw result.error;
            this.onSuccess?.(result);
            return result;

        } catch (err) {
            this.onError?.(err);
            throw err;

        } finally {
            this.onLoading?.(false);
        }
    }

    destroyCard() {
        if (this.cardElement) {
            this.cardElement.unmount();
            this.cardElement = null;
        }
    }
}