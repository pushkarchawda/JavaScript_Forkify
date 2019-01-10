import { elements, elementString } from './base';

export const getSearchInput = () => elements.searchInput.value;

export const clearSearchInput = () => {
    elements.searchInput.textContent = '';
};

export const clearSearchResultList = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
};

/*
// 'Pasta with tomato and spinach'
acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta', 'with']
acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', 'tomato']
acc: 18 / acc + cur.length = 24 / newTitle = ['Pasta', 'with', 'tomato']
*/

export const titleReducer = (title, limit = 17) => {
    let newTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        //console.log(`${newTitle} ...`);
        return `${newTitle}...`;
    }        
    return title;
};

const resultListMetaData = (result) =>  {

    const markUp = `
    <li>
        <a class="results__link" href="#${result.recipe_id}">
            <figure class="results__fig">
                <img src="${result.image_url}" alt="${result.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${titleReducer(result.title)}</h4>
                <p class="results__author">${result.publisher}</p>
            </div>
        </a>
    </li>`;  
    elements.searchResultList.insertAdjacentHTML('beforeend', markUp);
};

const createButton = (currPage, type) =>  `
    <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? currPage - 1 : currPage + 1}">
        <span>Page ${(type === 'prev') ? currPage - 1  : currPage + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${(type === 'prev') ? 'left' : 'right'}"></use>
        </svg>
    </button>
    `;


const selectButton = (currPage, resultLength, limitPerPage) => {

    const totalPages = Math.ceil(resultLength / limitPerPage);
    //console.log(button);
    let button;
    if(currPage === 1 && totalPages > 1) {
        button = createButton(currPage, 'next');
    }
    else if(currPage < totalPages) {
        button = `
            ${createButton(currPage, 'next')}
            ${createButton(currPage, 'prev')}
            `;
    }
    else if(currPage === totalPages && totalPages > 1) {
        button = createButton(currPage, 'prev');
    }
    //console.log(button);
    elements.searchResultPages.insertAdjacentHTML('afterbegin' ,button);

};

export const renderSearchResult = (results, currPage = 1, limitPerPage = 10) => {    
    let start = (currPage - 1) * limitPerPage , end = currPage * limitPerPage;
    results.slice(start, end).forEach(resultListMetaData);
    selectButton(currPage, results.length, limitPerPage);
};

export const highlightSelected = (id) => {

    //console.log(id);
    
    //get all dom with 'results__link--active' class
    const activeClass = Array.from(document.querySelectorAll('.results__link'));

    //loop over the above array to remove 'results__link--active' class from DOM
    activeClass.forEach(el => {
        el.classList.remove('results__link--active');
    });

    // add 'results__link--active' class to selected id passed in parameter
    const selectedHashID = document.querySelector(`.results__link[href*="${id}"]`);
    if(selectedHashID)
        selectedHashID.classList.add('results__link--active');

};