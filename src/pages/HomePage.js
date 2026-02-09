import { listEvents } from '../services/eventsTest.js';

export class HomePage extends HTMLElement {
    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        const template = document.getElementById('home-page-template');
        const content = template.content.cloneNode(true);
        this.replaceChildren(content);

        const featuredContainer = this.querySelector('#featuredEvents');

        const events = listEvents();

        const featured = events.filter((e) => e.featured).slice(0, 3);

        featuredContainer.replaceChildren(
            ...featured.map((ev) => {
                const card = document.createElement('event-card');
                card.event = ev;
                return card;
            }),
        );
    }
}

customElements.define('home-page', HomePage);
