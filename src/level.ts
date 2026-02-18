

console.log("on level screen")

class Level implements IScreen {
    private game: Game;
    private entities: Entity[];
    private gravity = 0.8;

    constructor(game: Game) {
        this.game = game;
        this.entities = [];

        // console.log("fw")
        this.entities.push(new Platform(
            createVector(0, height / 2), createVector(0, 0), createVector(width, 10)
        ));
        this.entities.push(new Player(
            createVector(width / 4, height /2), createVector(0, 0), createVector(50, 100)
        ));
    }
    update() {
        this.aplygravity();
        this.entities.forEach(entity => {
            entity.update();
        })
        this.checkColission(this.entities);
    }
    checkColission(entities: Entity[]) {
        let player!: Player;
        let plat!: Platform;
        
        for (const entity of entities) {
            if (entity instanceof Player) {
                player = entity
            }
            if (entity instanceof Platform) {
                plat = entity
            }
        }
        if (player && plat) {
            // if (player.ignorePlatform) return;
            
            const playerBottom = player.position.y + player.size.y;
            const platformTop = plat.position.y;
            // console.log(playerBottom, platformTop)
            if (playerBottom >= platformTop && player.position.y < platformTop) {
                // entities instanceof Player 
                // console.log("Rf");
                player.onCollision(plat);
            }
        }
    }
    
    draw() {
        background(0);
        this.entities.forEach(entity => {
            entity.draw();
        });
    }
    
    aplygravity(): void {
        this.entities.forEach(entity => {
            if (entity.isgravity) {
                entity.velocity.y += this.gravity;
            }
        })
    }
}