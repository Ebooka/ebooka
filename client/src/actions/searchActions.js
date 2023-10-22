import {
    SEARCHING,
    EXECUTING_QUERY
} from './types';
import axios from 'axios';
import { returnErrors } from './errorActions';


export const searchTerm = (term, filter) => dispatch => {
    dispatch(setSearchLoading());
    console.log(term);
    if(!filter) {
        axios.get(`${process.env.REACT_APP_API_URL}/api/search/${term}`)
            .then(res => dispatch({
                type: EXECUTING_QUERY,
                payload: res.data
            }))
            //.catch(error => {
            //    console.log(error);
            //    dispatch(returnErrors(error.response.data, error.response.status))
            //});
    } else {
        axios.get(`${process.env.REACT_APP_API_URL}/api/search/${term}/${filter}`)
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
