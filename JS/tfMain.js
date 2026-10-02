import { maxwell } from "./TFN/maxwell.js";
import { TFwordMishuba } from "./TFN/T/Objects/Objects.js";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(reg => console.log("SW registered:", reg))
      .catch(err => console.error("SW registration failed:", err));
  });
}

document.addEventListener("DOMContentLoaded", async (event) => {

  const SoundsContext = new (window.AudioContext || window.webkitAudioContext)();

  /*
  flowOscillator.type = "sine";
  flowOscillator.frequency.setValueAtTime(440, SoundsContext.currentTime);
  flowOscillator.start();
  
  */

  /*
const indexdb = {
  name: ,
  keyPath: ,

}

//dbstores: indexdb

*/
  const TsunamiController = new maxwell({
    MasterSoundsContext: SoundsContext,
  });

  TsunamiController.site.NewsArray.push("Mishuba was born at 6 pounds 5 ounces...");
  TsunamiController.site.NewsArray.push("Mishuba played basketball from 7th to 10th grade.");
  TsunamiController.site.NewsArray.push("Mishuba received his BA in Sociology from the University of South Carolina in 2014.");
  TsunamiController.site.NewsArray.push("Mishuba received a Presidential Physical Fitness Award signed by Bill Clinton.");
  TsunamiController.site.NewsArray.push("Mishuba was a percussionist in school band.");
  TsunamiController.site.NewsArray.push("Mishuba attended multiple schools across states.");
  TsunamiController.site.NewsArray.push("Mishuba was a state 400m champion in 2008 and 2009.");
  TsunamiController.site.NewsArray.push("Mishuba graduated from Blythewood High School.");
  TsunamiController.site.NewsArray.push("Mishuba ran track at University of South Carolina.");
  TsunamiController.site.NewsArray.push("Mishuba received TEFL certification in 2017.");
  TsunamiController.site.NewsArray.push("Mishuba received MS in Entertainment Business from Full Sail University in 2020.");

  TsunamiController.site.EnHword(TFwordMishuba);
  for (let i = 0; i < TsunamiController.site.WordOfTheDayArray.length; i++) {
    console.log(`suppose tfo be word ${TsunamiController.site.WordOfTheDayArray[i]}`);
  };

  TsunamiController.onDomEvent("DOMContentLoaded");

  window.ControlMishuba = TsunamiController;
});