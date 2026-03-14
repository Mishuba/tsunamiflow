export class TfClipboard {

    constructor({
        autoPermission = false
    } = {}) {

        this.supported = !!navigator.clipboard;

        this.autoPermission = autoPermission;

        this.listeners = {};

        this.lastText = null;
        this.lastItems = null;

        if (!this.supported) {
            console.warn("Clipboard API not supported");
        }
    }

    /* ----------------------------
       Permission
    ----------------------------*/

    async getPermission() {

        if (!navigator.permissions) return null;

        try {

            const result = await navigator.permissions.query({
                name: "clipboard-read"
            });

            return result.state;

        } catch (err) {
            return null;
        }
    }

    /* ----------------------------
       Write Text
    ----------------------------*/

    async writeText(text) {

        if (!this.supported) return;

        try {

            await navigator.clipboard.writeText(text);

            this.lastText = text;

            this.emit("writeText", text);

        } catch (err) {

            console.error("Clipboard writeText failed:", err);
            this.emit("error", err);
        }
    }

    /* ----------------------------
       Read Text
    ----------------------------*/

    async readText() {

        if (!this.supported) return null;

        try {

            const text = await navigator.clipboard.readText();

            this.lastText = text;

            this.emit("readText", text);

            return text;

        } catch (err) {

            console.error("Clipboard readText failed:", err);
            this.emit("error", err);

            return null;
        }
    }

    /* ----------------------------
       Write Clipboard Items
    ----------------------------*/

    async writeItems(items) {

        if (!this.supported) return;

        try {

            await navigator.clipboard.write(items);

            this.lastItems = items;

            this.emit("writeItems", items);

        } catch (err) {

            console.error("Clipboard writeItems failed:", err);
            this.emit("error", err);
        }
    }

    /* ----------------------------
       Read Clipboard Items
    ----------------------------*/

    async readItems() {

        if (!this.supported) return [];

        try {

            const items = await navigator.clipboard.read();

            this.lastItems = items;

            this.emit("readItems", items);

            return items;

        } catch (err) {

            console.error("Clipboard readItems failed:", err);
            this.emit("error", err);

            return [];
        }
    }

    /* ----------------------------
       Write Image
    ----------------------------*/

    async writeImage(blob) {

        if (!this.supported) return;

        try {

            const item = new ClipboardItem({
                [blob.type]: blob
            });

            await navigator.clipboard.write([item]);

            this.emit("writeImage", blob);

        } catch (err) {

            console.error("Clipboard writeImage failed:", err);
            this.emit("error", err);
        }
    }

    /* ----------------------------
       Read Image
    ----------------------------*/

    async readImage() {

        const items = await this.readItems();

        for (const item of items) {

            for (const type of item.types) {

                if (type.startsWith("image/")) {

                    const blob = await item.getType(type);

                    this.emit("readImage", blob);

                    return blob;
                }
            }
        }

        return null;
    }

    /* ----------------------------
       Legacy Copy Fallback
    ----------------------------*/

    copyFallback(text) {

        const textarea = document.createElement("textarea");

        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";

        document.body.appendChild(textarea);

        textarea.select();
        document.execCommand("copy");

        document.body.removeChild(textarea);

        this.emit("copyFallback", text);
    }

    /* ----------------------------
       Event System
    ----------------------------*/

    on(event, fn) {

        if (!this.listeners[event])
            this.listeners[event] = [];

        this.listeners[event].push(fn);
    }

    emit(event, data) {

        (this.listeners[event] || [])
            .forEach(fn => fn(data));
    }

    /* ----------------------------
       Debug
    ----------------------------*/

    toJson() {

        return {

            supported: this.supported,

            lastText: this.lastText,

            hasItems: !!this.lastItems
        };
    }

}