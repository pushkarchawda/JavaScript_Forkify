import { elements, elementString } from './base';
import { titleReducer } from './SearchView';

export const toggleLike = (isLiked) => {

    const str = isLiked ? 'icon-heart' : 'icon-heart-outlined';    

    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${str}`)

}

export const toggleLikeMenu = (numLikes) => {

    elements.likeMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';

}

export const renderLike = (recipe) => {
    const metadata = `
    <li>
        <a class="likes__link" href="#${recipe.id}">
            <figure class="likes__fig">
                <img src="${recipe.image}" alt="${recipe.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${titleReducer(recipe.title)}</h4>
                <p class="likes__author">${recipe.author}</p>
            </div>
        </a>
    </li>
    `;

    elements.likeList.insertAdjacentHTML('beforeend', metadata);
}

export const deleteLike = (id) => {
    console.log(id);
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if(el) el.parentElement.removeChild(el);
}