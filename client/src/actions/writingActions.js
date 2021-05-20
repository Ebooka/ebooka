import {
    GET_WRITINGS,
    ADD_WRITING,
    WRITINGS_LOADING,
    GET_WRITING,
    LIKED_WRITING,
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
    COMMENTED_WRITING_ERROR, RESPONDED_COMMENT_REQUEST, RESPONDED_COMMENT_SUCCESS, RESPONDED_COMMENT_ERROR
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
        .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
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

export const saveComment = (writingId, content, commenterId) => dispatch => {
    dispatch({type: COMMENTED_WRITING});
    axios.post('/api/writings/comment/', {
            writingId: writingId,
            commenterId: commenterId,
            content: content
        })
        .then(res => dispatch({
            type: COMMENTED_WRITING_SUCCESS,
            payload: res.data
        }))
        .catch(error => dispatch({
            type: COMMENTED_WRITING_ERROR,
        }));

}

export const saveResponse = (writingId, content, parentCommentId, commenterId) => async dispatch => {
    dispatch({type: RESPONDED_COMMENT_REQUEST});
    axios.post('/api/writings/response/', {
            writingId: writingId,
            content: content,
            parentCommentId: parentCommentId,
            commenterId: commenterId
        })
        .then(res => dispatch({
            type: RESPONDED_COMMENT_SUCCESS,
            payload: res.data
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
                console.log('volvi, genero => ', writing.genre);
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
    console.log('addChapters');
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

export const deleteComment = (id, wid) => dispatch => {
    dispatch({type: DELETE_COMMENT});
    axios.delete(`/api/writings/comment/${id}/writing/${wid}/`)
        .then(res => dispatch({
            type: DELETE_COMMENT_SUCCESS,
        }))
        .catch(err => dispatch({
            type: DELETE_COMMENT_ERROR,
        }));
}
