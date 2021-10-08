import {
    GET_DRAFTS_BY_USER,
    ADD_DRAFT,
    DRAFTS_LOADING,
    GET_DRAFTS_PREVIEW,
    GET_DRAFT,
    EDIT_DRAFT,
    DELETE_DRAFT,
    GETTING_DRAFT_REQUEST,
    GETTING_DRAFT_RESPONSE,
    GETTING_DRAFT_ERROR, SET_CURRENT_DRAFT
} from '../actions/types';

const initialState = {
    drafts: null,
    loading: false,
    currentDraft: null,
    error: false,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_CURRENT_DRAFT:
            return {
                ...state,
                currentDraft: action.data,
            };
        case GETTING_DRAFT_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GETTING_DRAFT_RESPONSE:
            return {
                ...state,
                currentDraft: action.payload,
                loading: false,
            };
        case GETTING_DRAFT_ERROR:
            return {
                ...state,
                loading: false,
                error: true,
            };
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
    }
} 