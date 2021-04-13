import {
    SEARCHING,
    EXECUTING_QUERY
} from './types';
import axios from 'axios';
import { returnErrors } from './errorActions';


export const searchTerm = (term, filter) => dispatch => {
    dispatch(setSearchLoading());
    if(!filter) {
        axios.get(`/api/search/${term}`)
            .then(res => dispatch({
                type: EXECUTING_QUERY,
                payload: res.data
            }))
            .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
    } else {
        axios.get(`/api/search/${term}/${filter}`)
            .then(res => dispatch({
                type: EXECUTING_QUERY,
                payload: res.data
            }))
            .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
    }
};

export const setSearchLoading = () => {
    return {
        type: SEARCHING
    };
};