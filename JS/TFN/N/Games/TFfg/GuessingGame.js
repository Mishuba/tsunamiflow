//fix this game. 

function guessingGame() {

    let number = prompt("test number");
    
    let min = 3;
    let max = 10;
    let unknownNumber = Math.random() * (max - min + 1);
    let beingUsedNumber = Math.floor(unknownNumber) + min;

    while (number != beingUsedNumber) {
        if (number < beingUsedNumber) {
           number = prompt(" the number is too low, try again");
           console.log(beingUsedNumber);
        }
        else if (number > beingUsedNumber) {
            number = prompt(" the number is too high, try again");
            console.log(beingUSedNumber);
        }
    }
    alert("you got it right.  Your #" + number +" is the same as the random #" + beingUsedNumber)
}

guessingGame();