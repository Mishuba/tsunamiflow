import { AiWizard } from "./Adult/ai6";


export class AiMaster extends AiWizard {

    constructor() {

    }
    sprite = null;
    constructor(options = {}) {
        super(options);
        if (options.sprite) {
            this.sprite = options.sprite;
        }
    }
}