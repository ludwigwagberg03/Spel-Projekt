/// <reference path="entity.ts" />

class Player extends entity {
    private onGround: boolean = false;
    private onPlatform: boolean = false;
    private isFalling: boolean = false;
    private attackHitBox: {
        position: p5.Vector;
        width: number;
        hight: number;
    };
    private isPlayerFacingRight: boolean = true;
    private enimies: entity[] = [];
    private swordSwipeTimer: number = 500;

    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector, h: number) {
        super(p, v, s, h, true);
        this.attackHitBox = {
            position: p.copy(),
            width: 100,
            hight: 50,
        }
    }

    public setEnimies(entities: entity[]){
        this.enimies = entities;
    }

    public onCollision(other: entity): void {
        if (other instanceof Platform) {
            this.handlePlatformLanding(other);
        }
        if (other instanceof enemy) {
            this.entityDamage(10);
        }
    }
    private handlePlatformLanding(other: entity) {
        if (this.isFalling) return;

        const platformTop = other.getPosition().y;
        const isAbovePlatform = this.position.y + this.size.y - this.velocity.y <= platformTop;

        const freeFall = this.velocity.y > 0;

        if (freeFall && isAbovePlatform) {
            this.position.y = platformTop - this.size.y;
            this.velocity.y = 0;

            this.onGround = true;
            this.onPlatform = true;
            this.isFalling = false;
        }
    }

    private takedamage(n: number): void { }

    public update(gravity: number, worldWidth: number) {
        if (this.swordSwipeTimer < 500) {
            this.swordSwipeTimer -= deltaTime
            console.log(this.swordSwipeTimer);
        }
        if (this.swordSwipeTimer < 0) {
            this.swordSwipeTimer = 500
            console.log(this.swordSwipeTimer);
        }
        this.move();
        super.update(gravity, worldWidth);
        this.updatePosition(worldWidth);
        this.updateAttackHitBox();
    }

    draw() {
        super.draw();

        rect(this.attackHitBox.position.x, this.attackHitBox.position.y, this.attackHitBox.width, this.attackHitBox.hight)
    }

    private updatePosition(worldWidth: number) {

        // player is on the ground 
        this.checkIfPlayerIsOnGround();

        if (this.position.x >= worldWidth - this.size.x) {
            this.velocity.x = 0;
            this.position.x = worldWidth - this.size.x;
            this.onGround = true;
            this.isFalling = false;
        }
        if (this.position.x < 0) {
            this.velocity.x = 0;
            this.position.x = 0;
            this.onGround = true;
            this.isFalling = false;
        }
    }

    private checkIfPlayerIsOnGround() {
        if (this.position.y > height - this.size.y) {
            this.velocity.y = 0;
            this.position.y = height - this.size.y;
            this.onGround = true;
            this.onPlatform = false;
            this.isFalling = false;
        }
    }

    private updateAttackHitBox(){
        if(this.isPlayerFacingRight === true){
            this.attackHitBox.position.x = this.position.x;
            this.attackHitBox.position.y = this.position.y;
        } else {
            this.attackHitBox.position.x = this.position.x - this.size.x;
            this.attackHitBox.position.y = this.position.y;
        }
        
    }

    private swordAttack(enemies: entity[]){
        if (this.swordSwipeTimer === 500){
            for (let e of enemies) {
            if (e instanceof enemy){
                const enemyX = e.getPosition().x;
                const enemyY = e.getPosition().y;
                const enemyWidth = e.getSize().x;
                const enemyHight = e.getSize().y;

                const attackX = this.attackHitBox.position.x;
                const attackY = this.attackHitBox.position.y;
                const attackWidth = this.attackHitBox.width;
                const attackHight = this.attackHitBox.hight;
                const hit = attackX < enemyX + enemyWidth && attackX + attackWidth > enemyX && attackY < enemyY + enemyHight && attackY + attackHight > enemyY;

                if (hit){
                    console.log("hit");
                    e.entityDamage(15);
                    this.swordSwipeTimer -= deltaTime;
                }
                }
            }
        }
        
    }

    private move() {
        this.velocity.x = 0;

        if (keyIsDown(65)) { // a
            this.velocity.x = -5;
            this.isPlayerFacingRight = false;
        }
        if (keyIsDown(68)) { // d
            this.velocity.x = 5;
            this.isPlayerFacingRight = true;
        }
        if (keyIsDown(83) && this.onPlatform) { // s
            this.velocity.y = 0.8;
            this.onGround = false;
            this.onPlatform = false;
            this.isFalling = true;
        }
        if (keyIsDown(32)) { // space
            this.jump();
        }
        if (keyIsDown(69)) { // E
            this.swordAttack(this.enimies);
        }
    }
    private jump() {
        if (this.onGround) {
            this.velocity.y = -30;
            this.onGround = false;
            this.onPlatform = false;
        }
    }

    // public overlaps(other: Entity) {
    //     if (other instanceof Platform) {
    //         // Speciell lösning
    //     } else {
    //         super.overlaps(other);
    //     }
    // }
}
