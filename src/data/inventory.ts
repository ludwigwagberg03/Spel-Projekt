class Inventory {
    private items: Item[] = [];

    constructor(startingItem: Item[] = []) {

        this.items = startingItem;

    }
    public getItems() {
        return this.items;
    }
    public addItem(item: Item) {
        this.items.push(item);
    }
    public hasItem(id: string) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].id === id) {
                return true;
            }
        }
        return false;
    }

}