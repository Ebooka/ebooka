import {
    GET_WRITINGS,
    ADD_WRITING,
    WRITINGS_LOADING,
    GET_WRITING,
    LIKED_WRITING,
    UNLIKED_WRITING,
    GET_WRITINGS_PREVIEW,
    COMMENTED_WRITING,
    GET_WRITINGS_BY_USERNAME,
    DELETE_DRAFT,
    ADD_VIEWER,
    ADD_ANON_VIEWER,
    RESPONDED_COMMENT_REQUEST,
    RESPONDED_COMMENT_SUCCESS,
    RESPONDED_COMMENT_ERROR,
    DELETE_COMMENT_SUCCESS,
    DELETE_COMMENT,
    DELETE_COMMENT_ERROR,
    COMMENTED_WRITING_SUCCESS,
    COMMENTED_WRITING_ERROR,
} from '../actions/types'

const initialState = {
    writings: null,
    loading: false,
    deleteCommentLoading: false,
    msg: '',
    error: false,
    commentedWritingLoading: false,
    newComment: null,
    respondedCommentLoading: false,
    newCommentResponse: null
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_WRITINGS:
            if(action.payload) {
                console.log(action.payload);
            }
            return {
                ...state,
                writings: action.payload ? state.writings ? [...state.writings, ...action.payload] : [...action.payload] : state.writings,
                loading: false
            }
        case GET_WRITING:
        case GET_WRITINGS_PREVIEW:
        case GET_WRITINGS_BY_USERNAME:
        case DELETE_DRAFT:
        case ADD_VIEWER:
        case ADD_ANON_VIEWER:
            let newWritings = [];
            console.log('reducer', action.type, action.payload);
            if(state.writings) {
                if(Array.isArray(state.writings))
                    newWritings.push(...state.writings);
                else
                    newWritings.push(state.writings);
            }
            if(action.payload) {
                if(Array.isArray(action.payload))
                    newWritings.push(...action.payload);
                else
                    newWritings.push(action.payload);
            }
            return {
                ...state,
                writings: newWritings,
                loading: false
            }
        case LIKED_WRITING:
        case UNLIKED_WRITING:
            let { writings } = state;
            let updatedWriting = action.payload;
            let index = -1;
            for(let i = 0 ; i < writings.length && index < 0; i++) {
                if(writings[i].id === updatedWriting.id)
                    index = i;
            }
            writings[index] = updatedWriting;
            return {
                ...state,
                writings: writings,
                loading: false,
                commentedWritingLoading: false,
                error: false,
            }
        case RESPONDED_COMMENT_REQUEST:
            return {
                ...state,
                respondedCommentLoading: true
            }
        case RESPONDED_COMMENT_SUCCESS:
            return {
                ...state,
                newCommentResponse: action.payload,
                respondedCommentLoading: false
            }
        case RESPONDED_COMMENT_ERROR:
            return {
                ...state,
                error: true,
                respondedCommentLoading: false
            }
        case COMMENTED_WRITING:
            return {
                ...state,
                commentedWritingLoading: true
            }
        case COMMENTED_WRITING_SUCCESS:
            return {
                ...state,
                newComment: action.payload,
                commentedWritingLoading: false,
                error: false
            }
        case COMMENTED_WRITING_ERROR:
            return {
                ...state,
                commentedWritingLoading: false,
                error: true
            }
        case ADD_WRITING:
            return {
                ...state,
                writings: [action.payload, ...state.writings]
            };
        case WRITINGS_LOADING:
            return {
                ...state,
                loading: true
            };
        case DELETE_COMMENT:
            return {
                ...state,
                deleteCommentLoading: true
            };
        case DELETE_COMMENT_SUCCESS: {
            return {
                ...state,
                deleteCommentLoading: false,
                msg: action.payload,
                error: false,
            };
        }
        case DELETE_COMMENT_ERROR: {
            return {
                ...state,
                deleteCommentLoading: false,
                msg: action.payload,
                error: true
            };
        }
        default:
            return state;
    };
}
