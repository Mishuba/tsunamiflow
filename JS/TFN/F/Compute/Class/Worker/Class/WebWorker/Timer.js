import { TimerTimes } from "./../JS/Arrays.js";

let TimerTrigger = new Set();
let something = null;

async function startTime() {
    let TheTimeIGuess = new Promise((resolve) => {
        let currentTime = new Date();
        let TsunamiTimes = currentTime.toTimeString().slice(0, 5);// "HH:MM";

        if (something === null) {
            something = setInterval(() => {
                currentTime = new Date();
                TsunamiTimes = currentTime.toTimeString().slice(0, 5);
            }, 1000);
        } else {
            TsunamiTimes = currentTime.toTimeString().slice(0, 5);
        }
        resolve(TsunamiTimes);
    });

    let TheRealTime = await TheTimeIGuess;

    if (TimerTimes.includes(TheRealTime) && !TimerTrigger.has(TheRealTime)) {
        TimerTrigger.add(TheRealTime);
        console.log(`Triggering event for ${TheRealTime}`);
        postMessage({ type: "Tf Schedule", time: TheRealTime });
    } else {
        postMessage({ type: "Tf Time", time: TheRealTime });
    }

    if (TheRealTime === "23:59") {
        TimerTrigger.clear();
    }
}

setInterval(startTime, (1000 * 60));


