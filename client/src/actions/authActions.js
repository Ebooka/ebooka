import axios from 'axios';
import { returnErrors } from './errorActions';
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    SEND_PASSWORD_EMAIL
} from './types';
import {setGettingUser} from "./userActions";

export const loadUser = () => (dispatch, getState) => {
    dispatch({ type: USER_LOADING });    
    axios.get('/api/auth/user', tokenConfig(getState))
        .then(res => {
            dispatch({ 
                type: USER_LOADED,
                payload: res.data
            });
            }
        )
        .catch(error => {
            dispatch(returnErrors(error.response.data, error.response.status));
            dispatch({
                type: AUTH_ERROR
            });
        });
};

export const registerUser = (user) => dispatch => {
    dispatch({type: USER_LOADING});
    axios.post('/api/users', user)
        .then(res => 
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            })
        )
        .catch(error => {
            dispatch(returnErrors(error.response.data, error.response.status, 'REGISTER_FAIL'));
            dispatch({
                type: REGISTER_FAIL
            });
        });
}

export const logout = () => dispatch => {
    dispatch({ type: LOGOUT_SUCCESS });
    window.location.reload();
};

export const login = (data) => dispatch => {
    axios.post('/api/auth/user', data)
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });
            window.location.reload();
        })
        .catch(error => {
            dispatch(returnErrors(error.response.data, error.response.status, 'LOGIN_FAIL'));
            dispatch({
                type: LOGIN_FAIL
            });
        });
};


export const sendPasswordEmail = email => dispatch => {
    const body = {
        email: email
    };
    axios.post('/api/auth/user/password', body)
        .then(res => {
            dispatch({
                type: SEND_PASSWORD_EMAIL,
                payload: res.data
            })
        });
}

export const tokenConfig = getState => {
    const token = getState().auth.token;
    const username = getState().auth.username;
    const config = {
        headers: {
            'Content-type':'application/json'
        }
    };
    if(token) {
        config.headers['x-auth-token'] = token;
        config.headers['x-auth-username'] = username;
    }
    return config;
};
