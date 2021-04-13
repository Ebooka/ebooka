import {
    GET_DRAFTS_BY_USER,
    ADD_DRAFT,
    DRAFTS_LOADING,
    GET_DRAFTS_PREVIEW,
    GET_DRAFT,
    EDIT_DRAFT,
    DELETE_DRAFT
} from '../actions/types';

const initialState = {
    drafts: null,
    loading: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_DRAFTS_PREVIEW:
        case GET_DRAFTS_BY_USER:
        case GET_DRAFT:
        case DELETE_DRAFT:
            return {
                ...state,
                drafts: action.payload,
                loading: false
            };
        case ADD_DRAFT:
        case EDIT_DRAFT:
            return {
                ...state,
                drafts: action.payload
            };
        case DRAFTS_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    };
} 