import { TsDomCanvas } from "./Teen/T.js";

export class HeaderWords extends TsDomCanvas {
    TheOtherWords = 1;
    QuoteStuff = 0;
    WordOfTheDayArray = new Array();
    WordTimes = ["00:00", "01:30", "02:40", "03:30", "04:15", "05:00", "06:15", "07:00", "09:30", "11:15", "12:30", "14:00", "16:15", "19:45", "20:50", "22:05", "23:10"];
    theWords = null;
    FirstWord = null;
    FirstDefinition = null;
    FirstQuoteText = null;
    FirstQuoteHistoryFact = null;
    FirstQuoteHistoryFact2 = null;
    FirstQuoteHistoryMyth = null;
    FirstQuoteHistoryMyth2 = null;
    FirstQuoteHistoryLegend = null;
    FirstQuoteHistoryLegend2 = null;
    SecondQuoteText = null;
    SecondQuoteHistoryFact = null;
    SecondQuoteHistoryFact2 = null;
    SecondQuoteHistoryMyth = null;
    SecondQuoteHistoryMyth2 = null;
    SecondQuoteHistoryLegend = null;
    SecondQuoteHistoryLegend2 = null;
    SomeQuote = null;
    SomeQuote2 = null;
    SomeFact = null;
    SomeFact2 = null;
    SomeFact3 = null;
    SomeFact4 = null;
    SomeMyth = null;
    SomeMyth2 = null;
    SomeMyth3 = null;
    SomeMyth4 = null;
    SomeLegend = null;
    SomeLegend2 = null;

    SomeLegend3 = null;

    SomeLegend4 = null;

    SomeOfEverythingOne = null;

    SomeOfEverythingTwo = null;

    SomeOfEverythingThree = null;

    SomeOfEverythingFour = null;
    constructor(options = {}) {
        super(options);
    }
    buildHistory(historyData) {
        return {
            fact: historyData.fact || {},
            myth: historyData.myth || {},
            legend: historyData.legend || {}
        };
    }
    EnHword(value) {
        let word = {
            word: value.word,
            definition: value.definition,
            quotes: value.quotes.map((quote) => ({
                text: quote.text,
                history: this.buildHistory(quote.history)
            }))
        };

        this.WordOfTheDayArray.push(word);
    }

    getWord() {
        return this.theWords;
    }
    WordOfTheDay(time) {
        if (this.theWords === null || undefined) {
            if (this.WordOfTheDayArray.length === 0) {
                console.error("no words");
                return;
            } else {
                this.theWords = Math.floor(Math.random() * (this.WordOfTheDayArray.length - 1));
                this.FirstWord = this.WordOfTheDayArray[this.theWords].word.word;
                this.FirstDefinition = this.WordOfTheDayArray[this.theWords].word.definition;
                this.FirstQuoteText = this.WordOfTheDayArray[this.theWords].word.quotes[this.QuoteStuff].text;
                this.FirstQuoteHistoryFact = this.WordOfTheDayArray[this.theWords].word.quotes[this.QuoteStuff].history.fact.one;
                this.FirstQuoteHistoryFact2 = this.WordOfTheDayArray[this.theWords].word.quotes[this.QuoteStuff].history.fact.two;
                this.FirstQuoteHistoryMyth = this.WordOfTheDayArray[this.theWords].word.quotes[this.QuoteStuff].history.myth.one;
                this.FirstQuoteHistoryMyth2 = this.WordOfTheDayArray[this.theWords].word.quotes[this.QuoteStuff].history.myth.two;
                this.FirstQuoteHistoryLegend = this.WordOfTheDayArray[this.theWords].word.quotes[this.QuoteStuff].history.legend.one;
                this.FirstQuoteHistoryLegend2 = this.WordOfTheDayArray[this.theWords].word.quotes[this.QuoteStuff].history.legend.two;
                this.SecondQuoteText = this.WordOfTheDayArray[this.theWords].word.quotes[this.TheOtherWords].text;
                this.SecondQuoteHistoryFact = this.WordOfTheDayArray[this.theWords].word.quotes[this.TheOtherWords].history.fact.one;
                this.SecondQuoteHistoryFact2 = this.WordOfTheDayArray[this.theWords].word.quotes[this.TheOtherWords].history.fact.two;
                this.SecondQuoteHistoryMyth = this.WordOfTheDayArray[this.theWords].word.quotes[this.TheOtherWords].history.myth.one;
                this.SecondQuoteHistoryMyth2 = this.WordOfTheDayArray[this.theWords].word.quotes[this.TheOtherWords].history.myth.two;
                this.SecondQuoteHistoryLegend = this.WordOfTheDayArray[this.theWords].word.quotes[this.TheOtherWords].history.legend.one;
                this.SecondQuoteHistoryLegend2 = this.WordOfTheDayArray[this.theWords].word.quotes[this.TheOtherWords].history.legend.two;

                this.SomeQuote = `${this.FirstWord} <br /> Definition: ${this.FirstDefinition} <br /> Quote: ${this.FirstQuoteText}`;
                this.SomeQuote2 = `${this.FirstWord} <br/> Definition: ${this.FirstDefinition} <br /> Quote: ${this.SecondQuoteText}`;
                this.SomeFact = `${this.FirstWord} <br /> Defintion: ${this.FirstDefinition} <br /> Fact: ${this.FirstQuoteHistoryFact}`;

                this.SomeFact2 = `${this.FirstWord} <br /> Defintion: ${this.FirstDefinition} <br /> Fact: ${this.FirstQuoteHistoryFact2}`;

                this.SomeFact3 = `${this.FirstWord} <br /> Definition: ${this.FirstDefinition} <br /> Fact: ${this.SecondQuoteHistoryFact}`;

                this.SomeFact4 = `${this.FirstWord} <br /> Definition: ${this.FirstDefinition} <br /> Fact: ${this.SecondQuoteHistoryFact2}`;

                this.SomeMyth = `${this.FirstWord} <br /> Definition: ${this.FirstDefinition} <br /> Myth: ${this.FirstQuoteHistoryMyth}`;

                this.SomeMyth2 = `${this.FirstWord} <br /> Definition: ${this.FirstDefinition} <br /> Myth: ${this.FirstQuoteHistoryMyth2}`;

                this.SomeMyth3 = `${this.FirstWord} <br /> Definition: ${this.FirstDefinition} <br /> Myth: ${this.SecondQuoteHistoryMyth}`;

                this.SomeMyth4 = `${this.FirstWord} <br /> Definition: ${this.FirstDefinition} <br /> Myth: ${this.SecondQuoteHistoryMyth2}`;

                this.SomeLegend = `${this.FirstWord} <br /> Definition: ${this.FirstDefinition} <br /> Legend: ${this.FirstQuoteHistoryLegend}`;

                this.SomeLegend2 = `${this.FirstWord} <br /> Definition: ${this.FirstDefinition} <br /> Legend: ${this.FirstQuoteHistoryLegend2}`;

                this.SomeLegend3 = `${this.FirstWord} <br /> Definition: ${this.FirstDefinition} <br /> Legend: ${this.SecondQuoteHistoryLegend}`;

                this.SomeLegend4 = `${this.FirstWord} <br /> Definition: ${this.FirstDefinition} <br /> Legend: ${this.SecondQuoteHistoryLegend2}`;

                this.SomeOfEverythingOne = `${this.FirstWord} <br /> Defintion: ${this.FirstDefinition} <br /> Quote: ${this.FirstQuoteText} <br /> Fact: ${this.FirstQuoteHistoryFact} <br /> Myth: ${this.FirstQuoteHistoryMyth} <br /> Legend: ${this.FirstQuoteHistoryLegend} <br />`;

                this.SomeOfEverythingTwo = `${this.FirstWord} <br /> Defintion: ${this.FirstDefinition} <br /> Quote: ${this.FirstQuoteText} <br /> Fact: ${this.FirstQuoteHistoryFact2} <br /> Myth: ${this.FirstQuoteHistoryMyth2} <br /> Legend: ${this.FirstQuoteHistoryLegend2} <br />`;

                this.SomeOfEverythingThree = `${this.FirstWord} <br /> Defintion: ${this.FirstDefinition} <br /> Quote: ${this.SecondQuoteText} <br /> Fact: ${this.SecondQuoteHistoryFact} <br /> Myth: ${this.SecondQuoteHistoryMyth} <br /> Legend: ${this.SecondQuoteHistoryLegend} <br />`;

                this.SomeOfEverythingFour = `${this.FirstWord} <br /> Defintion: ${this.FirstDefinition} <br /> Quote: ${this.SecondQuoteText} <br /> Fact: ${this.SecondQuoteHistoryFact2} <br /> Myth: ${this.SecondQuoteHistoryMyth2} <br /> Legend: ${this.SecondQuoteHistoryLegend2} <br />`;
            }
            console.log(this.getWord());
            switch (time) {
                case this.WordTimes[0]:
                    return this.SomeQuote;
                case this.WordTimes[1]:
                    return this.SomeFact;
                case this.WordTimes[2]:
                    return this.SomeMyth;
                case this.WordTimes[3]:
                    return this.SomeLegend;
                case this.WordTimes[4]:
                    return this.SomeOfEverythingTwo;
                case this.WordTimes[5]:
                    return this.SomeFact2;
                case this.WordTimes[6]:
                    return this.SomeMyth2;
                case this.WordTimes[7]:
                    return this.SomeLegend2;
                case this.WordTimes[8]:
                    return this.SomeOfEverythingThree;
                case this.WordTimes[9]:
                    return this.SomeQuote2;
                case this.WordTimes[10]:
                    return this.SomeFact3;
                case this.WordTimes[11]:
                    return this.SomeMyth3;
                case this.WordTimes[12]:
                    return this.SomeLegend3;
                case this.WordTimes[13]:
                    return this.SomeOfEverythingFour;
                case this.WordTimes[14]:
                    return this.SomeFact4;
                case this.WordTimes[15]:
                    return this.SomeMyth4;
                case this.WordTimes[16]:
                    return this.SomeLegend4;
                default:
                    return this.SomeOfEverythingOne;
            }
        }
    };
}