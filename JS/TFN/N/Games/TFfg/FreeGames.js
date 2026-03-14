// JavaScript Game code here

function GameDraw() {
    //Home page game (needs to fixed)
    const GameCanvas = document.getElementById("Game1");
    // below is defining what type of canva i want
    if (GameCanvas.getContext) {
        const GameArea = GameCanvas.getContext("2d");
        Choosing = prompt("Choose One:  ");
        switch (Choosing) {
            case "Rectangle":
                //rect(x, y, width, height) draws a rectangle whose top-left corner is specified by (x, y) with the specified width and height.
                GameArea.fillStyle = "rgb(200, 0, 0,)";
                // fillRect(x, y, width, height)
                GameArea.fillRect(10, 10, 50, 50);
        
                GameArea.fillStyle = "rgba(0, 0, 200, 0.5)";
                //strokeRect(x, y, width, height);
                GameArea.strokeRect(30, 30, 50, 50);
        
                GameArea.fillStyle = "rgb(0, 200, 0)";
                //clearRect(x, y, width, height);
                GameArea.clearRect(50, 50, 50, 50);
        
            break;
            case "Triangle":
                //Below draws a triangle.
                //Creates a new path. Once created, future drawing commands are directed into the path and used to build the path up.
                GameArea.beginPath();
                GameArea.moveTo(75, 50);
                // use lineTo(x, y) for drawing straight lines.
                // The starting point is dependent on previously drawn paths, where the end point of the previous path is the starting point for the following, etc etc. The starting point can also be changed by using the moveTo() method. 
                GameArea.lineTo(100, 75);
                GameArea.lineTo(100, 25);
                //Draws a solid shape by filling the path's content area.
                GameArea.fill();
            break;
            case "SmileyFace":
                GameArea.beginPath();
                // to draw arcs or circles, we use the arc() or arcTo() methods. 
                // arc(x, y, radius, startAngle, endAngle, counterclockwise)
                GameArea.arc(75, 75, 50, 0, Math.PI * 2, true); //OUter Circle
                GameArea.moveTo(110,75);
                //arcTo(x1, y1, x2, y2, radius) Draws an arc with the given control points and radius, connected to the previous point by a straight line. 
                GameArea.arc(75, 75, 35, 0, Math.PI, false); // Mouth (clockwise)
                GameArea.moveTo(65, 65);
                GameArea.arc(60, 65, 5, 0, Math.PI * 2, true); // Left Eye
                GameArea.moveTo(95, 65);
                GameArea.arc(90, 65, 5, 0, Math.PI * 2, true); // Right eye
                GameArea.stroke();
            break;
            case "Some Random Thing": 
            for(let Gi = 0; i < 4; i++) {
                for (let Gai= 0; Gai < 3; Gai++) {
                    GameArea.begin();
                    const xz = 25 + Gai * 50; //x coordinate 
                    const yz = 25 + Gi * 50; // y coordinate 
                    const xyzRadius = 20; // Arc radius 
                    const xyzStartAngle = 0; // Starting point on circle
                    const xyzEndAngle = Math.PI + (Math.PI * Gai) / 2; // End point on circle
                    const xzyCounterClockwise = Gi % 2 !== 0; // clockwise or counterclockwise
                    GameArea.arc(xz, yz, xyzRadius, xyzStartAngle, xyzEndAngle, xzyCounterClockwise);
                    if (Gi > 1) {
                        GameArea.fill();
                    } else {
                        GameArea.stroke();
                    }
                }
            }
            break;
            case "Quadratic Bezier Curves":
                //quadraticCurveTo(cp1x, cp1y, x, y)
                /* Draws a quadratic Bezier curve from the current pen position to the end point specified by x and y, using the control point specified by cp1x and cp1y

                bezierCurveTo(cp1x, cp2x, cp2y, x, y)
                    Draws a cubic Bezier curve from the current pen position to the end point specified by x and y, using the control points specified by (cp1x, cp1y) and (cp2x, cp2y).

                The quadratic bezier curve has a start and an end point (blue dots) and just one control point (indicated by the red dot) while a cubic Bezier curve uses two control points. 

                x and y parameters in both of these methods are the coordinates of the end point. 
                cp1x and cp1y are the coordinates of the first control point, 
                cp2x and cp2y are the coordinates of the second control point. 
                */
               GameArea.beginPath();
               GameArea.moveTo(75, 25);
               GameArea.quadraticCurveTo(25, 25, 25, 62.5);
               GameArea.quadraticCurveTo(25, 100, 50, 100);
               GameArea.quadraticCurveTo(50, 120, 30, 125);
               GameArea.quadraticCurveTo(60, 120, 65, 100);
               GameArea.quadraticCurveTo(125, 100, 125, 62.5);
               GameArea.quadraticCurveTo(125, 25, 75, 25);
               GameArea.stroke();
            break;
            case "Cubic Bezier Curves":
                GameArea.beginPath();
                GameArea.moveTo(75, 40);
                GameArea.bezierCurveTo(75, 37, 70, 25, 50, 25);
                GameArea.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
                GameArea.bezierCurveTo(20, 80, 40, 102, 75, 120);
                GameArea.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
                GameArea.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
                GameArea.bezierCurveTo(85, 25, 75, 37, 75, 40);
                GameArea.fill();
                //quadraticCurveTo(cp1x, cp1y, x, y)
                /* Draws a quadratic Bezier curve from the current pen position to the end point specified by x and y, using the control point specified by cp1x and cp1y

                bezierCurveTo(cp1x, cp2x, cp2y, x, y)
                    Draws a cubic Bezier curve from the current pen position to the end point specified by x and y, using the control points specified by (cp1x, cp1y) and (cp2x, cp2y).

                The quadratic bezier curve has a start and an end point (blue dots) and just one control point (indicated by the red dot) while a cubic Bezier curve uses two control points. 

                x and y parameters in both of these methods are the coordinates of the end point. 
                cp1x and cp1y are the coordinates of the first control point, 
                cp2x and cp2y are the coordinates of the second control point. 
                */
            break;
            case Pacman:
                roundedRect(GameArea, 12, 12, 150, 150, 15);
                roundedRect(GameArea, 19, 19, 150, 150, 0);
                roundedRect(GameArea, 53, 53, 49, 33, 10);
                roundedRect(GameArea, 53, 119, 49, 16, 6);
                roundedRect(GameArea, 135, 53, 49, 33, 10);
                roundedRect(GameArea, 135, 119, 25, 49, 10);

                GameArea.beginPath();
                GameArea.arc(37, 37, 13, Math.PI / 7, -Math.PI/ 7, false);
                GameArea.lineTo(31,37);
                GameArea.fill();

                for (let gio = 0; gio < 8; gio++) {
                    GameArea.fillRect(51 + gio * 16, 35, 4, 4);
                }

                for (let gio = 0; gio < 6; gio++) {
                    GameArea.fillRect(115, 51 + gio * 16, 4, 4);
                }

                for (let gio = 0; gio < 8; gio++) {
                    GameArea.fillRect(51 + gio * 16, 99, 4, 4);
                }

                GameArea.beginPath();
                GameArea.moveTo(83, 116);
                GameArea.lineTo(83, 102);
                GameArea.bezierCurveTo(83, 94, 89, 88, 97, 88);
                GameArea.bezierCurveTo(105, 88, 111, 94, 111, 102);
                GameArea.lineTo(111, 116);
                GameArea.lineTo(106.333, 111.333);
                GameArea.lineTo(101.666, 116);
                GameArea.lineTo(97, 111.333);
                GameArea.lineTo(92.333, 116);
                GameArea.lineTo(87.666, 111.333);
                GameArea.lineTo(83, 116);
                GameArea.fill();

                GameArea.fillStyle = "white";
                GameArea.beginPath();
                GameArea.moveTo();
                GameArea.moveTo(91, 96);
                GameArea.bezierCurveTo(88, 96, 87, 99, 87, 101);
                GameArea.bezierCurveTo(87, 103, 88, 106, 91, 106);
                GameArea.bezierCurveTo(94, 106, 95, 103, 95, 101);
                GameArea.bezierCurveTo(95, 99, 94, 96, 91, 96);
                GameArea.moveTo(103, 96);
                GameArea.bezierCurveTo(100, 96, 99, 99, 99, 101);
                GameArea.bezierCurveTo(99, 103, 100, 106, 103, 106);
                GameArea.bezierCurveTo(106, 106, 107, 103, 107, 101);
                GameArea.bezierCurveTo(107, 99, 106, 96, 103, 96);
                GameArea.fill();

                GameArea.fillStyle = "black";
                GameArea.beginPath();
                GameArea.arc(101, 102, 2, 0, Math.PI * 2, true);
                GameArea.fill();

                GameArea.beginPath();
                GameArea.arc(89, 102, 2, 0, Math.PI * 2, true);
                GameArea.fill();
            break;
            case "Rounded Rectangle": 
            /*
                function roundedRect(ctx, x, y, width, height, radius) {
                    ctx.beginPath();
                    ctx.moveTo(x, y, + radius);
                    ctx.arcTo(x, y + height, x + radius, y + height, radius);
                    ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
                    ctx.arcTo(x + width, y, x + width - radius, y, radius);
                    ctx.arcTo(x, y, x, y + radius, radius);
                    ctx.stroke();
                }
                */
            break;
            case "Path2d":
                /*
                Path2D()
                    - the Path2D() constructor returns a newly instantiated Path2D object, optionally with another path as an argument (creates a copy), or optionally with a string consisting of SVG path data.
                    - Path2D.addPath(path [, transform])

                */
               const AnotherRectangle = new Path2D();
               AnotherRectangle.rect(10, 10, 50, 50);

               const AnotherCircle = new Path2D();
               AnotherCircle.arc(100, 35, 25, 0, 2 * Math.PI);

               GameArea.stroke(AnotherRectangle);
               GameArea.fill(AnotherCircle);
            break;
            case "SVG paths":
                /* const p = new Path2D("M10 h 80 v 80 h -80 Z");
                */
            default: ;
            break;
        }

    } else {
        console.log("The Game Area isn't working properly");
        /*
        Angles in the arc function are measured in radians, not degrees. To convert degrees to radians you can use the following JavaScript expression: radians = (Math.PI/180)*degrees
        */

        /* fillStyle = color 
            -Sets the style used when filling shapes.

            strokeStyle = color 
                -Sets the style for shapes' outlines.
        */

        /* Transparency 
            globalAlpha = transparencyValue 
                example
                    ctx.globalAlpha = 0.2;

                - Applies the specified transparency value to all future shapes drawn on the canvas. The value must be between 0.0 (fully transparent) to 1.0 (fully opaque). This value is 1.) (fully opaque) by default.

                    How to assign transparent colors to strokestyle ans fillstyle 
                        ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
                        ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
            */

        /*  Line Style 
                lineWidth = value
                    Sets the width of lines drawn in the future. 
                
                lineCap = type 
                    Sets the appearance of the ends of lines. 

                lineJoin = type 
                    Sets the appearance of the "corners" where lines meet.

                miterLimit = value
                    Establishes a limit on the miter when two lines join at a sharp angle, to let you control how thick the junction becomes. 

                getLineDash() 
                    Returns the current line dash pattern array containing an even number of non-negative numbers.
                
                setLineDash(segments)
                    Sets the current line dash pattern

                lineDashOffset = value 
                    Specifies where to start a dash array on a line.
                    
                lineCap
                    property determines how the end points of every line are drawn. There are three possible values for this property and those are: butt, round and square. By Default this property is set to butt:

                    butt
                        The ends of lines are squared off at the endpoints. 

                    round
                        The ends of lines are rounded.

                    square 
                        The ends of lines are squared off by adding a box with an equal width and half the height of the line's thickness. 

                lineJoin 
                    The lineJoin property determines how two connecting segments (of lines, arcs or curves) with non-zero lengths in a shape are joined together (degenerate segments with zero lengths, whose specified endpoints and control points are exactly at the same position, are skipped). 
                        There are three possible values for this property: round, bevel and miter. By default this property is set to miter. 

                    round 
                        Rounds off the corners of a shape by filling an additional sector of disc centered at the common endpoint of connected segments. The radius for these rounded corners is equal to half the line width.
                    
                    bevel 
                        Fills an additional triangular area between the common endpoint of connected segments, and the separate outside rectangular corners of each segment. 

                    miter 
                        Connected segments are joined by extending their outside edges to connect at a single point, with the effect of filling an additional lozenge-shaped area. This setting is effected by the miterLimit property which is explained below. 
    
        */
    }
}


/*
    // below is applying the color.
    GameArea.fillStyle= "green";
    // below is the location of it and size
    GameArea.fillRect(10, 10, 150, 100);
*/