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