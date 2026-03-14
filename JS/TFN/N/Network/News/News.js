/* News Ticker/Updater */
var ReallyDude;
var NewsArray = new Array();
NewsArray.push("Mishuba was born at 6 pounds 5 ounces with a length of 20 inches. His head was 12 1/2 inches, chest was 11 1/2 inches on July 11, 1990 at Tallahassee Memorial Regional Medical Center INC. in Tallahassee, FLorida of the United States of America on Planet Earth.");
NewsArray.push("Mishuba played on the school basketball team from 7th grade to 10 grade. ");
NewsArray.push("Mishuba received his BA in Sociology from the University of South Carolina in 2014.");
NewsArray.push("Mishuba received a Presidential Physical Fitness Award when he was 6 signed by Bill Clinton while in elementary school at Holbrook in Fort Bragg, North Carolina.");
NewsArray.push("Mishuba was a percussionist in the school band from 7th grade to 10 grade. Mishuba says 'He can play any perucssion instrument'.");
NewsArray.push("Mishuba went to Holbrook Elementary in North Carolina, Riley elementary in Florida and Jefferson Elementary in Kansas.");
NewsArray.push("Mishuba was the 400m state champion for 3a in 2008 and the 400m state champion for 4a in 2009.");
NewsArray.push("Mishuba went to Fort Riley Middle School in Kansas, Liberty HIll MIddle School in Texas and Union Grove Middle School.");
NewsArray.push("Mishuba was athlete of the year in 2008 for track & field for South Carolina.");
NewsArray.push("Mishuba played on the school football team from 7th grade to 12 grade.");
NewsArray.push("Mishuba graduated from Blythewood High School.");
NewsArray.push("Mishuba run track for the Univeristy of South Carolina. <a href='https://gamecocksonline.com/sports/track-and-field/roster/chris-maxwell/2677'> Click here to find out more </a>");
NewsArray.push("Mishuba received a silver on his WorkKey Career Readiness Certificate in the 11th grade.");
NewsArray.push("Mishuba ran track and field from 7th grade up until he graduated from undergraduate school.");
NewsArray.push("Mishuba went to Harker Heights High School in Texas and Blythewood High School in South Carolina.");
NewsArray.push("Mishuba received his Professional TEFL Certification in 2017. His Certificate NO. is <a href='teacherlink.teachingnomad.com/certificates'> TN1700-043  </a>");
NewsArray.push("Mishuba received his MS in Entertainment Business from Full Sail University in 2020.");

export async function NewsTimer() {
    ReallyDude = Math.floor(Math.random() * NewsArray.length);
    document.getElementById("NTS").innerHTML = NewsArray[ReallyDude];
}
/* News Ticker/Updater End */
