import { deleteChannel, patchChannel, postChannel } from "../utils/channelApiUtils";


export const RECEIVE_CHANNELS = 'channels/RECEIVE_CHANNELS';
export const RECEIVE_CHANNEL = 'channels/RECEIVE_CHANNEL';
export const REMOVE_CHANNEL = 'channels/REMOVE_CHANNEL';

const receiveChannels = channels => ({
    type: RECEIVE_CHANNELS,
    channels
})

const receiveChannel = channel => ({
    type: RECEIVE_CHANNEL,
    channel
})

const removeChannel = channel => ({
    type: REMOVE_CHANNEL,
    channel
})

export const fetchChannels = (serverId) => (dispatch) => (
    fetch(`/api/servers/${serverId}/channels`)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then(channels => dispatch(receiveChannels(channels)))
);

export const createChannel = (channel) => (dispatch) => (
    postChannel(channel)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then(channel => dispatch(receiveChannel(channel)))
        .catch(err => console.error(err))
);

export const updateChannel = (channel) => (dispatch) => (
    patchChannel(channel)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then(channel => dispatch(receiveChannel(channel)))
        .catch(err => console.error(err))
);

export const destroyChannel = (channel) => (dispatch) => (
    deleteChannel(channel)
        .then(res => {
            if (res.ok) {
                dispatch(removeChannel(channel));
            } else {
                throw res;
            }
        })
);

const channelsReducer = (state = {}, action) => {
    const nextState = { ...state };

    switch(action.type) {
        case RECEIVE_CHANNELS:
            return action.channels;
        case RECEIVE_CHANNEL:
            nextState[action.channel.id] = action.channel;
            return nextState;
        case REMOVE_CHANNEL:
            delete nextState[action.channel.id]
            return nextState;
        default:
            return state;
    }
};

export default channelsReducer;