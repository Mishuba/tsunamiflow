import { GameWorldAudio, TFpwoReal, TFpwoImag } from "./Variables.js";
export const DSLO = {
    enabledHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
}

export const navButtons = {
    homepage: document.getElementById("tfHome"),
    roster: document.getElementById("tfRoster"),
    news: document.getElementById("tfNews"),
    Competitions: document.getElementById("tfCompetitions"),
    TFnetwork: document.getElementById("tfNetwork"),
    Community: document.getElementById("tfCommunity")
};

//Img
//Start with images here.
export let TFimageOptions = {
    width: 100,
    height: 100
};
//Img Ends

//Audio
export let TFtextTrackOptions = {
    kind: "subtitles", // caption, descriptions, chapters, metadata
    label: "name",
    language: "en", //
};

export let TFaudioAnalyzerOptionsFr = {
    fftSize: 2048, //32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768 // defaults to 2048.
    maxDecibels: 0, // 0 is the loudest
    minDecibels: -100, // 0 is the loudest 
    smoothingTimeConstant: 0.5, // between 0 and 1
    //channelCount: ,
    channelCountMode: "max",
    //channelInterpretation: ,
    //
};

export let TFperiodicWaveOptions = {
    //channelCount: 2,
    //channelCountMode: "max",
    //channelInterpretation: "speakers",
    disableNormalization: true,
};

TFpwoReal[0] = 0;
TFpwoReal[1] = 1;

TFpwoImag[0] = 0;
TFpwoImag[1] = 1;



export let TFperiodicWave = GameWorldAudio.createPeriodicWave(TFpwoReal, TFpwoImag, TFperiodicWaveOptions)

export let TFoscillatorNodeOptions = {
    type: "sine", //"square", "sawtooth", "triangle", "custom" //default is "sine";
    detune: 0,
    frequency: 440,
    periodicWave: TFperiodicWave,
    channelCount: 2,
    channelCountMode: "max", // max, something , huh
    channelInterpretation: "speakers"
};

export let TFWaveShaperNodeOptions = {
    //curve: 0.5, // -1, 1
    oversample: "none", // "none", "2x", "4x",
    channelCount: "2", //
    channelCountMode: "max",
    //channelInterpretation: "speaker"
};

export let Game2dPannerOptions = { pan: 0 }; // -1 = far left, 1 = far right;

export let TFdelayNodeOptions = {
    delayTime: 0,
    maxDelayTime: 1,
    channelCount: 2,
    channelCountMode: "max",
    channelInterpretation: "speakers"
};

export let TFdynamicsCompressorNodeOptions = {
    attack: 0.003, // 0-1
    knee: 30, //0 - 40
    ratio: 12, // 1  - 20
    release: 0.250, // 0-1
    threshold: -24 // -100 - 0
};
//Audio Ends
//Video Game


//Controller
// Standard button mappings for PlayStation, Xbox, Switch, and PC
// Controller Mappings
export const controllerMappings = {
    playstation: {
        up: "D-Pad Up", down: "D-Pad Down", left: "D-Pad Left", right: "D-Pad Right",
        select: "touchpad", start: "Options Button", share: "Share Button",
        action1: "Cross", action2: "Circle", action3: "Square", action4: "Triangle",
        action5: "L1", action6: "R1", action7: "L2", action8: "R2", action9: "Left Analog Stick Button", action10: "Right Analog Stick Button", action11: "", action12: "",
        leftStick: "Left Analog Stick", rightStick: "Right Analog Stick",
    },
    xbox: {
        up: "D-Pad Up", down: "D-Pad Down", left: "D-Pad Left", right: "D-Pad Right",
        select: "Menu Button", start: "View Button", action1: "A", action2: "B",
        action3: "X", action4: "Y", leftStick: "Left Analog Stick", rightStick: "Right Analog Stick",
    },
    switch: {
        up: "D-Pad Up", down: "D-Pad Down", left: "D-Pad Left", right: "D-Pad Right",
        select: "- Button", start: "+ Button", action1: "B", action2: "A", action3: "Y", action4: "X",
        leftStick: "Left Analog Stick", rightStick: "Right Analog Stick",
    }
};
//Game Pads
export const gamepads = {};

//Video Game Characters

// Armour Sets
export var armourSet1 = { name: "Helmet", defense: 5 };
export var armourSet2 = { name: "Chestplate", defense: 10 };
export var armourSet3 = { name: "Gloves", defense: 3 };
export var armourSet4 = { name: "Boots", defense: 2 };
export var armourSet5 = { name: "Shield", defense: 8 };
export var armourSet6 = { name: "Pants", defense: 6 };
export var armourSet7 = { name: "Bracers", defense: 4 };
export var armourSet8 = { name: "Cloak", defense: 7 };

