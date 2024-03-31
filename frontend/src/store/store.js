import { thunk } from 'redux-thunk';
import logger from 'redux-logger';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import sessionReducer from './sessionReducer';

const rootReducer = combineReducers({
    session: sessionReducer
});

const configureStore = ( initialState = {} ) => (
    createStore(rootReducer, initialState, applyMiddleware(thunk, logger))
);

export default configureStore;