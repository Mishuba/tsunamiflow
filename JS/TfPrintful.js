export class UniqueOriginal {
   constructor(){

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