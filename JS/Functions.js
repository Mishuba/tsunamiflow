import { weatherSpot, WABul, WABurl, WapiKey, CWapi, TsunamiRadio, TsunamiRadioTitle, TsunamiLastButton, TsunamiRadioButtons, TsunamiRestartButton, TsunamiStartButton, TsunamiSkipButton, RadioCanvas } from "./Variables.js";

import { DSLO } from "./Objects.js";

import { Particle } from "./Classes.js";

let CANVAS_WIDTH = 600;
let CANVAS_HEIGHT = 600;

//Visualizator
let particles = [];
for (let i = 0; i < 100; i++) {
    let x = Math.random() * RadioCanvas.width;
    let y = Math.random() * RadioCanvas.height;
    let dx = (Math.random() - 0.5) * 0.5;
    let dy = (Math.random() - 0.5) * 0.5;
    let radius = Math.random() * 0.5 + 0.2;
    let color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, 0.8)`;
    particles.push(new Particle(x, y, dx, dy, radius, color));
}
//Radio Stuff Ends
//Canvas Video Game items
/*
var fullHeal;
var fullStamina;
var fullMagic;
*/
//Get browser info
async function getBrowserType() {
    const userAgent = navigator.userAgent;
    console.log(userAgent);

    if (userAgent.indexOf("Chrome") > -1) {
        return Promise.resolve("chrome");
    } else if (userAgent.indexOf("Firefox") > -1) {
        return Promise.resolve("firefox");
    } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
        return "safari";
    } else if (userAgent.indexOf("Edge") > -1) {
        return "edge";
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
        return "opera";
    } else if (userAgent.indexOf("Netscape") > -1) {
        return "netscape";
    } else {
        return "unknown";
    }
}

export function loadBrowserSpecificScript() {
    const browser = getBrowserType();

    let script = document.createElement("script");
    switch (browser) {
        case "chrome":
            script.src = "JS/chrome-specific.js";
            break;
        case "firefox":
            script.src = "JS/firefox-specific.js";
            break;
        case "safari":
            script.src = "JS/safari-specific.js";
            break;
        case "edge":
            script.src = "JS/edge-specific.js";
            break;
        case "opera":
            script.src = "JS/opera-specific.js";
            break;
        case "netscape":
            script.src = "JS/netscape-specific.js";
            break;
        default:
            script.src = "JS/default.js";
            break;
    }

    document.head.appendChild(script);
}
//Weather
async function DEWL(theError) {
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

async function CityXml(CityName) {
    let something = `${WABul}${CWapi}?key=${WapiKey}&q=${CityName}&aqi=no`;

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
            weatherSpot.innerHTML = `${IWname}, ${IWregion}, ${IWcountry} <br>${IWcText} C: ${IWcTC} F: ${IWcTF} <img src=${IWcIcon}>`;

            //Make the response do cool stuff. 
        }
    };
    userCity.send();
}

async function DSWL(working) {
    // use the latitude and longitude location points. 
    let TFlat = working.coords.latitude;
    let TFlong = working.coords.longitude;
    let TFcoords = working.coords;
    //use the latitude and longitude location points.
    let something = `${WABurl}${CWapi}?key=${WapiKey}&q=${TFlat},${TFlong}&aqi=no`;
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
            weatherSpot.innerHTML = `${IWname}, ${IWregion}, ${IWcountry} <br>${IWcText} C: ${IWcTC} F: ${IWcTF} <img src=${IWcIcon}>`;

            //Make the response do cool stuf.
        }
    };
    xhr.send();
};

export async function requestLocation() {
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
export async function NavXML(un, psw) {
    if (un.value == "" || psw.value == "") {
        // You may want to handle the case where username or password is empty
    } else {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("TFloginIcon").innerHTML = this.responseText;
                // create a cookie to keep the user logged in when I regenerate the session.
                // set sessionstorage, sessionids,and localstorageid, userPreferences, get computer info
            }
        };
        xhr.open("POST", `server.php?phpnun=${un.value}&phpnpsw=${psw.value}`, true);
        xhr.send();
    }
}

//Community Stuff Starts Here
//Subscribers
export async function DoXML(fn, ls, nn, gen, em, birth, un, psw, membershipLevel, chineseZodiacSign, westernZodiacSign, spiritAnimal, celticTreeZodiacSign, nativeAmericanZodiacSign, vedicAstrologySign, guardianAngel, chineseElement, eyeColorMeaning, greekMythologyArchetype, norseMythologyPatronDeity, egyptianZodiacSign, mayanZodiacSign, loveLanguage, birthstone, birthFlower, bloodType, attachmentStyle, charismaType, businessPersonality, disc, socionicsType, learningStyle, financialPersonalityType, primaryMotivationStyle, creativeStyle, conflictManagementStyle, teamRolePreference, SPC, SPCC, SPA1, SPA2, SPCtf, SS, SPN, MembershipCostFr, SCidFR) {
    let SubFormData = new FormData();
    SubFormData.append("TFRegisterFirstName", fn.value);
    SubFormData.append("TFRegisterLastName", ls.value);
    SubFormData.append("TFRegisterNickName", nn.value);
    SubFormData.append("TFRegisterGender", gen.value);
    SubFormData.append("TFRegisterEmail", em.value);
    SubFormData.append("TFRegisterBirthday", birth.value);
    SubFormData.append("TFRegisterUsername", un.value);
    SubFormData.append("TFRegisterPassword", psw.value);
    SubFormData.append("membershipLevel", membershipLevel.value);
    SubFormData.append("ChineseZodiacSign", chineseZodiacSign.value);
    SubFormData.append("WesternZodiacSign", westernZodiacSign.value);
    SubFormData.append("SpiritAnimal", spiritAnimal.value);
    SubFormData.append("CelticTreeZodiacSign", celticTreeZodiacSign.value);
    SubFormData.append("NativeAmericanZodiacSign", nativeAmericanZodiacSign.value);
    SubFormData.append("VedicAstrologySign", vedicAstrologySign.value);
    SubFormData.append("GuardianAngel", guardianAngel.value);
    SubFormData.append("ChineseElement", chineseElement.value);
    SubFormData.append("EyeColorMeaning", eyeColorMeaning.value);
    SubFormData.append("GreekMythologyArchetype", greekMythologyArchetype.value);
    SubFormData.append("NorseMythologyPatronDeity", norseMythologyPatronDeity.value);
    SubFormData.append("EgyptianZodiacSign", egyptianZodiacSign.value);
    SubFormData.append("MayanZodiacSign", mayanZodiacSign.value);
    SubFormData.append("LoveLanguage", loveLanguage.value);
    SubFormData.append("Birthstone", birthstone.value);
    SubFormData.append("BirthFlower", birthFlower.value);
    SubFormData.append("BloodType", bloodType.value);
    SubFormData.append("AttachmentStyle", attachmentStyle.value);
    SubFormData.append("CharismaType", charismaType.value);
    SubFormData.append("BusinessPersonality", businessPersonality.value);

    SubFormData.append("DISC", disc.value);
    SubFormData.append("SocionicsType", socionicsType.value);
    SubFormData.append("LearningStyle", learningStyle.value);
    SubFormData.append("FinancialPersonalityType", financialPersonalityType.value);
    SubFormData.append("PrimaryMotivationStyle", primaryMotivationStyle.value);
    SubFormData.append("CreativeStyle", creativeStyle.value);
    SubFormData.append("ConflictManagementStyle", conflictManagementStyle.value);
    SubFormData.append("TeamRolePreference", teamRolePreference.value);
    SubFormData.append("tfSubPaymentCity", SPC.value);
    SubFormData.append("tfSubPaymentCountry", SPCC.value);
    SubFormData.append("tfSubPaymentAddress1", SPA1.value);
    SubFormData.append("tfSubPaymentAddress2", SPA2.value);
    SubFormData.append("tfSubPostalCode", SPCtf.value);
    SubFormData.append("tfSubState", SS.value);
    SubFormData.append("tfSubPhoneNumber", SPN.value);
    SubFormData.append("hiddenMC", MembershipCostFr.value);
    SubFormData.append("SCidFR", SCidFR);
    //SubFormData.append("TFRegisterFreeLevelButton", tfButton);
    //Ends
    let MyXML = new XMLHttpRequest();
    MyXML.onreadystatechange = async function () {
        if (this.readyState == 4 && this.status == 200) {
            let tSubFdataOk = JSON.parse(this.responseText);
            if (tSubFdataOk.error) {
                alert(tSubFdataOk.error);
            } else {
                //If action required (e.g., 3D secure), handle that in Javascript
                if (tSubFdataOk.requires_action) {
                    //get
                    stripeInstance.handleCardAction(tSubFdataOk.payment_intent_client_secret).then(function (result) {
                        if (result.error) {
                            //Show error to customer
                            alert(result.error.message);
                        } else {
                            //Send the paymentIntent ID to finalized subscription
                            var IDKanymore = new XMLHttpRequest();
                            IDKanymore.open("POST", "server.php", true); // Post to the same file
                            //IDKanymore.setRequestHeader("Content-Type", "application/json");

                            IDKanymore.onreadystatechange = async function () {
                                if (this.readyState == 4 && this.status == 200) {
                                    var IDKconfirmDat = JSON.parse(this.responseText);
                                    if (IDKconfirmDat.success) {
                                        console.log("Payment Successful: ", result.paymentIntent);
                                        document.getElementById("TFloginIcon").innerHTML = `${un.value} is logged in.`;
                                        document.getElementById("payment-message").innerHTML = `Welcome ${un.value} you are now a member of Tsunami Flow. <br> ${IDKconfirmDat.message} <hr>`;
                                        localStorage["NickName"] = nn.value; // NickName
                                        localStorage["Birthday"] = birth.value; // Birthday
                                        localStorage["Username"] = un.value; // Username
                                        localStorage["Membership"] = membershipLevel.value;
                                        localStorage["Gender"] = gen.value; // Gender
                                        sessionStorage["Email"] = em; // Email
                                        localStorage["City"] = SPC.value; // City 
                                        localStorage["Country"] = SPCC.value; //Country
                                    } else if (IDKconfirmDat.requires_confirmation) {
                                        console.log(IDKconfirmDat.message);
                                        document.getElementById("payment-message") = IDKconfirmDat.message;
                                    } else {
                                        console.log("it failed please try again later.");
                                    }
                                }
                            };
                            var FinalFormIthink = new FormData();
                            FinalFormIthink.append("PiTfidFR", result.paymentIntent.id);
                            IDKanymore.send(FinalFormIthink);
                        }
                    });
                } else if (tSubFdataOk.requires_confirmation) {
                    stripeInstance.confirmCardPayment(tSubFdataOk.payment_intent_client_secret, {
                        payment_method: {
                            card: cardElement
                        }
                    }).then(result => {
                        if (result.error) {
                            console.error(result.error.message);
                        } else {
                            console.log("Payment Successful: ", result.paymentIntent);

                            //send xmlrequest with the result.payment_intent_client_secret then
                            var OneMoreThingXML = new XMLHttpRequest();
                            OneMoreThingXML.open("POST", "server.php", true);
                            OneMoreThingXML.onreadystatechange = async function () {
                                if (this.readyState == 4 && this.status == 200) {
                                    TheInfoForOMT = JSON.parse(this.responseText);
                                    if (TheInfoForOMT.success) {
                                        //Do this because everything will have been submitted to the database.
                                        document.getElementById("TFloginIcon").innerHTML = `${un.value} is logged in.`;
                                        document.getElementById("payment-message").innerHTML = `Welcome ${un.value} you are now a member of Tsunami Flow.`;
                                        localStorage["NickName"] = nn.value; // NickName
                                        localStorage["Birthday"] = birth.value; // Birthday
                                        localStorage["Username"] = un.value; // Username
                                        localStorage["Membership"] = membershipLevel.value;
                                        localStorage["Gender"] = gen.value; // Gender
                                        sessionStorage["Email"] = em; // Email
                                        localStorage["City"] = SPC.value; // City 
                                        localStorage["Country"] = SPCC.value; //Country
                                    } else {
                                        console.log("the payment was unsuccessful");
                                    }
                                } else {
                                    console.log("the request failed for the payment confirmation")
                                }
                            }
                            var PaymentConfirmSubTFIguess = new FormData();
                            PaymentConfirmSubTFIguess.append("PCsubTFig", result.paymentIntent.id);
                            OneMoreThingXML.send(PaymentConfirmSubTFIguess);
                        }
                    });
                } else {
                    document.getElementById("TFloginIcon").innerHTML = `${un.value} is logged in.`;
                    document.getElementById("payment-message").innerHTML = `Welcome ${un.value} you are now a member of Tsunami Flow.`;
                    localStorage["NickName"] = nn.value; // NickName
                    localStorage["Birthday"] = birth.value; // Birthday
                    localStorage["Username"] = un.value; // Username
                    localStorage["Membership"] = membershipLevel.value;
                    localStorage["Gender"] = gen.value; // Gender
                    sessionStorage["Email"] = em; // Email
                    localStorage["City"] = SPC.value; // City 
                    localStorage["Country"] = SPCC.value; //Country
                }
            }
        } else if (this.readyState == 4 && this.status != 200) {
            console.error("Failed to submit request, status code: " + this.status);
        }
    }
    MyXML.open("POST", `./../server.php`, true);
    MyXML.send(SubFormData);
};
//Subscribers Ends
//Thoughts
export async function TfPostThot(thought) {
    if (thought.value == "") {
        console.log("thoughts didn't post");
    } else {
        let ThotXML = new XMLHttpRequest();
        ThotXML.onreadystatechange = async function () {
            if (this.readyState == 4 && this.status == 200) {
                let NewThoughtStep = JSON.parse(this.responseText);
                document.getElementById("thoughtsList").innerHTML = `User: ${NewThoughtStep[0]} Time: ${NewThoughtStep[1]} <br> Thought: ${NewThoughtStep[2]}`;
            } else if (this.readyState == 4 && this.status != 200) {
                console.error("Failed to submit request, status code: ", this.status);
            }
        };
        ThotXML.open("POST", `./../server.php?tfthought=${thought.value}`, true);
        ThotXML.send();
    }
};

//Get Thoughts
export async function getThoughtsOK(TsunamiFeed) {
    for (i = 0; i <= TsunamiFeed.length; i++) {
        for (r = 0; r <= TsunamiFeed[i].length; r++) {
            for (v = 0; v <= TsunamiFeed[i][r].length; v++) {
                for (n = 0; n <= TsunamiFeed[i][r][v].length; n++) {
                    let myTFthotTime = document.createElement("li");
                    myTFthotTime.innerHTML = TsunamiFeed[i][r][v][n];
                    let myTfThotUser = document.createElement("h4");
                    myTfThotUser.innerHTML = TsunamiFeed[i][r];
                    let myTfThot = document.createElement("p4");
                    myTfThot.innerHTML = TsunmamiFeed[i][r][v];

                    document.getElementById("thoughtsList").appendChild(myTFthotTime).appendChild(myTfThotUser).appendChild(myTfThot);
                };
            };
        };
        // i is the spot in the array
        // r is the user 
        // v is user thoughts 
        // n is thought time
    };
};
//Thoughts Ends Here
//Community Stuff Ends

//Radio
export async function startMusic() {
    if (TsunamiRadio.paused) {
        TsunamiRadio.play().catch(async (error) => {
            if (error.name === "NotAllowedError") {
                console.log("Autoplay is blocked. Please interact with the page to start the radio.");
            } else {
                console.error("Error playing audio:", error);
            }
        });
    } else {
        await TsunamiRadio.play().catch(async (error) => {
            if (error.name === "NotAllowedError") {
                console.log("Autoplay is blocked. Please interact with the page to start the radio.");
            } else {
                console.error("Error playing audio:", error);
            }
        });
    }
}

export async function stopMusic() {
    if (!TsunamiRadio.paused) {
        await TsunamiRadio.pause();
    }
}

export async function previousSong(music) {
    TsunamiRadio.src = music;
    await TsunamiRadio.play();
}

export async function restartSong(music) {
    TsunamiRadio.src = await music;
    await TsunamiRadio.play();
}

export async function TsunamiRadioReady() {
    TsunamiRadioTitle.innerHTML = "Welcome to TFN Radio";

    TsunamiLastButton.id = "TFradioPreviousButton";
    TsunamiLastButton.innerHTML = "Previous";
    TsunamiLastButton.addEventListener("click", async () => {

    });
    TsunamiRadioButtons.appendChild(TsunamiLastButton);

    TsunamiRestartButton.id = "TFRadioRestartButton";
    TsunamiRestartButton.innerHTML = "Restart";
    TsunamiRestartButton.addEventListener("click", async () => {

    });
    TsunamiRadioButtons.appendChild(TsunamiRestartButton);

    TsunamiStartButton.id = "TFradioButton";
    TsunamiStartButton.innerHTML = "Start Radio";
    TsunamiStartButton.addEventListener("click", async () => {
        if (TsunamiRadio.paused) {
            startMusic();
            TsunamiStartButton.innerHTML = "Pause Tsuanmi Radio";
        } else {
            stopMusic();
            TsunamiStartButton.innerHTML = "Play Tsunami Radio";
        }
    });
    TsunamiRadioButtons.appendChild(TsunamiStartButton);


    TsunamiSkipButton.id = "TFradioSkipButton";
    TsunamiSkipButton.innerHTML = "Next";
    TsunamiSkipButton.addEventListener("click", async () => {

    });
    TsunamiRadioButtons.appendChild(TsunamiSkipButton);
}

let visualizatorController;
//Radio Visualizer
export function TfAudioVisualizer(canvas, dataArray, bufferLength, AudioAnalyser) {
    let ctx = canvas.getContext("2d");

    let hereDude = async function doitBro() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //AudioAnalyser.getFloatTimeDomainData(dataArray);
        //AudioAnalyser.getByteTimeDomainData(dataArray);
        AudioAnalyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = "rgb(10, 10, 30)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Get Average volume for particle reaction
        let CtxTotal = 0;
        for (let i = 0; i < dataArray.length; i++) {
            CtxTotal += dataArray[i];
        }
        let averageVolume = CtxTotal / dataArray.length;

        for (let i = 0; i < particles.length; i++) {
            particles[i].update(averageVolume);
            particles[i].draw(ctx);
        }

        let barWidth = (100 / bufferLength) * 2.5;
        let barHeight;
        let CtxX = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            let CtxR = barHeight + 25 * (i / bufferLength);
            let CtxG = 250 * (i / bufferLength);
            let CtxB = 50;

            ctx.fillStyle = `rgb(${CtxR}, ${CtxG}, ${CtxB})`;
            ctx.fillRect(CtxX, 100 - barHeight, barWidth, barHeight);

            CtxX += barWidth + 1;
        }

        visualizatorController = requestAnimationFrame(hereDude);
    }

    hereDude();
};

export async function StopTheVisualizator() {
    cancelAnimationFrame(visualizatorController);
}
//Audio Ends

//Video
let isPlaying = false;
let mediaRecorder;
let recordedChunks = [];

export async function TplayFVideo() {
    /*tfVidStuff.play();*/
}

export async function TpauseFVideo() {
    /*    tfVidStuff.pause(); */
}

//Recording
export async function startRecording() {
    /*
    recordedChunks = [];
    let canvasStream = homepageCanvas.captureStream();
    let mediaStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...tfVidStuff.srcObject.getAudioTracks() // Include audio from video stream
    ]);
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };
    mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
        const randomSrc = URL.createObjectURL(recordedBlob);
        Tframe4u.href = randomSrc;
        Tframe4u.download = "RecordedVideo.webm";
        Tframe4u.style.display = 'block';
        Tframe4u.textContent = 'Download Video';
    };
    mediaRecorder.start();
    TframeIsRecording = true;
    TframeStRec.disabled = true;
    TframeSpRec.disabled = false;
    */
}

export async function stopRecording() {
    /*
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        TframeIsRecording = false;
        TframeStRec.disabled = false;
        TframeSpRec.disabled = true;
    }
        */
}
//Recording Ends

//Webcam
/*
export async function startWebcam() {
    
    //let emptyStream = new MediaStream();
    //let VideoStreamOk = new MediaStream(AskForWebcam);
    //let AudioStreamOk = new MediaStream(RadioPlaylistElement);
    tfVidStuff.srcObject = AskForWebcam;
    tfVidStuff.play();
    animate();

}
*/
export async function applyChromaKeyWebcam() {
    /*
    const frame = hpCC.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const data = frame.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Check if pixel matches the chroma key color for webcam
        if (r === chromaKeyColorWebcam.r && g === chromaKeyColorWebcam.g && b === chromaKeyColorWebcam.b) {
            data[i + 3] = 0; // Set alpha to 0
        }
    }
    hpCC.putImageData(frame, 0, 0);
    */
}
//Webcam Ends
//Video Ends
//Canvas
//ChromaKey Canvas
export async function hexToRgb(hex) {
    /*
    let trf = 0, tgf = 0, tbf = 0;
    if (hex.length === 4) {
        trf = parseInt(hex[1] + hex[1], 16);
        tgf = parseInt(hex[2] + hex[2], 16);
        tbf = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        trf = parseInt(hex[1] + hex[2], 16);
        tgf = parseInt(hex[3] + hex[4], 16);
        tbf = parseInt(hex[5] + hex[6], 16);
    }
    return { trf, tgf, tbf };
    */
}
//ChromaKey Canvas Ends

export async function animate() {
    /*
    let frameSkipCount = 2;
    let frameCounter = 0;
    if (tfVidStuff.paused || tfVidStuff.ended) {
        hpCC.drawImage(tfVidStuff, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const imageData = hpCC.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const data = imageData.data;
        const chromaColor = hexToRgb(colorPicker.value);

        for (let i = 0; i < data.length; i += 4) {
            if (data[i] === chromaColor.r && data[i + 1] === chromaColor.g && data[i + 2] === chromaColor.b) {
                data[i + 3] = 0; // Set alpha to 0 for transparency
            }
        }

        hpCC.putImageData(imageData, 0, 0);
        requestAnimationFrame(animate);
    } else {
        hpCC.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw the uploaded background video or image
        if (backgroundVideo) {
            hpCC.drawImage(backgroundVideo, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        } else if (backgroundImage) {
            hpCC.drawImage(backgroundImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        // Draw the webcam feed if it's active
        if (isPlaying) {
            hpCC.drawImage(video, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }

        // Apply chroma key for webcam, video, and image based on flags
        if (frameCounter % frameSkipCount === 0) {
            if (useChromaKeyWebcam) applyChromaKeyWebcam();
        }

        frameCounter++;

        // Continue the animation loop
        animationId = requestAnimationFrame(animate);
    }
    */
}
//Canvas Ends

//Store Begins
export function TsunamiDonations(stripe, elements) {
    const card = elements.create("card");
    card.mount("#DonationCardElement");

    return stripe.createPaymentMethod({
        type: "card",
        card: card,
    });
}
export function toggleTaxField() {
    var checkbox = document.getElementById("businessCheck");
    var taxField = document.getElementById("taxIdField");
    taxField.style.display = checkbox.checked ? "block" : "none";
}
//Handles Payment. Stripe Payments and Subscribers Payments.


export async function normalState(canvas) {
    if (canvas === "2d") {
        playerState = "stand";
    } else if (canvas === "webgl") {

    } else {
        console.log("no normal state might do something with the video.");
        if (canvas === "no stream") {
            console.log("use for none webrtc aka streaming aka more than one user stuff");
        } else {
            console.log("We are using this for streaming purposes");
        }
    }
}

// Game Mechanics
/* 
Air Division 
1.)
2.)
3.)
4.) Barn Owl
5.) Golden Eagle
Water Division
1.)
2.)
3.)
4.)
5.)
Land Division
1.)
2.)
3.)
4.)
5.)
*/
function damage(character, attackType) {
    // Return the corresponding attack damage
    // Update this because it is the most important piece for game fights.
    switch (attackType) {
        case "weak attack": return character.weakAttack;
        case "strong attack": return character.strongAttack;
        case "special attack": return character.specialAttack;
        case "main skill": return character.mainSkill; // Assume AoE skill as main skill
        case "range skill": return character.rangeSkill;
        case "knockback skill": return character.knockbackSkill;
        case "evade skill": return character.evadeSkill;
        case "defense skill": return character.defenseSkill;
        case "buff skill": return character.buffSkill;
        case "debuff skill": return character.debuffSkill;
        case "ultimate skill": return character.ultimateSkill;
        default: return 0; // No attack found, return 0
    }
}
//Game Mechanics Ends
//Video Game Logic Ends