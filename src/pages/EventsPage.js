import { store } from '../services/state.js';
import { loadEvents } from '../services/data.js';

export class EventsPage extends HTMLElement {
    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        const template = document.getElementById('events-page-template');
        this.replaceChildren(template.content.cloneNode(true));

        this.input = this.querySelector('input[name="q"]');
        this.listEl = this.querySelector('#eventsList');

        const renderList = () => {
            // NOTE: (peter) - pulling data from state.js that was initially retrieved from API.
            // Intent is to not call API on element load, only one call on inital site load.
            const { events, loading, error, eventSearch } = store.getState();

            const nextVal = eventSearch ?? '';
            if (this.input.value !== nextVal) this.input.value = nextVal;

            if (loading) {
                const p = document.createElement('p');
                p.className = 'muted';
                p.textContent = 'Loading events...';
                this.listEl.replaceChildren(p);
                return;
            }

            if (error) {
                const p = document.createElement('p');
                p.className = 'muted';
                p.textContent = `Error: ${error}`;
                this.listEl.replaceChildren(p);
                return;
            }

            const q = nextVal.trim().toLowerCase();

            const filtered = q
                ? events.filter((ev) => {
                      const match =
                          `${ev.title} ${ev.description ?? ''} ${ev.location} ${ev.date}`.toLowerCase();
                      return match.includes(q);
                  })
                : events;

            if (!filtered || filtered.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'muted';
                empty.textContent = 'No events match your search.';
                this.listEl.replaceChildren(empty);
                return;
            }

            // NOTE: (peter) - trying out doc fragments, similar to what was used in a frontendmasters course. Not needed since the events I'm gettings only total to 3.
            // However just want to practice not forcing any DOM changes when creating the list.
            const frag = document.createDocumentFragment();
            for (const ev of filtered) {
                const card = document.createElement('event-card');
                card.event = ev;
                frag.appendChild(card);
            }
            this.listEl.replaceChildren(frag);
            // OLD - map
            // this.listEl.replaceChildren(
            //     ...filtered.map((ev) => {
            //         const card = document.createElement('event-card');
            //         card.event = ev;
            //         return card;
            //     }),
            // );
        };

        this.input.addEventListener('input', (e) => {
            store.setState({ eventSearch: e.target.value });
        });

        this.onStateChanged = () => renderList();
        window.addEventListener('state-changed', this.onStateChanged);

        // NOTE: (peter) - Attemps to load events from state and eventually render to page.
        loadEvents().finally(renderList);
        renderList();
    }

    disconnectedCallback() {
        window.removeEventListener('state-changed', this.onStateChanged);
    }
}

customElements.define('events-page', EventsPage);
