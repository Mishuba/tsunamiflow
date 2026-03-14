export let PhysicalAbility = [
    { name: "health", points: 1 },
    { name: "stamina", points: 1 },
    { name: "weight", points: 1 },
    { name: "strength", points: 1 },
    { name: "agility", points: 1 }
];

export let controllerMappings = {
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