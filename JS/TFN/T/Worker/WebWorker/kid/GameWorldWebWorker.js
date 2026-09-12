//import { gameComponent } from "../../../../N/Games/Class/planetuniverse.js";
class GameWorld {
	worldai = null;
	frame = 0;
	offscreencanvas = null;
	canvastype = null;
	TfAudioVisualData = {
		dataArray: new Uint8Array(0),
		volume: 0,
		bass: 0,
		mid: 0,
		treble: 0,
		beat: false,
		timestamp: 0
	};
	constructor(options = {}) {
		if (options.offscreencanvas) {
			this.offscreencanvas = options.offscreencanvas;
		}
		if (options.canvastype) {
			this.initRadioOffscreen(options.canvastype);
		}
	}
	initRadioOffscreen(canvas, canvastype) {
		if (this.offscreencanvas !== null) {
			return;
		} else {
			try {
				this.offscreencanvas = canvas;
				this.canvasctx = this.offscreencanvas.getContext(canvastype);
				if (!this.canvasctx) throw new Error(`${canvastype} context not supported`);
				this.isoffscreenReady = true;
				console.log(`OffscreenCanvas initialized with ${canvastype} context`);
			} catch (err) {
				console.error("OffscreenCanvas init failed:", err);
				this.canvasctx = null;
			}
		}
	}
	scheduleVisualizerFrame(callback) {
		// Try requestAnimationFrame first
		try {
			if (typeof requestAnimationFrame === "function") {
				this.visualizerUsingTimeout = false;
				return requestAnimationFrame(callback);
			}
		} catch (error) {
			if (error.name === "NotSupportedError") {
				//console.warn("❌ requestAnimationFrame not supported, falling back to setTimeout");
			} else {
				//console.error("Error in requestAnimationFrame:", error);
			}
		}

		// Fall back to setTimeout
		try {
			this.visualizerUsingTimeout = true;
			return setTimeout(callback, 16);
		} catch (error) {
			if (error.name === "NotSupportedError") {
				console.warn("❌ setTimeout not supported");
			} else {
				console.error("Error in setTimeout:", error);
			}
		}

		console.error("❌ No viable scheduling method available");
		return null;
	}
	clear() {
		this.canvasctx.clearRect(0, 0, this.offscreencanvas.width, this.offscreencanvas.height);
	}
	Visualizer(ai, player = null) {
		this.clear();

		// Draw text
		this.canvasctx.fillText(ai.spriteDialog[this.frame], ai.textWidth, ai.textHeight);

		// Initialize speed if needed
		if (ai.speedX === 0) ai.speedX = 1;
		if (ai.speedY === 0) ai.speedY = 1;

		switch (player) {
			case "exist":

				break;
			default:
				// Bounce logic
				if (ai.textWidth + ai.speedX >= this.offscreencanvas.width || ai.textWidth + ai.speedX <= 0) {
					ai.speedX = -ai.speedX;
				}

				if (ai.textHeight + ai.speedY >= this.offscreencanvas.height || ai.textHeight + ai.speedY <= 0) {
					this.frame = (this.frame + 1) % ai.spriteDialog.length;
					ai.speedY = -ai.speedY;
				}

				// Move text

				ai.textWidth += ai.speedX;
				ai.textHeight += ai.speedY;
				break;
		}
	}
	cancelVisualizerFrame(id) {
		if (id === null) {
			return;
		}

		if (this.visualizerUsingTimeout) {
			clearTimeout(id);
		} else {
			cancelAnimationFrame(id);
		}
	}
	startVisualizerLoop(entity) {
		if (!this.offscreencanvas) {
			console.error("❌ No canvas available");
			return;
		}

		if (this.visualizerRunning) {
			return;
		}

		this.visualizerRunning = true;
		console.log("✅ Visualizer loop started");

		const vizloop = () => {
			if (!this.visualizerRunning) {
				return;
			}

			this.Visualizer(entity);

			this.visualizerFrame = this.scheduleVisualizerFrame(vizloop);
		};

		vizloop();
	}
	stopVisualizerLoop() {
		this.visualizerRunning = false;

		if (this.visualizerFrame !== null) {
			this.cancelVisualizerFrame(this.visualizerFrame);
			this.visualizerFrame = null;
		}
	}
	tycadome(id, type, action, meta, state, mode, payload, transfer = []) {
		let tf = {
			"id": id, //options.id
			"type": type, //command
			"action": action, // video.start
			"meta": meta, // {}
			"timestamp": Math.floor(Date.now() / 1000),
			"state": state, // {}
			"mode": mode, //"async"
			"payload": payload // {},
		};

		// Attach transferables only if valid
		const safeTransfer = [];

		if (Array.isArray(transfer) && transfer.length > 0) {
			for (const item of transfer) {
				if (
					item instanceof ArrayBuffer ||
					item instanceof MessagePort ||
					item instanceof ImageBitmap ||
					item instanceof OffscreenCanvas ||
					item instanceof AudioData ||
					item instanceof VideoFrame
				) {
					safeTransfer.push(item);
				}
			}
		}

		tf.transfer = safeTransfer;

		return tf;
	}
	MessageReceived(event) {
		switch (event.data.type) {
			case "canvas":
				console.log(`the canvas sent to the audio worker has an data action to ${event.data.action}`);
				switch (event.data.action) {
					case "load.game.world.canvas":
						console.log(`this ${event.data.payload.canvas} should be an offscreencanvas`);
						console.log(`attempting to create a 2d canvas context in the audio worker `);
						this.initRadioOffscreen(event.data.payload.canvas, "2d");
						switch (event.data.payload.system) {
							case "homepage":
								this.worldai = event.data.payload.ai;
								this.startVisualizerLoop(this.worldai);
								break;

							default:

								break;
						}
						break;
					default:
						console.log(`the event data action was something i did not expect ${event.data.action}`);
						break;
				}
				break;

			case "audio.worklet": {
				const payload = event.data.payload || {};
				if (event.data.action === "audio.visual.data") {
					if (payload.dataArray) {
						this.TfAudioVisualData.dataArray =
							payload.dataArray instanceof Uint8Array
								? payload.dataArray
								: new Uint8Array(payload.dataArray);
					}

					this.TfAudioVisualData.volume = Number(payload.volume) || 1;
					this.TfAudioVisualData.bass = Number(payload.bass) || 0;
					this.TfAudioVisualData.mid = Number(payload.mid) || 0;
					this.TfAudioVisualData.treble = Number(payload.treble) || 0;
					this.TfAudioVisualData.beat = Boolean(payload.beat);
					this.TfAudioVisualData.timestamp = Date.now();

					if (!this.visualizerRunning) {
						this.startVisualizerLoop();
					}
				}
				break;
			}
			default:
				console.error(`Unhandled event type: ${event.data.type}`);
		}
	}
}

const world = new GameWorld();

self.onmessage = async (e) => {
	world.MessageReceived(e);
}

self.onerror = async (e) => {
	try {
		const err = e?.error || e;
		self.postMessage(tycadome(
			"tycadome-guest" /*+ Date.now()*/,
			"error",
			"world.worker.error",
			{
				source: "web",
				target: "device:web-001",
				layer: "tf",
				worker: "world"
			},
			{
				status: "pending",
				priority: "low"
			},
			"async",
			{
				system: "World Worker",
				message: err?.message || String(err),
				filename: err?.fileName || null,
				lineno: err?.lineNumber || null,
				colno: err?.columnNumber || null,
				stack: err?.stack || null,
				rawEvent: e
			}));

	} catch (postErr) {
		console.error("Worker onerror failed to post:", postErr);
		console.trace();
	}
	console.error("Worker error:", e);
	console.trace();
};
