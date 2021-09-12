import {
    GET_WRITINGS,
    ADD_WRITING,
    WRITINGS_LOADING,
    GET_WRITING,
    LIKED_WRITING,
    LIKED_WRITING_REQUEST,
    UNLIKED_WRITING,
    GET_WRITINGS_PREVIEW,
    DELETE_DRAFT,
    COMMENTED_WRITING,
    GET_WRITINGS_BY_USERNAME,
    DELETE_WRITING,
    ADD_VIEWER,
    ADD_ANON_VIEWER,
    LIKED_COMMENT,
    UNLIKED_COMMENT,
    RESPONDED_COMMENT,
    DELETE_COMMENT,
    DELETE_COMMENT_SUCCESS,
    DELETE_COMMENT_ERROR,
    COMMENTED_WRITING_SUCCESS,
    COMMENTED_WRITING_ERROR,
    RESPONDED_COMMENT_REQUEST,
    RESPONDED_COMMENT_SUCCESS,
    RESPONDED_COMMENT_ERROR,
    GETTING_WRITING_LIKERS,
    GETTING_WRITING_LIKERS_SUCCESS,
    GETTING_WRITING_LIKERS_ERROR,
    GET_COMMENTS,
    GET_COMMENTS_SUCCESS,
    GET_COMMENTS_ERROR,
    GET_RESPONSES,
    GET_RESPONSES_SUCCESS,
    GET_RESPONSES_ERROR,
    SET_CURRENT_WRITING,
    GET_INDIVIDUAL_WRITING,
    GET_INDIVIDUAL_WRITING_SUCCESS,
    GET_INDIVIDUAL_WRITING_ERROR,
    EDIT_WRITING,
    EDIT_WRITING_SUCCESS,
    EDIT_WRITING_ERROR, UNLIKED_WRITING_REQUEST,
} from './types';
import axios from 'axios';
import { returnErrors } from './errorActions';

export const getWritings = (pageNumber) => dispatch => {
    dispatch(setWritingsLoading());
    axios.get(`/api/writings/page/${pageNumber}/`)
        .then(res => dispatch({
            type: GET_WRITINGS,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
};

export const getWritingsWithBlocked = (id, pageNumber) => dispatch => {
    dispatch(setWritingsLoading());
    axios.get(`/api/writings/block/${id}/page/${pageNumber}/`)
        .then(res => dispatch({
            type: GET_WRITINGS,
            payload: res.data
        }))
        //.catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
};

export const getWritingsWithFilters = (filters, pageNumber) => dispatch => {
    dispatch(setWritingsLoading());
    axios.get(`/api/writings/filter/${filters}/page/${pageNumber}/`)
        .then(res => dispatch({
            type: GET_WRITINGS,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const getWritingsWithFiltersAndBlocked = (filters, id, pageNumber) => dispatch => {
    dispatch(setWritingsLoading());
    axios.get(`/api/writings/filter/block/${id}/${filters}/page/${pageNumber}/`)
        .then(res => dispatch({
            type: GET_WRITINGS,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const addViewer = (viewerId, writingId) => dispatch => {
    dispatch(setWritingsLoading());
    axios.put(`/api/writings/viewer/${viewerId}/`, { writingId: writingId })
        .then(res => dispatch({
            type: ADD_VIEWER,
            payload: res.data
        }))
        .catch(error => returnErrors(error.response.data, error.response.status));
}

export const addAnonViewer = (viewerId, writingId) => dispatch => {
    dispatch(setWritingsLoading());
    axios.put(`/api/writings/anonViewer/${viewerId}/`, { writingId: writingId })
        .then(res => dispatch({
            type: ADD_ANON_VIEWER,
            payload: res.data
        }));
        //.catch(error => returnErrors(error.response.data, error.response.status));
}

export const deleteWriting = (id) => dispatch => {
    dispatch(setWritingsLoading());
    axios.delete(`/api/writings/${id}/`)
        .then(res => dispatch({
            type: DELETE_WRITING,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const getGenre = (genre) => dispatch => {
    dispatch(setWritingsLoading());
    axios.get(`/api/writings/genre/${genre}/`)
        .then(res => dispatch({
            type: GET_WRITINGS,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const getSubgenre = (subgenre) => dispatch => {
    dispatch(setWritingsLoading());
    axios.get(`/api/writings/subgenre/${subgenre}/`)
        .then(res => dispatch({
            type: GET_WRITINGS,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const editWriting = (writingId, data) => dispatch => {
    dispatch({type: EDIT_WRITING});
    axios.put(`/api/writings/${writingId}`, data)
        .then(res => dispatch({ type: EDIT_WRITING_SUCCESS }))
        .catch(err => dispatch({ type: EDIT_WRITING_ERROR }));
}

export const likeComment = (commentId, likerId, writingId) => dispatch => {
    dispatch(setWritingsLoading());
    axios.put('/api/writings/comment-like/', {
        writingId: writingId,
        likerId: likerId,
        commentId: commentId
    })
        .then(res => dispatch({
            type: LIKED_COMMENT,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const unlikeComment = (commentId, likerId, writingId) => dispatch => {
    dispatch(setWritingsLoading());
    axios.put('/api/writings/comment-unlike/', {
        writingId: writingId,
        likerId: likerId,
        commentId: commentId
    }).then(res => dispatch({
        type: UNLIKED_COMMENT,
        payload: res.data
    }))
    .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const likeWriting = (writingId, likerId) => dispatch => {
    dispatch(setWritingsLoading());
    dispatch({type: LIKED_WRITING_REQUEST});
    axios.put('/api/writings/like/', {
            writingId: writingId,
            likerId: likerId
        })
        .then(res => dispatch({
            type: LIKED_WRITING,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const unlikeWriting = (writingId, likerId) => dispatch => {
    dispatch(setWritingsLoading());
    dispatch({type: UNLIKED_WRITING_REQUEST})
    axios.put('/api/writings/unlike/', {
            writingId: writingId,
            likerId: likerId
        })
        .then(res => dispatch({
            type: UNLIKED_WRITING,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const saveComment = (writingId, content, commenter) => dispatch => {
    dispatch({type: COMMENTED_WRITING});
    axios.post('/api/writings/comment/', {
            writingId: writingId,
            commenterId: commenter.id,
            content: content
        })
        .then(res => dispatch({
            type: COMMENTED_WRITING_SUCCESS,
            payload: res.data,
            user: commenter,
            parents: [],
        }))
        .catch(error => {
            console.log(error)
            dispatch({
                type: COMMENTED_WRITING_ERROR,
            })
        });

}

export const saveResponse = (writingId, content, parentCommentId, commenter, parents) => async dispatch => {
    dispatch({type: RESPONDED_COMMENT_REQUEST});
    axios.post('/api/writings/response/', {
            writingId: writingId,
            content: content,
            parentCommentId: parentCommentId,
            commenterId: commenter.id,
        })
        .then(res => dispatch({
            type: RESPONDED_COMMENT_SUCCESS,
            payload: res.data,
            parents,
            user: commenter,
        }))
        .catch(error => dispatch({
            type: RESPONDED_COMMENT_ERROR,
        }));
}

export const addWriting = (writing, id, chaptersArray) => async dispatch => {
    dispatch(setWritingsLoading());
    if(id) {
        axios.delete(`/api/drafts/${id}/`)
            .then(res => {
                dispatch({
                    type: DELETE_DRAFT,
                    payload: res.data
                });
            })
            .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
    }
    await axios.post('/api/writings/', writing)
        .then(async (res) => {
                const id = res.data;
                if(writing.genre === 'Novela') {
                    return await addChapters(chaptersArray, id);
                }
            }
        )
        .catch(error => {
            dispatch(returnErrors(error.response.data, error.response.status))
        });
};

export const addChapters = async (chaptersArray, writingId) => {
    chaptersArray.map(chapter => {
        axios.post('/api/writings/chapters/', {
            body: chapter,
            writing_id: writingId
        })
            .then(res => { return true; })
            .catch(error => { return false; });
    })
}

export const setWritingsLoading = () => {
    return {
        type: WRITINGS_LOADING
    };
};

export const getWriting = (id) => dispatch => {
    dispatch(setWritingsLoading());
    axios.get(`/api/writings/${id}/`)
        .then(res => dispatch({
            type: GET_WRITING,
            payload: res.data
        }))
        //.catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const getWritingCorrect = (id) => dispatch => {
    dispatch({type: GET_INDIVIDUAL_WRITING});
    axios.get(`/api/writings/${id}/`)
        .then(res => dispatch({
            type: GET_INDIVIDUAL_WRITING_SUCCESS,
            payload: res.data
        }))
        .catch(err => dispatch({ type: GET_INDIVIDUAL_WRITING_ERROR, err }));
}

export const getWritingsPreview = (username) => dispatch => {
    dispatch(setWritingsLoading());
    axios.get(`/api/writings/preview/${username}/`)
        .then(res => dispatch({
            type: GET_WRITINGS_PREVIEW,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const getWritingsByUsername = (username) => dispatch => {
    dispatch(setWritingsLoading());
    axios.get(`/api/writings/username/${username}/`)
        .then(res => dispatch({
            type: GET_WRITINGS_BY_USERNAME,
            payload: res.data
        }))
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
}

export const deleteComment = (id, wid, parents) => dispatch => {
    dispatch({type: DELETE_COMMENT});
    axios.delete(`/api/writings/comment/${id}/writing/${wid}/`)
        .then(res => dispatch({
            type: DELETE_COMMENT_SUCCESS,
            commentId: id,
            writingId: wid,
            parents: parents,
        }))
        .catch(err => dispatch({
            type: DELETE_COMMENT_ERROR,
        }));
}

export const getWritingLikers = id => dispatch => {
    dispatch({type: GETTING_WRITING_LIKERS});
    axios.get(`/api/writings/${id}/likers/`)
        .then(res => dispatch({
            type: GETTING_WRITING_LIKERS_SUCCESS,
            payload: res.data
        }))
        .catch(err => dispatch({
            type: GETTING_WRITING_LIKERS_ERROR,
        }))
}

export const getComments = (writingId) => dispatch => {
    dispatch({type: GET_COMMENTS});
    axios.get(`/api/writings/all-comments/${writingId}`)
        .then(res => dispatch({
            type: GET_COMMENTS_SUCCESS,
            writingId,
            payload: res.data,
        }))
        .catch(err => dispatch({
            type: GET_COMMENTS_ERROR,
            err,
        }))
}

export const getResponses = (commentId, writingId, parents) => dispatch => {
    dispatch({type: GET_RESPONSES});
    axios.get(`/api/writings/responses/${commentId}`)
        .then(res => dispatch({
            type: GET_RESPONSES_SUCCESS,
            commentId,
            writingId,
            payload: res.data,
            parents,
        }))
        .catch(err => dispatch({
            type: GET_RESPONSES_ERROR,
            err,
        }))
}

export const setCurrentWriting = (data) => dispatch => {
    dispatch({type: SET_CURRENT_WRITING, data});
};
