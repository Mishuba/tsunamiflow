export class TfEffects {
    constructor() {
        this.Tfhex;
        this.rgb;
        this.chromaKeyColorWebcam = {
            r: 0,
            g: 255,
            b: 0
        };
        this.chromaFrame;
        this.chromaData;
        this.backgroundImg = null;
        //video
        this.backgroundVideo = null;
        this.isPlaying = false;
        this.frameSkipCount = 2;
        this.frameCounter = 0;
        this.useChromaKeyWebcam = false;
    }
    chromaKey(hex) {
        let trf = 0, tgf = 0, tbf = 0;
        if (hex.length === 4) {
            trf = parseInt(hex[1] + hex[1], 16);
            tgf = parseInt(hex[2] + hex[2], 16);
            tbf = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            trf = parseInt(hex[1] + hex[2], 16);
            tgf = parseInt(hex[3] + hex[4], 16);
            tbf = parseInt(hex[5] + hex[6], 16);
        }
        return { trf, tgf, tbf };
    }
    ColorPickerChromaKey(chroma) {
        this.Tfhex = chroma.target.value;
        this.rgb = parseInt(this.Tfhex.slice(1), 16);
        this.chromaKeyColorWebcam.r = (this.rgb >> 16) & 255;
        this.chromaKeyColorWebcam.g = (this.rgb >> 8) & 255;
        this.chromaKeyColorWebcam.b = this.rgb & 255;
    }
    webcam() {
        this.chromaFrame = ctx.getImageData(0, 0, canvas_width, canvas_height);
        this.chromaData = this.chromaFrame.data;
        for (let i = 0; i < this.chromaData.length; i += 4) {
            const r = this.chromaData[i];
            const g = this.chromaData[i + 1];
            const b = this.chromaData[i + 2];
            // Check if pixel matches the chroma key color for webcam
            if (r === this.chromaKeyColorWebcam.r && g === this.chromaKeyColorWebcam.g && b === this.chromaKeyColorWebcam.b) {
                this.chromaData[i + 3] = 0; // Set alpha to 0
            }
        }
    }
    canvas(canvas_width, canvas_height) {
        const imageData = ctx.getImageData(0, 0, canvas_width, canvas_height);
        this.chromaData = imageData.data;
        const chromaColor = this.chromaKey(this.Tfhex);
        for (let i = 0; i < this.chromaData.length; i += 4) {
            if (this.chromaData[i] === chromaColor.r && this.chromaData[i + 1] === chromaColor.g && this.chromaData[i + 2] === chromaColor.b) {
                this.chromaData[i + 3] = 0; // Set alpha to 0 for transparency
            }
        }
    }
    background(stream, canvas_height) {
        // Draw the uploaded background video or image
        if (this.backgroundVideo) {
            ctx.drawImage(this.backgroundVideo, 0, 0, canvas_width, canvas_height);
        } else if (this.backgroundImg) {
            ctx.drawImage(this.backgroundImg, 0, 0, canvas_width, canvas_height);
        }
        // Draw the webcam feed if it's active
        if (this.isPlaying === true) {
            ctx.drawImage(stream, 0, 0, canvas_width, canvas_height);
        }
        // Apply chroma key for webcam, video, and image based on flags
        if (this.frameCounter % this.frameSkipCount === 0) {
            if (this.useChromaKeyWebcam) {
                this.ColorPickerChromaKey(this.Tfhex);
            } else {

            }
        }
        this.frameCounter++;
    }
}