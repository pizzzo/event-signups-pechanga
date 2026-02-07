import state from '../services/state.js';
import { listEvents } from '../services/eventsTest.js';

const DEMO_EVENTS = listEvents();

export class EventsPage extends HTMLElement {
    // NOTE: (peter) - Updated this to maintain form input even on page change. Should only clear if submitted. Clears on tab close or if leaving site though.
    connectedCallback() {
        if (this._rendered) return;
        this._rendered = true;

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

            listEl.replaceChildren(
                ...filtered.map((ev) => {
                    const card = document.createElement('article');
                    card.className = 'card';
                    card.innerHTML = `
                <h2 class="card-title">${ev.title}</h2>
                <p class="muted">${ev.date} - ${ev.location}</p>
                <a class="navlink" href="/event/${ev.id}">View details</a>
                `;

                    return card;
                }),
            );
            if (filtered.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'muted';
                empty.textContent = 'No events match your search.';
                listEl.replaceChildren(empty);
            }
        };

        input.addEventListener('input', (e) => {
            state.eventSearch = e.target.value;
            renderList();
        });
        renderList();
    }
}
