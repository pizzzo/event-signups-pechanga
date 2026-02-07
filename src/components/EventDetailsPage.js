import { getEventById } from '../services/eventsTest.js';

export class EventDetailsPage extends HTMLElement {
    connectedCallback() {
        if (this._rendered) return;
        this._rendered = true;

        const template = document.getElementById('event-details-template');
        this.replaceChildren(template.content.cloneNode(true));

        const id = this.dataset.id;
        const event = getEventById(id);

        const titleElement = this.querySelector('#eventTitle');
        const infoElement = this.querySelector('#eventInfo');
        const bodyElement = this.querySelector('#eventBody');
        const imgElement = this.querySelector('#eventImg');

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
