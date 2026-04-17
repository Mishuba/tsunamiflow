export class base {
    Arraybuffer = null;
    ArraybyteLength = 0;
    Arrayview = null;
    ArrayonReady = null;
    blob = null;
    blobtype = "application/octet-stream"; // default MIME type
    blobonReady = null;
    blobobjectURL = null;
    ArrayonReady = onReady;
constructor(options = {}) {

}

    async tycadome(id, type, action, meta, state, mode, payload) {
        return {
            "id": id, //options.id
            "type": type, //command
            "action": action, // video.start
            "meta": meta,
            "timestamp": Math.floor(Date.now() / 1000),
            "state": state,
            "mode": mode, //"async"
            "payload": payload // {}
        };;
    }
}