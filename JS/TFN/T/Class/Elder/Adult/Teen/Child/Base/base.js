export class base {

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