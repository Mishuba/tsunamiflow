export class Flow extends Tsunami {
        canvas = canvas;
        contextTypecanvas = contextType;
        canvasctx = null;
        iscanvasReady = false;
      constructor(options = {}) {
            super(options);
      }
}