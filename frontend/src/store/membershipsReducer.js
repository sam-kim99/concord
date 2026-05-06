import { csrfFetch } from "../utils/csrfUtils";
import { REMOVE_SERVER } from "./serverReducer";

export const RECEIVE_MEMBERS = 'members/RECEIVE_MEMBERS';
export const ADD_MEMBER = 'members/ADD_MEMBER';

export const receiveMembers = members => ({
    type: RECEIVE_MEMBERS,
    members
})

export const addMember = member => ({
    type: ADD_MEMBER,
    member
})

export const fetchMembers = (serverId) => (dispatch) => (
    fetch(`/api/servers/${serverId}/memberships`)
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        })
        .then(members => dispatch(receiveMembers(members)))
)

export const leaveServer = (serverId, userId) => async (dispatch) => {
    const memRes = await fetch(`/api/servers/${serverId}/memberships`);
    if (!memRes.ok) throw memRes;
    const memberships = await memRes.json();
    const mine = memberships.find(m => m.userId === userId);
    if (!mine) throw new Error('Membership not found');

    const delRes = await csrfFetch(`/api/memberships/${mine.id}`, { method: 'DELETE' });
    if (!delRes.ok) throw delRes;

    dispatch({ type: REMOVE_SERVER, serverId });
};

const membersReducer = (state = {}, action) => {
    const nextState = { ...state };

    switch(action.type) {
        case RECEIVE_MEMBERS: 
            return action.members;
        case ADD_MEMBER:
            nextState[action.member.id] = action.member
            return nextState;
        default:
            return state;
    }
}

export default membersReducer;