

export const elements = {    
    searchInput : document.querySelector('.search__field'),
    searchButton : document.querySelector('.search'),
    searchResultList : document.querySelector('.results__list'),
    searchResult : document.querySelector('.results'),
    searchResultPages : document.querySelector('.results__pages'),
    recipe : document.querySelector('.recipe'),
    recipeIngredientList : document.querySelector('.recipe__ingredient-list'),
    likeMenu : document.querySelector('.likes__field'),
    likeList : document.querySelector('.likes__list'),
    shoppingList : document.querySelector('.shopping__list'),
    shopping : document.querySelector('.shopping')
};

export const elementString = {    
    loader : 'loader',    
};

export const renderLoader = (parent) => {
    const MarkUp = `
        <div class="${elementString.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin', MarkUp);
}

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementString.loader}`);
    //console.log(loader.parentElement);
    loader.parentElement.removeChild(loader);
}