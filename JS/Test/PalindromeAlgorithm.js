let input = prompt("what is your favorite word");

output: true/false;

function palindrome(str) {       
length = input.length;
let c = 0;

while (c <= length/2) {
    if (input = " ") {
        return undefined;
} if (input[c] != input[length - 1 - c]) 
        return false;
    c = c + 1;
        return true;
            }
}

console.log(palindrome(input));