export class UniqueOriginal {
   constructor(){
   this.TsunamiServer = "https://world.tsunamiflow.club/tfMain.php?";
   this.printfulList = "fetch_printful_items=7";
   this.store = document.getElementById("TFstore");
   }
   DisplayStoreItems(items) {
  
  if (!this.store) return;

  let list = store.querySelector("ul");
  let template = list.querySelector("li");
  let emptyMsg = store.querySelector("p");

  list.innerHTML = ""; // clear template
  emptyMsg.style.display = items.length ? "none" : "block";

  if (!items.length) return;

  items.forEach(product => {
    const li = template.cloneNode(true);

    const title = li.querySelector("h4");
    const img = li.querySelector("img");
    const desc = li.querySelector("p");
    const variantSelect = li.querySelector(".variantSelect");
    const qtyInput = li.querySelector(".quantityInput");
    const subtotal = li.querySelector(".itemSubtotal");
    const addButton = li.querySelector("button"); // your add-to-cart button

    title.textContent = product.name || "Unnamed Product";
    img.src = product.thumbnail || "";
    desc.textContent = product.description || "";

    variantSelect.innerHTML = "";
    const variants = product.sync_variants || product.variants || [];

    if (!variants.length) {
      const opt = document.createElement("option");
      opt.textContent = "No variants available";
      variantSelect.appendChild(opt);
      variantSelect.disabled = true;
    } else {
      variantSelect.disabled = false;

      variants.forEach(v => {
        const opt = document.createElement("option");
        opt.value = v.id;
        opt.dataset.price = v.retail_price || v.price || 0;
        opt.textContent = `${v.name} - $${opt.dataset.price}`;
        variantSelect.appendChild(opt);
      });
    }

    // price calculation
    const recalc = () => {
      const price = parseFloat(
        variantSelect.selectedOptions[0]?.dataset.price || 0
      );
      const qty = parseInt(qtyInput.value || 1);
      subtotal.textContent = (price * qty).toFixed(2);
    };

    variantSelect.onchange = recalc;
    qtyInput.oninput = recalc;
    recalc();
   }
   
}

const xhr = new XMLHttpRequest();

xhr.open("GET", "https://world.tsunamiflow.club/tfMain.php?fetch_printful_items=1", true);
xhr.withCredentials = true;

xhr.onerror = () => console.error("XHR fetch items failed");

xhr.onload = () => {
   console.log("Printful XHR status:", xhr.status);
   console.log("Raw response:", xhr.responseText);
  if (xhr.status !== 200) {
    console.error("Fetch failed:", xhr.responseText);
    return;
  } else {
     const data = JSON.parse(xhr.responseText);
     console.log("Printful items:", data);
     return data;
  }
};