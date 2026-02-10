import { store } from '../services/state.js';
import { loadEvents } from '../services/data.js';

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

        this.registerBtn = this.querySelector('#registerBtn');
        this.registerBtnMobile = this.querySelector('#registerBtnMobile');

        const registerHref = `/event/${this.id}/register`;
        if (this.registerBtn) this.registerBtn.href = registerHref;
        if (this.registerBtnMobile) this.registerBtnMobile.href = registerHref;

        this.onStateChanged = () => this.renderFromState();
        window.addEventListener('state-changed', this.onStateChanged);

        loadEvents().finally(() => this.renderFromState());
        this.renderFromState();
    }

    disconnectedCallback() {
        window.removeEventListener('state-changed', this.onStateChanged);
    }

    renderFromState() {
        const { events, loading, error } = store.getState();

        if (loading) {
            this.titleElement.textContent = 'Loading...';
            this.infoElement.textContent = '';
            this.bodyElement.textContent = '';
            if (this.imgElement) this.imgElement.removeAttribute('src');
            return;
        }

        if (error) {
            this.titleElement.textContent = 'Error';
            this.infoElement.textContent = error;
            this.bodyElement.textContent = '';
            if (this.imgElement) this.imgElement.removeAttribute('src');
            return;
        }

        const event = (events || []).find((e) => e._id === this.id);

        if (!event) {
            this.titleElement.textContent = 'Event not found';
            this.infoElement.textContent = this.id ? `id: ${this.id}` : '';
            this.bodyElement.textContent = '';
            if (this.imgElement) this.imgElement.removeAttribute('src');
            return;
        }

        this.titleElement.textContent = event.title;
        this.infoElement.textContent = `${event.date} - ${event.location}`;
        this.bodyElement.textContent = event.description || '';
        if (this.imgElement) this.imgElement.src = event.imageUrl || '';
    }
}

customElements.define('event-details-page', EventDetailsPage);
