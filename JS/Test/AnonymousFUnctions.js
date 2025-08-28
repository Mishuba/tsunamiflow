// benefits = Doesn't clutter global namespace, Usable once, Can be passed as arguments.
//variables
let total = 0;
let date = new Date(0); // this find the epoch date aka the reference point date

let currentDate = new Date(); // this find the current date.

let MishubaBirthYear = new Date(1990);
let MishubaBirthMonth = new Date(1990, 6);
let MishubaBirthday = new Date(1990, 6, 11);
let MishubaBirthHour = new Date(1990, 6, 11, 11);
let MishubaBirthMin = new Date(1990, 6, 11, 11, 34);
let MishubaBirthSecond = new Date(1990, 6, 11, 11, 34, 18);
let mishubaBirthMillisecond = new Date(1990, 6, 11, 11, 34, 18, 14);

let stringDate = new Date("April 20, 2022 16:20:01:02");
let MishubaStringBirthday = new Date("July 11, 1990 11:34:18:14");

let year = date.getFullYear();
let month = date.getMonth();
let dayofweek = date.getDay();
let dayofMonth = date.getDate();
let hours = date.getHours();
let minutes = date.getMinutes();
let second = date.getSeconds();
let milliseconds = date.getMilliseconds();

//functions
function checkout(element) {
    total += element;
}

function checkAge(age) {
    if (age >= 18) {
        return age;
    }
}

function combineLetters(total, nextLetter, index, array) {

    return total + nextLetter;
}

//arrays
let cart = [5, 6, 7, 8, 9];
let students = [16, 17, 18, 19, 20];
let numbers = [3, 4, 1, 2, 5];
let letters = ["H", "E", "L", "P"];

//StartUp/Anonymous Functions.
//anonymous functions = FUnction w/o a name. Often not accessible after its initial creation.
(function () {
    //use the below to set the date or adjust
    date.setFullYear(2023);
    date.setMonth(11);
    date.setDate(25);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    //use the above to set the date or adjust

    numbers.sort();
    console.log("numbers 1: " + numbers);

    numbers.sort(function (x, y) {
        return x - y;
    });

    console.log("numbers 2" + numbers);

    // filter() = Returns the elements of an array that meets a condition specified in a function.
    let adultStudents = students.filter(checkAge);

    //For Loops
    for (let i = 1; i <= 20; i++) {

        if (i == 7) {
            continue; // completely stops loops here
        } else if (i === 13) {
            break;
        }
        console.log(i);
    }

    // forEach() = Performs a function for each element in an Array.
    cart.forEach(checkout);
    console.log("Your total is : $" + total);

    // reduce() = Reduces an array to a single value The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    let word = letters.reduce(combineLetters);
    let backwards = letters.reduceRight(combineLetters);

    console.log(word);
    console.log(backwards);
})();