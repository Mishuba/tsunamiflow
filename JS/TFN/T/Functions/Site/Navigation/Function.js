export async function SignIn(tryToSignIn) {
    tryToSignIn.preventDefault();
    let NavUN = document.getElementById("nun");
    let NavPSW = document.getElementById("npsw");
    NavXML(NavUN, NavPSW);
}