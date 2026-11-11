import { GameMechanics } from "./Elder/GameMechanics.js";

export class letsDoIt extends GameMechanics {
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
        super(options);
    }
    start(element) {
        //line Break
        let gamelineBreak = document.createElement("br");
        element.insertBefore(gamelineBreak, element.childNodes[1]);

        let letsDoIt = window.navigator.keyboard;
        letsDoIt.key = (letsDoIt.key || []);

        //create game buttons
        let upButton = document.createElement("button");
        upButton.innerHTML = "Up";
        element.insertBefore(upButton, element.childNodes[2]);

        let gamelineBreak2 = document.createElement("br");
        element.insertBefore(gamelineBreak2, element.childNodes[3]);

        //left
        let leftButton = document.createElement("button");
        leftButton.innerHTML = "LEFT";
        element.insertBefore(leftButton, element.childNodes[4]);

        //right
        let rightButton = document.createElement("button");
        rightButton.innerHTML = "RIGHT";
        element.insertBefore(rightButton, element.childNodes[5]);

        let gamelineBreak3 = document.createElement("br");
        element.insertBefore(gamelineBreak3, element.childNodes[6]);

        //down
        let downButton = document.createElement("button");
        downButton.innerHTML = "DOWN";
        element.insertBefore(downButton, element.childNodes[7]);

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
    }

}
