document.addEventListener("DOMContentLoaded", async () => {
    window.parent.ControlMishuba.bindVidSystem();
    console.log("Iframe dom loaded");
    self.onmessage = async (event) => {

    }
    self.onmessageerror = (err) => {
        console.error("Error handling message in Community.js:", err);
    };
    self.onerror = (err) => {
        console.error("Error in Community.js:", err);
    }
    /*
            try {
                const newplaylistoptions = document.getElementById("liveplaylist");
                window.parent.ControlMishuba.newplaylistoptions = newplaylistoptions;
                if (window.parent.ControlMishuba.soundEngine.radioSchedule === null) {
                    for (let lilj = 0; lilj < window.parent.ControlMishuba.soundEngine.DefaultPlaylist.length; lilj++) {
                        const item = window.parent.ControlMishuba.soundEngine.DefaultPlaylist[lilj];
                        const option = document.createElement("option");
                        option.value = item;
                        newplaylistoptions.appendChild(option);
                    }
                } else {
                    for (let i = 0; i < window.parent.ControlMishuba.soundEngine.radioSchedule.length; i++) {
                        const item = window.parent.ControlMishuba.soundEngine.radioSchedule[i];
                        switch (subItem) {
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                            case 8:
                            case 9:
                            case 10:
                            case 12:
                            case 13:
                            case 14:
                            case 15:
                            case 16:
                            case 17:
                            case 18:
                            case 19:
                            case 20:
                            case 21:
                            case 22:
                            case 23:
                                for (let k = 0; k < item.length; k++) {
                                    const subolder = item[k];
                                    for (let l = 0; l < subolder.length; l++) {
                                        const subItem = subolder[l];
                                        const option = document.createElement("option");
                                        option.value = subItem;
                                        newplaylistoptions.appendChild(option);
                                    }
                                }
                                break;
                            default:
                                for (let j = 0; j < item.length; j++) {
                                    const subItem = item[j];
                                    const option = document.createElement("option");
                                    option.value = subItem;
                                    newplaylistoptions.appendChild(option);
                                }
                                break;
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            }
            */

});