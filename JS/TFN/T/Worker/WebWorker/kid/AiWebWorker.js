// Use relative import so the worker resolves when loaded as a module.
import { mediaWorker } from "./../../../Class/Elder/Adult/Teen/tfnation.js";

function postWorkerError(err) {
	try {
		const e = err?.error || err;
		self.postMessage({ type: "error", action: "worker.error", payload: { message: e?.message || String(e), filename: e?.fileName || null, lineno: e?.lineNumber || null, colno: e?.columnNumber || null, stack: e?.stack || null, detail: e } });
	} catch (postErr) {
		console.error("Failed to post worker error:", postErr);
	}
}

self.onerror = (e) => {
	postWorkerError(e);
};

try {
	console.log("AiWebWorker started");
} catch (err) {
	postWorkerError(err);
}
