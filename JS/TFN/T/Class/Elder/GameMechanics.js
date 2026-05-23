export class GameMechanics {
    //Ranking/PowerScaling
    GodRank = Infinity;
    RulerLevel = Math.pow(10, 10000);
    OmegaRank = Math.pow(10, 1000);
    XRank = Math.pow(10, 100);
    Godly = Math.pow(10, 97);
    MRank = Math.pow(10, 96);
    DemiGodRank = Math.pow(10, 93);
    YRank = Math.pow(10, 92)
    GodLike = Math.pow(10, 91);
    TsunamiFlowRank = Math.pow(10, 89);
    ZRank = Math.pow(10, 88);
    TranscendentLevel = Math.pow(10, 86);
    SSSRank = Math.pow(10, 85);
    GigaRank = Math.pow(10, 83);
    SSRank = Math.pow(10, 82);
    HyperRank = Math.pow(10, 80);
    SRank = Math.pow(10, 79);
    UltraRank = Math.pow(10, 77);
    ARank = Math.pow(10, 76);
    UniverseRank = Math.pow(10, 74);
    BRank = Math.pow(10, 73);
    RankBlackHoleLevel = Math.pow(10, 71);
    CRank = Math.pow(10, 70);
    RankStarLevel = Math.pow(10, 68);
    DRank = Math.pow(10, 67);
    RankSuperGalaxyLevel = Math.pow(10, 63);
    ERank = Math.pow(10, 64);
    RankGalaxyLevel = Math.pow(10, 62);
    FRank = Math.pow(10, 61);
    RankSolarSystemLevel = Math.pow(10, 59);
    GRank = Math.pow(10, 58);
    RankPlanetLevel = Math.pow(10, 56);
    HRank = Math.pow(10, 55);
    RankMoonLevel = Math.pow(10, 53);
    IRank = Math.pow(10, 52);
    RankOceanLevel = Math.pow(10, 49);
    JRank = Math.pow(10, 48);
    CommandarRank = Math.pow(10, 47);
    HuhCOmmander = Math.pow(10, 46);
    WoahWcommandar = Math.pow(10, 45);
    KRank = Math.pow(10, 44);
    Continent2Rank = Math.pow(10, 43);
    Continent1Rank = Math.pow(10, 42);
    RankContinentLevel = Math.pow(10, 41);
    LRank = Math.pow(10, 40);
    Country1Rank = Math.pow(10, 39);
    Country2Rank = Math.pow(10, 38);
    CountryLevel = Math.pow(10, 37);
    NRank = Math.pow(10, 36);
    CLrank = Math.pow(10, 35);
    ClRank = Math.pow(10, 34);
    CoastLevel = Math.pow(10, 33);
    ORank = Math.pow(10, 32);
    BossLevel = Math.pow(10, 31);
    BossSomething = Math.pow(10, 30);
    BossIdk = Math.pow(10, 29)
    PRank = Math.pow(10, 28);
    Nation2Rank = Math.pow(10, 27);
    Nation1Rank = Math.pow(10, 26);
    NationRank = Math.pow(10, 25);
    QRank = Math.pow(10, 24);
    RankDOlater = Math.pow(10, 23);
    RankLater = Math.pow(10, 22);
    RankMountain = Math.pow(10, 21);
    Rrank = Math.pow(10, 20);
    unknownCreateLater = Math.pow(10, 19);
    Createlater = Math.pow(10, 18);
    StateRank = Math.pow(10, 17);
    TRank = Math.pow(10, 16);
    MiniBoss = Math.pow(10, 15);
    CreateLaterRank = Math.pow(10, 14);
    ZipCodeRank = Math.pow(10, 13);
    URank = Math.pow(10, 12);
    EnemyRank = Math.pow(10, 11)
    CityRank = Math.pow(10, 10);
    AreaRank = Math.pow(10, 9)
    VRank = Math.pow(10, 8);
    FOrrestRank = Math.pow(10, 7);
    RankLakeLevel = Math.pow(10, 6);
    TownRank = Math.pow(10, 5)
    WRank = Math.pow(10, 4);
    StreetLevel = Math.pow(10, 3);
    HouseLevel = Math.pow(10, 2);
    BaseLevel = Math.pow(10, 1);

    //Mechnics
    tfGravity = 0.05;
    tfGravitySpeed = 0;
    tfGravityBounce = 0.6;

    //Universe
    GravitationalConstant = 6.67430e-11; // use this for the g in the function below.
    //Planets
    EarthMass = 5.972e24;
    EarthRadius = 6.371e6;
    constructor(options = {}) {

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
        switch (object.type) {
            case "environment":
                //Do not end game
                break;
            case "sprite":
                if ((myBottom < badTop) || (myTop > badBottom) || (myRight < badLeft) || (myLeft > badRight)) {
                    crash = false;
                } else {
                    crash = true;
                    //Create logic that determines who hit who first and also based on power, durability and weakness.
                    this.damageTotal(player, object, this.ActionMechanics(player));
                }
                //input damage function
                break;
            case "obstacle":
                if ((myBottom < badTop) || (myTop > badBottom) || (myRight < badLeft) || (myLeft > badRight)) {
                    crash = false;
                }
                // prevent from moving in that direction or jump/climb/swim over it.
                break;
            case "background":
                //idk what ima do for it yet / maybe no crash maybe just prevent from going off screen
                if ((myBottom < badTop) || (myTop > badBottom) || (myRight < badLeft) || (myLeft > badRight)) {
                    crash = false;
                }
                break;
            default:
                if ((myBottom < badTop) || (myTop > badBottom) || (myRight < badLeft) || (myLeft > badRight)) {
                    crash = false;
                    break;
                }
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
}