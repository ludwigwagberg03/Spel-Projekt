interface Item {
    id: string;
    name: string;
    type: "melee" | "ranged";
    damage: number;
    cooldown: number;

    autoFire?: boolean;

    hitboxWidth?: number;
    hitboxHeight?: number;

    projectileSpeed?: number;
    projectileSize?: number;

    price: number;
}