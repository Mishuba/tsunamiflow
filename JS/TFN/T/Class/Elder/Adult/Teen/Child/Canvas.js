import { TsDom } from "./Child/N.js";
import { } from "./Toddler/dom.js";
export class TsDomCanvas extends TsDom { //dom n window
    canvas = null;
    contextTypecanvas = "2d";
    contextTypecanvasoption = { colorSpace: "srgb", willReadFrequently: true };
    canvasctx = null;
    iscanvasReady = false;
    //Frames
    tfframes = null;
    //Game
    frame = 0; // 10 //Moving Obstacles
    frameDirection = 1;
    StaggerFrame = 15;

    component = {};
    TfObstacles = [];
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
    createComponent(width, height, color, x, y, speedX, speedY, type) {
        return { width, height, speedX, speedY, color, x, y, type };
    }
    getComponentValue(key) {
        return this.component[key];
    }
    HomePageAnimation(player) {
        this.clearCanvas();

        // Draw text
        this.context.fillText(player.spriteDialog[this.frame], player.textWidth, player.textHeight);

        // Initialize speed if needed
        if (player.speedX === 0) player.speedX = 1;
        if (player.speedY === 0) player.speedY = 1;

        // Bounce logic
        if (player.textWidth + player.speedX >= this.canvas.width || player.textWidth + player.speedX <= 0) {
            player.speedX = -player.speedX;
        }

        if (player.textHeight + player.speedY >= this.canvas.height || player.textHeight + player.speedY <= 0) {
            this.frame = (this.frame + 1) % player.spriteDialog.length;
            player.speedY = -player.speedY;
        }

        // Move text
        player.textWidth += player.speedX;
        player.textHeight += player.speedY;
    }
    tfSprite() {
        /*
            FirstGame.context.putImageData(imageData,dx,dy,dirtyX,dirtyY,dirtyWidth,dirtyHeight);
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
    }

    useDataOnCanvas(imageData) {
        //An ImageData object containing the array of pixel values.
        //let imageData = FirstGame.context.getImageData(sx, sy, sw, sh, settings);

        switch (type) {
            case "chromakey":
                //Green Screen 
                for (let i = 0; i < imageData.data.length; i += 4) {
                    //Modify pixel data
                    imageData.data[i + 0] = 190; //red
                    imageData.data[i + 1] = 0; //Green
                    imageData.data[i + 2] = 210; //Blue
                    imageData.data[i + 3] = 255; //A (what is a);
                }
                break;
            default:

                break;
        }

    }

    setFrames(frames) {
        switch (frames) {
            case "image":
            case "imagebitmap":
                this.tfframes = new VideoFrame(frames, { timestamp: 0 });
                break;
            case "canvas":
                this.tfframes = new VideoFrame(this.canvas, { timestamp: performance.now() * 1000 });
                break;
            case "video":
                this.tfframes = new VideoFrame(frames);
                break;
            default:
                try {
                    this.tfframes = new VideoFrame(pixelBuffer, {
                        format: "RGBA",
                        codedWidth: this.canvas.width,
                        codedHeight: this.canvas.height,
                        timestamp: 0
                    });
                    this.useDataOnCanvas(this.tfframes);
                } catch (e) {
                    console.warn("Unsupported frames type:", frames);
                    this.tfframes = null;
                }
                break;
        }
    }



    getCanvasContext() {
        /*
    //Make Canvas an image.
    //Context Stuff
    FirstGame.context.createImageData(width,height,settings);
    */


        return this.canvasctx;
    }
    stopCanvasInterval() {
        clearInterval(this.interval);
    }
    clearCanvas(color = "#000000") {
        if (!this.iscanvasReady) return;
        if (this.contextTypecanvas === "2d") {
            this.canvasctx.fillStyle = color;
            this.canvasctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            console.warn("Clear method not implemented for non-2d context");
        }
    }
}