import {
    GET_NOTIFICATIONS,
    NOTIFICATIONS_LOADING
} from '../actions/types';

const initialState = {
    notifications: null,
    loading: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.payload,
                loading: false
            }
        case NOTIFICATIONS_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
} 