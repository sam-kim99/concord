import { csrfFetch } from "./csrfUtils";

export const patchMessage = (message) => (
    csrfFetch(`/api/messages/${message.id}`, {
        method: 'PATCH',
        body: JSON.stringify(message)
    })
);

export const postMessage = (message) => (
    csrfFetch(`/api/messages`, {
        method: 'POST',
        body: JSON.stringify(message)
    })
);

export const deleteMessage = (message) => (
    csrfFetch(`/api/messages/${message.id}`, {
        method: 'DELETE'
    })
)

