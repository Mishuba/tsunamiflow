// JSON stands for JavaScript Object Notation.  It is a text format for storing and transporting data.

// below is an html drop down list

/*
const dbParam = JSON.stringify({table:"customers",limit:20});
const xmlhttp = new XMLHttpRequest();
xmlhttp.onload = function () {
    const myObj = JSON.parse(this.responseText);
    let text = "<select>"
    for (let x in myObj) {
        text += "<option>" + myObj[x].name + "</option>";
    }
    text += "</select>"
    document.getElementById("demo").innerHTML = text;
    }
}
xmlhttp.open("POST". "json_demo_html_table.php", true);
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.send("x=" + dbParam);

// html drop down list ended here

JSONP uses the <script> tag instead of the XMLHttpRequest.

JSONP request files using the script tag instead of the XMLHttpRequest object
    <script src="demo_jsonp.php">

The Server File
    - The file on the server wraps the result inside a function call:
        * Make sure that the function exists on the client.
    
/*
PHP has some built-in functions to handle JSON.

Objects in PHP can be converted into JSON by using the PHP function json_encode():
    example
        <?php
        $myObj->name = "John";
        $myObj->age = 30;
        $myObj->city = "New York";

        $myJSON = json_encode($myObj);

        echo $myJSON;
        ?>

        Arrays in PHP will also be converted into JSON when using the PHP function json_encode():

PHP File explained:
    convert the request into an object, using the PHP function json_decode()
    Access the database, and fill an array with the requested data.
    Add the array to an object, and return the object as JSON using the json_encode() function.

PHP Method = POST
    - To send AJAX requests using the POST method, specify the method, and the correct header.
    - The data sent to the server must now be an arguement to the send() mnethod:

/*

when receiving data from a web server, the data is always a string. 
Parse the data with JSON.parse(), and the date becomes a JavaScript object.
Use the JavaScript function JSON.parse() to convert text into a JavaScript object:
WHen using the JSON.parse() on a JSON derived from an array, the method will return a JavaScript array, instead of a JavaScript object.

*/

// Date objects are not allowed in JSON

// Functions are not allowed in JSON. If you need to include a function, write it as a string.


/*

a json string is like this
'{"name":"John", "age":30, "car":null}'
    the above defines an object with 3 properties

if you parse the json string with a javascript program, you can access the data as an object:
    example below
        let personName = obj.name;
        let personAge = obj.age;
*/

// JavaScript has a built in function for converting JSON strings into JavaScript objects:
        //JSON.parse()

// JavaScript also has a built in function for converting an object into a JSON string:
    // JSON.stringify()

// you can always store data as a text with JSON.

/*
Exceptions
    Stringify Dates
    - In JSON, date objects are not allowed. The JSON.stringify() function will convert any dates into strings.

Stringify Functions
    In JSON, functions are not allowed as object values.
        - The JSON.stringify() function will remove any functions froma JavaScript object, both the key and the value:

If you send functions using JSON, the functions will lose their scope, and the receiver would have to use eval() to convert them back into functions.

/*
the JSON syntax is a subset of the JavaScript syntax.

JSON Syntax Rules
JSON syntax is derived from JavaScript object notation syntax:
    -Data is in name/value pairs
    -Data is separated by commas
    -Curly braces hold objects
    -Square brackets hold arrays

JSON Data - A Name and a Value
    - a name/value pair consists of a field name (in double quotes), followed by a colon, followed by a value:
    - JSON names require double quotes
    - the value can be an array.

JSON - Evaluates to JavaScript Objects
    - In JSON, keys must be strings, written with double quotes:

JSON Values
    - JSON, values must be one of the following data types:
        * a string
            {"name":"John"}
        * a number
            {"age":30}
        * an object
            {
                "employee":{"name":"John", "age":30, "city":"New York"}
            }
        * an array
            {
                "employees":["John", "Anna", "Peter"]
            }
        * a boolean
            {"sale":true}
        * null
            {"middlename":null}
        

    - In JavaScript values can be all of the above, plus any other valid JavaScript expression, including:
        * a function
        * a date
        * undefined
        * 

JSON Files
    - The file type for JSON files is ".json"
    - The MIME type for JSON text is "application/json"


JSON Object Literals

below there is a JSON String with a JSON object literal inside of it:
'{"name":"John", "age":30, "car":null}'

JSON object literals are surrounded by curly braces {}.
JSON object literals contains key/value pairs.
Keys and values are separated by a colon.
Keys must be strings, and values must be a valid JSON data type:
            -string
            -number
            -object
            -array
            -boolean
            -null
    Each key/value pair is separated by a comma.

    you can access object values by using dot (.) notation:
            example
                const myJSON = '{"name":"John", "age":30, "car":null}';
                const myObj = JSON.parse(myJSON);
                x = myObj.name
    
you can also access object values by using bracket ([]) notation:
            example
                const myJSON = '{"name":"John", "age":30, "car":null}';
                const myObj = JSON.parse(myJSON);
                x = myObj["name"];


You can loop through object properties with a for-in loop:

In a for-in loop, use the bracket notation to access the property values:
            example
                const myJSON = '{"name":"John", "age":30, "car":null}';
                const myObj = JSON.parse(myJSON);
                    let text = "";
                    for (const x in myObj) {
                        text += myObj[x] + ", ";
                    }
        
Arrays in Objects
    Objects can contains arrays:
    {
        "name":"John",
        "age":30,
        "cars":["Ford", "BMW", "Fait"]
    }

You access array values by index:

Looping through an Array
- You can access array values by using a for in loop:
    example
        for (let i in myObj.car) {
            x += myObj.cars[i];
        }

    Or you can use a for loop:
        for (let i = 0; i < myObj.cars.length; i++) {
            x += myObj.cars[i];
        }

JSON From a Server
    - You an request JSON from the server by using an AJAX request
    - As long as the response from the server is written in JSON fromat you can parse the string into a JavaScript object.

*/