import {
    GETTING_USER,
    GOT_USER,
    FOLLOWED_USER,
    UNFOLLOWED_USER,
    GOT_FOLLOWED_ACCOUNTS,
    GOT_FOLLOWERS,
    GOT_LIKED_POSTS,
    UPDATED_USER,
    BLOCKED_USER,
    UNBLOCKED_USER,
    ADD_TO_FAVOURITE,
    REMOVE_FROM_FAVOURITES
} from '../actions/types';

const initialState = {
    user: null,
    accounts: null,
    loading: false,
    posts: null,
    image: null
};

export default function (state = initialState, action) {
    switch(action.type) {
        case GETTING_USER:
            return {
                ...state,
                loading: true
            };
        case FOLLOWED_USER:
        case UNFOLLOWED_USER:
        case GOT_USER:
        case BLOCKED_USER:
        case BLOCKED_USER:
        case ADD_TO_FAVOURITE:
        case REMOVE_FROM_FAVOURITES:
            return {
                ...state,
                loading: false,
                user: action.payload,
            };
        case GOT_FOLLOWED_ACCOUNTS:
        case GOT_FOLLOWERS:
            return {
                ...state,
                user: state.user,
                loading: false,
                accounts: action.payload
            }
        case GOT_LIKED_POSTS:
            return {
                ...state,
                user: state.user,
                loading: false,
                accounts: null,
                posts: action.payload
            }
        default:
            return state;
    }
}