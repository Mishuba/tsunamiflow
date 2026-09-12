class GameWorld {
	//Ranking/PowerScaling
	GodRank = Infinity;
	RulerLevel = Math.pow(10, 10000);
	OmegaRank = Math.pow(10, 1000);
	XRank = Math.pow(10, 100);
	Godly = Math.pow(10, 97);
	MRank = Math.pow(10, 96);
	DemiGodRank = Math.pow(10, 93);
	YRank = Math.pow(10, 92)
	GodLike = Math.pow(10, 91);
	TsunamiFlowRank = Math.pow(10, 89);
	ZRank = Math.pow(10, 88);
	TranscendentLevel = Math.pow(10, 86);
	SSSRank = Math.pow(10, 85);
	GigaRank = Math.pow(10, 83);
	SSRank = Math.pow(10, 82);
	HyperRank = Math.pow(10, 80);
	SRank = Math.pow(10, 79);
	UltraRank = Math.pow(10, 77);
	ARank = Math.pow(10, 76);
	UniverseRank = Math.pow(10, 74);
	BRank = Math.pow(10, 73);
	RankBlackHoleLevel = Math.pow(10, 71);
	CRank = Math.pow(10, 70);
	RankStarLevel = Math.pow(10, 68);
	DRank = Math.pow(10, 67);
	RankSuperGalaxyLevel = Math.pow(10, 63);
	ERank = Math.pow(10, 64);
	RankGalaxyLevel = Math.pow(10, 62);
	FRank = Math.pow(10, 61);
	RankSolarSystemLevel = Math.pow(10, 59);
	GRank = Math.pow(10, 58);
	RankPlanetLevel = Math.pow(10, 56);
	HRank = Math.pow(10, 55);
	RankMoonLevel = Math.pow(10, 53);
	IRank = Math.pow(10, 52);
	RankOceanLevel = Math.pow(10, 49);
	JRank = Math.pow(10, 48);
	CommandarRank = Math.pow(10, 47);
	HuhCOmmander = Math.pow(10, 46);
	WoahWcommandar = Math.pow(10, 45);
	KRank = Math.pow(10, 44);
	Continent2Rank = Math.pow(10, 43);
	Continent1Rank = Math.pow(10, 42);
	RankContinentLevel = Math.pow(10, 41);
	LRank = Math.pow(10, 40);
	Country1Rank = Math.pow(10, 39);
	Country2Rank = Math.pow(10, 38);
	CountryLevel = Math.pow(10, 37);
	NRank = Math.pow(10, 36);
	CLrank = Math.pow(10, 35);
	ClRank = Math.pow(10, 34);
	CoastLevel = Math.pow(10, 33);
	ORank = Math.pow(10, 32);
	BossLevel = Math.pow(10, 31);
	BossSomething = Math.pow(10, 30);
	BossIdk = Math.pow(10, 29)
	PRank = Math.pow(10, 28);
	Nation2Rank = Math.pow(10, 27);
	Nation1Rank = Math.pow(10, 26);
	NationRank = Math.pow(10, 25);
	QRank = Math.pow(10, 24);
	RankDOlater = Math.pow(10, 23);
	RankLater = Math.pow(10, 22);
	RankMountain = Math.pow(10, 21);
	Rrank = Math.pow(10, 20);
	unknownCreateLater = Math.pow(10, 19);
	Createlater = Math.pow(10, 18);
	StateRank = Math.pow(10, 17);
	TRank = Math.pow(10, 16);
	MiniBoss = Math.pow(10, 15);
	CreateLaterRank = Math.pow(10, 14);
	ZipCodeRank = Math.pow(10, 13);
	URank = Math.pow(10, 12);
	EnemyRank = Math.pow(10, 11)
	CityRank = Math.pow(10, 10);
	AreaRank = Math.pow(10, 9)
	VRank = Math.pow(10, 8);
	FOrrestRank = Math.pow(10, 7);
	RankLakeLevel = Math.pow(10, 6);
	TownRank = Math.pow(10, 5)
	WRank = Math.pow(10, 4);
	StreetLevel = Math.pow(10, 3);
	HouseLevel = Math.pow(10, 2);
	BaseLevel = Math.pow(10, 1);

	//Mechnics
	tfGravity = 0.05;
	tfGravitySpeed = 0;
	tfGravityBounce = 0.6;
	//////////////////////
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
			case "game.player":

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

					if (!TsunamiRadio.visualizerRunning) {
						TsunamiRadio.startVisualizerLoop();
					}
				}
				break;
			}
			default:
				console.error(`Unhandled event type: ${event.data.type}`);
		}
	}
}
self.onerror = async (e) => {
	try {
		const err = e?.error || e;
		self.postMessage(tycadome(
			"tycadome-guest" /*+ Date.now()*/,
			"error",
			"input.worker.error",
			{
				source: "web",
				target: "device:web-001",
				layer: "tf",
				worker: "input"
			},
			{
				status: "pending",
				priority: "low"
			},
			"async",
			{
				system: "Input Worker",
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