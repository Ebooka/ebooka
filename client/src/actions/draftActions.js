import {
    GET_DRAFTS_BY_USER,
    ADD_DRAFT,
    GET_DRAFT,
    DRAFTS_LOADING,
    EDIT_DRAFT,
    GET_DRAFTS_PREVIEW, GETTING_DRAFT_REQUEST, GETTING_DRAFT_RESPONSE, GETTING_DRAFT_ERROR, SET_CURRENT_DRAFT
} from './types';
import axios from 'axios';
import { returnErrors } from './errorActions';

export const addDraft = (draft, chaptersArray) => async dispatch => {
    dispatch(setDraftsLoading());
    await axios.post('/api/drafts', draft)
        .then(async res => {
            const id = res.data.id;
            if(draft.genre === 'Novela')
                return await addDraftChapters(chaptersArray, id);
        })
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
};

export const addDraftChapters = async (chaptersArray, draftId) => {
    chaptersArray.map(chapter => {
        axios.post('/api/drafts/chapters', {
            body: chapter,
            draft_id: draftId
        })
        .then(res => {return true;})
        .catch(error => {return false;});
    });
};

export const getDraftsByUser = (id) => dispatch => {
    dispatch(setDraftsLoading());
    axios.get('/api/drafts', id)
        .then(res => dispatch({
            type: GET_DRAFTS_BY_USER,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
};

export const getDraftsPreview = (id) => dispatch => {
    dispatch(setDraftsLoading());
    axios.get(`/api/drafts/user/${id}`)
        .then(res => dispatch({
            type: GET_DRAFTS_PREVIEW,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const editDraft = (draft, chapters, id) => async dispatch => {
    dispatch(setDraftsLoading());
    await axios.put(`/api/drafts/edit/${id}`, draft)
        .then(async res => {
            dispatch({
                type: EDIT_DRAFT,
                payload: res.data
            });
            if(draft.genre === 'Novela')
                return await addDraftChapters(chapters, id);
        })
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const getDraft = (id) => dispatch => {
    dispatch(setDraftsLoading());
    axios.get(`/api/drafts/${id}`, id)
        .then(res => dispatch({
            type: GET_DRAFT,
            payload: res.data

        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
};

export const getDraftCorrect = (id) => dispatch => {
    dispatch({ type: GETTING_DRAFT_REQUEST });
    axios.get(`/api/drafts/${id}`)
        .then(res => dispatch({
            type: GETTING_DRAFT_RESPONSE,
            payload: res.data
        }))
        .catch(err => dispatch({ type: GETTING_DRAFT_ERROR, err }))
}

export const setCurrentDraft = (data) => dispatch => {
    dispatch({ type: SET_CURRENT_DRAFT, data });
}

export const setDraftsLoading = () => {
    return {
        type: DRAFTS_LOADING
    };
};
