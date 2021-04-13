import {
    GET_FAVS_BY_USER,
    FAVS_LOADING
} from '../actions/types';

const initialState = {
    favs: null,
    loading: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_FAVS_BY_USER:
            return {
                ...state,
                favs: action.payload,
                loading: false
            };
        case FAVS_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    };
} 