import {
    GET_NOTIFICATIONS,
    NOTIFICATIONS_LOADING
} from './types';
import axios from 'axios';
import { returnErrors } from './errorActions';

export const getNotifications = (userId, likes, comments, tags, follows) => dispatch => {
    dispatch(setNotificationsLoading());
    axios.get(`${process.env.REACT_APP_API_URL}/api/notifications/${userId}`)
        .then(res => dispatch({
            type: GET_NOTIFICATIONS,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
};

export const createTagNotification = (commenterId, taggedUsername, writingId) => dispatch => {
    dispatch(setNotificationsLoading());
    axios.post(`${process.env.REACT_APP_API_URL}/api/notifications`, {
        sender_id: commenterId,
        username: taggedUsername,
        post_id: writingId,
        type: 'TAG'
    })
    .then(res => console.log(res))
    .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const setNotificationsLoading = () => {
    return {
        type: NOTIFICATIONS_LOADING
    };
};