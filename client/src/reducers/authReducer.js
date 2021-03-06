import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    UPDATED_USER
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    isAuthenticated: false,
    isLoading: false,
    isAdmin: false,
    user: null
};

export default function (state = initialState, action) {
    switch(action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case USER_LOADED:
        case UPDATED_USER:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload,
                isAdmin: action.payload.role === 'admin'
            };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('username', action.payload.username);
            return {
                ...state,
                token: action.payload.token,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                isAdmin: action.payload.role === 'admin'
            };
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case REGISTER_FAIL:
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            return {
                ...state,
                token: null,
                username: null,
                isAuthenticated: false,
                isLoading: false,
                isAdmin: false,
                user: null
            };
        default:
            return state;
    }
}