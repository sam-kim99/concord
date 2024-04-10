import { csrfFetch } from "./csrfUtils";

export const patchChannel = (channel) => (
    csrfFetch(`/api/servers/${channel.serverId}/channels/${channel.id}`, {
        method: 'PATCH',
        body: JSON.stringify(channel)
    })
);

export const postChannel = (channel) => (
    csrfFetch(`/api/servers/${channel.serverId}/channels`, {
        method: 'POST',
        body: JSON.stringify(channel)
    })
);

export const deleteChannel = (channel) => (
    csrfFetch(`/api/servers/${channel.serverId}/channels/${channel.id}`, {
        method: 'DELETE'
    })
)