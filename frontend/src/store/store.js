import { thunk } from 'redux-thunk';
// import logger from 'redux-logger';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import sessionReducer from './sessionReducer';
import serversReducer from './serverReducer';
import channelsReducer from './channelReducer';
import messagesReducer from './messageReducer';
import membersReducer from './membershipsReducer';
import friendsReducer from './friendsReducer';

const rootReducer = combineReducers({
    session: sessionReducer,
    server: serversReducer,
    channel: channelsReducer,
    message: messagesReducer,
    memberships: membersReducer,
    friends: friendsReducer
});

const configureStore = ( initialState = {} ) => (
    createStore(rootReducer, initialState, applyMiddleware(thunk))
);

export default configureStore;