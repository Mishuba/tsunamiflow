export async function WordOfTheDay(time, WordTimes, SomeQuote, SomeFact, SomeMyth, SomeLegend, SomeOfEverythingTwo, SomeFact2, SomeMyth2, SomeLegend2, SomeOfEverythingThree, SomeQuote2, SomeFact3, SomeMyth3, SomeLegend3, SomeOfEverythingFour, SomeFact4, SomeMyth4, SomeLegend4, SomeOfEverythingOne) {
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