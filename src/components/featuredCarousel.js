import { store } from '../services/state.js';

export class FeaturedCarousel extends HTMLElement {
    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        const template = document.getElementById('featured-carousel-template');
        if (!template) {
            console.warn('Missing #featured-carousel-template in index.html');
            return;
        }
        this.replaceChildren(template.content.cloneNode(true));

        this.selected = this.querySelector('.carousel-selected');
        this.counterEl = this.querySelector('.carousel-count');
        this.previousBtn = this.querySelector('.prev');
        this.nextBtn = this.querySelector('.next');

        this.previousBtn?.addEventListener('click', () => this.go(-1));
        this.nextBtn?.addEventListener('click', () => this.go(1));

        this.onStateChanged = () => this.syncFromState();
        window.addEventListener('state-changed', this.onStateChanged);

        this.index = 0;
        this.syncFromState();
    }

    disconnectedCallback() {
        window.removeEventListener('state-changed', this.onStateChanged);
    }

    syncFromState() {
        const { events, loading } = store.getState();

        // NOTE: (peter) - checking if data (events) returned is array before filtering over it.
        const all = Array.isArray(events) ? events : [];
        const featured = all.filter((e) => e.featured);
        this.events = featured.length ? featured : all;

        if (loading && this.events.length === 0) {
            const p = document.createElement('p');
            p.className = 'muted';
            p.textContent = 'Loading featured events...';
            this.selected?.replaceChildren(p);
            if (this.counterEl) this.counterEl.textContent = '';
            return;
        }

        if (!this.events.length) {
            const p = document.createElement('p');
            p.className = 'muted';
            p.textContent = 'No featured events yet.';
            this.selected?.replaceChildren(p);
            if (this.counterEl) this.counterEl.textContent = '';
            return;
        }
        // NOTE: (peter) - https://www.reddit.com/r/learnjavascript/comments/10wbebj/use_modular_arithmetic_to_handle_lists_that_wrap/
        // Seems to be working
        this.index = this.index % this.events.length;
        this.renderCard();
    }

    go(change) {
        const len = this.events?.length ?? 0;
        if (!len) return;
        this.index = (this.index + change + len) % len;
        this.renderCard();
    }

    renderCard() {
        const ev = this.events?.[this.index];
        if (!ev || !this.selected) return;

        const card = document.createElement('event-card');
        card.myEvent = ev; // NOTE: (peter) - sets myEvent in EventCard component.
        card.classList.add('carousel-card');
        this.selected.replaceChildren(card);

        if (this.counterEl) {
            this.counterEl.textContent = `${this.index + 1} / ${this.events.length}`;
        }
    }
}

customElements.define('featured-carousel', FeaturedCarousel);
