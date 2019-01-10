
export default class Likes {

    constructor() {
        this.likes = [];
    }

    addNewLike(id, title, author, image) {

        //Create new object which store data from parameter
        const obj = {id, title, author, image};

        //insert newly created object to likes array
        this.likes.push(obj);

        // Perist data in localStorage
        this.persistData();
        
        return obj;

    }

    deleteLike(id) {

        //Get the index of the like id passed in parameter from likes array
        const index = this.likes.findIndex(el => el.id === id);

        //delete the above obj from likes array using splice method
        this.likes.splice(index, 1);

        // Perist data in localStorage
        this.persistData();
    }

    isLiked(id) {

        //return if, id passed in parameter present in likes array
        return this.likes.findIndex(el => el.id === id) !== -1;

    }

    numberOfLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        
        // Restoring likes from the localStorage
        if (storage) this.likes = storage;
    }
}