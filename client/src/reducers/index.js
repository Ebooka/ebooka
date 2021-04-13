import { combineReducers } from 'redux';
import writingReducer from './writingReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import draftReducer from './draftReducer';
import searchReducer from './searchReducer';
import userReducer from './userReducer';
import notificationReducer from './notificationReducer';
import favouritesReducer from './favouritesReducer';

export default combineReducers({
    writing: writingReducer,
    error: errorReducer,
    auth: authReducer,
    draft: draftReducer,
    search: searchReducer,
    user: userReducer,
    notifications: notificationReducer,
    favs: favouritesReducer
});