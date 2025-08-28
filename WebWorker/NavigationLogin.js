//Nav Login Form
document.getElementById("tfNavLoginForm").addEventListener("submit", function (tryToSignIn) {
    tryToSignIn.preventDefault();
    let NavUN = document.getElementById("nun");
    let NavPSW = document.getElementById("npsw");
    NavXML(NavUN, NavPSW);
});
//Nav Login Form Ended