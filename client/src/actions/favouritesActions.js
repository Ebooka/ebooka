import {
    GET_FAVS_BY_USER,
    FAVS_LOADING
} from './types';
import axios from 'axios';
import { returnErrors } from './errorActions';

export const getFavourites = (id) => dispatch => {
    dispatch(setFavouritesLoading());
    axios.get(`/api/favourites/${id}`)
        .then(res => dispatch({
            type: GET_FAVS_BY_USER,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
};

export const setFavouritesLoading = () => {
    return {
        type: FAVS_LOADING
    };
};