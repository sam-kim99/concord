import { thunk } from 'redux-thunk';
import logger from 'redux-logger';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import sessionReducer from './sessionReducer';
import serversReducer from './serverReducer';
import channelsReducer from './channelReducer';

const rootReducer = combineReducers({
    session: sessionReducer,
    server: serversReducer,
    channel: channelsReducer
});

const configureStore = ( initialState = {} ) => (
    createStore(rootReducer, initialState, applyMiddleware(thunk))
);

export default configureStore;