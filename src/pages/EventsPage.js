import { store } from '../services/state.js';
//
// NOTE: (peter) - Flow is going to be -> Build from template -> renderFromState will then getState -> display Loading... -> once state is read
// it will render to the screen event cards w/ data from state. Each card links to their respective "EventDetailPage".

export class EventsPage extends HTMLElement {
    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        const template = document.getElementById('events-page-template');
        this.replaceChildren(template.content.cloneNode(true));

        this.input = this.querySelector('input[name="q"]');
        this.listEl = this.querySelector('#eventsList');

        const renderList = () => {
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

            const list = Array.isArray(events) ? events : [];
            const q = nextVal.trim().toLowerCase();

            const filtered = q
                ? list.filter((ev) => {
                      const match =
                          `${ev.title} ${ev.description ?? ''} ${ev.location} ${ev.date}`.toLowerCase();
                      return match.includes(q);
                  })
                : list;

            if (filtered.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'muted';
                empty.textContent = 'No events match your search.';
                this.listEl.replaceChildren(empty);
                return;
            }

            const frag = document.createDocumentFragment();
            for (const ev of filtered) {
                const card = document.createElement('event-card');
                card.event = ev;
                frag.appendChild(card);
            }
            this.listEl.replaceChildren(frag);
        };

        this.input.addEventListener('input', (e) => {
            store.setState({ eventSearch: e.target.value });
        });

        this.onStateChanged = renderList;
        window.addEventListener('state-changed', this.onStateChanged);

        // initial render
        renderList();
    }

    disconnectedCallback() {
        window.removeEventListener('state-changed', this.onStateChanged);
    }
}

customElements.define('events-page', EventsPage);
