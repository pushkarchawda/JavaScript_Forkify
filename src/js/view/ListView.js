import { elements, elementString } from './base';

export const renderList = (ingredient) => {

    const markUp = `
    <li class="shopping__item" data-itemid = ${ingredient.unique_id}>
        <div class="shopping__count">
            <input type="number" value="${ingredient.count}" step="${ingredient.count}" class = "shopping__count-value">
            <p>${ingredient.unit}</p>
        </div>
        <p class="shopping__description">${ingredient.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>
    `;

    elements.shoppingList.insertAdjacentHTML('beforeend', markUp);

}

export const deleteIngredientsFromList = (id) => {

    //Get the particular DOM
    const dom = document.querySelector(`.shopping__item[data-itemid = ${id}]`);
    if(dom) dom.parentElement.removeChild(dom);

}