//import { gameComponent } from "../../../../N/Games/Class/planetuniverse.js";
class GameWorld {
	worldai = null;
	frame = 0;
	offscreencanvas = null;
	canvastype = null;
	tfObstacles = [];
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
	backgroundComponent(data) {
		this.canvasctx.drawImage(data.battleBackground, 0, 0, this.offscreencanvas.width, this.offscreencanvas.height);
	}
	obstacleComponent(data) {
		this.canvasctx.fillStyle = data.color;
		this.canvasctx.fillRect(data.x, data.y, data.width, data.height);
	}
	updateUserComponent(data) {
		if (data.type === "sprite") {
			this.canvasctx.drawImage(data.color, data.sx, data.sy, data.dw, data.dh, data.x, data.y, data.width, data.height);
		} else if (data.type === "player") {
			this.obstacleComponent(data);
		} else {
			this.obstacleComponent(data);
		}

	}
	Scoreboard(user) {
		user.text = "Score: " + this.frame;
	}
	MessageBoard(data) {
		this.canvasctx.font = `${data.textSize} ${data.textStyle}`;
		this.canvasctx.textAlign = data.textAlign;
		this.canvasctx.textBaseline = data.textBaseline;
		this.canvasctx.direction = data.textDirection;
		this.canvasctx.letterSpacing = data.letterSpacing;
		this.canvasctx.fontKerning = data.fontKerning;
		this.canvasctx.fontStretch = data.fontStretch;
		this.canvasctx.fontVariantCaps = data.fontVariantCaps;
		this.canvasctx.textRendering = data.textRendering;
		this.canvasctx.wordSpacing = data.wordSpacing;
		this.canvasctx.fillStyle = data.textColor;
		this.canvasctx.fillText(data.text, data.textWidth, data.textHeight /*, data.textSettings*/);
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
	everyInterval(n, frameNumber) {
		if ((frameNumber / n) % 1 == 0) {
			return true;
		} else {
			return false;
		}
	}
	clear() {
		this.canvasctx.clearRect(0, 0, this.offscreencanvas.width, this.offscreencanvas.height);
	}
	Visualizer(ai, player = null) {
		this.clear();

		// Draw text
		this.canvasctx.fillText(ai.spriteDialog.homepage[this.frame], ai.textWidth, ai.textHeight);

		//draw ai
		//this.canvasctx.drawImage(ai.sprite, ai.spriteX, ai.spriteY, ai.spriteWidth, ai.spriteHeight);


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
					this.frame = (this.frame + 1) % ai.spriteDialog.homepage.length;
					ai.speedY = -ai.speedY;
				}

				// Move text

				ai.textWidth += ai.speedX;
				ai.textHeight += ai.speedY;
				break;
		}
	}
	createObstacle() {
		let minHeight = this.offscreencanvas.width * 0.10;
		let maxHeight = this.offscreencanvas.width * 0.84;
		let heightTF = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
		let minGap = minHeight + 15;
		let maxGap = maxHeight - 15;
		let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);

		this.TfObstacles.push(this.createComponent(10, heightTF - gap, "green", this.offscreencanvas.width, 0, 0, 0));
		this.TfObstacles.push(this.createComponent(10, this.offscreencanvas.width - heightTF - gap, "green", this.offscreencanvas.width, heightTF + gap, 0, 0));
	}
	crashWith(player, object) {
		let myLeft = player.x;
		let myRight = player.x + (player.width);
		let myTop = player.y;
		let myBottom = player.y + (player.height);
		let badLeft = object.x;
		let badRight = object.x + (object.width);
		let badTop = object.y;
		let badBottom = object.y + (object.height);
		let crash = true;
		switch (object.type) {
			case "environment":
				//Do not end game
				break;
			case "sprite":
				if ((myBottom < badTop) || (myTop > badBottom) || (myRight < badLeft) || (myLeft > badRight)) {
					crash = false;
				} else {
					crash = true;
					//Create logic that determines who hit who first and also based on power, durability and weakness.
					this.damageTotal(player, object, this.ActionMechanics(player));
				}
				//input damage function
				break;
			case "obstacle":
				if ((myBottom < badTop) || (myTop > badBottom) || (myRight < badLeft) || (myLeft > badRight)) {
					crash = false;
				}
				// prevent from moving in that direction or jump/climb/swim over it.
				break;
			case "background":
				//idk what ima do for it yet / maybe no crash maybe just prevent from going off screen
				if ((myBottom < badTop) || (myTop > badBottom) || (myRight < badLeft) || (myLeft > badRight)) {
					crash = false;
				}
				break;
			default:
				if ((myBottom < badTop) || (myTop > badBottom) || (myRight < badLeft) || (myLeft > badRight)) {
					crash = false;
					break;
				}
		}
		return crash;
	}
	planetUniverse(ai, player = null) {
		if (this.crashWith(player, ai)) {
			this.stop();
			return;
		}

		this.clear();
	}

	RaceAgainstTheUniverse(user) {
		this.clear();
		this.frame = this.frame + 1;
		if (this.frame == 1 || this.everyInterval(75, this.frame)) {
			this.createObstacle();
		}
		//this.backgroundComponent(user);
		this.Scoreboard(user);
		this.newComponentPos(user);
		this.updateUserComponent(user);
		for (let i = 0; i < this.TfObstacles.length; i += 1) {
			if (this.crashWith(user, this.TfObstacles[i])) {
				this.stop();
				return;
			} else {
				this.TfObstacles[i].speedX = -1;
				this.newComponentPos(this.TfObstacles[i]);
				this.updateUserComponent(this.TfObstacles[i]);
			}
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
	startVisualizerLoop(entity, type = null) {
		if (!this.offscreencanvas) {
			console.error("❌ No canvas available");
			return;
		}

		if (this.visualizerRunning) {
			return;
		}

		this.visualizerRunning = true;
		console.log("✅ Visualizer loop started");

		//Create
		entity.spriteStates.forEach((state, index) => {
			entity.spriteStatesFrames = {
				loc: [], frame: state.frames
			};
			for (let j = 0; j < state.frames; j++) {
				let positionX = j * entity.dw;
				let positionY = index * entity.dh;

				entity.spriteStatesFrames.loc.push({ x: positionX, y: positionY });
			}
			entity.spriteStates[state.name] = entity.spriteStatesFrames;
		});
		console.log(entity.spriteStates);

		switch (type) {
			case "homepage":
				const vizloop = () => {
					if (!this.visualizerRunning) {
						return;
					}

					this.Visualizer(entity);

					this.visualizerFrame = this.scheduleVisualizerFrame(vizloop);
				};

				vizloop();
				break;

			case "race against the universe":
				const RATU = () => {
					if (!this.visualizerRunning) {
						return;
					}

					this.RaceAgainstTheUniverse(entity);

					this.visualizerFrame = this.scheduleVisualizerFrame(RATU);
				};

				RATU();
				break;

			case "planet universe":
				const PlanetUniverse = () => {
					if (!this.visualizerRunning) {
						return;
					}

					this.planetUniverse(entity);

					this.visualizerFrame = this.scheduleVisualizerFrame(PlanetUniverse);
				};

				PlanetUniverse();

				break;
			default:

				break;
		}
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

	StartVideoGame(event) {
		switch (event.data.payload.system) {
			case "homepage":
				this.worldai = event.data.payload.ai;
				this.startVisualizerLoop(this.worldai, event.data.payload.system);
				break;
			case "race against the universe":
				this.worldai = event.data.payload.ai;
				this.startVisualizerLoop(this.worldai, event.data.payload.system);
				break;
			case "planet universe":
				this.worldai = event.data.payload.ai;
				this.startVisualizerLoop(this.worldai, event.data.payload.system);
			default:
				this.worldai = event.data.payload.ai;
				this.startVisualizerLoop(this.worldai, event.data.payload.system);
				break;
		}
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
						this.StartVideoGame(event);
						break;
					default:
						console.log(`the event data action was something i did not expect ${event.data.action}`);
						break;
				}
				break;
			case "game":
				switch (event.data.action) {
					case "start.game":
						if (this.visualizerRunning === true) {
							this.stopVisualizerLoop();
						}
						this.StartVideoGame(event);
						break;
					default:
						if (this.visualizerRunning === true) {
							this.stopVisualizerLoop();
						}
						this.StartVideoGame(event);
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
				break;
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
