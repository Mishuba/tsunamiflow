import { TsDom } from "./Child/N.js";
export class TsDomCanvas extends TsDom { //dom n window
    canvas = null;
    contextTypecanvas = "2d";
    /*
    //Make Canvas an image.
    //Context Stuff
    FirstGame.context.createImageData(width,height,settings);

    //imageData
        //An ImageData object containing the array of pixel values.
    let imageData = FirstGame.context.getImageData(sx, sy, sw, sh, settings);

    //Green Screen 
        for (let i = 0; i < imageData.data.length; i += 4) {
        //Modify pixel data
        imageData.data[i + 0] = 190; //red
        imageData.data[i + 1] = 0; //Green
        imageData.data[i + 2] = 210; //Blue
        imageData.data[i + 3] = 255; //A (what is a);
    }

    
    FirstGame.context.putImageData(imageData,dx,dy,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
    */
    /*
        dx
        Horizontal position (x coordinate) at which to place the image data in the destination canvas.
    
        dy
        Vertical position (y coordinate) at which to place the image data in the destination canvas.
    
        dirtyX Optional
        Horizontal position (x coordinate) of the top-left corner from which the image data will be extracted. Defaults to 0.
    
        dirtyY Optional
        Vertical position (y coordinate) of the top-left corner from which the image data will be extracted. Defaults to 0.
    
        dirtyWidth Optional
        Width of the rectangle to be painted. Defaults to the width of the image data.
    
        dirtyHeight Optional
        Height of the rectangle to be painted. Defaults to the height of the image data.
    */
    contextTypecanvasoption = { colorSpace: "srgb", willReadFrequently: true };
    canvasctx = null;
    /*
canvasctx.canvas;
canvasctx.save();
canvasctx.restore();
canvasctx.reset();
canvasctx.scale(x,y);
canvasctx.rotate(angle);
canvasctx.translate(x,y);
canvasctx.transform(a,b,c,d,e,f);
canvasctx.setTransform(a,b,c,d,e,f);
canvasctx.resetTransform();
canvasctx.globalAlpha;
canvasctx.globalCompositeOperation;
canvasctx.imageSmoothingEnabled;
*/
    iscanvasReady = false;
    constructor(options = {}) {
        super(options);
    }
    initCanvas() {
        if (this.canvas !== null) {
            if (this.canvas === this.find("TFradioCanvas")) {
                return;
            } else {
                try {
                    this.canvasctx = this.canvas.getContext(this.contextTypecanvas, this.contextTypecanvasoption);
                    if (!this.canvasctx) throw new Error(`${this.contextTypecanvas} context not supported`);
                    this.iscanvasReady = true;
                    console.log(`Canvas initialized with ${this.contextTypecanvas} context`);
                } catch (err) {
                    console.error("Canvas init failed:", err);
                    this.canvasctx = null;
                }
            }
        } else {
            console.warn("No canvas element found for initialization");
        }
    }

    resizeCanvas(width, height) {
        if (!this.iscanvasReady) return;
        this.canvas.width = width;
        this.canvas.height = height;
    }

    clearCanvas(color = "#000000") {
        if (!this.iscanvasReady) return;
        if (this.contextTypecanvas === "2d") {
            this.canvasctx.fillStyle = color;
            this.canvasctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            console.warn("Clear method not implemented for non-2d context");
        }
    }

    getCanvasContext() {
        return this.canvasctx;
    }
}