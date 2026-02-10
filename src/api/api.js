import { http } from './http.js';

// NOTE: (peter) - api requires POST/PUT without _id, this is a helper that just uses deconstruction to split _id and the rest of the data.

function withoutId(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const { _id, ...rest } = obj;
    return rest;
}

export const api = {
    listEvents() {
        return http.get('/events');
    },

    getEvent(id) {
        return http.get(`/events/${id}`);
    },

    listRegistrants() {
        return http.get('/registrants');
    },

    createRegistrant(registrant) {
        return http.post('/registrants', withoutId(registrant));
    },

    updateRegistrant(id, registrant) {
        return http.put(`/registrants/${id}`, withoutId(registrant));
    },

    deleteRegistrant(id) {
        return http.del(`/registrants/${id}`);
    },
};
