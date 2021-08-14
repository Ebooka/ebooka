import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
}
const pReducer = persistReducer(persistConfig, rootReducer);
const initialState = {};
const middleware = [thunk];

export default () => {
    let store = createStore(pReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));
    let persistor = persistStore(store);
    return {store, persistor};
};
