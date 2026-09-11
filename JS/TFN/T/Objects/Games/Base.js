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

export let spriteStates = [
            { name: "stand", frames: 2 },
            { name: "walk", frames: 2 },
            { name: "run", frames: 2 },
            { name: "jump", frames: 2 },
            { name: "double jump", frames: 2 },
            { name: "crouch", frames: 2 },
            { name: "crawl", frames: 2 },
            { name: "climb", frames: 2 },
            { name: "swim", frames: 2 },
            { name: "dive", frames: 2 },
            { name: "fly", frames: 2 },
            { name: "Cycle Through Items", frames: 2 },
            { name: "Pick Up", frames: 2 },
            { name: "World Interaction", frames: 2 },
            { name: "Use Item", frames: 2 },
            { name: "weak attack", frames: 2 },
            { name: "strong attack", frames: 2 },
            { name: "special attack", frames: 2 },
            { name: "main skill", frames: 2 },
            { name: "aoe skill", frames: 2 },
            { name: "range skill", frames: 2 },
            { name: "knockback skill", frames: 2 },
            { name: "evade skill", frames: 2 },
            { name: "defense skill", frames: 2 },
            { name: "buff skill", frames: 2 },
            { name: "debuff skill", frames: 2 },
            { name: "ultimate skill", frames: 2 },
            { name: "block", frames: 2 },
            { name: "parry", frames: 2 }
        ];