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
    GET_INDIVIDUAL_WRITING_SUCCESS, GET_INDIVIDUAL_WRITING_ERROR, LIKED_WRITING_REQUEST, UNLIKED_WRITING_REQUEST
} from '../actions/types';
import {REHYDRATE} from "redux-persist/es/constants";
import {whenMapStateToPropsIsMissing} from 'react-redux/lib/connect/mapStateToProps';

const initialState = {
    writings: null,
    loading: false,
    deleteCommentLoading: false,
    msg: '',
    error: false,
    commentedWritingLoading: false,
    newComment: null,
    respondedCommentLoading: false,
    newCommentResponse: null,
    loadingLikers: false,
    likers: [],
    gettingCommentsLoading: false,
    gettingCommentsError: false,
    gettingResponsesLoading: false,
    gettingResponsesError: false,
    currentWriting: null,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_WRITINGS:
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
        case GET_INDIVIDUAL_WRITING:
            return {
                ...state,
                loading: true,
            };
        case GET_INDIVIDUAL_WRITING_SUCCESS:
            return {
                ...state,
                loading: false,
                currentWriting: action.payload,
            };
        case GET_INDIVIDUAL_WRITING_ERROR:
            return {
                ...state,
                loading: false,
            };
        case UNLIKED_WRITING_REQUEST:
        case LIKED_WRITING_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case LIKED_WRITING:
        case UNLIKED_WRITING:
            return {
                ...state,
                writings: state.writings.map(writing => {
                    if(writing.id === action.payload.id)
                        return action.payload;
                    return writing;
                }),
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
            const newComment = {
                ...action.payload,
                username: action.user.username,
                profile_image: action.user.profile_image,
                responses: []
            };
            return {
                ...state,
                writings: state.writings.map(writing => {
                    if(writing.id === action.payload.writingId) {
                        return {
                            ...writing,
                            comments: addCommentToThread(writing.comments, newComment, action.parents),
                        };
                    } else {
                        return writing;
                    }
                }),
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
        case COMMENTED_WRITING_SUCCESS: {
            const newComment = {
                ...action.payload,
                username: action.user.username,
                profile_image: action.user.profile_image,
                responses: []
            };
            return {
                ...state,
                newComment: action.payload,
                writings: state.writings.map(writing => {
                    if (writing.id === action.payload.writingId) {
                        return {
                            ...writing,
                            comments: addCommentToThread(writing.comments, newComment, action.parents, action.user),
                        };
                    } else {
                        return writing;
                    }
                }),
                commentedWritingLoading: false,
                error: false
            };
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
                writings: state.writings.map(writing => {
                    if(writing.id === action.writingId) {
                        return {
                            ...writing,
                            comments: deleteCommentFromThread(writing.comments, action.commentId, action.parents),
                        }
                    } else {
                        return writing;
                    }
                })
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
        case GETTING_WRITING_LIKERS:
            return {
                ...state,
                loadingLikers: true
            };
        case GETTING_WRITING_LIKERS_SUCCESS:
            return {
                ...state,
                loadingLikers: false,
                likers: action.payload
            };
        case GETTING_WRITING_LIKERS_ERROR:
            return {
                ...state,
                loadingLikers: false,
                msg: action.payload,
                error: true
            };
        case GET_COMMENTS:
            return {
                ...state,
                gettingCommentsLoading: true,
            };
        case GET_COMMENTS_SUCCESS:
            return {
                ...state,
                gettingCommentsLoading: false,
                writings: state.writings.map(writing => {
                    if(writing.id === action.writingId) {
                        return {
                            ...writing,
                            comments: action.payload,
                        };
                    } else {
                        return writing;
                    }
                })
            };
        case GET_COMMENTS_ERROR:
            return {
                ...state,
                gettingCommentsLoading: false,
                gettingCommentsError: true,
            };
        case GET_RESPONSES:
            return {
                ...state,
                gettingResponsesLoading: true,
            }
        case GET_RESPONSES_SUCCESS:
            return {
                ...state,
                gettingResponsesLoading: false,
                writings: state.writings.map(writing => {
                    if(writing.id === action.writingId) {
                        return {
                            ...writing,
                            comments: queueCommentToThread(writing.comments, action.commentId, action.payload, action.parents),
                        };
                    } else {
                        return writing;
                    }
                })
            }
        case GET_RESPONSES_ERROR:
            return {
                ...state,
                gettingResponsesLoading: false,
                gettingCommentsError: true,
            }
        case SET_CURRENT_WRITING:
            return {
                ...state,
                currentWriting: action.data,
            }
        case REHYDRATE:
            return {
                ...state,
                writings: null,
            };
        default:
            return state;
    };
}

const addCommentToThread = (comments, comment, parents) => {
    console.log(comments, comment, parents);
    if(parents.length === 0) return comments ? [...comments, comment] : [comment];
    return comments.map(commentMap => {
        if(commentMap.id === parents[0]) {
            parents.splice(0, 1);
            return {
                ...commentMap,
                responses: addCommentToThread(commentMap.responses, comment, parents),
            };
        } else {
            return commentMap;
        }
    })
}

const deleteCommentFromThread = (comments, commentId, parents) => {
    if(parents.length === 0) {
        return comments.filter(comment => comment.id !== commentId);
    }
    return comments.map(comment => {
        if(comment.id === parents[0]) {
            parents.splice(0, 1);
            return {
                ...comment,
                responses: deleteCommentFromThread(comment.responses, commentId, parents),
            };
        } else {
            return comment;
        }
    });
}

const queueCommentToThread = (comments, callerCommentId, payload, parents) => {
    console.log(comments, callerCommentId, payload, parents);
    if(parents.length === 0) {
        return payload;
    }
    return comments.map(oldComment => {
        if(oldComment.id === parents[0]) {
            parents.splice(0, 1);
            return {
                ...oldComment,
                responses: queueCommentToThread(oldComment.responses, callerCommentId, payload, parents),
            };
        } else {
            return oldComment;
        }
    });
}
