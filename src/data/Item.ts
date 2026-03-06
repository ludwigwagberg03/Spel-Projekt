interface Item {
    id: string;
    name: string;
    type: "melee" | "ranged";
    damage: number;
    cooldown: number;

    image?: p5.Image;
    imageKey?: string;
    
    autoFire?: boolean;

    hitboxWidth?: number;
    hitboxHeight?: number;

    projectileSpeed?: number;
    projectileSize?: number;

    price: number;
}