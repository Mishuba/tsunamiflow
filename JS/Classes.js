/*cd
sudo certbot--nginx - d websocket.tsunamiflow.club - d ruby.tsunamiflow.club - d network.tsunamiflow.club        
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Error while running nginx -c /etc/nginx/nginx.conf -t.

2025/10/02 09:18:46 [warn] 116365#116365: protocol options redefined for 0.0.0.0:443 in /etc/nginx/sites-enabled/www.tsunamiflow.club:24
2025/10/02 09:18:46 [emerg] 116365#116365: no "ssl_certificate" is defined for the "listen ... ssl" directive in /etc/nginx/sites-enabled/network.tsunamiflow.club:7
nginx: configuration file /etc/nginx/nginx.conf test failed

The nginx plugin is not working; there may be problems with your existing configuration.
The error was: MisconfigurationError('Error while running nginx -c /etc/nginx/nginx.conf -t.\n\n2025/10/02 09:18:46 [warn] 116365#116365: protocol options redefined for 0.0.0.0:443 in /etc/nginx/sites-enabled/www.tsunamiflow.club:24\n2025/10/02 09:18:46 [emerg] 116365#116365: no "ssl_certificate" is defined for the "listen ... ssl" directive in /etc/nginx/sites-enabled/network.tsunamiflow.club:7\nnginx: configuration file /etc/nginx/nginx.conf test failed\n')
*/

export class Weather {
    constructor() {
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
        xhr.open('POST', something);

        xhr.onload = async function (e) {
            if (this.status == 200) {
                // get the JSON reponse
                //parse when receiving 
                //stringify when sending
                let infoWeather = ('response', JSON.parse(this.response));

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
        let something = "https://api.weatherapi.com/v1" + "/current.json" + "?key=" + "cf5a64c9095e425ab0f52816230110" + "&q=" + CityName + "&aqi=no";

        const userCity = new XMLHttpRequest();
        userCity.open("POST", something);
        userCity.onload = function (e) {
            if (this.status == 200) {
                //get  the JSON response
                let infoWeather = ('response', JSON.stringify(this.response));
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
        } else {
            console.log("geo working");
            navigator.permissions.query({
                name: "geolocation"
            }).then(result => {
                if (result.state === "granted") {
                    console.log("geolocation is accessible and you are able to use it for different things. granted");
                    console.log("getting the information on the current position.");
                    navigator.geolocation.getCurrentPosition(this.LatAndLong, this.Error, this.DSLO);
                } else if (result.state === "prompt") {
                    //console.log("geolocation needs to be requested");
                    if (confirm("TF is asking if you will allow it to access your location.")) {
                        navigator.geolocation.getCurrentPosition(this.LatAndLong, this.Error, this.DSLO);
                    } else {
                        let letmegetloc = prompt("If you want weather updates please type your city name with no spaces if not just press enter. (Your Location will not be accessed");
                        if (letmegetloc.trim() !== "") {
                            this.City(letmegetloc);
                        } else {
                            console.log("the weather will not work.");
                        }
                    };
                } else {
                    console.log("geo denied");
                    let letmegetloc = prompt("If you want weather updates please type your city name with no spaces if not just press enter. (Your Location will not be accessed");
                    if (!letmegetloc === "" || " ") {
                        this.City(letmegetloc);
                    } else {
                        console.log("the weather will not work.");
                    }
                }
            });
        };
    }
}
/*
export class TfImages {
    constructor() {

    }
}
*/

export class tfVGbaby {

    cry() {
        console.log("crying");
    }
    laugh() {
        console.log("laughing");
    }
    crawl() {
        console.log("crawling");
    }
}

export class tfVGtoddler extends tfVGbaby {
    constructor() {

    }
}

export class tfVGkid extends tfVGtoddler {
    constructor() {

    }
}

export class tfVGpreteen extends tfVGkid {
    constructor() {

    }
}

export class tfVGteen extends tfVGpreteen {
    constructor() {

    }
}

export class tfVGyoungAdult extends tfVGteen {
    constructor() {

    }
}

export class tfVGadult extends tfVGyoungAdult {
    constructor() {

    }
}

export class tfVGmatureAdult extends tfVGadult {
    constructor() {

    }
}

export class tfVGolderAdult extends tfVGmatureAdult {
    constructor() {

    }
}

export class tfVGelderAdult extends tfVGolderAdult {
    constructor() {

    }
}

export class tfVGlegendaryAdult extends tfVGelderAdult {
    constructor() {

    }
}

export class tfVGmythicalAdult extends tfVGlegendaryAdult {
    constructor() {

    }
}