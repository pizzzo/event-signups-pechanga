import { store } from '../services/state.js';
import { loadEvents } from '../services/data.js';
import { api } from '../api/api.js';

// NOTE: (peter) - Flow is going to be -> Build from template -> renderFromState will then getState -> display Loading... -> once state is read
// it will render to the screen event details. EventDetail page links to -> form submission.

export class EventDetailsPage extends HTMLElement {
    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        const template = document.getElementById('event-details-template');
        this.replaceChildren(template.content.cloneNode(true));

        this.id = this.dataset.id;

        this.titleElement = this.querySelector('#eventTitle');
        this.infoElement = this.querySelector('#eventInfo');
        this.bodyElement = this.querySelector('#eventBody');
        this.imgElement = this.querySelector('#eventImg');

        this.registrantsList = this.querySelector('registrants-list');

        const registerHref = `/event/${this.id}/register`;
        this.querySelector('#registerBtn')?.setAttribute('href', registerHref);
        this.querySelector('#registerBtnMobile')?.setAttribute(
            'href',
            registerHref,
        );

        this.onStateChanged = () => this.renderFromState();
        window.addEventListener('state-changed', this.onStateChanged);

        loadEvents().finally(() => {
            this.renderFromState();
            this.loadRegistrants();
        });

        this.renderFromState();
    }

    disconnectedCallback() {
        window.removeEventListener('state-changed', this.onStateChanged);
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

    async loadRegistrants() {
        try {
            const all = await api.listRegistrants();
            const list = Array.isArray(all) ? all : [];
            store.setState({ registrants: list });

            this.registrantsList &&
                (this.registrantsList.data = {
                    registrants: list,
                    eventId: this.id,
                });
        } catch (err) {
            console.error(err);
        }
    }
}

customElements.define('event-details-page', EventDetailsPage);
