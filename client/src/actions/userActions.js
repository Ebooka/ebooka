import axios from 'axios';
import { returnErrors } from './errorActions';
import {
    GOT_USER,
    GETTING_USER,
    FOLLOWED_USER,
    UNFOLLOWED_USER,
    GOT_FOLLOWED_ACCOUNTS,
    GOT_FOLLOWERS,
    GOT_LIKED_POSTS,
    UPDATED_USER,
    BLOCKED_USER,
    UNBLOCKED_USER,
    ADD_TO_FAVOURITE,
    REMOVE_FROM_FAVOURITES,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    UPDATE_USER,
    FOLLOWED_USER_REQUEST,
    UNFOLLOWED_USER_REQUEST
} from './types';

export const getUser = (username) => dispatch => {
    dispatch(setGettingUser());
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/${username}`)
        .then(res => {
            dispatch({
                type: GOT_USER,
                payload: res.data
            });
        })
        .catch(error => console.log(error));
};

export const updateUser = (data, id) => dispatch => {
    dispatch({type: UPDATE_USER})
    axios.put(`${process.env.REACT_APP_API_URL}/api/users/update/${id}`, data)
        .then(res => {
            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: res.data
            });
        })
        .catch(error => dispatch(({type: UPDATE_USER_ERROR})));
}

export const follow = (followedId, username, followerId) => dispatch => {
    dispatch(setGettingUser());
    dispatch({type: FOLLOWED_USER_REQUEST, followedId});
    axios.put(`${process.env.REACT_APP_API_URL}/api/users/follow`, {
            username: username,
            followerId: followerId
        })
        .then(res => dispatch({
            type: FOLLOWED_USER,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
};

export const unfollow = (unfollowedId, username, unfollowerId) => dispatch => {
    dispatch(setGettingUser());
    dispatch({type: UNFOLLOWED_USER_REQUEST, unfollowedId});
    axios.put(`${process.env.REACT_APP_API_URL}/api/users/unfollow`, {
            username: username,
            unfollowerId: unfollowerId
        })
        .then(res => dispatch({
            type: UNFOLLOWED_USER,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
};

export const block = (userId, blockedId) => dispatch => {
    dispatch(setGettingUser());
    axios.put(`${process.env.REACT_APP_API_URL}/api/users/block`, {
            userId: userId,
            blockedId: blockedId
        })
        .then(res => dispatch({
            type: BLOCKED_USER,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const unblock = (userId, blockedId) => dispatch => {
    dispatch(setGettingUser());
    axios.put(`${process.env.REACT_APP_API_URL}/api/users/unblock`, {
            userId: userId,
            blockedId: blockedId
        })
        .then(res => dispatch({
            type: UNBLOCKED_USER,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const addToFavourites = (userId, writingId) => dispatch => {
    dispatch(setGettingUser());
    axios.put(`${process.env.REACT_APP_API_URL}/api/users/favourites`, {
            user_id: userId,
            writing_id: writingId
        })
        .then(res => dispatch({
            type: ADD_TO_FAVOURITE,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const removeFromFavourites = (userId, writingId) => dispatch => {
    dispatch(setGettingUser());
    axios.put(`${process.env.REACT_APP_API_URL}/api/users/remove-favourite`, {
            user_id: userId,
            writing_id: writingId
        })
        .then(res => dispatch({
            type: REMOVE_FROM_FAVOURITES,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const getFollowedAccountsById = (userId) => dispatch => {
    dispatch(setGettingUser());
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/followed_accounts/${userId}`)
        .then(res => {
            dispatch({
                type: GOT_FOLLOWED_ACCOUNTS,
                payload: res.data
            });
        })
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const getLikedPosts = (userId) => dispatch => {
    dispatch(setGettingUser());
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/liked_posts/${userId}`)
        .then(res => {
            dispatch({
                type: GOT_LIKED_POSTS,
                payload: res.data
            });
        })
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const getFollowedAccountsByUsername = (username) => dispatch => {
    dispatch(setGettingUser());
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/followed_accounts_by_username/${username}`)
        .then(res => {
            dispatch({
                type: GOT_FOLLOWED_ACCOUNTS,
                payload: res.data
            });
        })
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const getFollowersById = (userId) => dispatch => {
    dispatch(setGettingUser());
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/followers/${userId}`)
        .then(res => {
            dispatch({
                type: GOT_FOLLOWERS,
                payload: res.data
            });
        })
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const getFollowersByUsername = (username) => dispatch => {
    dispatch(setGettingUser());
    axios.get(`${process.env.REACT_APP_API_URL}/api/users/followers_by_username/${username}`)
        .then(res => {
            dispatch({
                type: GOT_FOLLOWERS,
                payload: res.data
            });
        })
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const setGettingUser = () => {
    return {
        type: GETTING_USER
    };
};

