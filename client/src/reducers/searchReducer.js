import {
    SEARCHING,
    EXECUTING_QUERY
} from '../actions/types';

const initialState = {
    search: null,
    loading: false
};

export default function(state = initialState, action) {
    switch(action.type) {
        case EXECUTING_QUERY:
            return {
                ...state,
                search: action.payload,
                loading: false
            };
        case SEARCHING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    };
};