export class StripeDonation {
    #stripePublicKey = "pk_live_51LEZXZDEt62FFVusTpTno0riC4cY20IoRtuiM2UnA3AHUdwAAxRj3qaev1RUwonD1pSzOOLmDYUXg9NiOBngYfUy005Tw1msUZ"; #backendUrl = "https://world.tsunamiflow.club/StripeStuff.php";
static #stripePromise = null;
  constructor(stripePublicKey = "pk_live_51LEZXZDEt62FFVusTpTno0riC4cY20IoRtuiM2UnA3AHUdwAAxRj3qaev1RUwonD1pSzOOLmDYUXg9NiOBngYfUy005Tw1msUZ", backendUrl = "https://world.tsunamiflow.club/StripeStuff.php") {
    this.#stripePublicKey = stripePublicKey;
    this.stripe = null;
    this.backendUrl = backendUrl;
    this.cardElement = null;
    this.customerId = localStorage.getItem('stripeCustomerId') || null; // saved customer
  }
      static async load() {
        if (window.Stripe) {
            return window.Stripe;
        } else {
if (!this.#stripePromise) {
        this.#stripePromise = new Promise((resolve, reject) => {
                let pscr = document.createElement("script");
                pscr.src = "https://js.stripe.com/v3"; // ✅
                pscr.onload = () => resolve(window.Stripe);
                pscr.onerror = reject;
                document.head.appendChild(pscr);
            });
}
return this.#stripePromise;
        }
    }
async init() {
        await this.constructor.load(); // make sure Stripe.js is loaded
        this.stripe = Stripe(this.#stripePublicKey);
    }
  request(data) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", this.backendUrl, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.withCredentials = true;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (xhr.status === 200 && !response.error) resolve(response);
            else reject(response.error || 'Unknown error');
          } catch (err) {
            reject(err.message || 'JSON parse error');
          }
        }
      };
      xhr.send(JSON.stringify(data));
    });
  }
  async fetchrequest(data) {
    const res = await fetch(this.backendUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
    });

    let json;
    try {
        json = await res.json();
    } catch {
        throw new Error("Invalid JSON response");
    }

    if (!res.ok || json.error) {
        throw json.error || "Unknown error";
    }

    return json;
}
  mountCard(elementId) {
    if (!this.stripe) throw new Error("Stripe not initialized");

    if (this.cardElement) {
        this.cardElement.unmount();
    }

    const elements = this.stripe.elements();
    this.cardElement = elements.create('card');
    this.cardElement.mount(`#${elementId}`);
}
  
  // Donate (one-time) with optional saved customer
  async donate(amount, currency = 'usd', saveCustomer = true, email = null) {
if (!this.stripe) throw new Error("Stripe not initialized");
  if (!this.cardElement) throw new Error("Card element not mounted");
  
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
    
    return result;
  } catch (err) {
    console.error("Donation error:", err);
    throw err;
  }
}
  
  // Subscribe (recurring) with optional saved customer
  async subscribe(email, priceId, saveCustomer = true) {
if (!this.stripe) throw new Error("Stripe not initialized");
    if (!this.cardElement) throw new Error("Card element not mounted");
    
    const payload = {
      action: 'createSubscription',
      email,
      priceId,
      saveCustomer: saveCustomer
    };
    
    if (this.customerId) payload.customerId = this.customerId;
    
    const data = await this.request(payload);
    const { clientSecret, subscriptionId, customerId } = data;
    
    if (saveCustomer && customerId) this.customerId = customerId;
    if (customerId) localStorage.setItem('stripeCustomerId', customerId);
    
    if (!clientSecret) {
      return { status: 'success', message: 'No payment required', subscriptionId };
    }
    
    return this.stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: this.cardElement }
    });
  }
destroyCard() {
    if (this.cardElement) {
        this.cardElement.unmount();
        this.cardElement = null;
    }
}
}

