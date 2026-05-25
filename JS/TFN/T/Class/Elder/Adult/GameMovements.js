import { GameController } from "./Teen/GameController.js";
export class TFgameMovement extends GameController {
    player = null;
    image = null;
    playerAngle = 0;
    playerMoveAngle = 0;
    constructor(options = {}) {
        super(options);
        if (options.player) {
            this.player = options.player;
        }
        if (options.image) {
            this.image = options.image;
        } else {
            this.image = new Image();
        }
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
}
