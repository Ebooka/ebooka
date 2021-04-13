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
    RESPONDED_COMMENT
} from '../actions/types'

const initialState = {
    writings: null,
    loading: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_WRITINGS:
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
        case LIKED_WRITING:
        case UNLIKED_WRITING:
        case COMMENTED_WRITING:
        case RESPONDED_COMMENT:
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
                loading: false
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
        default:
            return state;
    };
}
