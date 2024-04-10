import { csrfFetch } from "./csrfUtils";

export const patchServer = (server) => (
    csrfFetch(`/api/servers/${server.id}`, {
        method: 'PATCH',
        body: JSON.stringify(server)
    })
);

export const postServer = (server) => (
    csrfFetch('/api/servers', {
        method: 'POST',
        body: JSON.stringify(server)
    })
);

export const deleteServer = (id) => (
    csrfFetch(`/api/servers/${id}`, {
        method: 'DELETE'
    })
)