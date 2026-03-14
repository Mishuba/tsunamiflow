export async function NewsTimer() {
    ReallyDude = Math.floor(Math.random() * NewsArray.length);
    document.getElementById("NTS").innerHTML = NewsArray[ReallyDude];
}