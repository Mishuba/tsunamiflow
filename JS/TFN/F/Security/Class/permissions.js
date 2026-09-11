export class PermissionsAPI {
    constructor(options = {}) {
        this.supported = !!navigator.permissions;

        // External/custom handlers (your existing classes can be injected here)
        this.custom = options.custom || {};

        // 🔥 Core permission map
        this.map = {
            geolocation: {
                query: async () => {
                    if (!this.supported) return "unsupported";
                    try {
                        const res = await navigator.permissions.query({ name: "geolocation" });
                        return res.state;
                    } catch {
                        return "unsupported";
                    }
                },
                request: () => new Promise((resolve) => {
                    navigator.geolocation.getCurrentPosition(
                        () => resolve("granted"),
                        (err) => resolve(err.code === 1 ? "denied" : "prompt")
                    );
                })
            },

            notifications: {
                query: async () => {
                    if (!this.supported) return Notification.permission;
                    try {
                        const res = await navigator.permissions.query({ name: "notifications" });
                        return res.state;
                    } catch {
                        return Notification.permission;
                    }
                },
                request: async () => {
                    return await Notification.requestPermission();
                }
            },

            camera: {
                // ⚠️ query unreliable → fallback
                query: async () => "prompt",
                request: async () => {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                        stream.getTracks().forEach(t => t.stop());
                        return "granted";
                    } catch {
                        return "denied";
                    }
                }
            },

            microphone: {
                query: async () => "prompt",
                request: async () => {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        stream.getTracks().forEach(t => t.stop());
                        return "granted";
                    } catch {
                        return "denied";
                    }
                }
            },

            clipboard: {
                query: async () => {
                    if (!this.supported) return "unsupported";
                    try {
                        const res = await navigator.permissions.query({ name: "clipboard-read" });
                        return res.state;
                    } catch {
                        return "unsupported";
                    }
                },
                request: async () => {
                    try {
                        await navigator.clipboard.readText();
                        return "granted";
                    } catch {
                        return "denied";
                    }
                }
            }
        };

        // 🔥 Merge in custom permissions (your system)
        this.map = { ...this.map, ...this.custom };

        if (!this.supported) {
            console.warn("Permissions API not fully supported in this browser.");
        }
    }

    /* ========================= */
    /* ===== CORE METHODS ====== */
    /* ========================= */

    async query(name) {
        const perm = this.map[name];
        if (!perm || !perm.query) return "unsupported";

        try {
            return await perm.query();
        } catch (err) {
            console.error(`Query failed for "${name}"`, err);
            return "error";
        }
    }

    async request(name) {
        const perm = this.map[name];
        if (!perm || !perm.request) return "unsupported";

        try {
            return await perm.request();
        } catch (err) {
            console.error(`Request failed for "${name}"`, err);
            return "error";
        }
    }

    /* ========================= */
    /* ===== WATCH SUPPORT ===== */
    /* ========================= */

    async watch(name, callback) {
        if (!this.supported) return null;

        try {
            const status = await navigator.permissions.query({ name });
            status.onchange = () => callback(status.state);
            return status;
        } catch {
            return null;
        }
    }

    /* ========================= */
    /* ===== EXTEND SYSTEM ===== */
    /* ========================= */

    add(name, handlers) {
        this.map[name] = handlers;
    }
}