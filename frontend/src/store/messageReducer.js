import { deleteMessage, patchMessage, postMessage } from "../utils/messageApiUtils";

export const RECEIVE_MESSAGES = 'messages/RECEIVE_MESSAGES';
export const RECEIVE_MESSAGE = 'messages/RECEIVE_MESSAGE';
export const REMOVE_MESSAGE = 'messages/REMOVE_MESSAGE';

const receiveMessages = messages => ({
    type: RECEIVE_MESSAGES,
    messages
});

export const receiveMessage = message => ({
    type: RECEIVE_MESSAGE,
    message
});
    
const removeMessage = message => ({
    type: REMOVE_MESSAGE,
    message
});

export const fetchMessages = (channelId) => (dispatch) => (
    fetch(`/api/channels/${channelId}/messages`)
    .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then(messages => dispatch(receiveMessages(messages)))
);

export const createMessage = (message) => (dispatch) => (
    postMessage(message)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then(message => dispatch(receiveMessage(message)))
        .catch(err => console.error(err))
);

export const updateMessage = (message) => (dispatch) => (
    patchMessage(message)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then(message => dispatch(receiveMessage(message)))
        .catch(err => console.error(err))
);

export const destroyMessage = (message) => (dispatch) => (
    deleteMessage(message)
        .then(res => {
            if (res.ok) {
                dispatch(removeMessage(message));
            } else {
                throw res;
            }
        })
);

const messagesReducer = (state = {}, action) => {
    const nextState = { ...state };

    switch(action.type) {
        case RECEIVE_MESSAGES:
            return action.messages;
        case RECEIVE_MESSAGE:
            nextState[action.message.id] = action.message;
            return nextState;
        case REMOVE_MESSAGE:
            delete nextState[action.message.id]
            return nextState;
        default:
            return state;
    }
};

export default messagesReducer;