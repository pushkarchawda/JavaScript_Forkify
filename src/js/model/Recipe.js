import axios from 'axios';
import {key, corsProxy, url} from '../config';

export default class Recipe {

    constructor(recipe_id) {
        this.recipe_id = recipe_id;
    }

    async getRecipe() {
        try  {
            const response = await axios(`${corsProxy}${url}/api/get?key=${key}&rId=${this.recipe_id}`);            
            //this.result = response.data.recipe;
            //console.log(response);
            this.f2f_url = response.data.recipe.f2f_url;
            this.image_url = response.data.recipe.image_url;
            this.ingredients = response.data.recipe.ingredients;
            this.publisher = response.data.recipe.publisher;
            this.publisher_url = response.data.recipe.publisher_url;            
            this.social_rank = response.data.recipe.social_rank;
            this.source_url = response.data.recipe.source_url;
            this.title = response.data.recipe.title;             
        }
        catch(error) {
            alert(`Something went wrong :(`);
            console.log(error);
        }
    };

    getServings() {
        this.servings = 4;
    }

    getCookingTime()
    {
        //Assuming we need 15 mins for each 3 ingredients
        const periods = Math.ceil(this.ingredients.length / 3);
        this.time = periods * 15;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        
        const newIngredients = this.ingredients.map(el => {
            
            //Standardize units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, units[i]);
            }); 
            
            //Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //Parse ingredients unit
            const arr = ingredient.split(' ');           

            //console.log(arr.findIndex([false, true, false]));

            const unitIndex = arr.findIndex(el2 => {
                //console.log(units.includes(el2));
                return units.includes(el2)                
            });

            //console.log(unitIndex);

            let obj;

            if(unitIndex > -1) {

                const arrCount = arr.slice(0, unitIndex);
                let count ;
                if (arrCount.length === 1) {
                    count = eval(arr[0].replace('-', '+'));
                } else {                    
                    count = eval(arr.slice(0, unitIndex).join('+'));
                }

                obj = {
                    unit: arr[unitIndex],
                    count,                    
                    ingredient: arr.slice(unitIndex + 1).join(' ')
                };
            }
            else if(parseInt(arr[0], 10)) {
                // There is NO unit, but 1st element is number
                obj = {
                    unit : '',
                    count : parseInt(arr[0], 10),
                    ingredient : arr.slice(1).join(' ')
                }
            }
            else if(unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                obj = {
                    unit: '',
                    count: 1,
                    ingredient
                }
            }
            return obj;
        });

        this.ingredients = newIngredients;
        //console.log(newIngredients);
    }

    updateServing(type) {
        
        const newServing = type === 'dec' ? this.servings - 1 : this.servings + 1;
        
        this.ingredients.forEach(el => {
            el.count *= (newServing / this.servings)
        });

        this.servings = newServing;
        
    }

}