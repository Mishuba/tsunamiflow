export class TFwordOftheDay {
    constructor(word) {
        this.word = word || {};
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

export class Particle {
    constructor(x, y, dx, dy, radius, color, canvas) {
        this.x = x;
        this.y = y;
        this.dx = dx; // x velocity
        this.dy = dy; // y velocity
        this.radius = radius;
        this.baseRadius = radius;
        this.color = color;
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