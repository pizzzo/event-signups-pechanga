import { state } from '../services/state.js';
import { listEvents } from '../services/eventsTest.js';
import { EventCard } from '../components/eventCard.js';

const DEMO_EVENTS = listEvents();

export class EventsPage extends HTMLElement {
    // NOTE: (peter) - Updated this to maintain form input even on page change. Should only clear if submitted. Clears on tab close or if leaving site though.
    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        const template = document.getElementById('events-page-template');
        this.replaceChildren(template.content.cloneNode(true));

        const input = this.querySelector('input[name="q"]');
        const listEl = this.querySelector('#eventsList');

        input.value = state.eventSearch ?? '';

        const renderList = () => {
            const q = (state.eventSearch ?? '').trim().toLowerCase();

            const filtered = q
                ? DEMO_EVENTS.filter((ev) => {
                      const match =
                          `${ev.title} ${ev.location} ${ev.date}`.toLowerCase();
                      return match.includes(q);
                  })
                : DEMO_EVENTS;

            if (filtered.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'muted';
                empty.textContent = 'No events match your search.';
                listEl.replaceChildren(empty);
                return;
            }

            listEl.replaceChildren(
                ...filtered.map((ev) => {
                    const card = document.createElement('event-card');
                    card.event = ev;
                    return card;
                }),
            );
        };

        input.addEventListener('input', (e) => {
            state.eventSearch = e.target.value;
            renderList();
        });
        renderList();
    }
}

customElements.define('events-page', EventsPage);
