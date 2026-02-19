const form = document.getElementById("jobForm");
const output = document.getElementById("output");
const submitBtn = document.getElementById("submitBtn");

// 🔧 CHANGE THIS TO YOUR PHP ENDPOINT
const API_URL = "https://world.tsunamiflow.club/RubyEmailer.php";

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  submitBtn.disabled = true;
  output.textContent = "Launching job...";
  
  const payload = {
  WhatWeDoinBro: document.getElementById("WhatWeDoinBro").value.trim(),
  MessageSubject: document.getElementById("MessageSubject").value.trim(),
  MessageStart: document.getElementById("MessageStart").value.trim(),
  MessageContinue: document.getElementById("MessageContinue").value.trim(),
  YoutubeLink: document.getElementById("YoutubeLink").value.trim(),
  SpotifyLink: document.getElementById("SpotifyLink").value.trim(),
  AppleLink: document.getElementById("AppleLink").value.trim(),
  WavDownloadLink: document.getElementById("WavDownloadLink").value.trim(),
  Mp3DownloadLink: document.getElementById("Mp3DownloadLink").value.trim()
};

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(payload)
    });
    
    let data;
try {
  data = await res.json();
} catch {
  data = await res.text();
}

if (!res.ok) {
  throw data;
}
    
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = JSON.stringify(err, null, 2);
  } finally {
    submitBtn.disabled = false;
  }
});