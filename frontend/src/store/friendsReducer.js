import { csrfFetch } from "../utils/csrfUtils";
import { receiveServer } from "./serverReducer";

export const RECEIVE_FRIENDSHIPS = 'friends/RECEIVE_FRIENDSHIPS';
export const RECEIVE_FRIENDSHIP   = 'friends/RECEIVE_FRIENDSHIP';
export const REMOVE_FRIENDSHIP    = 'friends/REMOVE_FRIENDSHIP';

const receiveFriendships = friendships => ({ type: RECEIVE_FRIENDSHIPS, friendships });
const receiveFriendship  = friendship  => ({ type: RECEIVE_FRIENDSHIP, friendship });
const removeFriendship   = id          => ({ type: REMOVE_FRIENDSHIP, id });

export const fetchFriendships = () => async dispatch => {
    const res = await fetch('/api/friendships');
    if (!res.ok) throw res;
    const data = await res.json();
    dispatch(receiveFriendships(data));
};

export const sendFriendRequest = friendId => async dispatch => {
    const res = await csrfFetch('/api/friendships', {
        method: 'POST',
        body: JSON.stringify({ friendship: { friend_id: friendId } })
    });
    if (!res.ok) throw res;
    const data = await res.json();
    dispatch(receiveFriendship(data));
    return data;
};

export const acceptFriendship = id => async dispatch => {
    const res = await csrfFetch(`/api/friendships/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ friendship: { status: 'accepted' } })
    });
    if (!res.ok) throw res;
    const data = await res.json();
    dispatch(receiveFriendship(data));
    return data;
};

export const rejectFriendship = id => async dispatch => {
    const res = await csrfFetch(`/api/friendships/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ friendship: { status: 'rejected' } })
    });
    if (!res.ok) throw res;
    const data = await res.json();
    dispatch(receiveFriendship(data));
    return data;
};

export const destroyFriendship = id => async dispatch => {
    const res = await csrfFetch(`/api/friendships/${id}`, { method: 'DELETE' });
    if (!res.ok) throw res;
    dispatch(removeFriendship(id));
    // Backend deletes both directions; refetch to clear the reverse row.
    dispatch(fetchFriendships()).catch(() => {});
};

export const openDirectMessage = userId => async dispatch => {
    const res = await csrfFetch(`/api/dms/${userId}`, { method: 'POST' });
    if (!res.ok) throw res;
    const server = await res.json();
    dispatch(receiveServer(server));
    return server;
};

export const searchUsers = async query => {
    const res = await fetch(`/api/users?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw res;
    return await res.json();
};

const initialState = {};

const friendsReducer = (state = initialState, action) => {
    switch (action.type) {
        case RECEIVE_FRIENDSHIPS: {
            const next = {};
            action.friendships.forEach(f => { next[f.id] = f; });
            return next;
        }
        case RECEIVE_FRIENDSHIP: {
            return { ...state, [action.friendship.id]: action.friendship };
        }
        case REMOVE_FRIENDSHIP: {
            const { [action.id]: _, ...rest } = state;
            return rest;
        }
        default:
            return state;
    }
};

export default friendsReducer;
