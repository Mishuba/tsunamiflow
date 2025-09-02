import { WordTimes } from "./Arrays.js";

class TFwordOftheDay {
    constructor(word) {
        this.word = word || {};
        this.TheOtherWords = 1;
        this.QuoteStuff = 0;
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

export const WordOfTheDayArray = new Array();

export let TFwordTemplate = new TFwordOftheDay({
    word: "",
    definition: "",
    quotes: [
        {
            text: "",
            history: {
                fact: { one: "", two: "" },
                myth: { one: "", two: "" },
                legend: { one: "", two: "" }
            }
        },
        {
            text: "",
            history: {
                fact: { one: "", two: "" },
                myth: { one: "", two: "" },
                legend: { one: "", two: "" }
            }
        }
    ]
});

let TFwordMishuba = new TFwordOftheDay({
    word: "Mishuba",
    definition: "A heterosexual North American entertainer.",
    quotes: [
        {
            text: "'My Inner Self Helps Unifies Beautiful Art' - Mishuba",
            history: {
                fact: { one: "Mishuba's parents were in the military which cause him to live in multiple places growing up. Mishuba lived in two countries(Germany and the United States of America), went to four elementary schools, four middle schools and two high schools; he also lived in six different states while living with his family.", two: "Outside of music Mishuba loves to play sports and video games, draw and write poetry." },
                myth: { one: "Mishuba is plotting on taking over the world.", two: "Mishuba has physic power." },
                legend: { one: "Mishuba was the first division one college athlete with a scholarship to also have a record deal.", two: "Mishuba is the reincarnation of ..." }
            }
        },
        {
            text: "You cannot stop greatness you can only prolong it. What is meant to be great will be great",
            history: {
                fact: { one: "His chinese name is 飞龙丁 (fei'long ding）, his first name means flying dragon and his last name is surname ding (the chinese people he was friends with in Xian, China gave him the last name 东风 （dong'feng）; but he wants to his last name to be Ding.", two: "" },
                myth: { one: "Mishuba has no idea what he is doing.", two: "Mishuba been lame his whole life." },
                legend: { one: "Mishuba went to china to fall in love with a woman", two: "Mishuba is able to see, feel, smell, and hear the people who have died in is life in his dreams in the spiritual plane." }
            }
        }
    ]
});
WordOfTheDayArray.push(TFwordMishuba);

let TFtsunami = new TFwordOftheDay();

//WordOfTheDayArray.push(TFtsunami);

/*
let TFflow = new TFwordOftheDay();
WordOfTheDayArray.push(TFflow);

let TFnation = new TFwordOftheDay();
WordOfTheDayArray.push(TFnation);

let TFpublish = new TFwordOftheDay();
WordOfTheDayArray.push(TFpublish);

let TFcompany = new TFwordOftheDay();
WordOfTheDayArray.push(TFcompany);

let TFcorporation = new TFwordOftheDay();
WordOfTheDayArray.push(TFcorporation);

let TFsole = new TFwordOftheDay();
WordOfTheDayArray.push(Tfsole);

let TFproprietorship = new TFwordOftheDay(); //fix the spelling of this word
WordOfTheDayArray.push(TFproprietorship);

let TFstock = new TFwordOftheDay();
WordOfTheDayArray.push(TFstock);

let TFmarket = new TFwordOftheDay();
WordOfTheDayArray.push(TFmarket);

let TFadvertise = new TFwordOftheDay();
WordOfTheDayArray.push(TFadvertise);



let TFHeterosexual = new TFwordOftheDay();
WordOfTheDayArray.push(TFHeterosexual);

let TFnorthAmerican = new TFwordOftheDay();
WordOfTheDayArray.push(TFnorthAmerican);

let TFentertain = new TFwordOftheDay();
WordOfTheDayArray.push(TFentertain);

let TFinner = new TFwordOftheDay();
WordOfTheDayArray.push(TFinner);

let TFself = new TFwordOftheDay();
WordOfTheDayArray.push(TFself);

let TFhelp = new TFwordOftheDay();
WordOfTheDayArray.push(TFhelp);

let TFunify = new TFwordOftheDay();
WordOfTheDayArray.push(TFunify);

let TFbeauty = new TFwordOftheDay();
WordOfTheDayArray.push(TFbeauty);

let TFart = new TFwordOftheDay();
WordOfTheDayArray.push(TFart);

let TFparent = new TFwordOftheDay();
WordOfTheDayArray.push(TFparent);

let TFmilitary = new TFwordOftheDay();
WordOfTheDayArray.push(TFmilitary);

let TFmultiple = new TFwordOftheDay();
WordOfTheDayArray.push(TFmultiple);

let TFplace = new TFwordOftheDay();
WordOfTheDayArray.push(TFplace);

let TFgrow = new TFwordOftheDay();
WordOfTheDayArray.push(TFgrow);

let TFup = new TFwordOftheDay();
WordOfTheDayArray.push(TFup);

let TFlive = new TFwordOftheDay();
WordOfTheDayArray.push(TFlive);

let TFcountry = new TFwordOftheDay();
WordOfTheDayArray.push(TFcountry);

let TFelementary = new TFwordOftheDay();
WordOfTheDayArray.push(TFelementary);

let TFschool = new TFwordOftheDay();
WordOfTheDayArray.push(TFschool);

let TFmiddle = new TFwordOftheDay();
WordOfTheDayArray.push(TFmiddle);

let TFhigh = new TFwordOftheDay();
WordOfTheDayArray.push(TFhigh);

let TFdifferent = new TFwordOftheDay();
WordOfTheDayArray.push(TFdifferent);

let TFstate = new TFwordOftheDay();
WordOfTheDayArray.push(TFstate);

let TFwhile = new TFwordOftheDay();
WordOfTheDayArray.push(TFwhile);

let TFfamily = new TFwordOftheDay();
WordOfTheDayArray.push(TFfamily);

let TFoutside = new TFwordOftheDay();
WordOfTheDayArray.push(TFoutside);

let TFmusic = new TFwordOftheDay();
WordOfTheDayArray.push(TFmusic);

let TFlove = new TFwordOftheDay();
WordOfTheDayArray.push(TFlove);

let TFplay = new TFwordOftheDay();
WordOfTheDayArray.push(TFplay);

let TFsport = new TFwordOftheDay();
WordOfTheDayArray.push(TFsport);

let TFvideo = new TFwordOftheDay();
WordOfTheDayArray.push(TFvideo);

let TFgame = new TFwordOftheDay();
WordOfTheDayArray.push(TFgame);

let TFdraw = new TFwordOftheDay();
WordOfTheDayArray.push(TFdraw);

let TFwrite = new TFwordOftheDay();
WordOfTheDayArray.push(TFwrite);

let TFplot = new TFwordOftheDay();
WordOfTheDayArray.push(TFplot);

let TFtake = new TFwordOftheDay();
WordOfTheDayArray.push(TFtake);

let TFworld = new TFwordOftheDay();
WordOfTheDayArray.push(TFworld);

let TFphysic = new TFwordOftheDay();
WordOfTheDayArray.push(TFphysic);

let TFpower = new TFwordOftheDay();
WordOfTheDayArray.push(TFpower);

let TFfirst = new TFwordOftheDay();
WordOfTheDayArray.push(TFfirst);

let TFdivision = new TFwordOftheDay();
WordOfTheDayArray.push(TFdivision);

let TFcollege = new TFwordOftheDay();
WordOfTheDayArray.push(TFcollege);

let TFathlete = new TFwordOftheDay();
WordOfTheDayArray.push(TFathlete);

let TFscholarship = new TFwordOftheDay();
WordOfTheDayArray.push(TFscholarship);

let TFwith = new TFwordOftheDay();
WordOfTheDayArray.push(TFwith);

let TFalso = new TFwordOftheDay();
WordOfTheDayArray.push(TFalso);

let TFhave = new TFwordOftheDay();
WordOfTheDayArray.push(TFhave);

let TFrecord = new TFwordOftheDay();
WordOfTheDayArray.push(TFrecord);

let TFdeal = new TFwordOftheDay();
WordOfTheDayArray.push(TFdeal);

let TFreincarnate = new TFwordOftheDay();
WordOfTheDayArray.push(TFreincarnate);

let TFcan = new TFwordOftheDay();
WordOfTheDayArray.push(TFcan);

let TFnot = new TFwordOftheDay();
WordOfTheDayArray.push(TFnot);

let TFstop = new TFwordOftheDay();
WordOfTheDayArray.push(TFstop);

let TFgreat = new TFwordOftheDay();
WordOfTheDayArray.push(TFgreat);

let TFyou = new TFwordOftheDay();
WordOfTheDayArray.push(TFyou);

let TFonly = new TFwordOftheDay();
WordOfTheDayArray.push(TFonly);

let TFprolong = new TFwordOftheDay();
WordOfTheDayArray.push(TFprolong);

let TFit = new TFwordOftheDay();
WordOfTheDayArray.push(TFit);

let TFwhat = new TFwordOftheDay();
WordOfTheDayArray.push(TFwhat);

let TFmeant = new TFwordOftheDay();
WordOfTheDayArray.push(TFmeant);

let TFis = new TFwordOftheDay();
WordOfTheDayArray.push(TFis);

let TFto = new TFwordOftheDay();
WordOfTheDayArray.push(TFto);

let TFbe = new TFwordOftheDay();
WordOfTheDayArray.push(TFbe);

let TFwill = new TFwordOftheDay();
WordOfTheDayArray.push(TFwill);

let TFname = new TFwordOftheDay();
WordOfTheDayArray.push(TFname);

let TFfly = new TFwordOftheDay();
WordOfTheDayArray.push(TFfly);

let TFdragon = new TFwordOftheDay();
WordOfTheDayArray.push(TFdragon);

let TFsurname = new TFwordOftheDay();
WordOfTheDayArray.push(TFsurname);

let TFwant = new TFwordOftheDay();
WordOfTheDayArray.push(TFwant);

let TFlast = new TFwordOftheDay();
WordOfTheDayArray.push(TFlast);

let TFno = new TFwordOftheDay();
WordOfTheDayArray.push(TFno);

let TFidea = new TFwordOftheDay();
WordOfTheDayArray.push(TFidea);

let TFdo = new TFwordOftheDay();
WordOfTheDayArray.push(TFdo);

let TFbeen = new TFwordOftheDay();
WordOfTheDayArray.push(TFbeen);

let TFlame = new TFwordOftheDay();
WordOfTheDayArray.push(TFlame);

let TFhis = new TFwordOftheDay();
WordOfTheDayArray.push(TFhis);

let TFher = new TFwordOftheDay();
WordOfTheDayArray.push(TFher);

let TFwhole = new TFwordOftheDay();
WordOfTheDayArray.push(TFwhole);

let TFlife = new TFwordOftheDay();
WordOfTheDayArray.push(TFlife);

let TFwent = new TFwordOftheDay();
WordOfTheDayArray.push(TFwent);

let TFfall = new TFwordOftheDay();
WordOfTheDayArray.push(TFfall);

let TFin = new TFwordOftheDay();
WordOfTheDayArray.push(TFin);

let TFwoman = new TFwordOftheDay();
WordOfTheDayArray.push(TFwoman);

let TFwomen = new TFwordOftheDay();
WordOfTheDayArray.push(TFwomen);

let TFman = new TFwordOftheDay();
WordOfTheDayArray.push(TFman);

let TFmen = new TFwordOftheDay();
WordOfTheDayArray.push(TFmen);

let TFable = new TFwordOftheDay();
WordOfTheDayArray.push(TFable);

let TFsee = new TFwordOftheDay();
WordOfTheDayArray.push(TFsee);

let TFfeel = new TFwordOftheDay();
WordOfTheDayArray.push(TFfeel);

let TFsmell = new TFwordOftheDay();
WordOfTheDayArray.push(TFsmell);

let TFhear = new TFwordOftheDay();
WordOfTheDayArray.push(TFhear);

let TFpeople = new TFwordOftheDay();
WordOfTheDayArray.push(TFpeople);

let TFwho = new TFwordOftheDay();
WordOfTheDayArray.push(TFwho);

let TFdie = new TFwordOftheDay();
WordOfTheDayArray.push(TFdie);

let TFdream = new TFwordOftheDay();
WordOfTheDayArray.push(TFdream);

let TFspiritual = new TFwordOftheDay();
WordOfTheDayArray.push(TFspiritual);

let TFplane = new TFwordOftheDay();
WordOfTheDayArray.push(TFplane);
*/
let theWords = Math.floor(Math.random() * (WordOfTheDayArray.length - 1));

let FirstWord = WordOfTheDayArray[theWords].word.word;
let FirstDefinition = WordOfTheDayArray[theWords].word.definition;
let FirstQuoteText = WordOfTheDayArray[theWords].word.quotes[QuoteStuff].text;
let FirstQuoteHistoryFact = WordOfTheDayArray[theWords].word.quotes[QuoteStuff].history.fact.one;
let FirstQuoteHistoryFact2 = WordOfTheDayArray[theWords].word.quotes[QuoteStuff].history.fact.two;
let FirstQuoteHistoryMyth = WordOfTheDayArray[theWords].word.quotes[QuoteStuff].history.myth.one;
let FirstQuoteHistoryMyth2 = WordOfTheDayArray[theWords].word.quotes[QuoteStuff].history.myth.two;
let FirstQuoteHistoryLegend = WordOfTheDayArray[theWords].word.quotes[QuoteStuff].history.legend.one;
let FirstQuoteHistoryLegend2 = WordOfTheDayArray[theWords].word.quotes[QuoteStuff].history.legend.two;
let SecondQuoteText = WordOfTheDayArray[theWords].word.quotes[TheOtherWords].text;
let SecondQuoteHistoryFact = WordOfTheDayArray[theWords].word.quotes[TheOtherWords].history.fact.one;
let SecondQuoteHistoryFact2 = WordOfTheDayArray[theWords].word.quotes[TheOtherWords].history.fact.two;
let SecondQuoteHistoryMyth = WordOfTheDayArray[theWords].word.quotes[TheOtherWords].history.myth.one;
let SecondQuoteHistoryMyth2 = WordOfTheDayArray[theWords].word.quotes[TheOtherWords].history.myth.two;
let SecondQuoteHistoryLegend = WordOfTheDayArray[theWords].word.quotes[TheOtherWords].history.legend.one;
let SecondQuoteHistoryLegend2 = WordOfTheDayArray[theWords].word.quotes[TheOtherWords].history.legend.two;


let SomeQuote = `${FirstWord} <br /> Definition: ${FirstDefinition} <br /> Quote: ${FirstQuoteText}`;
let SomeQuote2 = `${FirstWord} <br/> Definition: ${FirstDefinition} <br /> Quote: ${SecondQuoteText}`;
let SomeFact = `${FirstWord} <br /> Defintion: ${FirstDefinition} <br /> Fact: ${FirstQuoteHistoryFact}`;

let SomeFact2 = `${FirstWord} <br /> Defintion: ${FirstDefinition} <br /> Fact: ${FirstQuoteHistoryFact2}`;

let SomeFact3 = `${FirstWord} <br /> Definition: ${FirstDefinition} <br /> Fact: ${SecondQuoteHistoryFact}`;

let SomeFact4 = `${FirstWord} <br /> Definition: ${FirstDefinition} <br /> Fact: ${SecondQuoteHistoryFact2}`;

let SomeMyth = `${FirstWord} <br /> Definition: ${FirstDefinition} <br /> Myth: ${FirstQuoteHistoryMyth}`;

let SomeMyth2 = `${FirstWord} <br /> Definition: ${FirstDefinition} <br /> Myth: ${FirstQuoteHistoryMyth2}`;

let SomeMyth3 = `${FirstWord} <br /> Definition: ${FirstDefinition} <br /> Myth: ${SecondQuoteHistoryMyth}`;

let SomeMyth4 = `${FirstWord} <br /> Definition: ${FirstDefinition} <br /> Myth: ${SecondQuoteHistoryMyth2}`;

let SomeLegend = `${FirstWord} <br /> Definition: ${FirstDefinition} <br /> Legend: ${FirstQuoteHistoryLegend}`;

let SomeLegend2 = `${FirstWord} <br /> Definition: ${FirstDefinition} <br /> Legend: ${FirstQuoteHistoryLegend2}`;

let SomeLegend3 = `${FirstWord} <br /> Definition: ${FirstDefinition} <br /> Legend: ${SecondQuoteHistoryLegend}`;

let SomeLegend4 = `${FirstWord} <br /> Definition: ${FirstDefinition} <br /> Legend: ${SecondQuoteHistoryLegend2}`;

let SomeOfEverythingOne = `${FirstWord} <br /> Defintion: ${FirstDefinition} <br /> Quote: ${FirstQuoteText} <br /> Fact: ${FirstQuoteHistoryFact} <br /> Myth: ${FirstQuoteHistoryMyth} <br /> Legend: ${FirstQuoteHistoryLegend} <br />`;

let SomeOfEverythingTwo = `${FirstWord} <br /> Defintion: ${FirstDefinition} <br /> Quote: ${FirstQuoteText} <br /> Fact: ${FirstQuoteHistoryFact2} <br /> Myth: ${FirstQuoteHistoryMyth2} <br /> Legend: ${FirstQuoteHistoryLegend2} <br />`;

let SomeOfEverythingThree = `${FirstWord} <br /> Defintion: ${FirstDefinition} <br /> Quote: ${SecondQuoteText} <br /> Fact: ${SecondQuoteHistoryFact} <br /> Myth: ${SecondQuoteHistoryMyth} <br /> Legend: ${SecondQuoteHistoryLegend} <br />`;

let SomeOfEverythingFour = `${FirstWord} <br /> Defintion: ${FirstDefinition} <br /> Quote: ${SecondQuoteText} <br /> Fact: ${SecondQuoteHistoryFact2} <br /> Myth: ${SecondQuoteHistoryMyth2} <br /> Legend: ${SecondQuoteHistoryLegend2} <br />`;


export async function WordOfTheDay(time) {
    switch (time) {
        case WordTimes[0]:
            return SomeQuote;
        case WordTimes[1]:
            return SomeFact;
        case WordTimes[2]:
            return SomeMyth;
        case WordTimes[3]:
            return SomeLegend;
        case WordTimes[4]:
            return SomeOfEverythingTwo;
        case WordTimes[5]:
            return SomeFact2;
        case WordTimes[6]:
            return SomeMyth2;
        case WordTimes[7]:
            return SomeLegend2;
        case WordTimes[8]:
            return SomeOfEverythingThree;
        case WordTimes[9]:
            return SomeQuote2;
        case WordTimes[10]:
            return SomeFact3;
        case WordTimes[11]:
            return SomeMyth3;
        case WordTimes[12]:
            return SomeLegend3;
        case WordTimes[13]:
            return SomeOfEverythingFour;
        case WordTimes[14]:
            return SomeFact4;
        case WordTimes[15]:
            return SomeMyth4;
        case WordTimes[16]:
            return SomeLegend4;
        default:
            return SomeOfEverythingOne;
    }
};