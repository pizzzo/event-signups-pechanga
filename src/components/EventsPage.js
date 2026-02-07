import state from '../services/state.js';

export class EventsPage extends HTMLElement {
    connectedCallback() {
        if (this._rendered) return;
        this._rendered = true;

        const template = document.getElementById('events-page-template');
        this.replaceChildren(template.content.cloneNode(true));

        const input = this.querySelector('input[name="q"]');

        input.value = state.eventSearch ?? '';

        input.addEventListener('input', (e) => {
            state.eventSearch = e.target.value;
        });
    }
}

customElements.define('events-page', EventsPage);
