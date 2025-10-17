/*
const TfWebSocket = new WebSocket("wss://3.143.179.123/websocket");

new WebSocket("wss://world.tsunamiflow.club:8080");

*/
//env variable
const TfWebSocket = new WebSocket("wss://world.tsunamiflow.club/websocket");

TfWebSocket.onopen = async (event) => {
    let data = event.data;
    //alert(data.message);
    let testingData = {
        type: "start_game",
        message: "testing message",
        username: "Mishuba",
        error: "nothing right now"
    };
    TfWebSocket.send(JSON.stringify(testingData));
}

TfWebSocket.onmessage = async (event) => {
    let data = event.data;
    console.log(data);
}

TfWebSocket.onerror = async (event) => {
    let data = event.data;
    console.log(data);
}

TfWebSocket.onclose = async (event) => {
    let data = event;
    console.log(data);
}

const linkToSpriteSheet = "./Pictures/Games/Sprites/Stickman/Sheets/standingNwalking.png";
const AckmaHawkBattleBackground = "./Pictures/Logo/Tsunami Flow Logo.png";
const StickMan = new Image();
StickMan.src = linkToSpriteSheet;

let AckmaHawkSpriteSheet = "";

let tfSSCX = 0; //Character State Location Row
let AckmaHawkSpriteSheetState = 0;
let tfSSCY = 0; //Character State Frame Column
let AckmaHawkSpriteSheetFrame = 0;
let tfSCW = 120; // Character Size in image file width
let AckmaHawkSpritSheetWidth = 120;
let tfSCH = 120; // Character Size in image file height
let AckmaHawkSpriteSheetHeight = 120;
let tfSPX = 60; //position of character Left and Right Movement
let AckmaHawkCanvasX = 60; //CanvasWidth / 2
let tfSPY = 160; // position of character Up and Down Movement
let AckmaHawkCanvasY = 160; //CanvasHeight /2 
let tfSNW = 30; //Size of character The width 
let AckmaHawkCanvasWidth = 30; //CanvasWidth * 0.25;
let tfSNH = 30; //Size of character The Height
let AckmaHawkCanvasHeight = 30; //CanvasHeight * 0.25;
let AckmaHawkType = "sprite";
/*
export const StickmanStates = [
    { name: "stand", frames: 2 },
    { name: "walk", frames: 2 },
    { name: "run", frames: 2 },
    { name: "jump", frames: 2 },
    { name: "double jump", frames: 2 },
    { name: "crouch", frames: 2 },
    { name: "crawl", frames: 2 },
    { name: "climb", frames: 2 },
    { name: "swim", frames: 2 },
    { name: "dive", frames: 2 },
    { name: "fly", frames: 2 },
    { name: "Cycle Through Items", frames: 2 },
    { name: "Pick Up", frames: 2 },
    { name: "World Interaction", frames: 2 },
    { name: "Use Item", frames: 2 },
    { name: "weak attack", frames: 2 },
    { name: "strong attack", frames: 2 },
    { name: "special attack", frames: 2 },
    { name: "main skill", frames: 2 },
    { name: "aoe skill", frames: 2 },
    { name: "range skill", frames: 2 },
    { name: "knockback skill", frames: 2 },
    { name: "evade skill", frames: 2 },
    { name: "defense skill", frames: 2 },
    { name: "buff skill", frames: 2 },
    { name: "debuff skill", frames: 2 },
    { name: "ultimate skill", frames: 2 },
    { name: "block", frames: 2 },
    { name: "parry", frames: 2 }
];
*/
let AckmaHawkTextWidth = 280;
let AckmaHawkTextHeight = 40;
let AckmaHawkTextSize = "30px";
let AckmaHawkTextStyle = "Consolas";
let AckmaHawkTextAlign = "center"; //end, left, right, center
let AckmaHawkTextBaseLine = "alphabetic"; //top, hanging, middle, ideographic, bottom
let AckmaHawkTextDirection = "inherit"; //ltr, rtl
let AckmaHawkLetterSpacing = 0;
let AckmaHawkFontKerning = "auto";
let AckmaHawkFontStretch = "normal"; //ultra-condensed, extra-condensed, condensed, semi-condensed, semi-expanded, expanded, extra-expanded, ultra-expanded
let AckmaHawkFontVariantCaps = "normal" //small-caps, all-small-caps, petite-caps, all-petite-caps, unicase, titling-caps
let AckmaHawkTextRendering = "auto"; //optimizeSpeed, optimizeLegibility, geometricPrecision
let AckmaHawkWordSpacing = 0;
let AckmaHawkTextSettings;
let AckmaHawkDialog = "testing";
let StickManDialog = [];
let homePageArray = [
    "Welcome to tsunamiflow.club",
    "This is the homebase for Tsunami Flow",
    "We are currently working on content for the website.",
    "Come by often and check for updates.",
    "Please be patient"
];
let PhysicalAbility = [
    { name: "health", points: 1 },
    { name: "stamina", points: 1 },
    { name: "weight", points: 1 },
    { name: "strength", points: 1 },
    { name: "agility", points: 1 }
];
let AckmaHawkIntellectualIntelligence = [
    { name: "Science", level: 0, experience: 0 },
    { name: "Creativity", level: 0, experience: 0 },
    { name: "Math", level: 0, Engineering: 0 },
    { name: "Memory", level: 0, experience: 0 },
    { name: "Awareness", level: 0, experience: 0 }
];
let AckmaHawkSocialIntelligence = [
    { name: "Reflection", level: 0, experience: 0 },
    { name: "honesty", level: 0, experience: 0 },
    { name: "deception", level: 0, experience: 0 },
    { name: "manipulation", level: 0, experience: 0 },
    { name: "charisma", level: 0, experience: 0 }
];
let AckmaHawkEmotionalIntelligence = [
    { name: "feelings", level: 0, experience: 0 },
    { name: "mood", level: 0, experience: 0 },
    { name: "temper", level: 0, experience: 0 },
    { name: "attitude", level: 0, experience: 0 },
    { name: "perspective", level: 0, experience: 0 }
];
let AckmaHawkExistentialIntelligence = [
    { name: "consciousness", level: 0, experience: 0 },
    { name: "time", level: 0, experience: 0 },
    { name: "dimension", level: 0, experience: 0 },
    { name: "space", level: 0, experience: 0 },
    { name: "defense", level: 0, experience: 0 }
];
let AckmaHawkEnergeticIntelligence = [
    { name: "fire", level: 0, experience: 0 },
    { name: "water", level: 0, experience: 0 },
    { name: "air", level: 0, experience: 0 },
    { name: "lightning", level: 0, experience: 0 },
    { name: "earth", level: 0, experience: 0 }
];
let AckmaHawkMetaCognitiveIntelligence = [
    { name: "magic", level: 0, experience: 0 },
    { name: "ESP", level: 0, experience: 0 },
    { name: "dexterity", level: 0, experience: 0 },
    { name: "genetic", level: 0, experience: 0 },
    { name: "personal", level: 0, experience: 0 }
];
let AckmaHawkHeadArmor = 1;
let AckmaHawkBodyArmor = 1;
let AckmaHawkLegArmor = 1;
let AckmaHawkarmArmor = 1;
let AckmaHawkweakAttack = 1;
let AckmaHawkstrongAttack = 1;
let AckmaHawkspecialAttack = 1;
let AckmaHawkknockBackSkill = 1;
let AckmaHawkaoeSkill = 1;
let AckmaHawkbuffSkill = 1;
let AckmaHawkmainSkill = 1;
let AckmaHawkevadeSkill = 1;
let AckmaHawkrangeSkill = 1;
let AckmaHawkdebuffSkill = 1;
let AckmaHawkdefenseSkill = 1;
let AckmaHawkultimateSkill = 1;
let PlayerState = "stand";

// items
var fullHeal;
var fullStamina;
var fullMagic;

// Armour
var armourSet1;
var armourSet2;
var armourSet3;
var armourSet4;
var armourSet5;
var armourSet6;
var armourSet7;
var armourSet8;

//Game
export class letsDoIt {
    constructor(TfGameName, player) {
        //Game Area
        this.TgameFname = TfGameName
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d", { colorSpace: "srgb", willReadFrequently: true });
        //Game Pieces
        this.component = {};
        this.TfObstacles = [];
        //Game Picture Images; 
        this.gameBackground = new Image();
        //Game Players
        this.player1 = player;
        this.image = new Image();
        this.playerAngle = 0;
        this.playerMoveAngle = 0;
        //Solo Team Members;
        this.Minion = new Image();
        this.MiniBoss = new Image();
        this.Boss = new Image();
        this.Captain = new Image();
        this.Commandar = new Image();
        this.StageBoss = new Image();
        this.Ruler = new Image();
        //1v1
        this.Enemy = new Image();
        this.EnemyMinion = new Image();
        this.EnemyMiniBoss = new Image();
        this.EnemyBoss = new Image();
        this.EnemyCaptain = new Image();
        this.EnemyCommandar = new Image();
        this.EnemyStageBoss = new Image();
        this.EnemyRuler = new Image();
        //Multiplayer
        this.player2 = new Image();
        this.player3 = new Image();
        this.player4 = new Image();
        //Ai
        this.AiEnemy = new Image();
        this.AiMinion = new Image();
        this.AiMiniBoss = new Image();
        this.AiBoss = new Image();
        this.AiCaptain = new Image();
        this.AiCommandar = new Image();
        this.AiStageBoss = new Image();
        this.AiRuler = new Image();
        //Game Controllers
        this.controllerIndex = null;
        this.controllerType = null;
        //Frames
        this.frame = 0; // 10 //Moving Obstacles
        this.frameDirection = 1;
        this.StaggerFrame = 15;
        //Armor
        this.armourSet1 = { name: "Helmet", defense: 5 };
        this.armourSet2 = { name: "Chestplate", defense: 10 };
        this.armourSet3 = { name: "Gloves", defense: 3 };
        this.armourSet4 = { name: "Boots", defense: 2 };
        this.armourSet5 = { name: "Shield", defense: 8 };
        this.armourSet6 = { name: "Pants", defense: 6 };
        this.armourSet7 = { name: "Bracers", defense: 4 };
        this.armourSet8 = { name: "Cloak", defense: 7 };
        //Weapons
        //Ranking/PowerScaling
        this.GodRank = Infinity;
        this.RulerLevel = Math.pow(10, 10000);
        this.OmegaRank = Math.pow(10, 1000);
        this.RankX = Math.pow(10, 100);
        this.Godly = Math.pow(10, 62);
        this.RankM = Math.pow(10, 97);
        this.DemiGodRank = Math.pow(10, 94);
        this.RankY = Math.pow(10, 59)
        this.GodLike = Math.pow(10, 91);
        this.TsunamiFlowRank = Math.pow(10, 57);
        this.ZRank = Math.pow(10, 88);
        this.TranscendentLevel = Math.pow(10, 55);
        this.RankSSS = Math.pow(10, 85);
        this.GigaRank = Math.pow(10, 53);
        this.RankSS = Math.pow(10, 82);
        this.HyperRank = Math.pow(10, 51);
        this.RankS = Math.pow(10, 79);
        this.UltraRank = Math.pow(10, 49);
        this.RankA = Math.pow(10, 76);
        this.UniverseRank = Math.pow(10, 47);
        this.RankB = Math.pow(10, 73);
        this.RankBlackHoleLevel = Math.pow(10, 45);
        this.RankC = Math.pow(10, 70);
        this.RankStarLevel = Math.pow(10, 43);
        this.RankD = Math.pow(10, 67);
        this.RankSuperGalaxyLevel = Math.pow(10, 41);
        this.RankE = Math.pow(10, 64);
        this.RankGalaxyLevel = Math.pow(10, 39);
        this.RankF = Math.pow(10, 61);
        this.RankSolarSystemLevel = Math.pow(10, 37);
        this.RankG = Math.pow(10, 58);
        this.RankPlanetLevel = Math.pow(10, 35);
        this.RankH = Math.pow(10, 55);
        this.RankMoonLevel = Math.pow(10, 33);
        this.RankI = Math.pow(10, 52);
        this.RankOceanLevel = Math.pow(10, 49);
        this.RankJ = Math.pow(10, 48);
        this.CommandarRank = Math.pow(10, 47);
        this.HuhCOmmander = Math.pow(10, 46);
        this.WoahWcommandar = Math.pow(10, 45);
        this.RankK = Math.pow(10, 44);
        this.Continent2Rank = Math.pow(10, 43);
        this.Continent1Rank = Math.pow(10, 42);
        this.RankContinentLevel = Math.pow(10, 41);
        this.RankL = Math.pow(10, 40);
        this.Country1Rank = Math.pow(10, 39);
        this.Country2Rank = Math.pow(10, 38);
        this.CountryLevel = Math.pow(10, 37);
        this.RankN = Math.pow(10, 36);
        this.CLrank = Math.pow(10, 35);
        this.ClRank = Math.pow(10, 34);
        this.CoastLevel = Math.pow(10, 33);
        this.ORank = Math.pow(10, 32);
        this.BossLevel = Math.pow(10, 31);
        this.BossSomething = Math.pow(10, 30);
        this.BossIdk = Math.pow(10, 29)
        this.PRank = Math.pow(10, 28);
        this.Nation2Rank = Math.pow(10, 27);
        this.Nation1Rank = Math.pow(10, 26);
        this.NationRank = Math.pow(10, 25);
        this.QRank = Math.pow(10, 24);
        this.RankDOlater = Math.pow(10, 23);
        this.RankLater = Math.pow(10, 22);
        this.RankMountain = Math.pow(10, 21);
        this.Rrank = Math.pow(10, 20);
        this.unknownCreateLater = Math.pow(10, 19);
        this.Createlater = Math.pow(10, 18);
        this.StateRank = Math.pow(10, 17);
        this.TRank = Math.pow(10, 16);
        this.MiniBoss = Math.pow(10, 15);
        this.CreateLaterRank = Math.pow(10, 14);
        this.ZipCodeRank = Math.pow(10, 13);
        this.URank = Math.pow(10, 12);
        this.EnemyRank = Math.pow(10, 11)
        this.CityRank = Math.pow(10, 10);
        this.AreaRank = Math.pow(10, 9)
        this.VRank = Math.pow(10, 8);
        this.FOrrestRank = Math.pow(10, 7);
        this.RankLakeLevel = Math.pow(10, 6);
        this.TownRank = Math.pow(10, 5)
        this.WRank = Math.pow(10, 4);
        this.StreetLevel = Math.pow(10, 3);
        this.HouseLevel = Math.pow(10, 2);
        this.BaseLevel = Math.pow(10, 1);

        //Mechnics
        this.tfGravity = 0.05;
        this.tfGravitySpeed = 0;
        this.tfGravityBounce = 0.6;

        //Universe
        this.GravitationalConstant = 6.67430e-11; // use this for the g in the function below.
        //Planets
        this.EarthMass = 5.972e24;
        this.EarthRadius = 6.371e6;
        this.gamepads = {};
        this.controllerMappings = {
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
        this.SoundTrack;
        this.GameWorldAudio = new AudioContext();
    }
    HomePageAnimation(player) {
    this.clear();

    // Draw text
    this.context.fillText(player.spriteDialog[this.frame], player.textWidth, player.textHeight);

    // Initialize speed if needed
    if (player.speedX === 0) player.speedX = 1;
    if (player.speedY === 0) player.speedY = 1;

    // Bounce logic
    if (player.textWidth + player.speedX >= this.canvas.width || player.textWidth + player.speedX <= 0) {
        player.speedX = -player.speedX;
    }

    if (player.textHeight + player.speedY >= this.canvas.height || player.textHeight + player.speedY <= 0) {
        this.frame = (this.frame + 1) % player.spriteDialog.length;
        player.speedY = -player.speedY;
    }

    // Move text
    player.textWidth += player.speedX;
    player.textHeight += player.speedY;
}
    createComponent(width, height, color, x, y, speedX, speedY, type) {
        return { width, height, speedX, speedY, color, x, y, type };
    }
    getComponentValue(key) {
        return this.component[key];
    }
    SpritePosition(data) {
        let position = Math.floor(data.spriteFrameInterval / data.spriteStates[data.spriteState].frame) % data.spriteStates[data.spriteState].loc.length;

        data.sx = data.dw * position;
        data.sy = data.spriteStates[data.spriteState].loc[position].y;

        if (this.frame % this.StaggerFrame === 0) {
            if (data.spriteFrameInterval >= data.spriteStates[data.spriteState].frame) {
                data.spriteFrameInterval = 0;
            } else {
                data.spriteFrameInterval = data.spriteFrameInterval + 1
            }
        } else {

        }
        return data.sx, data.sy;
    }
    updateComponent(data) {
        let placement = this.context;
        if (data.type == "sprite") {
            let gameCharacter = this.image;
            gameCharacter.src = data.color;

            this.SpritePosition(data);
            placement.drawImage(gameCharacter, data.sx, data.sy, data.dw, data.dh, data.x, data.y, data.width, data.height);

            //Scoreboard
            placement.font = `${data.textSize} ${data.textStyle}`;
            placement.textAlign = data.textAlign;
            placement.textBaseline = data.textBaseline;
            placement.direction = data.textDirection;
            placement.letterSpacing = data.letterSpacing;
            placement.fontKerning = data.fontKerning;
            placement.fontStretch = data.fontStretch;
            placement.fontVariantCaps = data.fontVariantCaps;
            placement.textRendering = data.textRendering;
            placement.wordSpacing = data.wordSpacing;
            placement.fillStyle = data.textColor;
            placement.fillText(data.text, data.textWidth, data.textHeight /*, data.textSettings*/);
        } else if (data.type == "background") {
            //this.gameBackground.src = data.battleBackground;
            placement.drawImage(gameBackground, data.x, data.y, data.width, data.height);
        } else if (data.type == "text") {
            placement.font = `${data.textSize} ${data.textStyle}`;
            placement.fillStyle = data.textColor;
            placement.fillText(data.text, data.textWidth, data.textHeight);
        } else if (data.type == "player") {

            placement.fillStyle = data.color;
            placement.fillRect(data.x, data.y, data.width, data.height);

            //Scoreboard
            placement.font = `${data.textSize} ${data.textStyle}`;
            placement.textAlign = data.textAlign;
            placement.textBaseline = data.textBaseline;
            placement.direction = data.textDirection;
            placement.letterSpacing = data.letterSpacing;
            placement.fontKerning = data.fontKerning;
            placement.fontStretch = data.fontStretch;
            placement.fontVariantCaps = data.fontVariantCaps;
            placement.textRendering = data.textRendering;
            placement.wordSpacing = data.wordSpacing;
            placement.fillStyle = data.textColor;
            placement.fillText(data.text, data.textWidth, data.textHeight /*, data.textSettings*/);
        } else if (data.type == "obstacle") {
            placement.fillStyle = data.color;
            placement.fillRect(data.x, data.y, data.width, data.height);
        } else {
            placement.fillStyle = data.color;
            placement.fillRect(data.x, data.y, data.width, data.height);
        }
    }
    newComponentPos(data) {
        if (this.canvas.x && this.canvas.y) {
            data.x = this.canvas.x;
            data.y = this.canvas.y;
        } else {
            data.x += data.speedX;
            data.y += data.speedY;
        }
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    moveup(data) {
        if (data.type == "sprite") {
            this.SpritePosition(data);
            return data.speedY -= 1;
        } else {
            return data.speedY -= 1;
        }
    }
    movedown(data) {
        if (data.type == "sprite") {
            this.SpritePosition(data);
            return data.speedY += 1;
        } else {
            return data.speedY += 1;
        }
    }
    moveleft(data) {
        if (data.type == "sprite") {
            this.SpritePosition(data);
            return data.speedX -= 1;
        } else {
            return data.speedX -= 1;
        }
    }
    moveright(data) {
        if (data.type !== "sprite") {
            this.SpritePosition(data);
            return data.speedX += 1;
        } else {
            return data.speedX += 1;
        }
    }
    stopMove(data) {
        if (data.type !== "sprite") {
            this.SpritePosition(data);
            data.speedX = 0;
            data.speedY = 0;
        } else {
            data.speedX = 0;
            data.speedY = 0;
        }
    }
    pcControls(event, key, canvas, sprite) {
        switch (key) {
            case "ArrowUp":
            case "Up":
            case 38:
                if (sprite.type == "sprite") {
                    sprite.spriteState = "walk";
                    this.SpritePosition(sprite);
                    sprite.y = Math.max(sprite.y - (1 * sprite.spriteSpeed), 0);
                } else {
                    this.moveup(sprite);
                }
                break;
            case "ArrowDown":
            case "Down":
            case 40:
                if (sprite.type == "sprite") {
                    sprite.spriteState = "walk";
                    this.SpritePosition(sprite);
                    sprite.y = Math.max(sprite.y + (1 * sprite.spriteSpeed), Math.min(sprite.y + (1 * sprite.spriteSpeed), canvas.height - sprite.height));
                } else {
                    this.movedown(sprite);
                }
                break;
            case "ArrowLeft":
            case "Left":
            case 37:
                if (sprite.type == "sprite") {
                    sprite.spriteState = "walk";
                    this.SpritePosition(sprite);
                    sprite.x = Math.max(sprite.x - (1 * sprite.spriteSpeed), 0);
                } else {
                    this.moveleft(sprite);
                }
                break;
            case "ArrowRight":
            case "Right":
            case 39:
                if (sprite.type == "sprite") {
                    sprite.spriteState = "walk";
                    this.SpritePosition(sprite);
                    sprite.x = Math.max(sprite.x + (1 * sprite.spriteSpeed), Math.min(sprite.x + (1 * sprite.spriteSpeed), canvas.width - sprite.width));
                } else {
                    this.moveright(sprite);
                }
                break;
            case "Enter":
                sprite.spriteState = "select";
                break;
            case "Escape":
                sprite.spriteState = "Start";
                break;
            case "j":
                sprite.spriteState = "weak attack";
                this.SpritePosition(sprite);
                break;
            case "k":
                sprite.spriteState = "strong attack";
                this.SpritePosition(sprite);
                break;
            case "l":
                sprite.spriteState = "special attack";
                this.SpritePosition(sprite);
                break;
            case ";":
                sprite.spriteState = "main attack";
                this.SpritePosition(sprite);
                break;
            case "m":
                sprite.spriteState = "aoe skill";
                this.SpritePosition(sprite);
                break;
            case ",":
                sprite.spriteState = "range skill";
                this.SpritePosition(sprite);
                break;
            case ".":
                sprite.spriteState = "knockback skill";
                this.SpritePosition(sprite);
                break;
            case "/":
                sprite.spriteState = "evade skill";
                this.SpritePosition(sprite);
                break;
            case "u":
                sprite.spriteState = "defense skill";
                this.SpritePosition(sprite);
                break;
            case "i":
                sprite.spriteState = "buff skill";
                this.SpritePosition(sprite);
                break;
            case "o":
                sprite.spriteState = "debuff skill";
                this.SpritePosition(sprite);
                break;
            case "p":
                sprite.spriteState = "ultimate skill";
                this.SpritePosition(sprite);
                break;
            case "w":
                sprite.spriteState = "jump";
                this.SpritePosition(sprite);
                break;
            case "x":
                sprite.spriteState = "crounch";
                this.SpritePosition(sprite);
                break;
            case "space":
                sprite.spriteState = "crawl";
                this.SpritePosition(sprite);
                break;
            case "d":
                sprite.spriteState = "";
                //hpXmove = +hpXmove;
                break;
            case "a":
                sprite.spriteState = "";
                //hpXmove = -hpXmove;
                break;
            case "s":
                sprite.spriteState = "run";
                this.SpritePosition(sprite);
                break;
            case "2":
                sprite.spriteState = "double jump";
                this.SpritePosition(sprite);
                break;
            case "e":
                sprite.spriteState = "climb";
                this.SpritePosition(sprite);
                break;
            case "c":
                sprite.spriteState = "swim";
                this.SpritePosition(sprite);
            case "3":
                sprite.spriteState = "fly";
                this.SpritePosition(sprite);
                //hpYmove = +hpYmove;
                break;
            case "v":
                sprite.spriteState = "dive";
                this.SpritePosition(sprite);
                break;
            case "y":
                sprite.spriteState = "block";
                this.SpritePosition(sprite);
                break;
            case "n":
                sprite.spriteState = "parry";
                this.SpritePosition(sprite);
                break;
            default:
                sprite.spriteState = "stand";
                this.SpritePosition(sprite);
                break;
        }
    }
    getControllerType(gamepad) {
        // Detect controller type based on button layout
        if (gamepad.buttons[0].value === 1) {
            return 'playstation';
        } else if (gamepad.buttons[1].value === 1) {
            return 'xbox';
        } else if (gamepad.buttons[0].value === 1 && gamepad.buttons[3].value === 1) {
            return 'switch';
        } //else {return pcControls();}; 
    };
    gamepadHandler(event, connected) {
        const gamepad = event.gamepad;
        if (connected) {
            this.controllerIndex = gamepad.index;
            console.log("Controller connected at index:", controllerIndex);
            this.controllerType = this.getControllerType(gamepad);
            console.log("Controller type detected:", this.controllerType);
            gamepads[gamepad.index] = gamepad;
            console.log(`Gamepad connected: ${gamepad.id}`);
        } else {
            this.controllerIndex = null;
            this.controllerType = null;
            delete gamepads[gamepad.index];
            console.log(`Gamepad disconnected: ${gamepad.id}`);
        }
    }
    updateSpritePosition(canvas, sprite, leftRightAxis = null, upDownAxis = null) {

        if (this.controllerIndex !== null) {
            // Adjust the sprite position based on the axis input
            sprite.x = Math.max(sprite.x + (leftRightAxis * sprite.spriteSpeed), Math.min(sprite.x, canvas.width - sprite.width));
            sprite.y = Math.max(sprite.y + (upDownAxis * sprite.spriteSpeed), Math.min(sprite.y, canvas.height - sprite.height));
        } else {
            // Adjust the sprite position based on the pc controls 
            this.pcControls(leftRightAxis, upDownAxis, canvas, sprite);
        }
    }
    handleSticks(canvas, sprite, axes) {
        if (this.controllerIndex !== null) {
            // Left stick - axes[0] = left-right, axes[1] = up-down
            this.updateSpritePosition(canvas, sprite, axes[0], axes[1]);

            // Right stick - axes[2] = left-right, axes[3] = up-down
            // handleCameraMovement(axes[2], axes[3]);
        } else {
            document.addEventListener("keydown", this.updateSpritePosition(canvas, sprite, e, e.key), false);
            document.addEventListener("keyup", this.updateSpritePosition(canvas, sprite, e, e.key), false);
        }
    }
    getButtonAction(buttonIndex, mappings) {
        switch (buttonIndex) {
            case 0: return mappings.action1; // A or Cross
            case 1: return mappings.action2; // B or Circle
            case 2: return mappings.action3; // X or Square
            case 3: return mappings.action4; // Y or Triangle
            case 8: return mappings.select;  // Select Button
            case 9: return mappings.start;   // Start Button
            case 12: return mappings.up;     // D-Pad Up
            case 13: return mappings.down;   // D-Pad Down
            case 14: return mappings.left;   // D-Pad Left
            case 15: return mappings.right;  // D-Pad Right
            case 16: return mappings.action5; // L1
            case 17: return mappings.action6; // R1
            case 18: return mappings.action7; // L2
            case 19: return mappings.action8; // R2
            case 20: return mappings.action9; // Left Analog Stick
            case 21: return mappings.action10; // Right Analog stick
            case 22: return mappings.action2 && mapping.action4; // Triangle and Circle
            case 23: return mappings.action1 && mappings.action3; //  Cross and square
            case 24: return mappings.action5 && mapping.action6; // L1 and R1
            case 25: return mappings.action2 && mapping.action1; // Cross and Circle
            case 26: return mappings.action7 && mapping.action8; // X or Square
        }
    }
    handleButtons(buttons, player) {
        if (this.controllerType) {
            const mappings = controllerMappings[this.controllerType];
            buttons.forEach((button, index) => {
                if (button.pressed) {
                    // Get the action corresponding to the button pressed
                    const action = this.getButtonAction(index, mappings);
                    if (action) {
                        console.log(`Action triggered: ${action}`);

                        // Additional logic for specific button presses (e.g., movement, actions, etc.)
                        switch (index) {
                            case 0: // Cross
                                switch (buttonEvent) {
                                    case "pressed":
                                        player.spriteState = "main skill";
                                        break;
                                    case "value":
                                        player.spriteState = "";
                                        break;
                                    case "touched":
                                        player.spriteState = "main skill";
                                        break;
                                }
                                break;
                            case 1: // Circle
                                switch (buttonEvent) {
                                    case "pressed":
                                        player.spriteState = "special attack";
                                        break;
                                    case "value":
                                        player.spriteState = "";
                                        break;
                                    case "touched":
                                        player.spriteState = "special attack";
                                        break;
                                }
                                break;
                            case 2: // Square
                                switch (buttonEvent) {
                                    case "pressed":
                                        player.spriteState = "weak attack";
                                        break;
                                    case "value":
                                        player.spriteState = "";
                                        break;
                                    case "touched":
                                        player.spriteState = "";
                                        break;
                                }
                                break;
                            case 3: // Triangle
                                switch (buttonEvent) {
                                    case "pressed":
                                        player.spriteState = "strong attack";
                                        break;
                                    case "value":
                                        player.spriteState = "";
                                        break;
                                    case "touched":
                                        player.spriteState = "";
                                        break;
                                }
                                break;
                            case 16: // L1
                                switch (buttonEvent) {
                                    case "pressed":
                                        player.spriteState = "evade skill";
                                        break;
                                    case "value":
                                        player.spriteState = "";
                                        break;
                                    case "touched":
                                        player.spriteState = "";
                                        break;
                                }
                                break;
                            case 17: // R1
                                switch (buttonEvent) {
                                    case "pressed":
                                        player.spriteState = "block";
                                        break;
                                    case "value":
                                        player.spriteState = "";
                                        break;
                                    case "touched":
                                        player.spriteState = "parry";
                                        break;
                                }
                                break;
                            case 18: // L2
                                switch (buttonEvent) {
                                    case "pressed":
                                        player.spriteState = "aoe skill";
                                        break;
                                    case "value":
                                        player.spriteState = "";
                                        break;
                                    case "touched":
                                        player.spriteState = "";
                                        break;
                                }
                                break;
                            case 19: // R2
                                switch (buttonEvent) {
                                    case "pressed":
                                        player.spriteState = "range skill";
                                        break;
                                    case "value":
                                        player.spriteState = "";
                                        break;
                                    case "touched":
                                        player.spriteState = "";
                                        break;
                                }
                                break;
                            case 8: // Select or Share
                                switch (buttonEvent) {
                                    case "pressed":
                                        player.spriteState = "stand";
                                        break;
                                    case "value":
                                        player.spriteState = "";
                                        break;
                                    case "touched":
                                        player.spriteState = "";
                                        break;
                                }
                                break;
                            case 9: // Start or Options
                                switch (buttonEvent) {
                                    case "pressed":
                                        player.spriteState = "stand";
                                        break;
                                    case "value":
                                        player.spriteState = "";
                                        break;
                                    case "touched":
                                        player.spriteState = "";
                                        break;
                                }
                                break;
                            case 20: // L3
                                switch (buttonEvent) {
                                    case "pressed":
                                        player.spriteState = "hover";
                                        break;
                                    case "value":
                                        player.spriteState = "fly";
                                        break;
                                    case "touched":
                                        player.spriteState = "crounch";
                                        break;
                                }
                                break;
                            case 21: // R3
                                switch (buttonEvent) {
                                    case "pressed":
                                        player.spriteState = "Sprint";
                                        break;
                                    case "value":
                                        player.spriteState = "fly";
                                        break;
                                    case "touched":
                                        player.spriteState = "Fast Flight";
                                        break;
                                }
                                break;
                            case 12: // D up
                                switch (buttonEvent) {
                                    case "pressed":
                                        player.spriteState = "Use Item";
                                        break;
                                    case "value":
                                        player.spriteState = "Use Item";
                                        break;
                                    case "touched":
                                        player.spriteState = "Use Item";
                                        break;
                                }
                                break;
                            case 13: // d down
                                switch (buttonEvent) {
                                    case "pressed":
                                        player.spriteState = "Pick Up";
                                        break;
                                    case "value":
                                        player.spriteState = "Pick Up";
                                        break;
                                    case "touched":
                                        player.spriteState = "Pick Up";
                                        break;
                                }
                                break;
                            case 14: // d left
                                switch (buttonEvent) {
                                    case "pressed":
                                        player.spriteState = "World Interaction";
                                        break;
                                    case "value":
                                        player.spriteState = "World Interaction";
                                        break;
                                    case "touched":
                                        player.spriteState = "World Interaction";
                                        break;
                                }
                                break;
                            case 15: // d right
                                switch (buttonEvent) {
                                    case "pressed":
                                        player.spriteState = "Cycle Through Items";
                                        break;
                                    case "value":
                                        player.spriteState = "Cycle Through Items";
                                        break;
                                    case "touched":
                                        player.spriteState = "Cycle Through Items";
                                        break;
                                }
                                break;
                            case 22: // Button 21 (knockback skill)
                                player.spriteState = "knockback skill";
                                break;
                            case 16: // Button 22 (evade skill)
                                player.spriteState = "evade skill";
                                break;
                            case 24: // Button 23 (defense skill)
                                player.spriteState = "defense skill";
                                break;
                            case 23: // Button 24 (buff skill)
                                player.spriteState = "buff skill";
                                break;
                            case 25: // Button 25 (debuff skill)
                                player.spriteState = "debuff skill";
                                break;
                            case 26: // Button 26 (ultimate skill)
                                player.spriteState = "ultimate skill";
                                break;
                            case 30: // Center Button
                                switch (buttonEvent) {
                                    case "pressed":
                                        player.spriteState = "stand";
                                        break;
                                    case "value":
                                        player.spriteState = "stand";
                                        break;
                                    case "touched":
                                        player.spriteState = "stand";
                                        break;
                                }
                                break;
                            default:
                                player.spriteState = "Taunt";
                                break;
                        }
                    }
                }
            });
        }
    }
    ActionMechanics(data) {
        switch (data.spriteState) {
            case "stand":
                data.spriteStates.name.x
                data.spriteStates.name.y
                data.sx = 0; // or 120
                data.sy = 0;
                break;
            case "walk":
                data.sx = 0;
                data.sy = 120;
                break;
            case "run":

                break;
            case "jump":

                break;
            case "double jump":

                break;
            case "crouch":

                break;
            case "crawl":

                break;
            case "climb":

                break;
            case "swim":

                break;
            case "dive":

                break;
            case "fly":

                break;
            case "Cycle Through Items":

                break;
            case "Pick Up":

                break;
            case "World Interaction":

                break;
            case "Use Item":

                break;
            case "weak attack":

                break;
            case "strong attack":

                break;
            case "special attack":

                break;
            case "main skill":

                break;
            case "aoe skill":

                break;
            case "range skill":

                break;
            case "knockback skill":

                break;
            case "evade skill":

                break;
            case "defense skill":

                break;
            case "buff skill":

                break;
            case "debuff skill":

                break;
            case "ultimate skill":

                break;
            case "block":

                break;
            case "parry":

                break;
            default:

                break;
        }
    }
    GravitationAcceleration(g, m1, r) {
        let GravitationalAcceleration = (g * m1) / (r * r);;
        return GravitationalAcceleration;
    }
    CalculateGravitationalForceKilogramsFromPounds(g, m1, m2, r) {
        //m1 //mass of first object aka the earth
        //m2 //mass of the second object aka the user/player in Pounds
        //r //distance between the centers of the two object (if using earth it would be [center of earth and the person's center of mass{usually just Earth's radius if the person is on the surface.}]);
        let GravitationalForce = (g * m1 * (m2 / 2.20462)) / (r * r);

        return GravitationalForce;
    }
    CalculateGravitationalForceFromKilograms(g, m1, m2, r) {
        //m1 //mass of first object aka the earth
        //m2 //mass of the second object aka the user/player in Kilograms
        //r //distance between the centers of the two object (if using earth it would be [center of earth and the person's center of mass{usually just Earth's radius if the person is on the surface.}]);
        let GravitationalForce = (g * m1 * (m2 * 2.20462)) / (r * r);
        return GravitationalForce;
    }
    GameScaleNumber(scale, number, conversion, type, weight, mass = 5.972e24, exponent = 3, radius = 6.371e6, GravitationalConstant = 6.67430e-11) {
        switch (scale) {
            case "balance":
                Math.round(number);
                break;
            case "up":
                Math.ceil(number);
                break;
            case "down":
                Math.floor(number);
                break;
            case "exponent":
                Math.pow(number, exponent);
                break;
            case "square root":
                Math.sqrt(number);
                break;
            case "absolute":
                Math.abs(number);
                break;
            case "weakest":
                Math.min(number, tfPowerScale, tfPowerScale1, tfPowerScale2, tfPowerScale3, tfPowerScale4, tfPowerScale5, tfPowerScale6, tfPowerScale7, tfPowerScale8, tfPowerScale9);
                break;
            case "strongest":
                Math.max(number, tfPowerScale, tfPowerScale1, tfPowerScale2, tfPowerScale3, tfPowerScale4, tfPowerScale5, tfPowerScale6, tfPowerScale7, tfPowerScale8, tfPowerScale9);
                break;
            case "PI":
                Math.PI;
                break;
            case "Euler":
                Math.E;
                break;
            case "Milliter":
                if (conversion !== "Fluid Ounces") {
                    number;
                } else {
                    let milliter = number * 29.5735;
                }
                break;
            case "Fluid Ounces":
                if (conversion !== "Milliter") {
                    number;
                } else {
                    let fluidOunces = number / 29.5735;
                }
            case "Inches":
                if (conversion == "feet") {
                    let inches = number * 12;
                } else {
                    number
                }
                break;
            case "Feet":
                if (conversion == "Inches") {
                    let feet = number / 12;
                } else {
                    number;
                }
            case "Kilograms":
                if (conversion !== "Pounds") {
                    number;
                } else {
                    let kilograms = number / 2.20462;
                }
                break;
            case "Pounds":
                if (conversion !== "Kilograms") {
                    number;
                } else {
                    let pounds = number * 2.20462;
                }
                break;
            case "Gravitational Acceleration":
                let PlanetGravity = this.GravitationAcceleration(GravitationalConstant, mass, radius)
                break;
            case "Gravitational Force Kilograms":
                if (conversion !== "Pounds") {
                    number;
                } else {
                    let PlanetGravityEffect = this.CalculateGravitationalForceFromKilograms(GravitationalConstant, mass, weight, radius);
                }
                break;
            case "Gravitational Force Pounds":
                if (conversion !== "Kilograms") {
                    number;
                } else {
                    let PlanetGravityEffect = this.CalculateGravitationalForceKilogramsFromPounds(GravitationalConstant, mass, weight, radius);
                }
                break;
            case "Hours":
                if (conversion == "Minutes") {
                    let hours = number / 60
                } else if (conversion == "Days") {
                    let hours = number * 24;
                } else if (conversion == "Week") {
                    let hours = (number * (7 * 24));
                } else if (conversion == "Year") {
                    if (type == "regular") {
                        let hours = ((number * (365 * 24)))
                    } else {
                        let hours = ((number * (366 * 24)));
                    }
                } else if (conversion == "Decade") {
                    if (type == "regular") {
                        let FirstPart = ((number * (8 * (365 * 24))));
                        let SecondPart = ((number * (2 * (366 * 24))));
                        let hours = FirstPart + SecondPart;
                    } else {
                        let FirstPart = ((number * (7 * (365 * 24))));
                        let SecondPart = ((number * (3 * (366 * 24))));
                        let hours = FirstPart + SecondPart;
                    }
                } else if (conversion == "century") {
                    if (type == "regular") {
                        let FirstPart = ((number * (5 * (8 * (365 * 24)))));
                        let SecondPart = ((number * (5 * (2 * (366 * 24)))));
                    } else {
                        let FirstPart = ((number * (5 * (7 * (365 * 24)))));
                        let SecondPart = ((number * (5 * (3 * (366 * 24)))));
                        let hours = FirstPart + SecondPart
                    }
                } else if (conversion == "milliseconds") {

                } else {
                    // seconds
                    let hours = number / 3600;
                }
                break;

            default:
                // I dont have a reason for default
                break;
        }
    }
    crashWith(player, object) {
        let myLeft = player.x;
        let myRight = player.x + (player.width);
        let myTop = player.y;
        let myBottom = player.y + (player.height);
        let badLeft = object.x;
        let badRight = object.x + (object.width);
        let badTop = object.y;
        let badBottom = object.y + (object.height);
        let crash = true;
        if ((myBottom < badTop) || (myTop > badBottom) || (myRight < badLeft) || (myLeft > badRight)) {
            crash = false;
        }
        return crash;
    }
    damage(character, attackType) {
        switch (attackType) {
            case "weakAttack":
                return character.weakAttack;
            case "strongAttack":
                return character.strongAttack;
            case "knockBackAttack":
                return character.knockBackAttack;
            case "specialAttack":
                return character.specialAttack;
            case "aoeSkill":
                return character.aoeSkill;
            case "rangeSkill":
                return character.rangeSkill;
            case "knockBackSkill":
                return character.knockBackSkill;
            case "evadeSkill":
                return character.evadeSkill;
            case "defenseSkill":
                return character.defenseSkill;
            case "buffSkill":
                return character.buffSkill;
            case "debuffSkill":
                return character.debuffSkill;
            case "ultimateSkill":
                return character.ultimateSkill;
            default:
                return 0;
        }
    }
    damageTotal(tfCC1, tfCC2, pressed) {
        let damageDealt = damage(tfCC1, pressed) - tfCC2.ArmorMax;
        if (damageDealt < 0) {
            damagedealt = 0;
        }
        return damageDealt;
        /*
        // Calculate damage, considering ArmorMax
        let damageDealt = damage(tfCC1, pressed) - tfCC2.ArmorMax;
        return damageDealt < 0 ? 0 : damageDealt; // Ensure no negative damage
        */
    }
    newHealth(character, damage) {
        character.health = character.health - damage;
        return character.health;
        // Subtract damage from character's health
        //    character.health = Math.max(0, character.health - damage); // Health shouldn't go below 0
    }
    death(character) {
        if (character.health > 0) {
            return console.log("still alive");
        } else {
            return console.log("dead");
        }
        //return character.health > 0 ? "still alive" : "dead";
    }
    fullHealth(character) {
        character.health = character.maxHealth;
        return character.health;
    }
    instantKill(character) {
        character.health = 0;
        return character.health;
    }
    GainExperience(character) {
        //const base_xp = 100; // Example base XP
        //const factor = 7; // XP growth factor
        //return base_xp * Math.pow((character.CharacterLevel + 1), factor);
    }
    LevelUp(character) {
        //character.CharacterLevel++;
        //character.health += 10; // Increase max health per level
        //character.strength += 2; // Increase strength per level
        console.log(`Level Up! New Level: ${character.CharacterLevel}`);
    }
    everyInterval(n, frameNumber) {
        if ((frameNumber / n) % 1 == 0) {
            return true;
        } else {
            return false;
        }
    }
    updatingMyGame(user, position) {
        let xTF, heightTF, gap, minHeight, maxHeight, minGap, maxGap;

        for (let i = 0; i < this.TfObstacles.length; i += 1) {
            if (this.crashWith(user, this.TfObstacles[i])) {
                this.stop();
                return;
            }
        }
        this.clear();
        this.frame = this.frame + 1;
        if (this.frame == 1 || this.everyInterval(75, this.frame)) {
            xTF = this.canvas.width;
            minHeight = xTF * 0.10;
            maxHeight = xTF * 0.84;
            heightTF = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
            minGap = minHeight + 15;
            maxGap = maxHeight - 15;
            gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

            this.TfObstacles.push(this.createComponent(10, heightTF - gap, "green", xTF, 0, 0, 0));
            this.TfObstacles.push(this.createComponent(10, xTF - heightTF - gap, "green", xTF, heightTF + gap, 0, 0));
        }
        for (let i = 0; i < this.TfObstacles.length; i += 1) {
            this.TfObstacles[i].speedX = -1;
            this.newComponentPos(this.TfObstacles[i]);
            this.updateComponent(this.TfObstacles[i]);
        }
        this.gameBackground.src = user.battleBackground;
        this.context.drawImage(this.gameBackground, 0, 0, this.canvas.width, this.canvas.height);

        user.text = "Score: " + this.frame;

        this.newComponentPos(user);
        this.updateComponent(user);
    }
    start() {
        //Create Canvas
        //this.canvas.min-width = 70%;
        this.canvas.width = 600;
        //this.canvas.max-width = 100%;
        //this.canvas.min-height = 70%;
        this.canvas.height = 400;
        //this.canvas.max-height = 100%;
        this.canvas.style.margin = "0 auto";
        this.canvas.style.background = "000000";
        this.canvas.style.display = "block";
        this.canvas.style.border = "1px solid black";
        this.canvas.style.cursor = "none";
        this.context.imageSmoothingEnabled = true;
        //this.context.imageSmoothingQualty;
        //Show Canvas
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        //line Break
        let gamelineBreak = document.createElement("br");
        document.body.insertBefore(gamelineBreak, document.body.childNodes[1]);

        if (this.TgameFname === "Tsunami Flow Updates") {
            this.interval = setInterval(async () => {
                this.HomePageAnimation(this.player1);
            }, 20);
        } else if (this.TgameFname === "Homepage Game") {

            //let letsDoIt = window.navigator.keyboard;
            letsDoIt.key = (letsDoIt.key || []);

            console.log("starting spriteStates.forEach");

            //create game buttons
            let upButton = document.createElement("button");
            upButton.innerHTML = "Up";
            document.body.insertBefore(upButton, document.body.childNodes[2]);

            let gamelineBreak2 = document.createElement("br");
            document.body.insertBefore(gamelineBreak2, document.body.childNodes[3]);

            //left
            let leftButton = document.createElement("button");
            leftButton.innerHTML = "LEFT";
            document.body.insertBefore(leftButton, document.body.childNodes[4]);

            //right
            let rightButton = document.createElement("button");
            rightButton.innerHTML = "RIGHT";
            document.body.insertBefore(rightButton, document.body.childNodes[5]);

            let gamelineBreak3 = document.createElement("br");
            document.body.insertBefore(gamelineBreak3, document.body.childNodes[6]);

            //down
            let downButton = document.createElement("button");
            downButton.innerHTML = "DOWN";
            document.body.insertBefore(downButton, document.body.childNodes[7]);

            //OnScreen Buttons Controller
            //up
            upButton.addEventListener("keydown", function (e) {
                letsDoIt.key[e.keyCode] = true;
                if (letsDoIt.key && letsDoIt.key[38]) {
                    this.pcControls(e, e.keyCode, this.canvas, this.player1);
                }
            });
            upButton.addEventListener("keyup", function (e) {
                letsDoIt.key[e.keyCode] = false;
            });

            leftButton.addEventListener("keydown", function (e) {
                letsDoIt.key[e.keyCode] = true;
                if (letsDoIt.key && letsDoIt.key[37]) {
                    this.pcControls(e, e.keyCode, this.canvas, this.player1);
                }
            });
            leftButton.addEventListener("keyup", function (e) {
                letsDoIt.key[e.keyCode] = false;
            });

            rightButton.addEventListener("keydown", function (e) {
                letsDoIt.key[e.keyCode] = true;
                if (letsDoIt.key && letsDoIt.key[39]) {
                    this.pcControls(e, e.keyCode, this.canvas, this.player1);
                }
            });
            rightButton.addEventListener("keyup", function (e) {
                letsDoIt.key[e.keyCode] = false;
            });
            downButton.addEventListener("keydown", function (e) {
                letsDoIt.key[e.keyCode] = true;
                if (letsDoIt.key && letsDoIt.key[38]) {
                    this.pcControls(e, e.keyCode, this.canvas, this.player1);
                }
            });
            downButton.addEventListener("keyup", function (e) {
                letsDoIt.key[e.keyCode] = false;
            });
            /*
                for signal
                const controller = new AbortController();
                controller.about(); to remove listeners 
            */

            //Mouse Controller
            //window.addEventListener("mousemove", function (e) {this.canvas.x = e.pageX;this.canvas.y = e.pageY;});
            upButton.addEventListener("mouseup", () => { this.stopMove(this.player1) }, {
                capture: false, once: false, passive: true, // true means the listener will never call preventDefault
                //signal: controller.signal
            });
            upButton.addEventListener("mousedown", () => { this.moveup(this.player1) }, {
                capture: false, once: false, passive: true //signal: controller.signal,
                // true means the listener will never call preventDefault
            });

            leftButton.addEventListener("mouseup", () => { this.stopMove(this.player1) }, {
                capture: false, once: false, passive: true, // true means the listener will never call preventDefault
                //signal: controller.signal
            });

            leftButton.addEventListener("mousedown", () => { this.moveleft(this.player1) }, {
                capture: false, once: false, passive: true, // true means the listener will never call preventDefault
                //signal: controller.signal
            });
            rightButton.addEventListener("mouseup", () => { this.stopMove(this.player1) }, {
                capture: false, once: false, passive: true, // true means the listener will never call preventDefault
                //signal: controller.signal
            });

            rightButton.addEventListener("mousedown", () => { this.moveright(this.player1) }, {
                capture: false, once: false, passive: true, // true means the listener will never call preventDefault
                //signal: controller.signal
            });

            downButton.addEventListener("mouseup", () => { this.stopMove(this.player1) }, { capture: false, once: false, passive: true });// true means the listener will never call preventDefault
            //signal: controller.signal

            downButton.addEventListener("mousedown", () => { this.movedown(this.player1) }, { capture: false, once: false, passive: true });  // true means the listener will never call preventDefault
            //Touch Screen Controller
            window.addEventListener("touchmove", function (e) {
                this.canvas.x = e.touches[0].screenX;
                this.canvas.y = e.touches[0].screenY;
            })

            upButton.addEventListener("touchstart", () => { this.moveup(this.player1) }, {
                capture: false, once: false, passive: true, // true means the listener will never call preventDefault
                //signal: controller.signal
            });

            leftButton.addEventListener("touchstart", () => { this.moveleft(this.player1) }, {
                capture: false, once: false, passive: true, // true means the listener will never call preventDefault
                //signal: controller.signal
            });

            rightButton.addEventListener("touchstart", () => { this.moveright(this.player1) }, {
                capture: false, once: false, passive: true, // true means the listener will never call preventDefault
                //signal: controller.signal
            });

            downButton.addEventListener("touchstart", () => { this.movedown(this.player1) }, { capture: false, once: false, passive: true });// true means the listener will never call preventDefault
            //signal: controller.signal

            //Console Controller 
            window.addEventListener("gamepadconnected", (event) => {
                this.gamepadHandler(event, true);
            }, false);

            window.addEventListener("gamepaddisconnected", () => {
                this.gamepadHandler(event, false);
            }, false);

            //Handle Sprite Movements with this option either controller or pc. 
            if (this.controllerIndex !== null) {
                let gamepad = navigator.getGamepads()[this.controllerIndex];

                if (gamepad) {
                    this.handleButtons(gamepad.buttons, this.player1);
                    this.handleSticks(this.canvas, this.player1, gamepad.axes);
                }
            } else {
                document.addEventListener("keydown", async (event) => {
                    event.preventDefault();
                    letsDoIt.key[event.keyCode] = true;
                    this.pcControls(event, event.key, this.canvas, this.player1);
                });
                document.addEventListener("keyup", async (event) => {
                    event.preventDefault();
                    letsDoIt.key[event.keyCode] = false;
                    this.player1.spriteState = "stand";
                });
            }


            //Create
            this.player1.spriteStates.forEach((state, index) => {
                this.player1.spriteStatesFrames = {
                    loc: [], frame: state.frames
                };
                for (let j = 0; j < state.frames; j++) {
                    let positionX = j * this.player1.dw;
                    let positionY = index * this.player1.dh;

                    this.player1.spriteStatesFrames.loc.push({ x: positionX, y: positionY });
                }
                this.player1.spriteStates[state.name] = this.player1.spriteStatesFrames;
            });
            console.log(this.player1.spriteStates);
            //Loop Starts 
            this.interval = setInterval(() => {
                this.updatingMyGame(this.player1)
            }, 20);
        }
        //loop ends
    }

    stop() {
        clearInterval(this.interval);
    }
    static from(data) {
        return new letsDoIt(data.TgameFname, data.player1);
    }
    toJSON() {
        return {
            TgameFname: this.TgameFname,
            player1: this.player1,
        };
    }
}

export class gameComponent {
    static AmountOfComponents = 0;
    constructor(SpriteNewWidth, SpriteNewHeight, color, SpritePlacementX, SpritePlacementY, type, SpriteStartClippinX, SpriteStartClippinY, SpriteClippedWidth, SpriteClippedHeight, SpriteTextSize, SpriteTextStyle, SpriteTextWidth, SpriteTextHeight, SpriteTextAlign, SpriteTextBaseline, SpriteTextDirection, SpriteLetterSpacing, SpriteFontKerning, SpriteFontStretch, SpriteFontVariantCaps, SpriteTextRendering, SpriteWordSpacing, SpriteTextSettings, SpriteDialog, SpriteState, battleBackground, firstname, lastname, nickname, PhysicalAbility, IntellectualAbility, SocialAbility, EmotionalAbility, ExistentialAbility, EnergeticAbility, MetaCognitiveAbility, headArmor, bodyArmor, armArmor, legArmor, weakAttack, strongAttack, specialAttack, mainSkill, evadeSkill, defenseSkill, knockbackSkill, rangeSkill, aoeSkill, buffSkill, debuffSkill, ultimateSkill) {
        gameComponent.AmountofComponents += 1;
        this.exist = true;
        this.width = SpriteNewWidth;
        this.height = SpriteNewHeight;
        this.speedX = 0;
        this.speedY = 0;
        this.spriteSpeed = 5;
        this.color = color;
        this.x = SpritePlacementX;
        this.y = SpritePlacementY;
        this.type = type;
        this.sx = SpriteStartClippinX;
        this.sy = SpriteStartClippinY;
        this.dw = SpriteClippedWidth;
        this.dh = SpriteClippedHeight;
        this.textSize = SpriteTextSize;
        this.textStyle = SpriteTextStyle;
        this.textWidth = SpriteTextWidth;
        this.textHeight = SpriteTextHeight;
        this.textAlign = SpriteTextAlign;
        this.textBaseline = SpriteTextBaseline;
        this.textDirection = SpriteTextDirection;
        this.letterSpacing = SpriteLetterSpacing;
        this.fontKerning = SpriteFontKerning;
        this.fontStretch = SpriteFontStretch;
        this.fontVariantCaps = SpriteFontVariantCaps;
        this.textRendering = SpriteTextRendering;
        this.wordSpacing = SpriteWordSpacing;
        this.textSettings = SpriteTextSettings;
        this.spriteDialog = SpriteDialog;
        this.spriteState = SpriteState;
        this.spriteAnimationArray = [];
        this.spriteStates = [
            { name: "stand", frames: 2 },
            { name: "walk", frames: 2 },
            { name: "run", frames: 2 },
            { name: "jump", frames: 2 },
            { name: "double jump", frames: 2 },
            { name: "crouch", frames: 2 },
            { name: "crawl", frames: 2 },
            { name: "climb", frames: 2 },
            { name: "swim", frames: 2 },
            { name: "dive", frames: 2 },
            { name: "fly", frames: 2 },
            { name: "Cycle Through Items", frames: 2 },
            { name: "Pick Up", frames: 2 },
            { name: "World Interaction", frames: 2 },
            { name: "Use Item", frames: 2 },
            { name: "weak attack", frames: 2 },
            { name: "strong attack", frames: 2 },
            { name: "special attack", frames: 2 },
            { name: "main skill", frames: 2 },
            { name: "aoe skill", frames: 2 },
            { name: "range skill", frames: 2 },
            { name: "knockback skill", frames: 2 },
            { name: "evade skill", frames: 2 },
            { name: "defense skill", frames: 2 },
            { name: "buff skill", frames: 2 },
            { name: "debuff skill", frames: 2 },
            { name: "ultimate skill", frames: 2 },
            { name: "block", frames: 2 },
            { name: "parry", frames: 2 }
        ];
        this.spriteStatesFrames = {};
        this.spriteFrameInterval = 0;
        this.battleBackground = battleBackground;
        this.firstname = firstname;
        this.lastname = lastname;
        this.nickname = nickname;
        this.PhysicalAbility = PhysicalAbility;
        this.IntellectualAbility = IntellectualAbility;
        this.SocialAbility = SocialAbility;
        this.EmotionalAbility = EmotionalAbility;
        this.ExistentialAbility = ExistentialAbility;
        this.EnergeticAbility = EnergeticAbility;
        this.MetaCognitiveAbility = MetaCognitiveAbility;
        this.headArmor = headArmor;
        this.bodyArmor = bodyArmor;
        this.armArmor = armArmor;
        this.legArmor = legArmor;
        this.weakAttack = weakAttack;
        this.strongAttack = strongAttack;
        this.specialAttack = specialAttack;
        this.mainSkill = mainSkill;
        this.evadeSkill = evadeSkill;
        this.defenseSkill = defenseSkill;
        this.knockbackSkill = knockbackSkill;
        this.rangeSkill = rangeSkill;
        this.aoeSkill = aoeSkill;
        this.buffSkill = buffSkill;
        this.debuffSkill = debuffSkill;
        this.ultimateSkill = ultimateSkill;
    }
    static from(data) {
        return new gameComponent(data.width, data.height, data.speedX, data.speedY, data.spriteSpeed, data.color, data.x, data.y, data.type, data.sx, data.sy, data.dx, data.dh, data.textSize, data.textStyle, data.textWidth, data.textHeight, data.textAlign, data.textBaseline, data.textDirection, data.letterSpacing, data.fontKerning, data.fontStretch, data.fontVariantCaps, data.textRendering, data.wordSpacing, data.textSettings, data.spriteDialog, data.spriteState, data.spriteAnimationArray, data.spriteStates, data.spriteStatesFrames, data.spriteFrameInterval, data.battleBackground, data.firstname, data.lastname, data.nickname, data.PhysicalAbility, data.IntellectualAbility, data.SocialAbility, data.EmotionalAbility, data.ExistentialAbility, data.EnergeticAbility, data.MetaCognitiveAbility, data.headArmor, data.bodyArmor, data.armArmor, data.legArmor, data.weakAttack, data.strongAttack, data.specialAttack, data.mainSkill, data.evadeSkill, data.defenseSkill, data.knockbackSkill, data.rangeSkill, data.aoeSkill, data.buffSkill, data.debuffSkill, data.ultimateSkill);
    }
    toJSON() {
        return {
            width: this.width,
            height: this.height,
            speedX: this.speedX,
            speedY: this.speedY,
            spriteSpeed: this.spriteSpeed,
            color: this.color,
            x: this.x,
            y: this.y,
            type: this.type,
            sx: this.sx,
            sy: this.sy,
            dw: this.dw,
            dh: this.dh,
            textSize: this.textSize,
            textStyle: this.textStyle,
            textWidth: this.textWidth,
            textHeight: this.textHeight,
            textAlign: this.textAlign,
            textBaseline: this.textBaseline,
            textDirection: this.textDirection,
            letterSpacing: this.letterSpacing,
            fontKerning: this.fontKerning,
            fontStretch: this.fontStretch,
            fontVariantCaps: this.fontVariantCaps,
            textRendering: this.textRendering,
            wordSpacing: this.wordSpacing,
            textSettings: this.textSettings,
            spriteDialog: this.spriteDialog,
            spriteState: this.spriteState,
            spriteAnimationArray: this.spriteAnimationArray,
            spriteStates: this.spriteStates,
            spriteStatesFrames: this.spriteStatesFrames,
            spriteFrameInterval: this.spriteFrameInterval,
            battleBackground: this.battleBackground,
            firstName: this.firstname,
            lastName: this.lastname,
            nickName: this.nickname,
            PhysicalAbility: this.PhysicalAbility,
            IntellectualAbility: this.IntellectualAbility,
            SocialAbility: this.SocialAbility,
            EmotionalAbility: this.EmotionalAbility,
            ExistentialAbility: this.ExistentialAbility,
            EnergeticAbility: this.EnergeticAbility,
            MetaCognitiveAbility: this.MetaCognitiveAbility,
            headArmor: this.headArmor,
            bodyArmor: this.bodyArmor,
            armArmor: this.armArmor,
            legArmor: this.legArmor,
            weakAttack: this.weakAttack,
            strongAttack: this.strongAttack,
            specialAttack: this.specialAttack,
            mainSkill: this.mainSkill,
            evadeSkill: this.evadeSkill,
            defenseSkill: this.defenseSkill,
            knockbackSkill: this.knockbackSkill,
            rangeSkill: this.rangeSkill,
            aoeSkill: this.aoeSkill,
            buffSkill: this.buffSkill,
            debuffSkill: this.debuffSkill,
            ultimateSkill: this.ultimateSkill,
        }
    }
}

let player1 = new gameComponent(tfSNW, tfSNH, "blue", tfSPX, tfSPY, "player", tfSSCX, tfSSCY, tfSCW, tfSCH, AckmaHawkTextSize, AckmaHawkTextStyle, AckmaHawkTextWidth, AckmaHawkTextHeight, AckmaHawkTextAlign, AckmaHawkTextBaseLine, AckmaHawkTextDirection, AckmaHawkLetterSpacing, AckmaHawkFontKerning, AckmaHawkFontStretch, AckmaHawkFontVariantCaps, AckmaHawkTextRendering, AckmaHawkWordSpacing, AckmaHawkTextSettings, homePageArray, PlayerState, AckmaHawkBattleBackground, "Tsunami", "Flow", "TF", PhysicalAbility, AckmaHawkIntellectualIntelligence, AckmaHawkSocialIntelligence, AckmaHawkEmotionalIntelligence, AckmaHawkExistentialIntelligence, AckmaHawkEnergeticIntelligence, AckmaHawkMetaCognitiveIntelligence, AckmaHawkHeadArmor, AckmaHawkBodyArmor, AckmaHawkarmArmor, AckmaHawkLegArmor, AckmaHawkweakAttack, AckmaHawkstrongAttack, AckmaHawkspecialAttack, AckmaHawkmainSkill, AckmaHawkevadeSkill, AckmaHawkdefenseSkill, AckmaHawkknockBackSkill, AckmaHawkrangeSkill, AckmaHawkaoeSkill, AckmaHawkbuffSkill, AckmaHawkdebuffSkill, AckmaHawkultimateSkill);

let TfStickMan = new gameComponent(tfSNW, tfSNH, linkToSpriteSheet, tfSPX, tfSPY, "sprite", tfSSCX, tfSSCY, tfSCW, tfSCH, AckmaHawkTextSize, AckmaHawkTextStyle, AckmaHawkTextWidth, AckmaHawkTextHeight, AckmaHawkTextAlign, AckmaHawkTextBaseLine, AckmaHawkTextDirection, AckmaHawkLetterSpacing, AckmaHawkFontKerning, AckmaHawkFontStretch, AckmaHawkFontVariantCaps, AckmaHawkTextRendering, AckmaHawkWordSpacing, AckmaHawkTextSettings, StickManDialog, PlayerState, AckmaHawkBattleBackground, "Hubert", "Maxwell", "StickMan", PhysicalAbility, AckmaHawkIntellectualIntelligence, AckmaHawkSocialIntelligence, AckmaHawkEmotionalIntelligence, AckmaHawkExistentialIntelligence, AckmaHawkEnergeticIntelligence, AckmaHawkMetaCognitiveIntelligence, AckmaHawkHeadArmor, AckmaHawkBodyArmor, AckmaHawkarmArmor, AckmaHawkLegArmor, AckmaHawkweakAttack, AckmaHawkstrongAttack, AckmaHawkspecialAttack, AckmaHawkmainSkill, AckmaHawkevadeSkill, AckmaHawkdefenseSkill, AckmaHawkknockBackSkill, AckmaHawkrangeSkill, AckmaHawkaoeSkill, AckmaHawkbuffSkill, AckmaHawkdebuffSkill, AckmaHawkultimateSkill);

let Mishuba = new gameComponent(AckmaHawkCanvasWidth, AckmaHawkCanvasHeight, AckmaHawkSpriteSheet, AckmaHawkCanvasX, AckmaHawkCanvasY, AckmaHawkType, AckmaHawkSpriteSheetState, AckmaHawkSpriteSheetFrame, AckmaHawkSpritSheetWidth, AckmaHawkSpriteSheetHeight, AckmaHawkTextSize, AckmaHawkTextStyle, AckmaHawkTextWidth, AckmaHawkTextHeight, AckmaHawkTextAlign, AckmaHawkTextBaseLine, AckmaHawkTextDirection, AckmaHawkLetterSpacing, AckmaHawkFontKerning, AckmaHawkFontStretch, AckmaHawkFontVariantCaps, AckmaHawkTextRendering, AckmaHawkWordSpacing, AckmaHawkTextSettings, AckmaHawkDialog, PlayerState, AckmaHawkBattleBackground, "Mishuba", "Feilong", "2Fly", PhysicalAbility, AckmaHawkIntellectualIntelligence, AckmaHawkSocialIntelligence, AckmaHawkEmotionalIntelligence, AckmaHawkExistentialIntelligence, AckmaHawkEnergeticIntelligence, AckmaHawkMetaCognitiveIntelligence, AckmaHawkHeadArmor, AckmaHawkBodyArmor, AckmaHawkarmArmor, AckmaHawkLegArmor, AckmaHawkweakAttack, AckmaHawkstrongAttack, AckmaHawkspecialAttack, AckmaHawkmainSkill, AckmaHawkevadeSkill, AckmaHawkdefenseSkill, AckmaHawkknockBackSkill, AckmaHawkrangeSkill, AckmaHawkaoeSkill, AckmaHawkbuffSkill, AckmaHawkdebuffSkill, AckmaHawkultimateSkill);

let AckmaHawk = new gameComponent(AckmaHawkCanvasWidth, AckmaHawkCanvasHeight, AckmaHawkSpriteSheet, AckmaHawkCanvasX, AckmaHawkCanvasY, AckmaHawkType, AckmaHawkSpriteSheetState, AckmaHawkSpriteSheetFrame, AckmaHawkSpritSheetWidth, AckmaHawkSpriteSheetHeight, AckmaHawkTextSize, AckmaHawkTextStyle, AckmaHawkTextWidth, AckmaHawkTextHeight, AckmaHawkTextAlign, AckmaHawkTextBaseLine, AckmaHawkTextDirection, AckmaHawkLetterSpacing, AckmaHawkFontKerning, AckmaHawkFontStretch, AckmaHawkFontVariantCaps, AckmaHawkTextRendering, AckmaHawkWordSpacing, AckmaHawkTextSettings, AckmaHawkDialog, PlayerState, AckmaHawkBattleBackground, "Sagoonma", "", "Ackma Hawk", PhysicalAbility, AckmaHawkIntellectualIntelligence, AckmaHawkSocialIntelligence, AckmaHawkEmotionalIntelligence, AckmaHawkExistentialIntelligence, AckmaHawkEnergeticIntelligence, AckmaHawkMetaCognitiveIntelligence, AckmaHawkHeadArmor, AckmaHawkBodyArmor, AckmaHawkarmArmor, AckmaHawkLegArmor, AckmaHawkweakAttack, AckmaHawkstrongAttack, AckmaHawkspecialAttack, AckmaHawkmainSkill, AckmaHawkevadeSkill, AckmaHawkdefenseSkill, AckmaHawkknockBackSkill, AckmaHawkrangeSkill, AckmaHawkaoeSkill, AckmaHawkbuffSkill, AckmaHawkdebuffSkill, AckmaHawkultimateSkill);

let Halu = new gameComponent(AckmaHawkCanvasWidth, AckmaHawkCanvasHeight, AckmaHawkSpriteSheet, AckmaHawkCanvasX, AckmaHawkCanvasY, AckmaHawkType, AckmaHawkSpriteSheetState, AckmaHawkSpriteSheetFrame, AckmaHawkSpritSheetWidth, AckmaHawkSpriteSheetHeight, AckmaHawkTextSize, AckmaHawkTextStyle, AckmaHawkTextWidth, AckmaHawkTextHeight, AckmaHawkTextAlign, AckmaHawkTextBaseLine, AckmaHawkTextDirection, AckmaHawkLetterSpacing, AckmaHawkFontKerning, AckmaHawkFontStretch, AckmaHawkFontVariantCaps, AckmaHawkTextRendering, AckmaHawkWordSpacing, AckmaHawkTextSettings, AckmaHawkDialog, PlayerState, AckmaHawkBattleBackground, "Sagoonma", "", "Ackma Hawk", PhysicalAbility, AckmaHawkIntellectualIntelligence, AckmaHawkSocialIntelligence, AckmaHawkEmotionalIntelligence, AckmaHawkExistentialIntelligence, AckmaHawkEnergeticIntelligence, AckmaHawkMetaCognitiveIntelligence, AckmaHawkHeadArmor, AckmaHawkBodyArmor, AckmaHawkarmArmor, AckmaHawkLegArmor, AckmaHawkweakAttack, AckmaHawkstrongAttack, AckmaHawkspecialAttack, AckmaHawkmainSkill, AckmaHawkevadeSkill, AckmaHawkdefenseSkill, AckmaHawkknockBackSkill, AckmaHawkrangeSkill, AckmaHawkaoeSkill, AckmaHawkbuffSkill, AckmaHawkdebuffSkill, AckmaHawkultimateSkill);

//default character
export let HomepageUpdates = new letsDoIt("Tsunami Flow Updates", player1); //default i should just make this it's own class tbh. page setup without sprite

//Characters
    //Shapes
    export let FirstGame = new letsDoIt("Homepage Game", player1); //default page setup without sprite
    //Stickman
    export let Stickman = new letsDoIt("Homepage Game", TfStickMan); ////default page setup with sprite

    //Mishuba
    export let mishuba = new letsDoIt("", Mishuba); //mishuba aka my user setup using images.
    //Know Tyme
    //Lockdown
    //Shadow

    //My book.
    export let ackmaHawk = new letsDoIt("", AckmaHawk); // my super hero setup 
    export let halu = new letsDoIt("", Halu); //my super villain setup.
    //Duwen
// 
    
//Characters End

/*
    //Make canvas a blob
    function theBlobImage(blob) {
        const canvaBlobImage = document.createElement("img");
        const canvaURLblobImage = URL.createObjectURL(blob);

        canvaBlobImage.onload = () => {
        // no longer need to read the blob so it's revoked
        URL.revokeObjectURL(canvaURLblobImage);
        };

        canvaBlobImage.src = canvaURLblobImage;
        document.body.appendChild(canvaBlobImage);
    }

    FirstGame.canvas.toBlob(theBlobImage, image/jpg, 1); //this if for images.
        //Exceptions 
            //SecurityError

    //Make Canvas an image.

    //Context Stuff
    FirstGame.context.createImageData(width,height,settings);

    //imageData
        //An ImageData object containing the array of pixel values.
    let imageData = FirstGame.context.getImageData(sx, sy, sw, sh, settings);

    //Green Screen 
        for (let i = 0; i < imageData.data.length; i += 4) {
        //Modify pixel data
        imageData.data[i + 0] = 190; //red
        imageData.data[i + 1] = 0; //Green
        imageData.data[i + 2] = 210; //Blue
        imageData.data[i + 3] = 255; //A (what is a);
    }

    
    FirstGame.context.putImageData(imageData,dx,dy,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
    */
/*
    dx
    Horizontal position (x coordinate) at which to place the image data in the destination canvas.

    dy
    Vertical position (y coordinate) at which to place the image data in the destination canvas.

    dirtyX Optional
    Horizontal position (x coordinate) of the top-left corner from which the image data will be extracted. Defaults to 0.

    dirtyY Optional
    Vertical position (y coordinate) of the top-left corner from which the image data will be extracted. Defaults to 0.

    dirtyWidth Optional
    Width of the rectangle to be painted. Defaults to the width of the image data.

    dirtyHeight Optional
    Height of the rectangle to be painted. Defaults to the height of the image data.
*/

/*
FirstGame.context.
FirstGame.context.canvas;
FirstGame.context.save();
FirstGame.context.restore();
FirstGame.context.reset();
FirstGame.context.scale(x,y);
FirstGame.context.rotate(angle);
FirstGame.context.translate(x,y);
FirstGame.context.transform(a,b,c,d,e,f);
FirstGame.context.setTransform(a,b,c,d,e,f);
FirstGame.context.resetTransform();
FirstGame.context.globalAlpha;
FirstGame.context.globalCompositeOperation;
FirstGame.context.imageSmoothingEnabled;

    //do this inside the iframe.
        window.addEventListener("message", (event) => {
            const { type, info } = event.data;
 
            if (type === "game") {
                const game = letsDoIt.from(event.data.info);
            }
        });

        FirstGame.start() 
        //startGame(FirstGame); // Original but startGame code is deleted.
*/