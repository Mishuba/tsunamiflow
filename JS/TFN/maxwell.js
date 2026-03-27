export class maxwell {
    permissionengine = null;
    soundengine = null;
    audioTitle = null;
    audioSystem = null;
    audioLast = null;
    audioRestart = null;
    audioStart = null;
    audioSkip = null;
    mediaBin = {
        webcams: {},
        videos: {},
        images: {},
        screens: {}
    };
    constructor(option = {}) {
        if (option.permission) {
            this.permissionengine = option.permission;
        }
        if (option.sound) {
            this.soundengine = option.sound;
        }
        if (option.AudioTitle) {
            this.audioTitle = option.AudioTitle;
        }
        if (option.AudioButtonSpot) {
            this.audioSystem = option.AudioButtonSpot;
        }
        if (option.AudioPrevious) {
            this.audioLast = option.AudioPrevious;
        }
        if (option.AudioOver) {
            this.audioRestart = option.AudioOver;
        }
        if (option.AudioStart) {
            this.audioStart = option.AudioStart;
        }
        if (option.AudioSkip) {
            this.audioSkip = option.AudioSkip;
        }
    }

    bindPayments() {

    }

    async addVideoToBin(file) {
        const id = crypto.randomUUID();
        const url = URL.createObjectURL(file);

        this.mediaBin.videos[id] = {
            id,
            type: "video",
            url,
            created: Date.now()
        };

        return id;
    }

    async playFromBin(id) {
        const item = this.mediaBin.videos[id];
        if (!item) return;
        await this.startMediaSource("video", item.url);
    }

    removeFromBin(id) {
        const item = this.mediaBin.videos[id];
        if (!item) return;

        URL.revokeObjectURL(item.url);
        delete this.mediaBin.videos[id];
    }

    listBinVideos() {
        return Object.values(this.mediaBin.videos)
            .sort((a, b) => b.created - a.created);
    }

    async bindStore() {

    }

    bindAudio() {
        this.soundengine.RadioReady(this.audioTitle, this.audioSystem, this.audioLast, this.audioRestart, this.audioStart, this.audioSkip);
        this.soundengine.RadioEventListeners();
    }
}