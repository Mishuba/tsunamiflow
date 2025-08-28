//map() = performs a function for each element in an array, then stores the returned values in a new array

let storeUSD = [5, 6, 7, 8, 9,];

function toEuros(value){

    value *= 0.85;
    return value;
}

let storeEUR = storeUSD.map(toEuros);

console.log(storeUSD);
console.log(storeEUR);

