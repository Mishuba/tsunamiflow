export class gameComponent {
    static AmountOfComponents = 0;
    constructor(SpriteNewWidth, SpriteNewHeight, color, SpritePlacementX, SpritePlacementY, type, SpriteStartClippinX, SpriteStartClippinY, SpriteClippedWidth, SpriteClippedHeight, SpriteTextSize, SpriteTextStyle, SpriteTextWidth, SpriteTextHeight, SpriteTextAlign, SpriteTextBaseline, SpriteTextDirection, SpriteLetterSpacing, SpriteFontKerning, SpriteFontStretch, SpriteFontVariantCaps, SpriteTextRendering, SpriteWordSpacing, SpriteTextSettings, SpriteDialog, SpriteState, battleBackground, firstname, lastname, nickname, PhysicalAbility, IntellectualAbility, SocialAbility, EmotionalAbility, ExistentialAbility, EnergeticAbility, MetaCognitiveAbility, headArmor, bodyArmor, armArmor, legArmor, weakAttack, strongAttack, specialAttack, mainSkill, evadeSkill, defenseSkill, knockbackSkill, rangeSkill, aoeSkill, buffSkill, debuffSkill, ultimateSkill) {
        gameComponent.AmountofComponents += 1;
        this.exist = true;
        this.width = SpriteNewWidth;
        this.height = SpriteNewHeight;
        this.speedX = 0;
        this.speedY = 0;
        this.spriteSpeed = 5;
        this.color = color;
        this.x = SpritePlacementX;
        this.y = SpritePlacementY;
        this.type = type;
        this.sx = SpriteStartClippinX;
        this.sy = SpriteStartClippinY;
        this.dw = SpriteClippedWidth;
        this.dh = SpriteClippedHeight;
        this.textSize = SpriteTextSize;
        this.textStyle = SpriteTextStyle;
        this.textWidth = SpriteTextWidth;
        this.textHeight = SpriteTextHeight;
        this.textAlign = SpriteTextAlign;
        this.textBaseline = SpriteTextBaseline;
        this.textDirection = SpriteTextDirection;
        this.letterSpacing = SpriteLetterSpacing;
        this.fontKerning = SpriteFontKerning;
        this.fontStretch = SpriteFontStretch;
        this.fontVariantCaps = SpriteFontVariantCaps;
        this.textRendering = SpriteTextRendering;
        this.wordSpacing = SpriteWordSpacing;
        this.textSettings = SpriteTextSettings;
        this.spriteDialog = SpriteDialog;
        this.spriteState = SpriteState;
        this.spriteAnimationArray = [];
        this.spriteStates = [
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
        this.spriteStatesFrames = {};
        this.spriteFrameInterval = 0;
        this.battleBackground = battleBackground;
        this.firstname = firstname;
        this.lastname = lastname;
        this.nickname = nickname;
        this.PhysicalAbility = PhysicalAbility;
        this.IntellectualAbility = IntellectualAbility;
        this.SocialAbility = SocialAbility;
        this.EmotionalAbility = EmotionalAbility;
        this.ExistentialAbility = ExistentialAbility;
        this.EnergeticAbility = EnergeticAbility;
        this.MetaCognitiveAbility = MetaCognitiveAbility;
        this.headArmor = headArmor;
        this.bodyArmor = bodyArmor;
        this.armArmor = armArmor;
        this.legArmor = legArmor;
        this.weakAttack = weakAttack;
        this.strongAttack = strongAttack;
        this.specialAttack = specialAttack;
        this.mainSkill = mainSkill;
        this.evadeSkill = evadeSkill;
        this.defenseSkill = defenseSkill;
        this.knockbackSkill = knockbackSkill;
        this.rangeSkill = rangeSkill;
        this.aoeSkill = aoeSkill;
        this.buffSkill = buffSkill;
        this.debuffSkill = debuffSkill;
        this.ultimateSkill = ultimateSkill;
    }
    static from(data) {
        return new gameComponent(data.width, data.height, data.speedX, data.speedY, data.spriteSpeed, data.color, data.x, data.y, data.type, data.sx, data.sy, data.dx, data.dh, data.textSize, data.textStyle, data.textWidth, data.textHeight, data.textAlign, data.textBaseline, data.textDirection, data.letterSpacing, data.fontKerning, data.fontStretch, data.fontVariantCaps, data.textRendering, data.wordSpacing, data.textSettings, data.spriteDialog, data.spriteState, data.spriteAnimationArray, data.spriteStates, data.spriteStatesFrames, data.spriteFrameInterval, data.battleBackground, data.firstname, data.lastname, data.nickname, data.PhysicalAbility, data.IntellectualAbility, data.SocialAbility, data.EmotionalAbility, data.ExistentialAbility, data.EnergeticAbility, data.MetaCognitiveAbility, data.headArmor, data.bodyArmor, data.armArmor, data.legArmor, data.weakAttack, data.strongAttack, data.specialAttack, data.mainSkill, data.evadeSkill, data.defenseSkill, data.knockbackSkill, data.rangeSkill, data.aoeSkill, data.buffSkill, data.debuffSkill, data.ultimateSkill);
    }
    toJSON() {
        return {
            width: this.width,
            height: this.height,
            speedX: this.speedX,
            speedY: this.speedY,
            spriteSpeed: this.spriteSpeed,
            color: this.color,
            x: this.x,
            y: this.y,
            type: this.type,
            sx: this.sx,
            sy: this.sy,
            dw: this.dw,
            dh: this.dh,
            textSize: this.textSize,
            textStyle: this.textStyle,
            textWidth: this.textWidth,
            textHeight: this.textHeight,
            textAlign: this.textAlign,
            textBaseline: this.textBaseline,
            textDirection: this.textDirection,
            letterSpacing: this.letterSpacing,
            fontKerning: this.fontKerning,
            fontStretch: this.fontStretch,
            fontVariantCaps: this.fontVariantCaps,
            textRendering: this.textRendering,
            wordSpacing: this.wordSpacing,
            textSettings: this.textSettings,
            spriteDialog: this.spriteDialog,
            spriteState: this.spriteState,
            spriteAnimationArray: this.spriteAnimationArray,
            spriteStates: this.spriteStates,
            spriteStatesFrames: this.spriteStatesFrames,
            spriteFrameInterval: this.spriteFrameInterval,
            battleBackground: this.battleBackground,
            firstName: this.firstname,
            lastName: this.lastname,
            nickName: this.nickname,
            PhysicalAbility: this.PhysicalAbility,
            IntellectualAbility: this.IntellectualAbility,
            SocialAbility: this.SocialAbility,
            EmotionalAbility: this.EmotionalAbility,
            ExistentialAbility: this.ExistentialAbility,
            EnergeticAbility: this.EnergeticAbility,
            MetaCognitiveAbility: this.MetaCognitiveAbility,
            headArmor: this.headArmor,
            bodyArmor: this.bodyArmor,
            armArmor: this.armArmor,
            legArmor: this.legArmor,
            weakAttack: this.weakAttack,
            strongAttack: this.strongAttack,
            specialAttack: this.specialAttack,
            mainSkill: this.mainSkill,
            evadeSkill: this.evadeSkill,
            defenseSkill: this.defenseSkill,
            knockbackSkill: this.knockbackSkill,
            rangeSkill: this.rangeSkill,
            aoeSkill: this.aoeSkill,
            buffSkill: this.buffSkill,
            debuffSkill: this.debuffSkill,
            ultimateSkill: this.ultimateSkill,
        }
    }
}