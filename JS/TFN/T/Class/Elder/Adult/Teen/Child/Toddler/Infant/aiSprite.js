import { AiInterface } from "./Fetus/ai.js";

export class aiSprite2d extends AiInterface {
    sprite = null;
    constructor(options = {}) {
        super(options);
        if (options.sprite) {
            this.sprite = options.sprite;
        }
    }

}