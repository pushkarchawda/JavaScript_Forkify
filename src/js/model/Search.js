import axios from 'axios';
import {key, corsProxy, url} from '../config';

export default class Search {

    constructor(query) {
        this.query = query;
    }

    async getSearchResult() {
        try {
            const response = await axios(`${corsProxy}${url}/api/search?key=${key}&q=${this.query}`);            
            this.result = response.data.recipes;
            console.log(response);
            console.log(this.result);
        }
        catch(error) {
            alert(`Something went wrong :(`);
            console.log(error);
        }
    };
}
