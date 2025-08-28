var myName = "Hubert Christopher Maxwell";
var myStreet = "1023 Delaware St.";
var myCity = "Tallahassee, Fl 32304";
var myPhone = "850-273-3609";
console.log(myName.length);
// finds the length of the string

console.log(myName.charAt(0));
// find the first character

console.log(myName.indexOf(" "));
// counts the first index of what you pass in

console.log(myName.lastIndexOf('o'));
//this will find the what you search for starting from the end

console.log(myName.trim()); // will eliminate extra space

console.log(MyName.toUpperCase()); // will make the whole thing in uppercase

console.log(myName.toLowerCase()); // will make everything lowercase

var firstName = myName.slice(0, 3)
console.log(firstName);

var Fname = myname.slice(0, MyName.indexOf(" "));
//finding the first name here

var LastName =myName.slice(myName.lastIndexOf(" ")+ 1);
console.log(lastName);

var myAddress = myStreet.concat(" ", myCity);
console.log(myAddress);

myPhone = myPhone.replaceAll("-", "");
console.log(myPhone);

