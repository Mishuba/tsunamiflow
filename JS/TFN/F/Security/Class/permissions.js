export class PermissionsAPI {
    constructor() {
        this.supported = !!navigator.permissions;
        if (!this.supported) console.warn("Permissions API not supported in this browser.");
    }

    /**
     * Check permission status for a given name
     * @param {string} name - permission name (geolocation, camera, microphone, notifications, etc.)
     * @returns {Promise<string>} - "granted", "denied", "prompt"
     */
    async query(name) {
        if (!this.supported) return "unsupported";

        try {
            const status = await navigator.permissions.query({ name });
            return status.state;
        } catch (err) {
            console.error(`Failed to query permission "${name}":`, err);
            return "error";
        }
    }

    /**
     * Request permission for geolocation, camera, or microphone
     * @param {string} name - "geolocation" | "camera" | "microphone"
     * @returns {Promise<string>} - "granted", "denied", or "prompt"
     */
    async request(name) {
        if (!this.supported) return "unsupported";

        try {
            switch (name) {
                case "geolocation":
                    return new Promise((resolve) => {
                        navigator.geolocation.getCurrentPosition(
                            () => resolve("granted"),
                            (err) => {
                                if (err.code === 1) resolve("denied");
                                else resolve("prompt");
                            }
                        );
                    });
                case "camera":
                case "microphone":
                    const constraints = {};
                    if (name === "camera") constraints.video = true;
                    if (name === "microphone") constraints.audio = true;

                    try {
                        const stream = await navigator.mediaDevices.getUserMedia(constraints);
                        // Stop all tracks immediately after access granted
                        stream.getTracks().forEach(track => track.stop());
                        return "granted";
                    } catch (err) {
                        return "denied";
                    }
                case "notifications":
                    const result = await Notification.requestPermission();
                    return result;
                default:
                    console.warn(`Permission request for "${name}" not implemented.`);
                    return "unsupported";
            }
        } catch (err) {
            console.error(`Failed to request permission "${name}":`, err);
            return "error";
        }
    }

    /**
     * Watch for permission state changes
     * @param {string} name - permission name
     * @param {function} callback - function to call on state change
     * @returns {Promise<PermissionStatus|null>}
     */
    async watch(name, callback) {
        if (!this.supported) return null;

        try {
            const status = await navigator.permissions.query({ name });
            status.onchange = () => callback(status.state);
            return status;
        } catch (err) {
            console.error(`Failed to watch permission "${name}":`, err);
            return null;
        }
    }
}