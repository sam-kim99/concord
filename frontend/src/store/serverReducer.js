import { csrfFetch } from "../utils/csrfUtils";
import { deleteServer, patchServer, postServer } from "../utils/serverApiUtils";

export const RECEIVE_SERVERS = 'servers/RECEIVE_SERVERS';
export const RECEIVE_SERVER = 'servers/RECEIVE_SERVER';
export const REMOVE_SERVER = 'servers/REMOVE_SERVER';

const receiveServers = servers => ({
    type: RECEIVE_SERVERS,
    servers
});

const receiveServer = server => ({
    type: RECEIVE_SERVER,
    server
});

const removeServer = serverId => ({
    type: REMOVE_SERVER,
    serverId
});


export const fetchServers = () => (dispatch) => (
    fetch('/api/servers')
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then(servers => dispatch(receiveServers(servers)))
    );

export const fetchServer = id => async dispatch => {
    const response = await csrfFetch(`/api/servers/${id}`);
    const server = await response.json();
    dispatch(receiveServer(server));
};

export const createServer = (server) => (dispatch) => (
    postServer(server)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then(server=> dispatch(receiveServer(server)))
        .catch(err => console.error(err))
    );

export const updateServer = (server) => (dispatch) => (
    patchServer(server)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {    
                throw res
            }
        })
        .then(server => dispatch(receiveServer(server)))
        .catch(err => console.error(err))
    );

export const destroyServer = (id) => (dispatch) => (
    deleteServer(id)
        .then(res => {
            if (res.ok) {
                dispatch(removeServer(id))
            } else {
                throw res;
            }
        })
    );


const serversReducer = (state = {}, action) => {
    // Object.freeze(state);
    // let nextState = Object.assign({}, state);
    const nextState = { ...state }

    switch(action.type) {
        case RECEIVE_SERVERS:
            return action.servers;
        case RECEIVE_SERVER:
            nextState[action.server.id] = action.server;
            return nextState;
        case REMOVE_SERVER:
            delete nextState[action.serverId];
            return nextState;
        default:
            return state;
    }
};

export default serversReducer;