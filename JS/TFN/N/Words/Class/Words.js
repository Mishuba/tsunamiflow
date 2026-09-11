export class TFwordOftheDay {
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