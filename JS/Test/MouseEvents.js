

const div = document.querySelector("#myDiv");

div.style.backgroundColor = "grey";
div.style.width = "200px";
div.style.height = "200px";

div.addEventListener("click", e => {
    console.log(" You clicked the mouse");
    div.style.backgroundColor= "yellow";
});

div.addEventListener("mousedown", e => {
    console.log("You are holding the mouse down");
    div.style.backgroundColor = "red";
});

div.addEventListener("mouseup", e => {
    console.log("You let go of the mouse");
    div.style.backgroundColor = "black";

})

div.addEventListener("dblclick", e => {
    console.log("Double clicked the mouse");
    div.style.backgroundColor = "purple";
});

div.addEventListener("contextmenu", e => {
    console.log("You opened the context menu");
    div.style.backgroundColor= "orange";
}); // right click

div.addEventListener("mouseover", e => {
    console.log("You entered the square");
    div.style.backgroundColor = "White";
});

div.addEventListener("mouseleave", e => {
    console.log("You left the square");
    div.style.backgroundColor = "Green";
});

div.addEventListener("mousemove", e => {
    console.log("You are within the square!");
    div.style.backgroundColor = "lime";
})

