import uniqid from 'uniqid'
export default class List {

    constructor()
    {
        this.list = [];
    }

    addItem(count, unit, ingredient) {

        //Create a new object to hold above data
        const obj = {
            unique_id : uniqid(),
            count, 
            unit, 
            ingredient
        };
        //add new object to list array
        this.list.push(obj);

        //return new object
        return obj;
    }

    deleteItem(id) {

        //Get index of the id, which we want to delete
        const index = this.list.findIndex(el => el.unique_id === id);
        // [2,4,8] splice(1, 2) -> returns [4, 8], original array is [2]
        // [2,4,8] slice(1, 2) -> returns 4, original array is [2,4,8]
        this.list.splice(index, 1);
    }

    updateCount(id, newCount) {
        this.list.find(el => el.id === id).count = newCount;
    }

}