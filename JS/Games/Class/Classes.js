/*
export class TfImages {
    constructor() {

    }
}
*/

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