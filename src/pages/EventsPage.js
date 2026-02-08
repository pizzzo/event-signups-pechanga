import { store } from '../services/state.js';
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

        this.input = this.querySelector('input[name="q"]');
        this.listEl = this.querySelector('#eventsList');

        const renderList = () => {
            const { eventSearch } = store.getState();
            const nextVal = eventSearch ?? '';
            if (this.input.value !== nextVal) this.input.value = nextVal;

            const q = nextVal.trim().toLowerCase();

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
                this.listEl.replaceChildren(empty);
                return;
            }

            this.listEl.replaceChildren(
                ...filtered.map((ev) => {
                    const card = document.createElement('event-card');
                    card.event = ev;
                    return card;
                }),
            );
        };

        this.input.addEventListener('input', (e) => {
            store.setState({ eventSearch: e.target.value });
        });

        this.onStateChanged = () => renderList();
        window.addEventListener('state-changed', this.onStateChanged);
        renderList();
    }
    disconnectedCallback() {
        window.removeEventListener('state-changed', this.onStateChanged);
    }
}

customElements.define('events-page', EventsPage);
