import { HeaderNews } from "./Elder/news.js";
export class HeaderWeather extends HeaderNews {
    constructor(options = {}) {
        super(options)
        this.DSLO = {
            enabledHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };
    }
    LatAndLong(working) {
        // use the latitude and longitude location points. 
        let TFlat = working.coords.latitude;
        let TFlong = working.coords.longitude;
        //let TFcoords = working.coords;
        //use the latitude and longitude location points.
        let something = "https://api.weatherapi.com/v1" + "/current.json" + "?key=" + "cf5a64c9095e425ab0f52816230110" + "&q=" + TFlat + "," + TFlong + "&aqi=no";
        const xhr = new XMLHttpRequest();
        xhr.open('GET', something);
        xhr.responseType = 'json';

        xhr.onload = async function () {
            if (this.status == 200) {
                const infoWeather = this.response;

                if (!infoWeather || !infoWeather.location) {
                    console.error('Weather API returned invalid response', this.response);
                    return;
                }

                let IWname = infoWeather.location.name;
                let IWregion = infoWeather.location["region"];
                let IWcountry = infoWeather.location["country"];

                //current
                let IWcTC = infoWeather.current["temp_c"];
                let IWcTF = infoWeather.current["temp_f"];
                let IWcText = infoWeather.current["condition"]["text"];
                let IWcIcon = infoWeather.current["condition"]["icon"];


                // Display on web page
                let theWeatherFr = `${IWname}, ${IWregion}, ${IWcountry} <br>${IWcText} C: ${IWcTC} F: ${IWcTF} <img src=${IWcIcon}>`;
                document.getElementById("TFweather").innerHTML = theWeatherFr;
                //return theWeatherFr;
                //Make the response do cool stuf.
            }
        };
        xhr.send();
    }
    City(CityName) {
        let something = "https://api.weatherapi.com/v1" + "/current.json" + "?key=" + "cf5a64c9095e425ab0f52816230110" + "&q=" + encodeURIComponent(CityName) + "&aqi=no";

        const userCity = new XMLHttpRequest();
        userCity.open("GET", something);
        userCity.responseType = 'json';
        userCity.onload = function () {
            if (this.status == 200) {
                const infoWeather = this.response;
                if (!infoWeather || !infoWeather.location) {
                    console.error('Weather API returned invalid response', this.response);
                    return;
                }
                let IWname = infoWeather.location.name;
                let IWregion = infoWeather.location["region"];
                let IWcountry = infoWeather.location["country"];

                //current
                let IWcTC = infoWeather.current["temp_c"];
                let IWcTF = infoWeather.current["temp_f"];
                let IWcText = infoWeather.current["condition"]["text"];
                let IWcIcon = infoWeather.current["condition"]["icon"];


                // Display on web page
                //document.getElementById("TFweather").innerHTML 
                let theWeatherFr = `${IWname}, ${IWregion}, ${IWcountry} <br>${IWcText} C: ${IWcTC} F: ${IWcTF} <img src=${IWcIcon}>`;
                //postMessage(`${IWname}, ${IWregion}, ${IWcountry} <br>${IWcText} C: ${IWcTC} F: ${IWcTF} <img src=${IWcIcon}>`);
                document.getElementById("TFweather").innerHTML = theWeatherFr;
                //return theWeatherFr;

                //Make the response do cool stuff. 
            }
        };
        userCity.send();
    }
    Error(e) {
        switch (e.code) {
            case e.PERMISSION_DENIED:

                break;
            case e.POSITION_UNAVAILABLE:

                break;
            case e.TIMEOUT:

                break;
            case e.UNKNOWN_ERROR:

                break;
            default:
                console.error(e);
                break;
        }
    }
    requestLocation() {
        if (!navigator.geolocation) {
            console.log("geo not working");
            return;
        }

        const success = this.LatAndLong.bind(this);
        const failure = this.Error.bind(this);
        const requestPosition = () => navigator.geolocation.getCurrentPosition(success, failure, this.DSLO);

        console.log("geo working");
        navigator.permissions.query({ name: "geolocation" })
            .then(result => {
                if (result.state === "granted") {
                    console.log("geolocation is accessible and you are able to use it for different things. granted");
                    console.log("getting the information on the current position.");
                    requestPosition();
                } else if (result.state === "prompt") {
                    if (confirm("TF is asking if you will allow it to access your location.")) {
                        requestPosition();
                    } else {
                        const letmegetloc = prompt("If you want weather updates please type your city name with no spaces if not just press enter. (Your Location will not be accessed");
                        const cityName = letmegetloc?.trim();
                        if (cityName) {
                            this.City(cityName);
                        } else {
                            console.log("the weather will not work.");
                        }
                    }
                } else {
                    console.log("geo denied");
                    const letmegetloc = prompt("If you want weather updates please type your city name with no spaces if not just press enter. (Your Location will not be accessed");
                    const cityName = letmegetloc?.trim();
                    if (cityName) {
                        this.City(cityName);
                    } else {
                        console.log("the weather will not work.");
                    }
                }
            })
            .catch(err => {
                console.warn("Permission query failed:", err);
                requestPosition();
            });
    }
}