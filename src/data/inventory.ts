class Inventory {
    private items: Item[] = [];

    constructor(startingItem: Item[] = []) {
        
        this.items = startingItem;
    }
    public getItems() {
        return this.items;
    }
}