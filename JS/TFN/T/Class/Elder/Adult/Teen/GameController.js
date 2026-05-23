export class GameController extends TsDom {
    //Game Controllers
    controllerIndex = null;
    controllerType = null;
    gamepads = {};
    constructor(options = {}) {
        super(options);
        if (options.controllerMappings) {
            this.controllerMappings = options.controllerMappings;
        } else {
            this.controllerMappings = {
                playstation: {
                    up: "D-Pad Up", down: "D-Pad Down", left: "D-Pad Left", right: "D-Pad Right",
                    select: "touchpad", start: "Options Button", share: "Share Button",
                    action1: "Cross", action2: "Circle", action3: "Square", action4: "Triangle",
                    action5: "L1", action6: "R1", action7: "L2", action8: "R2", action9: "Left Analog Stick Button", action10: "Right Analog Stick Button", action11: "", action12: "",
                    leftStick: "Left Analog Stick", rightStick: "Right Analog Stick",
                },
                xbox: {
                    up: "D-Pad Up", down: "D-Pad Down", left: "D-Pad Left", right: "D-Pad Right",
                    select: "Menu Button", start: "View Button", action1: "A", action2: "B",
                    action3: "X", action4: "Y", leftStick: "Left Analog Stick", rightStick: "Right Analog Stick",
                },
                switch: {
                    up: "D-Pad Up", down: "D-Pad Down", left: "D-Pad Left", right: "D-Pad Right",
                    select: "- Button", start: "+ Button", action1: "B", action2: "A", action3: "Y", action4: "X",
                    leftStick: "Left Analog Stick", rightStick: "Right Analog Stick",
                }
            };
        }
        //window.addEventListener("gamepadconnected", (e) => this.onGamepadConnected(e));
    }
    everyInterval(n, frameNumber) {
        if ((frameNumber / n) % 1 == 0) {
            return true;
        } else {
            return false;
        }
    }
    getControllerType(gamepad) {
        // Detect controller type based on button layout
        if (gamepad.buttons[0].value === 1) {
            return 'playstation';
        } else if (gamepad.buttons[1].value === 1) {
            return 'xbox';
        } else if (gamepad.buttons[0].value === 1 && gamepad.buttons[3].value === 1) {
            return 'switch';
        } //else {return pcControls();}; 
    };
    gamepadHandler(event, connected) {
        const gamepad = event.gamepad;
        if (connected) {
            this.controllerIndex = gamepad.index;
            console.log("Controller connected at index:", controllerIndex);
            this.controllerType = this.getControllerType(gamepad);
            console.log("Controller type detected:", this.controllerType);
            gamepads[gamepad.index] = gamepad;
            console.log(`Gamepad connected: ${gamepad.id}`);
        } else {
            this.controllerIndex = null;
            this.controllerType = null;
            delete gamepads[gamepad.index];
            console.log(`Gamepad disconnected: ${gamepad.id}`);
        }
    }
    getButtonAction(buttonIndex, mappings) {
        switch (buttonIndex) {
            case 0: return mappings.action1; // A or Cross
            case 1: return mappings.action2; // B or Circle
            case 2: return mappings.action3; // X or Square
            case 3: return mappings.action4; // Y or Triangle
            case 8: return mappings.select;  // Select Button
            case 9: return mappings.start;   // Start Button
            case 12: return mappings.up;     // D-Pad Up
            case 13: return mappings.down;   // D-Pad Down
            case 14: return mappings.left;   // D-Pad Left
            case 15: return mappings.right;  // D-Pad Right
            case 16: return mappings.action5; // L1
            case 17: return mappings.action6; // R1
            case 18: return mappings.action7; // L2
            case 19: return mappings.action8; // R2
            case 20: return mappings.action9; // Left Analog Stick
            case 21: return mappings.action10; // Right Analog stick
            case 22: return mappings.action2 && mapping.action4; // Triangle and Circle
            case 23: return mappings.action1 && mappings.action3; //  Cross and square
            case 24: return mappings.action5 && mapping.action6; // L1 and R1
            case 25: return mappings.action2 && mapping.action1; // Cross and Circle
            case 26: return mappings.action7 && mapping.action8; // X or Square
        }
    }
}