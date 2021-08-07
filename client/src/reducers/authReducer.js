import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    UPDATED_USER,
    SEND_PASSWORD_EMAIL,
    SEND_PASSWORD_EMAIL_SUCCESS,
    SEND_PASSWORD_EMAIL_ERROR
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    isAuthenticated: false,
    isLoading: false,
    isAdmin: false,
    user: null,
    message: '',
    sendingEmailError: false
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
        case REGISTER_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                isLoading: false,
                message: '¡Registración exitosa! Revisá tu correo para verificar la cuenta.',
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
        case SEND_PASSWORD_EMAIL:
            return {
                ...state,
                isLoading: true,
            }
        case SEND_PASSWORD_EMAIL_SUCCESS:
            return {
                ...state,
                isLoading: false,
            }
        case SEND_PASSWORD_EMAIL_ERROR:
            return {
                ...state,
                isLoading: false,
                sendingEmailError: true
            }
        default:
            return state;
    }
}
