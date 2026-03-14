export async function NewsTimer(NewsArray) {
    let ReallyDude = Math.floor(Math.random() * NewsArray.length);
    document.getElementById("NTS").innerHTML = NewsArray[ReallyDude];
}