export class letsDoIt {
    TgameFname = null;
    player1 = null;
    //Game Players
    player1 = player;
    image = new Image();
    playerAngle = 0;
    playerMoveAngle = 0;
    //Solo Team Members;
    Minion = new Image();
    MiniBoss = new Image();
    Boss = new Image();
    Captain = new Image();
    Commandar = new Image();
    StageBoss = new Image();
    Ruler = new Image();
    //1v1
    Enemy = new Image();
    EnemyMinion = new Image();
    EnemyMiniBoss = new Image();
    EnemyBoss = new Image();
    EnemyCaptain = new Image();
    EnemyCommandar = new Image();
    EnemyStageBoss = new Image();
    EnemyRuler = new Image();
    //Multiplayer
    player2 = new Image();
    player3 = new Image();
    player4 = new Image();
    //Ai
    AiEnemy = new Image();
    AiMinion = new Image();
    AiMiniBoss = new Image();
    AiBoss = new Image();
    AiCaptain = new Image();
    AiCommandar = new Image();
    AiStageBoss = new Image();
    AiRuler = new Image();
    constructor(options = {}) {

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
