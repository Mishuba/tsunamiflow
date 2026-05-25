import { TsDomCanvas } from "./Teen/Child/Canvas.js";
export class TsunamiFlowAudio extends TsDomCanvas {
    // ===== DEFAULTS (Pattern B) =====
    SongList = null;
    randomMusicDefault = null;
    AudioSource = {};
    AudioElement = null;
    AudioReady = null;
    AudioCxtId = null;
    SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;
    TfSpeechSupported = "speechSynthesis" in window;
    NamiSpeechOptions = {
        lang: "en-US",
        pitch: 1,
        rate: 1,
        volume: 1
    };
    //context
    TfSoundsContext = null;
    // new (window.AudioContext || window.webkitAudioContext)();
    TfSoundsidCounter = 0;
    TfSoundsGain = {};
    masterGain = null;
    TfSoundAnalyser = null;
    TfSoundAnalyserOptions = {
        fftSize: 2048,
        maxDecibels: 0,
        minDecibels: -100,
        smoothingTimeConstant: 0.5,
        channelCountMode: "max"
    };
    TfSoundsContextBufferLength = null;
    TfTrackAnalyser = {};
    TfTrackCompressor = {};
    TfSoundsFloat32FromIterable = null;
    TfSoundsPeriodicWaveOptions = {};
    TfSoundsPeridocWave = null;
    TfSoundsPannerOptions = {};
    TfSoundsPanner = null;
    TfSoundsDelayOptions = {};
    TfSoundsDelay = null;
    TfSoundsCompressorOptions = {};
    TfSoundsCompressor = null;
    TfSoundsDefaultPlaylist = null;
    //worklet 
    TfSoundsWorkletReady = false;
    TfSoundsWorkletNode = null;
    // worklet end
    TfSoundsOscillatorNodeOptions = {};
    TfSoundsOscillator = null;
    TfSoundsWaveShaperNodeOptions = {};
    TfSoundsWaveShaper = null;
    TfSoundContextBufferLength = null;
    TfSoundContextDataArray = null;
    audioConstraints = {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
    };
    elementSourceMap = new WeakMap();
    TfSoundsDefaultPlaylist = [
        "https://radio.tsunamiflow.club/Music/Afterparty/06 - Mishuba - One of them days.mp3",
        "https://radio.tsunamiflow.club/Music/Business/FE/RMM.mp3",
        "https://radio.tsunamiflow.club/Music/Business/TE/I Go In.mp3",
        "https://radio.tsunamiflow.club/Music/Business/TOB/Pandemoium.mp3",
        "https://radio.tsunamiflow.club/Music/Comedy/02 - (Unknown Artist) - 02 - Mishuba - Intro.mp3",
        "https://radio.tsunamiflow.club/Music/Comedy/04 - Mishuba - They Do It To Themselves Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Comedy/06 - Mishuba - Lame Guy Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Comedy/11 - (Unknown Artist) - 11 - Mishuba Off Dat (Sex & Love).mp3",
        "https://radio.tsunamiflow.club/Music/Comedy/Bitch Dependence.mp3",
        "https://radio.tsunamiflow.club/Music/Comedy/Freestyle 107.mp3",
        "https://radio.tsunamiflow.club/Music/Comedy/Freestyle 118.mp3",
        "https://radio.tsunamiflow.club/Music/Comedy/Freestyle 66.mp3",
        "https://radio.tsunamiflow.club/Music/Comedy/Freestyle 68.mp3",
        "https://radio.tsunamiflow.club/Music/Comedy/Mic Check #2 Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Comedy/Whatever (New Black Kid).mp3",
        "https://radio.tsunamiflow.club/Music/DJshuba/04 - (Unknown Artist) - 04 - Mishuba - Who Am I.mp3",
        "https://radio.tsunamiflow.club/Music/DJshuba/Me.mp3",
        "https://radio.tsunamiflow.club/Music/DJshuba/Tallahassee Super Sayian.mp3",
        "https://radio.tsunamiflow.club/Music/Dance/Battle/03 - (Unknown Artist) - 03 Mishuba - What I Do.mp3",
        "https://radio.tsunamiflow.club/Music/Dance/Battle/10 - (Unknown Artist) - 10 - Mishuba - Too Much.mp3",
        "https://radio.tsunamiflow.club/Music/Dance/How We Ride Ft Marcus and Dhamari.mp3",
        "https://radio.tsunamiflow.club/Music/Dance/Battle/This That.mp3",
        "https://radio.tsunamiflow.club/Music/Drinking/03 - MG Blackhall, Mishuba - Awesome Ft MG Blackhall.mp3",
        "https://radio.tsunamiflow.club/Music/Drinking/Freestyle 159 Ft Tugg.mp3",
        "https://radio.tsunamiflow.club/Music/Drinking/Freestyle 18 Ft ShawnOnDaBlock & Lee003.mp3",
        "https://radio.tsunamiflow.club/Music/Drinking/Freestyle 20 Ft Lee003 & ShawnOnDaBlock.mp3",
        "https://radio.tsunamiflow.club/Music/Drinking/Freestyle 25 Ft Dj Naj.mp3",
        "https://radio.tsunamiflow.club/Music/Drinking/Frrestyle 31 Feat Skeet Skirt & ShawnOnDaBlock.mp3",
        "https://radio.tsunamiflow.club/Music/Drinking/Freestyle 6 ft Chief Keese(Know Tyme).mp3",
        "https://radio.tsunamiflow.club/Music/Drinking/Freestyle 80 Feat. Skeet Skirt.mp3",
        "https://radio.tsunamiflow.club/Music/Drinking/Freestyle 96 Feat ShawnOnDaBlock.mp3",
        "https://radio.tsunamiflow.club/Music/Drinking/Step Your Game Up Ft. Cash.mp3",
        "https://radio.tsunamiflow.club/Music/Family/Kids/Morning Lovely Ft Bre and CaeJay.mp3",
        "https://radio.tsunamiflow.club/Music/Family/Lifestyle/We Can Ride (No Time Mishuba Lock Down).mp3",
        "https://radio.tsunamiflow.club/Music/Family/Values/Start (New Black Kid).mp3",
        "https://radio.tsunamiflow.club/Music/Family/Values/Take Off (No Time Mishuba Lock Down).mp3",
        "https://radio.tsunamiflow.club/Music/Family/Values/Time Travel.mp3",
        "https://radio.tsunamiflow.club/Music/Fashion/FH/02 - Mishuba - Rock Star.mp3",
        "https://radio.tsunamiflow.club/Music/Fashion/LD/03 - Mishuba - Cool Guy.mp3",
        "https://radio.tsunamiflow.club/Music/Fashion/LD/04 - Mishuba - Fall Back Please.mp3",
        "https://radio.tsunamiflow.club/Music/Fashion/PD/04 - Mishuba - Lala.mp3",
        "https://radio.tsunamiflow.club/Music/Fashion/PD/05 - Mishuba - Hooped Up On Ft. ShawnOnDaBlock.mp3",
        "https://radio.tsunamiflow.club/Music/Fashion/SM/07 - Mishuba - Supa Fly.mp3",
        "https://radio.tsunamiflow.club/Music/Gaming/Fighters/08 - Mishuba - 08 - Mishuba - Try To Stop Me.mp3",
        "https://radio.tsunamiflow.club/Music/Gaming/Instrumentals/01 - Mishuba - 01 - Mishuba - Intro.mp3",
        "https://radio.tsunamiflow.club/Music/Gaming/Instrumentals/03 - Mishuba - We.mp3",
        "https://radio.tsunamiflow.club/Music/Gaming/Instrumentals/05 - Mishuba - Questions.mp3",
        "https://radio.tsunamiflow.club/Music/Gaming/Instrumentals/07 - Mishuba - Life.mp3",
        "https://radio.tsunamiflow.club/Music/Gaming/Instrumentals/09 - Mishuba - 09 Mishuba - 2019-09-12 Mishuba.mp3",
        "https://radio.tsunamiflow.club/Music/Gaming/Instrumentals/10 - Mishuba - fin.mp3",
        "https://radio.tsunamiflow.club/Music/Gaming/Instrumentals/14 - Mishuba - 14 - Mishuba - Outro.mp3",
        "https://radio.tsunamiflow.club/Music/History/DH/Where To Go Freestyle Ft. Skeet Skirt.mp3",
        "https://radio.tsunamiflow.club/Music/Hustlin/02 - Mishuba - Entry Rookie Year.mp3",
        "https://radio.tsunamiflow.club/Music/Hustlin/02 - Mishuba - My LIne.mp3",
        "https://radio.tsunamiflow.club/Music/Hustlin/03 - Mishuba - 03 - Mishuba - Need More.mp3",
        "https://radio.tsunamiflow.club/Music/Hustlin/05 - Mishuba - Wake Up Run Up.mp3",
        "https://radio.tsunamiflow.club/Music/Hustlin/06 - Mishuba - Bankroll Ft. Levon.mp3",
        "https://radio.tsunamiflow.club/Music/Hustlin/06 - Mishuba - Hustle.mp3",
        "https://radio.tsunamiflow.club/Music/Hustlin/07 - Mishuba - 07 Mishuba - Ambition.mp3",
        "https://radio.tsunamiflow.club/Music/Hustlin/08 - (Unknown Artist) - 08 - Mishuba - Gotta Get It.mp3",
        "https://radio.tsunamiflow.club/Music/Hustlin/Belief (New Black Kid).mp3",
        "https://radio.tsunamiflow.club/Music/Inspiration/Meditation/01 - Mishuba - Asseerate.mp3",
        "https://radio.tsunamiflow.club/Music/Inspiration/Meditation/05 - Mishuba - 05 Mishuba - Meditation.mp3",
        "https://radio.tsunamiflow.club/Music/Inspiration/Meditation/15 - Mishuba - 3_28.mp3",
        "https://radio.tsunamiflow.club/Music/Inspiration/Movitation/07 - Mishuba - Protagonist.mp3",
        "https://radio.tsunamiflow.club/Music/Inspiration/Movitation/The Drop.mp3",
        "https://radio.tsunamiflow.club/Music/Inspiration/Something/03 - Mishuba- Crash.mp3",
        "https://radio.tsunamiflow.club/Music/Inspiration/Something/07 - Mishuba - Guitar Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Inspiration/Something/07 - Mishuba - Tonight Ft Tj and Note.mp3",
        "https://radio.tsunamiflow.club/Music/Inspiration/Something/09 - Mishuba - The Next Step.mp3",
        "https://radio.tsunamiflow.club/Music/Inspiration/Something/13 - Mishuba - Waking Thoughts.mp3",
        "https://radio.tsunamiflow.club/Music/Inspiration/Something/21 - Mishuba - 11_11 01_23.mp3",
        "https://radio.tsunamiflow.club/Music/Inspiration/Something/Peace (New Black Kid).mp3",
        "https://radio.tsunamiflow.club/Music/Literature/Instrumentals/06 - Mishuba - 06 - Mishuba - Eno.mp3",
        "https://radio.tsunamiflow.club/Music/Literature/Instrumentals/07 - (Unknown Artist) - 07 - Mishuba - Duwnen Lyric.mp3",
        "https://radio.tsunamiflow.club/Music/Literature/Instrumentals/14 - (Unknown Artist) - 14 - Mishuba - Dreaming.mp3",
        "https://radio.tsunamiflow.club/Music/Literature/Instrumentals/Journey (No Time Mishuba Lock Down).mp3",
        "https://radio.tsunamiflow.club/Music/Literature/Instrumentals/Zone.mp3",
        "https://radio.tsunamiflow.club/Music/Literature/Poems/01 - Mishuba - Preface.mp3",
        "https://radio.tsunamiflow.club/Music/Literature/Poems/02 - Mishuba - The Last Ride.mp3",
        "https://radio.tsunamiflow.club/Music/Literature/Poems/05 - Mishuba - Late Night Thoughts.mp3",
        "https://radio.tsunamiflow.club/Music/Literature/Poems/06 - Mishuba - Broken.mp3",
        "https://radio.tsunamiflow.club/Music/Literature/Poems/07 - Mishuba - Change.mp3",
        "https://radio.tsunamiflow.club/Music/Literature/Poems/16 - Mishuba - Miss Lady.mp3",
        "https://radio.tsunamiflow.club/Music/Literature/Poems/17 - Mishuba - Alone In The Castle.mp3",
        "https://radio.tsunamiflow.club/Music/Literature/Poems/22 - Mishuba - Proect Detha.mp3",
        "https://radio.tsunamiflow.club/Music/Love/Intimacy/04 - Mishuba - Her Name Is.mp3",
        "https://radio.tsunamiflow.club/Music/Love/Intimacy/08 - Mishuba - LGDF.mp3",
        "https://radio.tsunamiflow.club/Music/Love/Intimacy/09 - Mishuba - The Past.mp3",
        "https://radio.tsunamiflow.club/Music/Love/Intimacy/10 - Mishuba - Sex Game.mp3",
        "https://radio.tsunamiflow.club/Music/Love/Intimacy/13 - (Unknown Artist) - 13 - Mishuba - Thristin Over You (Sex $ Love).mp3",
        "https://radio.tsunamiflow.club/Music/Love/Intimacy/23 - Mishuba - Is This The Key.mp3",
        "https://radio.tsunamiflow.club/Music/Love/Memories/02 - Mishuba - My Heart.mp3",
        "https://radio.tsunamiflow.club/Music/Love/Memories/03 - Mishuba - 5 AM.mp3",
        "https://radio.tsunamiflow.club/Music/Love/Memories/08 - Mishuba - 2 AM.mp3",
        "https://radio.tsunamiflow.club/Music/Love/Memories/12 - (Unkwown Artist) - 12 - Mishuba - LaBae.mp3",
        "https://radio.tsunamiflow.club/Music/Love/Memories/12 - Mishuba - Nah Im A Fool In Love.mp3",
        "https://radio.tsunamiflow.club/Music/Love/Memories/18 - Mishuba - I Need To Do Better.mp3",
        "https://radio.tsunamiflow.club/Music/Love/Memories/19 - Mishuba - I Dont Even Know Anymore.mp3",
        "https://radio.tsunamiflow.club/Music/Love/Bachelor Pad (New Black Kid).mp3",
        "https://radio.tsunamiflow.club/Music/Love/Memories/Boo Thang Shawdy #1.mp3",
        "https://radio.tsunamiflow.club/Music/Love/love/04 - Mishuba - You.mp3",
        "https://radio.tsunamiflow.club/Music/Love/love/06 - (Unknown Artist) - 06 Mishuba - You Deserve More.mp3",
        "https://radio.tsunamiflow.club/Music/Love/love/06 - Mishuba - T&L.mp3",
        "https://radio.tsunamiflow.club/Music/Love/love/11 - Mishuba - The Simple Things.mp3",
        "https://radio.tsunamiflow.club/Music/Love/love/14 - Mishuba - Dear My Heart.mp3",
        "https://radio.tsunamiflow.club/Music/Love/love/20 - Mishuba - Dreaming About You.mp3",
        "https://radio.tsunamiflow.club/Music/Love/love/24 - Mishuba - Can You Hear Me.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/01 - Mishuba - 2904 Chatsworth Dodge Dart SXT Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/02 - Mishuba - 02 Mishuba - Mic Check #3 Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/02 - Mishuba - 3 AM Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/03 - Mishuba - 03 - Mishuba - Warming Up Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/03 - Mishuba - Regular Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/04 - Mishuba - 04 - Mishuba - Goin In Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Outisde/04 - Mishuba - The Interlude Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/05 - Mishuba - 05 - Mishuba - Random Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/05 - Mishuba - Hold Up Real QUick Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/05 - Mishuba - The Hell Wrong With Bruh Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/06 - Mishuba - 06 - Mishuba - 2019-12-21 Mishuba.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/06 - Mishuba - Freestyle 300.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/07 - Mishuba - 07 - Mishuba - Don't Forget Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/08 - Mishuba - 08 - Mishuba - Breaking Barriers Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/10 - Mishuba - 10 - All Time Freestyle ft Hayden Miles.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/11 - Mishuba - 11 - Mishuba - Letting Go Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/12 - Mishuba - 12 Mishuba - Watch Out Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/13 - Mishuba - 13 - Mishuba - Definition Musician Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/Freestyle 194.mp3",
        "https://radio.tsunamiflow.club/Music/Outside/I Stand On That Freestyle.mp3",
        "https://radio.tsunamiflow.club/Music/Politics/Neutral/01 - Mishuba - No More Gossip.mp3",
        "https://radio.tsunamiflow.club/Music/Politics/Neutral/05 - Mishuba - Rapture.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 125.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 126.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 161.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 171.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 179.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 185.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 189.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 190.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 195.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 196.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 200.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 202.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 205.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 225.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 27.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 62.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 67.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 71.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 89.mp3",
        "https://radio.tsunamiflow.club/Music/Pregame/Freestyle 98.mp3",
        "https://radio.tsunamiflow.club/Music/Rizz/Flirting/05 - (Unknown Artist) - 05 - Mishuba - Interlude.mp3",
        "https://radio.tsunamiflow.club/Music/Rizz/IceBreakers/Dime (New Black Kid).mp3",
        "https://radio.tsunamiflow.club/Music/Rizz/Shots/Freestyle 72.mp3",
        "https://radio.tsunamiflow.club/Music/Sex/sex/I Feel It.mp3",
        "https://radio.tsunamiflow.club/Music/Sports/Disses/01 - Mishuba - Defintion Musician Punch In.mp3",
        "https://radio.tsunamiflow.club/Music/Sports/Disses/04 - Mishuba - Rollo In A 4 Doe.mp3",
        "https://radio.tsunamiflow.club/Music/Sports/Disses/Killing Me Softly Ft Jasmine.mp3",
        "https://radio.tsunamiflow.club/Music/Sports/Disses/No Reason.mp3",
        "https://radio.tsunamiflow.club/Music/Sports/Fans/07 - Mishuba - 2022 Hip Hop King.mp3",
        "https://radio.tsunamiflow.club/Music/Sports/Fans/09 - (Unknown Artist) - 09 - Mishuba - July 8th.mp3",
        "https://radio.tsunamiflow.club/Music/Sports/Reviews/02 - Mishuba - 02 Mishuba - Technical.mp3",
        "https://radio.tsunamiflow.club/Music/Sports/Reviews/02 - Mishuba - For The Critics Ft Dj Naj.mp3",
        "https://radio.tsunamiflow.club/Music/Sports/Reviews/03 - Mishuba - You Cant See Me.mp3",
        "https://radio.tsunamiflow.club/Music/Sports/Reviews/Word On The Street.mp3",
        "https://radio.tsunamiflow.club/Music/Sports/Updates/04 - Mishuba - 04 - MIshuba- Humble.mp3",
        "https://radio.tsunamiflow.club/Music/Sports/Updates/I Go In.mp3",
        "https://radio.tsunamiflow.club/Music/Sports/Updates/The Drop.mp3",
        "https://radio.tsunamiflow.club/Music/Tech/Instrumentals/01 - Mishuba - 01 - Mishuba - Nifage.mp3",
        "https://radio.tsunamiflow.club/Music/Tech/Instrumentals/01 - Mishuba - Intro.mp3",
        "https://radio.tsunamiflow.club/Music/Tech/Instrumentals/09 - Mishuba - 09 - Mishuba - Rote.mp3",
        "https://radio.tsunamiflow.club/Music/Tech/Instrumentals/Blank (New Black Kid).mp3",
        "https://radio.tsunamiflow.club/Music/Tech/Instrumentals/Lockdown.mp3",
        "https://radio.tsunamiflow.club/Music/Tech/Music/Freestyle 34.mp3"
    ];
    constructor(options = {}) {
        super(options);

        // ===== OVERRIDES =====
        if (options.lang) {

            this.NamiSpeechOptions.lang = options.lang;
        }

        if (options.constraints) {
            this.audioConstraints = {
                ...this.audioConstraints,
                ...options.constraints
            };
        }

        if (options.audioElement) {
            this.AudioElement = options.audioElement;
        }

        if (options.SoundContext) {
            this.TfSoundsContext = options.SoundContext;
        }

        if (options.masterGain) {
            this.masterGain = options.masterGain;
        }
        if (options.TfSoundAnalyser) {
            this.TfSoundAnalyser = options.TfSoundAnalyser;
        }
        // FIX: apply after instantiation
        // ===== SPEECH RECOGNITION =====
        if (!this.SpeechRecognitionAPI) {
            console.warn("Speech Recognition not supported.");
            this.SpeechRecognition = null;
        } else {
            this.SpeechRecognition = new this.SpeechRecognitionAPI();

            this.SpeechRecognition.lang = this.lang;
            this.SpeechRecognition.continuous = true;
            this.SpeechRecognition.interimResults = true;

            this.SpeechRecognition.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(r => r[0].transcript)
                    .join("");

                this.emit("result", transcript);
            };

            this.SpeechRecognition.onerror = (err) =>
                this.emit("error", err);

            this.SpeechRecognition.onend = () => {
                this.active = false;
                this.emit("end");
            };
        }

        // ===== SPEECH SYNTHESIS =====
        if (!this.TfSpeechSupported) {
            console.warn("Speech Synthesis not supported.");
            this.TfSpeech = null;
            this.NamiSpeech = null;
        } else {
            this.TfSpeech = window.speechSynthesis;

            this.NamiSpeech = new SpeechSynthesisUtterance();
            Object.assign(this.NamiSpeech, this.NamiSpeechOptions);
        }
    }
    AudioNetworkState() {
        if (this.AudioElement.readyState === 0) {
            console.log("Radio readyState is HAVE_NOTHING aka no data yet.");
            if (this.AudioElement.networkState === 0) {
                console.log("Radio networkState has NETWORK_EMPTY");
                if (this.AudioElement.src === "") {
                    console.log("The radio source is ''");

                    this.worker.postMessage(this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "radio.network.state",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "file",
                            file: "none",
                            message: "the radio source is ''",
                            buffer: "nothing should be buffering.",
                            time: "Timer",
                        }));
                } else if (!this.AudioElement.src) {
                    ("The radio source does not exist");
                    this.worker.postMessage(this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "radio.network.state",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "file",
                            file: "none",
                            message: "The radio source does not exist",
                            buffer: "nothing should be buffering.",
                            time: "Timer",
                        }));
                } else if (this.AudioElement.src === " ") {
                    console.log("The radio source is ' '");
                    this.worker.postMessage(this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "radio.network.state",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "file",
                            file: "none",
                            message: "the radio source is ' '",
                            buffer: "nothing should be buffering.",
                            time: "Timer",
                        }));
                } else if (this.AudioElement.src === "about:blank") {
                    console.log("The radio source is about:blank");
                    this.worker.postMessage(this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "radio.network.state",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "file",
                            file: "none",
                            message: "The radio source is about:blank",
                            buffer: "nothing should be buffering.",
                            time: "Timer",
                        }));
                }
                else {
                    console.log("Something else is going on and I dont know what it is.");
                }
            } else if (this.AudioElement.networkState === 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (this.AudioElement.networkState === 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE");
                //No valid source
                this.worker.postMessage(this.tycadome(
                    "tycadome-guest" + Date.now(),
                    "radio",
                    "radio.network.state",
                    {
                        source: "web",
                        target: "device:web-001",
                        layer: "tf",
                        worker: "media",
                        backend: false
                    },
                    {
                        status: "pending",
                        priority: "low"
                    },
                    "async",
                    {
                        system: "file",
                        file: "none",
                        message: "Radio networkState has NETWORK_NO_SOURCE",
                        buffer: "nothing should be buffering.",
                        time: "Timer",
                    }));
            }
        } else if (this.AudioElement.readyState === 1) {
            console.log("Radio readyState is HAVE_METADATA");
            if (this.AudioElement.networkState === 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (this.AudioElement.networkState === 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (this.AudioElement.networkState === 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE (but during the have metadata point.");
                //No valid source
            }
        } else if (this.AudioElement.readyState === 2) {
            console.log("Radio readyState is HAVE_CURRENT_DATA");
            if (this.AudioElement.networkState === 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (this.AudioElement.networkState === 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (this.AudioElement.networkState === 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE but during the have ;loading point.");
                //No valid source
            }
        } else if (this.AudioElement.readyState === 3) {
            console.log("Radio readyState is HAVE_FUTURE_DATA");
            if (this.AudioElement.networkState === 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (this.AudioElement.networkState === 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE during the canplay point.");
                //No valid source
            }
        } else if (this.AudioElement.readyState === 4) {
            console.log("Radio readyState is HAVE_ENOUGH_DATA");
            if (this.AudioElement.networkState === 1) {
                console.log("Radio networkState is NETWORK_IDLE");
            } else if (this.AudioElement.networkState === 2) {
                console.log("Radio networkState is NETWORK_LOADING");
                //Actively fetching the audio from the network.
                //Show loading or buffering user interface.
            } else if (this.AudioElement.networkState === 3) {
                console.log("Radio networkState has NETWORK_NO_SOURCE during the canplaythrough point.");
                //No valid source
            }

            if (this.AudioElement.ended) {
                if (this.AudioElement.src === "") {
                    this.worker.postMessage(this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "radio.network.state",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "file",
                            file: "none",
                            message: "the radio source is ''",
                            buffer: "nothing should be buffering.",
                            time: "Timer",
                        }));
                } else if (this.AudioElement.src === undefined) {
                    this.worker.postMessage(this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "radio.network.state",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "file",
                            file: "none",
                            message: "the radio source is undefined",
                            buffer: "nothing should be buffering.",
                            time: "Timer",
                        }));
                } else if (!this.AudioElement.src) {
                    this.worker.postMessage(this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "radio.network.state",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "file",
                            file: "none",
                            message: "the radio source is ''",
                            buffer: "nothing should be buffering.",
                            time: "Timer",
                        }));
                } else {
                    this.worker.postMessage(this.tycadome(
                        "tycadome-guest" + Date.now(),
                        "radio",
                        "radio.network.state",
                        {
                            source: "web",
                            target: "device:web-001",
                            layer: "tf",
                            worker: "media",
                            backend: false
                        },
                        {
                            status: "pending",
                            priority: "low"
                        },
                        "async",
                        {
                            system: "skip",
                            file: "none",
                            message: "the radio source is ''",
                            buffer: "nothing should be buffering.",
                            time: "Timer",
                        }));
                }
            } else {
                if (this.AudioElement.paused) {
                    if (this.AudioElement.currentTime === 0) {
                        console.log("Tsunami Radio has not started yet.");
                    } else {
                        console.log("Paused at " + this.AudioElement.currentTime);
                    }
                } else {
                    console.log("A song is still playing. Make the next song play using the functions");
                }
            }
        } else {
            if (this.AudioElement.networkState === 3) {
                console.log("The network could not find the source.");
                this.worker.postMessage(this.tycadome(
                    "tycadome-guest" + Date.now(),
                    "radio",
                    "radio.network.state",
                    {
                        source: "web",
                        target: "device:web-001",
                        layer: "tf",
                        worker: "media",
                        backend: false
                    },
                    {
                        status: "pending",
                        priority: "low"
                    },
                    "async",
                    {
                        system: "file",
                        file: "none",
                        message: "The network could not find the source.",
                        buffer: "nothing should be buffering.",
                        time: "Timer",
                    }));
            } else {
                console.log("Some unknown error is going on with the Radio");
            }
        }
    }
    AudioFile(event) {
        if (!event?.data?.payload?.file) {
            const i = Math.floor(Math.random() * this.TfSoundsDefaultPlaylist.length);
            this.SongList = this.TfSoundsDefaultPlaylist[i];
            console.log("Default playlist:", this.SongList);
        } else {
            this.SongList = event.data.payload.file;
            console.log("From backend:", this.SongList);
        }

        return this.SongList;
    }
    AudioState() {
        switch (this.AudioCxtId) {
            case null:
                console.log("The audio context state is unknown");
                break;
            case undefined:
                console.log("The audio context state is unknown");
                break;
            case "":
                console.log("The audio context state is unknown");
                break;
            case " ":
                console.log("The audio context state is unknown");
                break;
            default:
                if (this.AudioSource[this.AudioCxtId]) {
                    switch (this.AudioSource[this.AudioCxtId].state) {
                        case "suspended":
                            this.AudioSource[this.AudioCxtId].resume();
                            break;
                        case "running":
                            console.log("The audio context state is running");
                            if (this.AudioElement.waiting) {
                                this.AudioSource[this.AudioCxtId].suspend();
                            }
                            break;
                        case "closed":
                            console.log("The Audio context state must be closed");
                            if (this.AudioElement.paused) {
                                //this.StopVisualizator();
                            }
                            break;
                        default:
                            console.log("The audio context state is unknown");
                            break;
                    }
                } else {
                    console.log("The audio context state is does not exist");
                }

        }
    }
    /// context
    createTrackChain() {
        return {
            gain: this.TfSoundsContext.createGain(),
            analyser: this.TfSoundsContext.createAnalyser(),
            compressor: this.TfSoundsContext.createDynamicsCompressor()
        };
    }
    initAudioContext() {
        if (!this.TfSoundsContext) {
            this.TfSoundsContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (!this.masterGain) {
            // MASTER
            this.masterGain = this.TfSoundsContext.createGain();
            this.masterGain.gain.value = 1;
        }

        if (!this.TfSoundAnalyser) {
            // GLOBAL ANALYSER BUS
            this.TfSoundAnalyser = this.TfSoundsContext.createAnalyser();
            Object.assign(this.TfSoundAnalyser, this.TfSoundAnalyserOptions);

            // DATA BUFFER
            this.TfSoundsContextBufferLength = this.TfSoundAnalyser.frequencyBinCount;
        }
        // ROUTING

        this.masterGain
            .connect(this.TfSoundAnalyser)
            .connect(this.TfSoundsContext.destination);

        this.emit("ready", this.TfSoundsContext);
        if (this.TfSoundsContext.state === "suspended") {
            return this.TfSoundsContext.resume();
        }
    }

    addAudioContextSource(element, id = null) {
        this.initAudioContext();

        const sourceId = id || `source-${++this.TfSoundsidCounter}`;
        let source;

        if (this.elementSourceMap.has(element)) {
            source = this.elementSourceMap.get(element);
        } else {
            source = this.TfSoundsContext.createMediaElementSource(element);
            this.elementSourceMap.set(element, source);
        }

        const chain = this.createTrackChain();

        // ✅ CLEAN SIGNAL FLOW
        source
            .connect(chain.gain)
            .connect(chain.analyser)
            .connect(chain.compressor)
            .connect(this.masterGain);

        // ✅ STORE EVERYTHING (IMPORTANT)
        this.AudioSource[sourceId] = source;
        this.TfSoundsGain[sourceId] = chain.gain;

        if (!this.TfTrackAnalyser) this.TfTrackAnalyser = {};
        if (!this.TfTrackCompressor) this.TfTrackCompressor = {};

        this.TfTrackAnalyser[sourceId] = chain.analyser;
        this.TfTrackCompressor[sourceId] = chain.compressor;

        this.emit("sourceAdded", { id: sourceId });

        return sourceId;
    }

    /* ----------------------------
       Add MediaStreamSource
    -----------------------------*/
    addAudioStreamSource(stream, id = null) {
        this.initAudioContext();
        const sourceId = id || `source-${++this.TfSoundsidCounter}`;
        let source;

        if (this.elementSourceMap.has(stream)) {
            source = this.elementSourceMap.get(stream);
        } else {
            source = this.TfSoundsContext.createMediaStreamSource(stream);
            this.elementSourceMap.set(stream, source);
        }

        const chain = this.createTrackChain();

        // ✅ CLEAN SIGNAL FLOW
        source
            .connect(chain.gain)
            .connect(chain.analyser)
            .connect(chain.compressor)
            .connect(this.masterGain);

        // ✅ STORE EVERYTHING (IMPORTANT)
        this.AudioSource[sourceId] = source;
        this.TfSoundsGain[sourceId] = chain.gain;

        if (!this.TfTrackAnalyser) this.TfTrackAnalyser = {};
        if (!this.TfTrackCompressor) this.TfTrackCompressor = {};

        this.TfTrackAnalyser[sourceId] = chain.analyser;
        this.TfTrackCompressor[sourceId] = chain.compressor;

        this.emit("sourceAdded", { id: sourceId, gain: chain.gain });
        return sourceId;
    }

    /* ----------------------------
       Control Gain
    -----------------------------*/
    setAudioContextGain(id, value = 1) {
        if (this.TfSoundsGain[id]) this.TfSoundsGain[id].gain.value = value;
    }

    /* ----------------------------
       Remove Source
    -----------------------------*/
    removeAudioContextSource(id) {
        const source = this.AudioSource[id];
        const gain = this.TfSoundsGain[id];
        const analyser = this.TfTrackAnalyser[id];
        const compressor = this.TfTrackCompressor[id];

        if (source) source.disconnect();
        if (gain) gain.disconnect();
        if (analyser) analyser.disconnect();
        if (compressor) compressor.disconnect();

        delete this.AudioSource[id];
        delete this.TfSoundsGain[id];
        delete this.TfTrackAnalyser[id];
        delete this.TfTrackCompressor[id];

        this.emit("sourceRemoved", id);
    }
    finishAudioContext() {
        if (!this.TfSoundsContext) return;

        Object.values(this.AudioSource).forEach(src => src.disconnect());
        Object.values(this.TfSoundsGain).forEach(g => g.disconnect());

        if (this.masterGain) this.masterGain.disconnect();

        this.TfSoundsContext.close();

        this.TfSoundsContext = null;
        this.AudioSource = {};
        this.TfSoundsGain = {};
        this.elementSourceMap = new WeakMap();
        this.masterGain = null;

        this.emit("closed");
    }
    speak(text) {
        if (!this.TfSpeech) return;

        this.NamiSpeech.text = text;
        this.TfSpeech.speak(this.NamiSpeech);
    }

    listen() {
        if (!this.SpeechRecognition) return;

        this.SpeechRecognition.start();
        this.active = true;
    }

    stopListening() {
        if (!this.SpeechRecognition) return;

        this.SpeechRecognition.stop();
        this.active = false;
    }

    // ===== WORKLET (ASYNC — REQUIRED) =====
    async initWorklet(url, wasm, options = {}) {
        this.initAudioContext();
        if (!this.TfSoundsContext.audioWorklet) {
            throw new Error("AudioWorklet not supported.");
        }

        if (!url) {
            throw new Error("Processor URL not provided.");
        }

        await this.TfSoundsContext.audioWorklet.addModule(url);

        this.TfSoundsWorkletNode = new AudioWorkletNode(
            this.TfSoundsContext,
            "TfSoundsProcessor",
            options
        );

        // 🔥 LOAD WASM
        const wasmBinary = await fetch(wasmUrl).then(r => r.arrayBuffer());

        this.TfSoundsWorkletNode.port.postMessage({
            type: "init_wasm",
            wasmBinary
        });

        this.TfSoundsWorkletNode.port.onmessage = (e) =>
            this.emit("message", e.data);

        this.TfSoundsWorkletReady = true;

        this.emit("worklet-ready", this.TfSoundsWorkletNode);
    }
    connectworklet(destination) {
        if (!this.TfSoundsWorkletNode) return;
        this.TfSoundsWorkletNode.connect(destination);
    }

    disconnectworklet() {
        if (!this.TfSoundsWorkletNode) return;
        this.TfSoundsWorkletNode.disconnect();
    }

    /* ----------------------------
       Send message to processor
    -----------------------------*/
    postworkletMessage(message) {
        if (!this.TfSoundsWorkletNode) return;
        this.TfSoundsWorkletNode.port.postMessage(message);
    }
    ///worklet ends
}