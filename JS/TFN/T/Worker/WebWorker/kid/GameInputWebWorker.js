
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