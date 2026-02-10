import { store } from './state';
import { api } from '../api/api.js';

export async function loadEvents() {
    const { events, loading } = store.getState();
    if (loading || (events && events.length)) return events;

    try {
        store.setState({ loading: true, error: null });
        const data = await api.listEvents();
        const Events = Array.isArray(data) ? data : [];

        store.setState({ events: Events, loading: false });
        return Events;
    } catch (err) {
        store.setState({
            loading: false,
            error: err?.message || 'Failed to load events',
        });
        return [];
    }
}
