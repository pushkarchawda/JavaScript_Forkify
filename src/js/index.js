import Search from './model/Search';
import Recipe from './model/Recipe';
import Likes from './model/Likes';
import List from './model/List';
import * as SearchView from './view/SearchView';
import * as RecipeView from './view/RecipeView';
import * as LikeView from './view/LikeView';
import * as ListView from './view/ListView';
import { elements, renderLoader, clearLoader } from './view/base';


//Global State
const state = {};

// Search Controller

const searchController = async () => {    
    
    //Get input field from search input
    const query = SearchView.getSearchInput();  

    //Initialize search model
    let search;
    
    if(query) {

        //Intialize the Search Model with search query
        state.search = new Search(query);

        //Clear Old search result list
        SearchView.clearSearchResultList();

        //Display loader
        renderLoader(elements.searchResult);        

        try {

            //Make search api call to get desired result
            await state.search.getSearchResult();

            //clear the loader and already present search result in UI
            clearLoader();
            SearchView.clearSearchInput();

            //Render result in UI
            SearchView.renderSearchResult(state.search.result);
            //console.log(state.search.result);

        }
        catch(error) {
            alert(`Proble encounter while searching for \'${query}\', Something seems to be wrong with \'food2fork.com\' service :(`);
            console.log(error);
        }        

    }    

}

elements.searchButton.addEventListener('submit', (event) => {
    event.preventDefault();
    //console.log('check');
    searchController();
});

elements.searchResultPages.addEventListener('click', (e) => {

    const pageButton = e.target.closest('.btn-inline');
    
    if(pageButton) {
        //console.log(pageButton);

        //parseInt, second parameter 10 is for decimal notation
        const loadPage = parseInt(pageButton.dataset.goto, 10);        
        console.log(loadPage);
        SearchView.clearSearchResultList();
        SearchView.renderSearchResult(state.search.result, loadPage);
    }

});

// Recipe Controller

const recipeController = async () => {

    //Get the recipe_id from url with # property - ex : #87595
    const recipe_id = window.location.hash.replace('#', '');    

    if(recipe_id)
    {
        //Create a new recipe object and pass the recipe_id
        state.recipe = new Recipe(recipe_id);  
        
        //highlighte selected id in search view
        SearchView.highlightSelected(recipe_id);

        //clear the old recipe content if any and display the loader
        RecipeView.clearLoadedRecipe();
        renderLoader(elements.recipe);

        try {

            //call the getRecipe() method to fetch the recipe details
            await state.recipe.getRecipe();

            //Parse ingredients, used to standardize units and store measurement
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.getCookingTime();
            state.recipe.getServings();

            //clear the loader
            clearLoader();

            //Render the recipe from state varible
            console.log(state.likes.isLiked(recipe_id));
            RecipeView.renderRecipe(state.recipe, state.likes.isLiked(recipe_id));

        }       
        catch(error) {
            alert('Issue getting recipe details, \'food2fork.com\' service seems to be down :(');
            console.log(error);
        } 
    }

}

//Page Load steps
window.addEventListener('load', () => {

    //Initialize state.likes and state.list
    if(!state.likes) state.likes = new Likes();
    if(!state.list) state.list = new List();

    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    LikeView.toggleLikeMenu(state.likes.numberOfLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => LikeView.renderLike(like));    
});

//window.l;
//LikeView.toggleLikeMenu(state.likes.numberOfLikes());

//Shopping List Controller
const shoppingListController = () => {

    //Check if list is not present in state, initialize the same
    if(!state.list) state.list = new List();

    window.list = state.list;

    //add each ingredients to list and UI
    state.recipe.ingredients.forEach(el => {
        const ingredient = state.list.addItem(el.count, el.unit, el.ingredient);
        ListView.renderList(ingredient);
    });

}

//Likes Controller
const likeController = () => {

    if(!state.likes) state.likes = new Likes();
    window.l = state.likes;
    const cur_id = state.recipe.recipe_id;

    console.log(cur_id);

    if(!state.likes.isLiked(cur_id)) {

        //Add cur_id to likes
        const recipeObj = state.likes.addNewLike(
            state.recipe.recipe_id, 
            state.recipe.title, 
            state.recipe.publisher, 
            state.recipe.image_url); 
        
        //Toggle like button
        LikeView.toggleLike(true);


        //Render the like in LikeMenu by adding to UI list
        LikeView.renderLike(recipeObj);

    }
    else {

        //Remove the like from state
        state.likes.deleteLike(cur_id);

        //toggle like button
        LikeView.toggleLike(false);

        //Remove the like from UI list
        LikeView.deleteLike(cur_id);
    }

    LikeView.toggleLikeMenu(state.likes.numberOfLikes());

};


//window.addEventListener('hashchange', recipeController);
//window.addEventListener('load', recipeController);

//both above commented event can be handle in one line as below
['hashchange', 'load'].forEach(event => window.addEventListener(event, recipeController));

//Update serving button event
elements.recipe.addEventListener('click', (event) => {
    //console.log('teste' + event.target);
    if(event.target.matches('.btn-decrease, .btn-decrease *')) {
        //console.log('tested');
        if(state.recipe.servings > 1) {
            console.log('tested');
            state.recipe.updateServing('dec');
            RecipeView.updateIngredientsServings(state.recipe);

        }

    }
    else if(event.target.matches('.btn-increase, .btn-increase *')) {
        //console.log('testei');
        state.recipe.updateServing('inc');
        RecipeView.updateIngredientsServings(state.recipe);

    }
    else if(event.target.matches('.recipe__love, .recipe__love *')) {
        console.log('check');
        likeController();

    }
    else if(event.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        console.log('list')
        shoppingListController();
    }

});

elements.shoppingList.addEventListener('click', event => {
    
    //get the ingredient id where the click happened
    console.log(event.target.closest('.shopping__item'));
    const id = event.target.closest('.shopping__item').dataset.itemid;
    console.log('data set itemId' + id);
    
    if(event.target.matches('.shopping__delete, .shopping__delete *')) {
        console.log('ddelete');
        //delete the id from state list and UI shopping list
        state.list.deleteItem(id);
        ListView.deleteIngredientsFromList(id);

    }
    else if(event.target.matches('.shopping__count, .shopping__count *')) {
        console.log('data step');
        const value = parseFloat(event.targer.value, 10);
        state.list.updateCount(id, value);
    }


});