import { HomepageUpdates, FirstGame } from "./sprite.js";

//Get browser info
async function getBrowserType() {
    const userAgent = navigator.userAgent;
    console.log(userAgent);

    if (userAgent.indexOf("Chrome") > -1) {
        return Promise.resolve("chrome");
    } else if (userAgent.indexOf("Firefox") > -1) {
        return Promise.resolve("firefox");
    } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
        return "safari";
    } else if (userAgent.indexOf("Edge") > -1) {
        return "edge";
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
        return "opera";
    } else if (userAgent.indexOf("Netscape") > -1) {
        return "netscape";
    } else {
        return "unknown";
    }
}

export function loadBrowserSpecificScript() {
    const browser = getBrowserType();

    let script = document.createElement("script");
    switch (browser) {
        case "chrome":
            script.src = "JS/chrome-specific.js";
            break;
        case "firefox":
            script.src = "JS/firefox-specific.js";
            break;
        case "safari":
            script.src = "JS/safari-specific.js";
            break;
        case "edge":
            script.src = "JS/edge-specific.js";
            break;
        case "opera":
            script.src = "JS/opera-specific.js";
            break;
        case "netscape":
            script.src = "JS/netscape-specific.js";
            break;
        default:
            script.src = "JS/default.js";
            break;
    }

    document.head.appendChild(script);
}
// Fetch current cart items from server.php
export async function fetchCart() {
    try {
        const res = await fetch('https://www.tsunamiflow.club/Server/server.php?cart_action=view', {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        return data.items || [];
    } catch (err) {
        console.error('Error fetching cart:', err);
        return [];
    }
}

// Update subtotal and grand total
export function updateTotals() {
    let grandTotal = 0;
    document.querySelectorAll('.cartForm').forEach(form => {
        const variantSelect = form.querySelector('.variantSelect');
        const quantityInput = form.querySelector('.quantityInput');
        const itemSubtotalEl = form.querySelector('.itemSubtotal');

        const variant = variantSelect?.selectedOptions[0];
        const price = parseFloat(variant?.dataset.price || 0);
        const quantity = parseInt(quantityInput?.value || 1);

        const subtotal = price * quantity;

        if (itemSubtotalEl) itemSubtotalEl.textContent = subtotal.toFixed(2);
        form.dataset.price = subtotal.toFixed(2);

        grandTotal += subtotal;
    });

    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = grandTotal.toFixed(2);
}
// Game Mechanics
/* 
Air Division 
1.)
2.)
3.)
4.) Barn Owl
5.) Golden Eagle
Water Division
1.)
2.)
3.)
4.)
5.)
Land Division
1.)
2.)
3.)
4.)
5.)
*/