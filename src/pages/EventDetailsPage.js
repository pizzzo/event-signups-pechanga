import { getEventById } from '../services/eventsTest.js';

export class EventDetailsPage extends HTMLElement {
    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        const template = document.getElementById('event-details-template');
        this.replaceChildren(template.content.cloneNode(true));

        const id = this.dataset.id;
        const event = getEventById(id);

        const titleElement = this.querySelector('#eventTitle');
        const infoElement = this.querySelector('#eventInfo');
        const bodyElement = this.querySelector('#eventBody');
        const imgElement = this.querySelector('#eventImg');
        const registerBtn = this.querySelector('#registerBtn');
        const registerBtnMobile = this.querySelector('#registerBtnMobile');

        const registerHref = `/event/${id}/register`;
        if (registerBtn) registerBtn.href = registerHref;
        if (registerBtnMobile) registerBtnMobile.href = registerHref;

        if (!event) {
            titleElement.textContent = 'Event not found';
            infoElement.textContent = id ? `id: ${id}` : '';
            bodyElement.textContent = '';
            return;
        }

        titleElement.textContent = event.title;
        infoElement.textContent = `${event.date} - ${event.location}`;
        bodyElement.textContent = event.description;
        imgElement.src = event.imageUrl;
    }
}

customElements.define('event-details-page', EventDetailsPage);
