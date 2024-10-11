class Sprite {
    constructor(config) {
        
        //Set up the image
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        //Set up the Shadow
        this.shadow = new Image();
        this.useShadow = true; //config.useShadow || false
        if (this.useShadow) {
            this.shadow.src = "/images/characters/shadow.png";
        }
        this.shadow.onload = () => {
            this.isShadowLoaded = true;
        }

        //Configure Animation & Initial State
        this.animations = config.animations || {
            //words in quotes are refered to as keys
            "idle-down": [ [0,0] ],
            "idle-right": [ [0,1] ],
            "idle-up": [ [0,2] ],
            "idle-left": [ [0,3] ],

            "walk-down": [ [1,0], [2,0], [3,0], [0,0] ],
            "walk-right": [ [1,1], [2,1], [3,1], [0,1] ],
            "walk-up": [ [1,2], [2,2], [3,2], [0,2] ],
            "walk-left": [ [1,3], [2,3], [3,3], [0,3] ],
        }
        this.currentAnimation = config.currentAnimation || "idle-down";
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 16; //How many gameloop frames we show a particular animation
        this.animationFrameProgress = this.animationFrameLimit;

        //Reference the game object
        this.gameObject = config.gameObject;
    }

    //Goes into animations. retrieves the currentAnimation (aka the animations key e.g. "idle-down") and the currentAnimationFrame (aka the array position for the given key e.g. 0)
    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame]
    }

    setAnimation(key) {
        if (this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgress() {
        //Downtick frame progress
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }

        //Reset the counter
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;

        if (this.frame === undefined) {
            this.currentAnimationFrame = 0;
        }
    }

    draw(ctx) {
        const x = this.gameObject.x - 8;
        const y = this.gameObject.y - 18;

        this.isShadowLoaded && ctx.drawImage(this.shadow, x, y)

        const [frameX, frameY] = this.frame

        this.isLoaded && ctx.drawImage(
            this.image, //image source variable
            frameX * 32, frameY * 32, //top left px from spritesheet
            32,32, //how many px right and down from spritesheet
            x,y, //starting position
            32,32 //rendered size
        )
        this.updateAnimationProgress();
    }

}