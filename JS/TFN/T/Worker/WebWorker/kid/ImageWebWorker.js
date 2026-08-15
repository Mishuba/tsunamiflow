
let offscreenctx = null;
let backgroundImg = null;


function UseImage(canvas, corner = false) {
    //this.initOffscreen();
    //this.resizeoffscreen(canvas.width, canvas.height);
    if (corner) {
        const logoW = canvas.width / 4;
        const logoH = canvas.height / 4;
        offscreenctx.drawImage(backgroundImg, canvas.width - logoW - 10, 10, logoW, logoH);
    } else {
        offscreenctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    }
}