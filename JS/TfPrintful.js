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