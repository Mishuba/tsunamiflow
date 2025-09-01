export class TFwordOftheDay {
    constructor(word) {
        this.word = word || {};
        this.TheOtherWords = 1;
        this.QuoteStuff = 0;
        this.Tfwotd = document.getElementById("tfWordOfTheDay");
    }
    set EnHword(value) {
        this.word = {
            word: value.word,
            definition: value.definition,
            quotes: value.quotes.map((quote, index) => ({
                quote: quote.text,
                history: this.buildHistory(quote.history)
            }))
        };
    }

    buildHistory(historyData) {
        return {
            fact: historyData.fact || {},
            myth: historyData.myth || {},
            legend: historyData.legend || {}
        };
    }

    getWord() {
        return this.word;
    }
}

export class Weather {
    constructor() {
        this.weatherElement = document.getElementById("TFweather");
        this.DSLO = {
            enabledHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
        this.WABul = "https://api.weatherapi.com/v1";
        this.WABurl = "https://api.weatherapi.com/v1";
        this.WapiKey = "cf5a64c9095e425ab0f52816230110";
        this.CWapi = "/current.json";
    }
    LatAndLong(working) {
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
            weatherElement.innerHTML = `${IWname}, ${IWregion}, ${IWcountry} <br>${IWcText} C: ${IWcTC} F: ${IWcTF} <img src=${IWcIcon}>`;

            //Make the response do cool stuf.
        }
    };
    xhr.send();
    }
    City(CityName) {
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
            weatherElement.innerHTML = `${IWname}, ${IWregion}, ${IWcountry} <br>${IWcText} C: ${IWcTC} F: ${IWcTF} <img src=${IWcIcon}>`;

            //Make the response do cool stuff. 
        }
    };
    userCity.send();
    }
    Error(e) {
        switch(e.code){
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
                navigator.geolocation.getCurrentPosition(DSWL, DEWL, DSLO);
            } else if (result.state === "prompt") {
                console.log("geolocation needs to be requested");
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
}


export class TfMusic {
    constructor(x, y, dx, dy, radius, color, canvas) {
        this.TsunamiRadio = document.getElementById("TFradioPlayer");
        this.TsunamiRadioTitle = document.getElementById("TfRadioStuff");
        this.TsunamiLastButton = document.createElement("button");
        this.TsunamiRadioButtons = document.getElementById("CheckRadio");
        this.TsunamiRestartButton = document.createElement("button");
        this.TsunamiStartButton = document.createElement("button");
        this.TsunamiSkipButton = document.createElement("button");
        this.phpRadio = new XMLHttpRequest();
        this.TsunamiRadioAudio = new AudioContext();
        this.canvas = document.getElementById("TFradioCanvas");
        this.x = x;
        this.y = y;
        this.dx = dx; // x velocity
        this.dy = dy; // y velocity
        this.radius = radius;
        this.baseRadius = radius;
        this.color = color;
        this.particles = [];
        this.visualizatorController;
        this.textTrackOptions = {
            kind: "subtitles", // caption, descriptions, chapters, metadata
            label: "name",
            language: "en", //
        };
        this.audioAnalyzerOptions = {
            fftSize: 2048, //32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768 // defaults to 2048.
            maxDecibels: 0, // 0 is the loudest
            minDecibels: -100, // 0 is the loudest 
            smoothingTimeConstant: 0.5, // between 0 and 1
            //channelCount: ,
            channelCountMode: "max",
            //channelInterpretation: ,
            //
        };
        periodicWaveOptions = {
            //channelCount: 2,
            //channelCountMode: "max",
            //channelInterpretation: "speakers",
            disableNormalization: true,
        };
        
    }
    this.TFpowReal = new Float32Array(2);
    this.TFpwoImag = new Float32Array(2);
    this.TFaudioBuffer = new ArrayBuffer(32);
    this.TFtestingF32A = new Float32Array(TFaudioBuffer, 4, 4);
    this.TFgameIterable = (function* () {
    yield* [1, 2, 3];
})();
    this.float32FromIterable = new Float32Array(TFgameIterable);

    this.TFperiodicWave = GameWorldAudio.createPeriodicWave(TFpwoReal, TFpwoImag, TFperiodicWaveOptions)
    this.TFoscillatorNodeOptions = {
        type: "sine", //"square", "sawtooth", "triangle", "custom" //default is "sine";
        detune: 0,
        frequency: 440,
        periodicWave: TFperiodicWave,
        channelCount: 2,
        channelCountMode: "max", // max, something , huh
        channelInterpretation: "speakers"
    };
    this.TFWaveShaperNodeOptions = {
        //curve: 0.5, // -1, 1
        oversample: "none", // "none", "2x", "4x",
        channelCount: "2", //
        channelCountMode: "max",
        //channelInterpretation: "speaker"
    };
    this.Game2dPannerOptions = { pan: 0 }; // -1 = far left, 1 = far right;
    this.TFdelayNodeOptions = {
        delayTime: 0,
        maxDelayTime: 1,
        channelCount: 2,
        channelCountMode: "max",
        channelInterpretation: "speakers"
    };
    this.TFdynamicsCompressorNodeOptions = {
        attack: 0.003, // 0-1
        knee: 30, //0 - 40
        ratio: 12, // 1  - 20
        release: 0.250, // 0-1
        threshold: -24 // -100 - 0
    };
    particle() {
        for (let i = 0; i < 100; i++) {
            let x = Math.random() * RadioCanvas.width;
            let y = Math.random() * RadioCanvas.height;
            let dx = (Math.random() - 0.5) * 0.5;
            let dy = (Math.random() - 0.5) * 0.5;
            let radius = Math.random() * 0.5 + 0.2;
            let color = `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, 0.8)`;
            particles.push(new Particle(x, y, dx, dy, radius, color));
        }
    }
    update(volume) {
        this.radius = this.baseRadius + volume / 80; // pulse based on volume
        this.x += this.dx;
        this.y += this.dy;

        // bounce off edges
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20;
        ctx.fill();
    }
    Visualizer(canvas, dataArray, bufferLength, AudioAnalyser){
        let ctx = canvas.getContext("2d");
        this.particle();
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

            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i].update(averageVolume);
                this.particles[i].draw(ctx);
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

            this.visualizatorController = requestAnimationFrame(hereDude);
        }

        hereDude();
    }
    StopVisualizator(){
        cancelAnimationFrame(this.visualizationController)
    }
    startMusic() {
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
    stopMusic() {
        if (!TsunamiRadio.paused) {
            await TsunamiRadio.pause();
        }
    }
    previousSong(music) {
        TsunamiRadio.src = music;
        await TsunamiRadio.play();
    }
    restartSong(music) {
        TsunamiRadio.src = await music;
        await TsunamiRadio.play();
    }
    TsunamiRadioReady() {
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
}

export class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        //Subscribers
// Define references to the form elements
this.FreeSubmitButton = document.getElementById("TFCompleteForm");
this.tfFN = document.getElementById("TfFirstName");
this.tfLN = document.getElementById("TfLastName");
this.tfNN = document.getElementById("TfNickName");
this.tfGen = document.getElementById("TfGender");
this.tfEM = document.getElementById("TfEmail");
this.tfBirth = document.getElementById("TfBirthday");
this.tfUN = document.getElementById("TFuserName"); //username
this.tfPsw = document.getElementById("TFpassword"); //password

// Membership level selection
this.tfMembershipLevel = document.getElementById("TFMembershipLevel");

// Additional fields based on membership level
// Free/Regular level fields
this.tfChineseZodiacSign = document.getElementById("ChineseZodiacSign");
this.tfWesternZodiacSign = document.getElementById("WesternZodiacSign");
this.tfSpiritAnimal = document.getElementById("SpiritAnimal");
this.tfCelticTreeZodiacSign = document.getElementById("CelticTreeZodiacSign");
this.tfNativeAmericanZodiacSign = document.getElementById("NativeAmericanZodiacSign");
this.tfVedicAstrologySign = document.getElementById("VedicAstrologySign");
this.tfGuardianAngel = document.getElementById("GuardianAngel");
this.tfChineseElement = document.getElementById("ChineseElement");
this.tfEyeColorMeaning = document.getElementById("EyeColorMeaning");
this.tfGreekMythologyArchetype = document.getElementById("GreekMythologyArchetype");
this.tfNorseMythologyPatronDeity = document.getElementById("NorseMythologyPatronDeity");
this.tfEgyptianZodiacSign = document.getElementById("EgyptianZodiacSign");
this.tfMayanZodiacSign = document.getElementById("MayanZodiacSign");

// Regular/VIP level fields
this.tfLoveLanguage = document.getElementById("LoveLanguage");
this.tfBirthstone = document.getElementById("Birthstone");
this.tfBirthFlower = document.getElementById("BirthFlower");
this.tfBloodType = document.getElementById("BloodType");
this.tfAttachmentStyle = document.getElementById("AttachmentStyle");
this.tfCharismaType = document.getElementById("CharismaType");

// VIP/Team level fields
this.tfBusinessPersonality = document.getElementById("BusinessPersonality");
this.tfDisc = document.getElementById("DISC");
this.tfSocionicsType = document.getElementById("SocionicsType");
this.tfLearningStyle = document.getElementById("LearningStyle");
this.tfFinancialPersonalityType = document.getElementById("FinancialPersonalityType");
this.tfPrimaryMotivationStyle = document.getElementById("PrimaryMotivationStyle");
this.tfCreativeStyle = document.getElementById("CreativeStyle");
this.tfConflictManagementStyle = document.getElementById("ConflictManagementStyle");
this.tfTeamRolePreference = document.getElementById("TeamRolePreference");
    }
    signup(fn, ls, nn, gen, em, birth, un, psw, membershipLevel, chineseZodiacSign, westernZodiacSign, spiritAnimal, celticTreeZodiacSign, nativeAmericanZodiacSign, vedicAstrologySign, guardianAngel, chineseElement, eyeColorMeaning, greekMythologyArchetype, norseMythologyPatronDeity, egyptianZodiacSign, mayanZodiacSign, loveLanguage, birthstone, birthFlower, bloodType, attachmentStyle, charismaType, businessPersonality, disc, socionicsType, learningStyle, financialPersonalityType, primaryMotivationStyle, creativeStyle, conflictManagementStyle, teamRolePreference, SPC, SPCC, SPA1, SPA2, SPCtf, SS, SPN, MembershipCostFr, SCidFR) {
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

                //DO Something it the response.


            }
        }
        MyXML.open("POST", `./../server.php`, true);
        MyXML.send(SubFormData);
    }
    login () {
        if (this.username == "" || this.password == "") {
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
            xhr.open("POST", `server.php?phpnun=${this.username}&phpnpsw=${this.password}`, true);
            xhr.send();
        }
    }
}

export class TfNetwork {
    constructor() {
        this.isPlaying = false;
        this.mediaRecorder; 
        this.recordedChunks = [];
    }
    playVideo(){

    }
    pauseVideo(){

    }
    stopVideo(){

    }
    chromaKey(hex) {
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
    chromaKey(){

        if(webcam === ""){
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
        } else if (canvas === ""){
            //Apply chromakey after webcam is put on the canvas instead of before. 
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

        } else if (video === ) {

        } else {
            //nothing
        }
    }
    startWebcam(){
        //let emptyStream = new MediaStream();
        //let VideoStreamOk = new MediaStream(AskForWebcam);
        //let AudioStreamOk = new MediaStream(RadioPlaylistElement);
        tfVidStuff.srcObject = AskForWebcam;
        tfVidStuff.play();
        animate();
    }
    stopWebcam(){

    }
    startRecording(){
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
    stopRecording(){
    /*
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            TframeIsRecording = false;
            TframeStRec.disabled = false;
            TframeSpRec.disabled = true;
        }
    */
    }
}

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