//Variables
var TsunamiFlowStore = "store.php";
/*Time*/
const time = document.getElementById("time");

/* Words */

/* weather */
const weatherSpot = document.getElementById("TFweather");
const DSLO = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};
/*weather api */
const WABul = "https://api.weatherapi.com/v1";
const WABurl = "https://api.weatherapi.com/v1";
const WapiKey = "cf5a64c9095e425ab0f52816230110";
const CWapi = "/current.json";
const WFFCapi = "/forecast.json";
const WSapi = "/sports.json";
const WAapi = "/astronomy.json";

/*News*/
let newsWorker;

//Radio
const audioPlayer = document.getElementById("TFradioPlayer");
var jsonphpradio;


APRP = audioPlayer.remote;
APRP.watchAvailability((availability) => {
    // Do something when the availability Changes    
});

const radioTypes = [
    "video/webm",
    "audio/webm",
    "video/webm;codecs=vp8",
    "video/webm;codecs=daala",
    "video/webm;codecs=h264",
    "audio/webm;codecs=opus",
    "video/mp4",
    "audio/mp3"
];

//Arrays
//Nav
const navButtons = {
    homepage: document.getElementById("tfHome"),
    roster: document.getElementById("tfRoster"),
    news: document.getElementById("tfNews"),
    Competitions: document.getElementById("tfCompetitions"),
    TFnetwork: document.getElementById("tfNetwork"),
    Community: document.getElementById("tfCommunity"),
    store: document.getElementById("tfStore")
};

//functions 
//Time
function currentTime() {
    time.innerHTML = new Date();
};

//Word of The Day
function WordOfTheDay() {
    let WordArray;

    let TheDate;

    // Get the word for the correct day. 
    /* I want to just create an array of words word:defintion and then just go through the array each day.*/
};


//Quotes [im'a add quotes to the Tsunami Flow Radio. I'ma figure out a time thing]
/* lets try a php things to make it easier.

I'll create a xmlhttprequest object here.
the object will request the list of quotes.
then the object will cycle through the quotes every 10 mins.

the php will create the quotes from a JSON file or from a txt file idk yet.
    I rather just make a section on my website that only I can log in from and just add the quotes like that.
Once the php creates the quotes it puts the quotes in an array or JSON format and sends it tot he javascript to use.
*/

/* Weather */
function DEWL(theError) {
    switch (theError.code) {
        case theError.PERMISSION_DENIED:
            weatherSpot.innerText = "You denied the request for geolocation";
            break;
        case theError.POSITION_UNAVAILABLE:
            weatherSpot.innerText = "Location information is unavailable";
            break;
        case theError.TIMEOUT:
            weatherSpot.innerText = "The request to get user location timed out";
            break;
        case theError.UNKNOWN_ERROR:
            weatherSpot.innerText = "An unknown error occurred.";
            break;
    }
};

/*this function is where I use the location to get the weather information and put it on the website.*/

function CityXml(CityName) {
    let something = `${WABul}${CWapi}?key=${WapiKey}&q=${CityName}&aqi=no`;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', something);
    xhr.onload = function (e) {
        if (this.status == 200) {
            // get the JSON reponse
            let infoWeather = ('response', JSON.stringify(this.response));

            //Put the response in the right area

            // Display on web page
            weatherSpot.innerHTML = infoWeather;

            //Make the response do cool stuf.
        }
    };
    xhr.send();
}


function DSWL(working) {
    // use the latitude and longitude location points. 
    let TFlat = working.coords.latitude;
    let TFlong = working.coords.longitude;
    let TFcoords = working.coords;
    //use the latitude and longitude location points.
    let something = `${WABurl}${CWapi}?key=${WapiKey}&q=${TFlat},${TFlong}&aqi=no`;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', something);

    xhr.onload = function (e) {
        if (this.status == 200) {
            // get the JSON reponse
            //parse when receiving 
            //stringify when sending
            let infoWeather = ('response', JSON.parse(this.response));

            IWname = infoWeather.location.name;
            IWregion = infoWeather.location["region"];
            IWcountry = infoWeather.location["country"];
            IWtzid = infoWeather.location["tz_id"];

            //current
            IWcLUE = infoWeather.current["last_updated_epoch"];
            IWcLU = infoWeather.current["last_updated"];
            IWcTC = infoWeather.current["temp_c"];
            IWcTF = infoWeather.current["temp_f"];
            IWcIsD = infoWeather.current["is_day"];
            IWcText = infoWeather.current["condition"]["text"];
            IWcIcon = infoWeather.current["condition"]["icon"];
            IWcCode = infoWeather.current["condition"]["code"];

            // Display on web page
            weatherSpot.innerHTML = `${IWname}, ${IWregion}, ${IWcountry} <br>${IWcText} C: ${IWcTC} F: ${IWcTF} <img src=${IWcIcon}>`;

            //Make the response do cool stuf.
        }
    };
    xhr.send();
    //`Latitude: ${TFlat} Longitude: ${TFlong}`;
    /*
    
        Country
        City
        Temp
        Clouds
        Rain
        Sports
        blah blah blah
    */
};

/*navigator*/
function requestLocation() {
    if (!navigator.geolocation) {
        console.log("geo not working");
    } else {
        console.log("geo working");
        navigator.permissions.query({
            name: "geolocation"
        }).then(result => {
            if (result.state === "granted") {
                console.log("geo granted");
                navigator.geolocation.getCurrentPosition(DSWL, DEWL, DSLO);
            } else if (result.state === "prompt") {
                console.log("geo needs to be requested");
                if (confirm("TF is asking if you will allow it to access your location.")) {
                    navigator.geolocation.getCurrentPosition(DSWL, DEWL, DSLO);
                } else {
                    console.log("Your location will not be accessed");

                    let letmegetloc = prompt("If you want weather updates please type your city name with no spaces if not just press enter. (Your Location will not be accessed");

                    if (!letmegetloc === "" || " ") {
                        CityXml(letmegetloc);
                    } else {
                        console.log("the weather will not work.");
                    }
                };
            } else {
                console.log("geo denied");
                let letmegetloc = prompt("If you want weather updates please type your city name with no spaces if not just press enter. (Your Location will not be accessed");

                if (!letmegetloc === "" || " ") {
                    CityXml(letmegetloc);
                } else {
                    console.log("the weather will not work.");
                }
            }
        });
    };
}


//Navigation 
function NavXML(un, psw) {
    if (un.value == "" || psw.value == "") {
        // You may want to handle the case where username or password is empty
    } else {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("TFloginIcon").innerHTML = this.responseText;
                // create a cookie to keep the user logged in when I regenerate the session.
                // set localstorage, localids, preferences, get computer info and all that.
            }
        };
        xhr.open("POST", `NavLogin.php?phpnun=${un.value}&phpnpsw=${psw.value}`, true);
        xhr.send();
    }
}


//News 
function tfStartWorker() {

}

if (window.Worker) {
    console.log("web worker working");
    if (typeof (Worker) !== "undefined") {
        console.log("type of worker is defined");
        if (typeof (newsWorker) == "undefined") {
            console.log("News Worker is not defined");
            newsWorker = new Worker("JS/WWnewsTicker.js");
            console.log("News worker is now defined");
        } else {
            console.log("news worker is defined");
        }
        // Do the news function from here.
        newsWorker.onmessage = function (event) {
            document.getElementById("NTS").innerHTML = event.data;
        }

        newsWorker.onerror = function (error) {
            console.log(`error message: ${error.message} <br> error filename: ${error.filename} <br> error line: ${error.lineno}`);
            preventDefault(newsWorker);
            let newsScript = document.createElement("script").src("JS/NewsTicker.js");
        }
    } else {
        console.log("No Web Worker Support");
    }
    //importScripts(""); to import more than one do it like this importScripts("","",""); 
} else {
    //create a script element.
    let newsScript = document.createElement("script").src("JS/NewsTicker.js");
    // add news.js to the element src 

    // append the element so it can then run.
}



function stopNewsWorker() {
    newsWorker.terminate();
    newsWorker = undefined;
}

function RadioTime(PSL) {
    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let radioRandom;

    // Determine the source based on the current hour and minutes
    switch (hour) {
        case 0: // In the Club {Flirting Set}
        case 1: // Dancing {Twerking Songs, line dance, viral dances(jerk, flex), dance battles}
        case 2: // After club mix
        case 3: // Sex Songs (foreplay, sex, after)
        case 4: // Love Songs (Memories, The Power of Love, I Love You)
        case 5: // Family Songs (Lifestyle, Being a Family, Kids)
        case 6: // Inspiration
        case 7: // History of the Day, Classic & Classical, Yesterdays History
        case 8: // Politics
        case 9: // Gaming
        case 10: // Comedy
        case 11: // All music random by year
        case 12: // Literature
        case 13: // Sports
        case 14: // Tech
        case 15: // Science
        case 16: // Real Estate
        case 17: // DJ Shuba
        case 18: // Film
        case 19: // Fashion
        case 20: // Business
        case 21: // Hustlin Music
        case 22: // Pregame
        case 23: // Just Entered the Club
            // Use `PSL[hour]` and select based on the current minute range
            let rangeIndex;
            if (hour >= 0 && hour <= 2) {
                // Special handling for hours 0, 1, 2, 3, 4, 5, 6
                if (hour === 0) {
                    radioRandom = Math.floor(Math.random() * PSL[hour][0].length);
                } else if (hour === 1) {
                    if (minutes <= 5) radioRandom = Math.floor(Math.random() * PSL[hour][0].length);
                    else if (minutes <= 15) radioRandom = Math.floor(Math.random() * PSL[hour][1].length);
                    else if (minutes <= 30) radioRandom = Math.floor(Math.random() * PSL[hour][2].length);
                    else radioRandom = Math.floor(Math.random() * PSL[hour][3].length);
                } else {
                    radioRandom = Math.floor(Math.random() * PSL[hour].length);
                }
                audioPlayer.src = PSL[hour][radioRandom];
            } else if (hour >= 7 && hour <= 23) {
                if (minutes <= 15) rangeIndex = 0;
                else if (minutes <= 45) rangeIndex = 1;
                else rangeIndex = 2;
                radioRandom = Math.floor(Math.random() * PSL[hour][rangeIndex].length);
                audioPlayer.src = PSL[hour][rangeIndex][radioRandom];
            } else {
                // Default fallback if hour is not handled explicitly
                audioPlayer.src = PSL[11][Math.floor(Math.random() * PSL[11].length)];
            }
            break;
    }
    console.log(`Hour: ${hour}, Minutes: ${minutes}`);
}

// Function to start music playback

function startMusic() {
    audioPlayer.play();
}

//Event Listeners 
document.addEventListener("DOMContentLoaded", () => {
    //Intervals
    setInterval(currentTime, 1000);
    //Intervals Ended

    requestLocation();
    setInterval(requestLocation, 1200000);
    //Nav
    //Pages
    for (const [key, button] of Object.entries(navButtons)) {
        button.addEventListener("click", () => {
            document.getElementById("TsunamiContent").src = `${key}.php`;
        });
    }
    //Pages Ended

    //Form
    document.getElementById("tfNavLoginForm").addEventListener("submit", function (tryToSignIn) {
        tryToSignIn.preventDefault();
        let NavUN = document.getElementById("nun");
        let NavPSW = document.getElementById("npsw");

        NavXML(NavUN, NavPSW);
    });
    //Form Ended
    //Nav Ended

    //Radio 
    //If Statements 
    if ("mediaCapabilities" in navigator) {
        for (const type of radioTypes) {
            // see if the type is supported.
            console.log(`Is ${type} supported? ${MediaRecorder.isTypeSupported(type) ? "Maybe!" : "Nope :("}`,);
            // see if you can use the audio
            console.log(audioPlayer.canPlayType(type));
        }
    }

    // Function to handle successful response from server
    function handleResponse() {
        if (phpRadio.status >= 200 && phpRadio.status < 300) {
            try {
                let phpSongList = JSON.parse(phpRadio.responseText);
                RadioTime(phpSongList);
                jsonphpradio = phpSongList;
            } catch (e) {
                console.error("Error Parsing JSON:", e);
            }
        } else {
            console.error("Request failed with status:", phpRadio.status);
        }
    }

    // Function to handle request errors
    function handleError() {
        console.error("Request Failed");
    }

    // Initialize the request
    let phpRadio = new XMLHttpRequest();
    phpRadio.open("GET", "RadioPlaylist.php", true);
    phpRadio.onload = handleResponse;
    phpRadio.onerror = handleError;
    phpRadio.send();

    //audioPlayer.addEventListener("stalled",function);
    audioPlayer.addEventListener("loadeddata", startMusic);
    audioPlayer.addEventListener("ended", function () {
        RadioTime(jsonphpradio);
    });
    /*extras 
    audioPlayer.mediaKeys.createSession();
    audioPlayer.mediaKeys.getStatusForPolicy();
    audioPlayer.mediaKeys.setServerCertificate();

    audioPlayer.addEventListener("abort",function);
    audioPlayer.addEventListener("canplay",function);
    audioPlayer.addEventListener("canplaythrough",function);
    audioPlayer.addEventListener("durationchange",function);
    audioPlayer.addEventListener("emptied",function);
    audioPlayer.addEventListener("error",function);
    audioPlayer.addEventListener("pause",function);
    audioPlayer.addEventListener("playing",function);

    audioPlayer.addEventListener("suspend",function);
    audioPlayer.addEventListener("volumechange",function);
    audioPlayer.addEventListener("waiting",function);
*/
    /*Radio Ended */
});
//Add Event Listener ended


/*
This is for radio
*/

//start functions
//RadioTime();

/*
                <script>
                    var tfAudioElement = document.getElementById("tfPlayer");
                    const musicImage = document.getElementById("musicPicture");
                    const backButton = document.getElementById("backButton");
                    const skipButton = document.getElementById("skipButton");

                    var CurrentSong = 0;

                    function LoadFirstSong() {
                        CurrentSong = Math.floor(Math.random() * TFmusicList.length - 1);
                        tfAudioElement.src = TFmusicList[CurrentSong];
                    }

                    function previousMusic() {
                        if (CurrentSong <= 0) {
                            CurrentSong = TFmusicList.length;
                        } else {
                            CurrentSong--;
                        }
                        tfAudioElement.src = TFmusicList[CurrentSong];
                        tfAudioElement.play();
                    }

                    function skipMusic() {
                        CurrentSong++;
                        if (CurrentSong >= TFmusicList.length) {
                            CurrentSong = 0;   
                        }
                        tfAudioElement.src = TFmusicList[CurrentSong];
                        tfAudioElement.play();
                    }

                    function randomMusic() {
                        RandomTfSongs = Math.floor(Math.random() * TFmusicList.length - 1)
                        if (CurrentSong == RandomTfSongs) {
                            if (CurrentSong <= 0) {
                                CurrentSong = TFmusicList.length;
                            } else if (CurrentSong >= TFmusicList.length) {
                                CurrentSong = 0;   
                            } else {
                                CurrentSong = Math.round(TFmusicList.length / 2);
                            }
                        } else if (CurrentSong < 0) {
                            CurrentSong = TFmusicList.length;
                        } else if (CurrentSong > TFmusicList.length) {
                            CurrentSong = 0;   
                        } else {
                            CurrentSong = RandomTfSongs;
                        }
                        tfAudioElement.src = TFmusicList[CurrentSong];
                        tfAudioElement.play();
                    }

                    tfAudioElement.onended = randomMusic();
*/