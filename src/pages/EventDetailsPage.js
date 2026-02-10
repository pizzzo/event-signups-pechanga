import { store } from '../services/state.js';
import { loadEvents } from '../services/data.js';
import { api } from '../api/api.js';
// NOTE: (peter) - Flow will be -> Template is cloned from HTML -> id comes in from event cards
// element vars set -> will load events and registrants and check for state change -> if changed sync and render.
// -> on page removal kill event listener from window.

export class EventDetailsPage extends HTMLElement {
    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        const template = document.getElementById('event-details-template');
        this.replaceChildren(template.content.cloneNode(true));

        this.id = this.dataset.id; // NOTE: (peter) - pulling id from dataset.id that was stored during routing.

        this.titleElement = this.querySelector('#eventTitle');
        this.infoElement = this.querySelector('#eventInfo');
        this.bodyElement = this.querySelector('#eventBody');
        this.imgElement = this.querySelector('#eventImg');

        //NOTE: (peter) -My custom registrants list element
        this.registrantsList = this.querySelector('registrants-list');

        const registerHref = `/event/${this.id}/register`;
        this.querySelector('#registerBtn')?.setAttribute('href', registerHref);
        this.querySelector('#registerBtnMobile')?.setAttribute(
            'href',
            registerHref,
        );

        this.onStateChanged = () => {
            this.renderFromState();
            this.syncRegistrants();
        };
        window.addEventListener('state-changed', this.onStateChanged);

        // NOTE: (peter) - custom eventListeners
        this.addEventListener('registrant-delete', this.onRegistrantDelete);
        this.addEventListener('registrant-save', this.onRegistrantSave);

        loadEvents().finally(() => {
            this.renderFromState();
            this.loadRegistrants();
        });

        this.renderFromState();
        this.syncRegistrants();
    }

    disconnectedCallback() {
        window.removeEventListener('state-changed', this.onStateChanged);
        this.removeEventListener('registrant-delete', this.onRegistrantDelete);
        this.removeEventListener('registrant-save', this.onRegistrantSave);
    }

    renderFromState() {
        const { events, loading, error } = store.getState();

        if (loading) {
            this.titleElement.textContent = 'Loading...';
            return;
        }
        if (error) {
            this.titleElement.textContent = 'Error';
            this.infoElement.textContent = error;
            return;
        }

        const event = (events || []).find((e) => e._id === this.id);
        if (!event) {
            this.titleElement.textContent = 'Event not found';
            return;
        }

        this.titleElement.textContent = event.title;
        this.infoElement.textContent = `${event.date} - ${event.location}`;
        this.bodyElement.textContent = event.description || '';
        if (this.imgElement) this.imgElement.src = event.imageUrl || '';
    }

    syncRegistrants() {
        const { registrants } = store.getState();
        // NOTE: (peter) - stores registrants and current eventId into RegistrantsList custom element.
        if (this.registrantsList) {
            this.registrantsList.registrantListData = {
                registrants: Array.isArray(registrants) ? registrants : [],
                eventId: this.id,
            };
        }
    }

    async loadRegistrants() {
        try {
            const all = await api.listRegistrants();
            const list = Array.isArray(all) ? all : [];
            store.setState({ registrants: list });
        } catch (err) {
            console.error(err);
        }
    }

    async onRegistrantDelete(e) {
        const id = e.detail.id;
        if (!id) return;

        if (!confirm('Delete this registrant?')) return;

        try {
            await api.deleteRegistrant(id);

            const { registrants } = store.getState();
            store.setState({
                registrants: (registrants || []).filter(
                    (registrant) => registrant._id !== id,
                ),
            });
        } catch (err) {
            alert(err?.message || 'Delete failed');
        }
    }

    async onRegistrantSave(e) {
        const id = e.detail?.id;
        const updates = e.detail?.updates;
        if (!id || !updates) return;

        const { registrants } = store.getState();
        const current = (registrants || []).find(
            (registrant) => registrant._id === id,
        ); // NOTE: (peter) - store current registrant info
        if (!current) return;

        // NOTE: (peter) - Organizing the payload I sned with api.updateRegistrant. Using current state and user inputted changes.
        const payload = {
            eventId: current.eventId,
            eventTitle: current.eventTitle ?? '',
            fullName: String(updates.fullName || '').trim(),
            email: String(updates.email || '').trim(),
            guests: Number(updates.guests ?? 0),
            notes: String(updates.notes || '').trim(),
            createdAt: current.createdAt ?? new Date().toISOString(),
        };
        // TODO: (peter) - might make into modals rather than use window alert.
        if (!payload.fullName) return alert('Name required.');
        if (!payload.email) return alert('Email required.');

        try {
            await api.updateRegistrant(id, payload);

            store.setState({
                registrants: (registrants || []).map((registrant) =>
                    registrant._id === id
                        ? { ...registrant, ...payload }
                        : registrant,
                ),
            });
        } catch (err) {
            alert(err?.message || 'Update failed');
        }
    }
}

customElements.define('event-details-page', EventDetailsPage);
