import { maxwell } from "./TFN/maxwell.js";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    navigator.serviceWorker.register("./service-worker.js")
      .then(reg => console.log("SW registered:", reg))
      .catch(err => console.error("SW registration failed:", err));
  });
}

const TFwordMishuba = {
  word: "Mishuba",
  definition: "A heterosexual North American entertainer.",
  quotes: [
    {
      text: "'My Inner Self Helps Unifies Beautiful Art' - Mishuba",
      history: {
        fact: {
          one: "Mishuba's parents were in the military which cause him to live in multiple places growing up. Mishuba lived in two countries(Germany and the United States of America), went to four elementary schools, four middle schools and two high schools; he also lived in six different states while living with his family.",
          two: "Outside of music Mishuba loves to play sports and video games, draw and write poetry."
        },
        myth: {
          one: "Mishuba is plotting on taking over the world.",
          two: "Mishuba has physic power."
        },
        legend: {
          one: "Mishuba was the first division one college athlete with a scholarship to also have a record deal.",
          two: "Mishuba is the reincarnation of ..."
        }
      }
    },
    {
      text: "You cannot stop greatness you can only prolong it. What is meant to be great will be great",
      history: {
        fact: {
          one: "His chinese name is 飞龙丁 (fei'long ding）, his first name means flying dragon and his last name is surname ding (the chinese people he was friends with in Xian, China gave him the last name 东风 （dong'feng）; but he wants to his last name to be Ding.",
          two: ""
        },
        myth: {
          one: "Mishuba has no idea what he is doing.",
          two: "Mishuba been lame his whole life."
        },
        legend: {
          one: "Mishuba went to china to fall in love with a woman",
          two: "Mishuba is able to see, feel, smell, and hear the people who have died in is life in his dreams in the spiritual plane."
        }
      }
    }
  ]
};

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



