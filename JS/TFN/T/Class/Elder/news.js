import { HeaderWords} from "./Adult/words.js";
export class HeaderNews extends HeaderWords {
NewsArray = new Array();
    constructor(options = {})
 {
        super(options);
    }
    UpdateNews() {
        let ReallyDude = Math.floor(Math.random() * this.NewsArray.length);
        let newsItems = this.find("NTS");
        newsItems.innerHTML = this.NewsArray[ReallyDude];
    }
}