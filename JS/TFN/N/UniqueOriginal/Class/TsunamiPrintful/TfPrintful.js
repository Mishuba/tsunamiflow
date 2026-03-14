export class UniqueOriginal {
   constructor(){

  } 
  async fetchCart() {
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

  async updateTotals() {
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

  bindCart() {
    document.querySelectorAll('.cartForm').forEach(form => {
      const quantityInput = form.querySelector('.quantityInput');
      const variantSelect = form.querySelector('.variantSelect');

      quantityInput?.addEventListener('input', () => this.updateTotals());
      variantSelect?.addEventListener('change', () => this.updateTotals());

      form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.action) return console.warn('Form action is empty!');
  try {
    const formData = new FormData(form);
    const res = await fetch(form.action, { method: 'POST', body: formData, headers: { 'X-Requested-With': 'XMLHttpRequest' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const result = await res.json();

    if (result.success) {
      // Refresh totals
      const cartItems = await this.fetchCart();
      let total = 0;
      cartItems.forEach(item => {
        total += (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1);
      });
      const totalEl = document.getElementById('cartTotal');
      if (totalEl) totalEl.textContent = total.toFixed(2);

      this.updateTotals(); // DOM subtotals
    } else {
      console.warn('Cart error:', result.error);
    }
  } catch (err) {
    console.error('Form submission error:', err);
  }
});
    });
    // Initialize totals on page load
    this.updateTotals();
  }
  showProducts() {
const xhr = new XMLHttpRequest();
    console.log("created printful request");
    xhr.open("GET", "https://world.tsunamiflow.club/store.php", true);
    xhr.setRequestHeader("X-Request-Type", "fetch_printful_items");
    
    xhr.onload = () => {
      console.log("Printful XHR status:", xhr.status);
      console.log("Raw response:", xhr.responseText);
      
      if (xhr.status !== 200) {
        console.error("Fetch failed:", xhr.responseText);
        return;
      }
      
      const data = JSON.parse(xhr.responseText);
      console.log("Printful items:", data.items);
      
      const store = document.getElementById("TFstore");
      const ul = store.querySelector("ul");
      
      ul.innerHTML = "";
      
      if (!data.items.length) {
        store.querySelector("p").style.display = "block";
        return;
      }
      
      data.items.forEach(item => {
        const li = document.createElement("li");
        
        li.innerHTML = `
      <h4>${item.name}</h4>
      <img src="${item.thumbnail}" alt="Product Image">
      <p>${item.description || ""}</p>

      <form class="cartForm" method="POST" action="/server.php">
        <select class="variantSelect" name="product_id" required></select>
        <input class="quantityInput" type="number" name="StoreQuantity" value="1" min="1" max="1000">
        <span class="itemSubtotal">0.00</span>
        <button type="submit" name="addProductToCart">Add to Cart</button>
      </form>
    `;
        
        const variantSelect = li.querySelector(".variantSelect");
        
        if (item.variants.length) {
          item.variants.forEach(variant => {
            const opt = document.createElement("option");
            opt.value = variant.variant_id;
            opt.dataset.price = variant.price;
            opt.textContent = `${variant.name} — $${variant.price}`;
            variantSelect.appendChild(opt);
          });
        } else {
          variantSelect.innerHTML = `<option>No Variants Available</option>`;
          variantSelect.disabled = true;
        }
        
        // Subtotal calculation
        const qtyInput = li.querySelector(".quantityInput");
        const subtotalSpan = li.querySelector(".itemSubtotal");
        
        function updateSubtotal() {
          const price = parseFloat(variantSelect.selectedOptions[0]?.dataset.price || 0);
          const qty = parseInt(qtyInput.value || 1);
          subtotalSpan.textContent = (price * qty).toFixed(2);
        }
        
        variantSelect.addEventListener("change", updateSubtotal);
        qtyInput.addEventListener("input", updateSubtotal);
        updateSubtotal();
        
        ul.appendChild(li);
      });
      this.bindCart();
    };
    xhr.send();
    
    xhr.onerror = (e) => console.error("XHR fetch items failed error: " + e);
}
};