import { store } from '../services/state.js';
//
// NOTE: (peter) - Flow is going to be -> Build from template -> renderList will then getState -> display Loading... -> once state is read it will render to the screen event cards w/ data from state. Each card links to their respective "EventDetailPage".
// Page will also have search and filter option that pulls categories, description, etc. from state to load.

export class EventsPage extends HTMLElement {
    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        const template = document.getElementById('events-page-template');
        this.replaceChildren(template.content.cloneNode(true));

        // NOTE: (peter) - My event cards
        this.listEl = this.querySelector('#eventsList');

        // NOTE: (peter) - filter controls, my search input and filter btn/menu, pulling from template
        this.input = this.querySelector('input[name="q"]');
        this.filterBtn = this.querySelector('#filterBtn');
        this.filterMenu = this.querySelector('#filterMenu');
        this.categorySelect = this.querySelector('#categoryFilter');
        this.locationSelect = this.querySelector('#locationFilter');
        this.clearFiltersBtn = this.querySelector('#clearFilterBtn');
        // NOTE: (peter) - might add featured but it's really being used since everything is featured...
        // might make some mock events later to try it out.

        // NOTE:(peter) using the pattern from my EventsDetailPage add an event listener and run a class module on event fire.
        this.filterBtn?.addEventListener('click', this.onToggleFilterMenu);
        this.clearFiltersBtn?.addEventListener('click', this.onClearFilters);
        // NOTE: (peter) - handles clicking away from element to close
        document.addEventListener('click', this.clickOut);
        this.input?.addEventListener('input', this.onSearchInput);

        // NOTE: (peter) - re-renders list on change
        this.categorySelect?.addEventListener('change', this.renderList);
        this.locationSelect?.addEventListener('change', this.renderList);

        window.addEventListener('state-changed', this.renderList);

        this.renderList();
    }

    disconnectedCallback() {
        window.removeEventListener('state-changed', this.renderList);
        document.removeEventListener('click', this.onDocumentClick);

        this.filterBtn?.removeEventListener('click', this.onToggleFilterMenu);
        this.clearFiltersBtn?.removeEventListener('click', this.onClearFilters);
        this.input?.removeEventListener('input', this.onSearchInput);

        this.categorySelect?.removeEventListener('change', this.renderList);
        this.locationSelect?.removeEventListener('change', this.renderList);
    }

    onSearchInput = (e) => {
        store.setState({ eventSearch: e.target.value });
    };

    onToggleFilterMenu = () => {
        if (!this.filterMenu || !this.filterBtn) return;

        const isOpen = !this.filterMenu.hasAttribute('hidden');
        if (isOpen) this.closeFilterMenu();
        else this.openFilterMenu();
    };

    clickOut = (e) => {
        if (!this.filterMenu || this.filterMenu.hasAttribute('hidden')) return;

        const clickedInsideComponent = this.contains(e.target);
        const clickedInsideMenuOrBtn =
            clickedInsideComponent &&
            (this.filterMenu.contains(e.target) ||
                this.filterBtn?.contains(e.target));

        if (!clickedInsideMenuOrBtn) {
            this.closeFilterMenu();
        }
    };

    // NOTE: (peter) - added these helpers to make things more readable.
    openFilterMenu() {
        this.filterMenu.removeAttribute('hidden');
        this.filterBtn?.setAttribute('aria-expanded', 'true');
    }

    closeFilterMenu() {
        this.filterMenu?.setAttribute('hidden', '');
        this.filterBtn?.setAttribute('aria-expanded', 'false');
    }

    onClearFilters = () => {
        store.setState({ eventSearch: '' });

        if (this.categorySelect) this.categorySelect.value = '';
        if (this.locationSelect) this.locationSelect.value = '';
        // NOTE: (peter) - closes on set and rerenders
        this.closeFilterMenu();
        this.renderList();
    };

    // NOTE: (peter) - this creates the option list.
    setSelectOptions(selectEl, values, placeholder = 'All') {
        if (!selectEl) return;

        const prev = selectEl.value || '';
        const template = document.getElementById('select-option-template');

        const frag = document.createDocumentFragment();

        const placeholderOption =
            template.content.firstElementChild.cloneNode(true);
        placeholderOption.value = '';
        placeholderOption.textContent = placeholder;
        frag.appendChild(placeholderOption);

        for (const value of values) {
            const option = template.content.firstElementChild.cloneNode(true);
            option.value = value;
            option.textContent = value;
            frag.appendChild(option);
        }

        selectEl.replaceChildren(frag);

        if (prev && values.includes(prev)) selectEl.value = prev;
        else selectEl.value = '';
    }

    renderList = () => {
        const { events, loading, error, eventSearch } = store.getState();

        const nextVal = eventSearch ?? '';
        if (this.input && this.input.value !== nextVal)
            this.input.value = nextVal;

        if (loading) {
            const p = document.createElement('p');
            p.className = 'muted';
            p.textContent = 'Loading events...';
            this.listEl?.replaceChildren(p);
            return;
        }

        if (error) {
            const p = document.createElement('p');
            p.className = 'muted';
            p.textContent = `Error: ${error}`;
            this.listEl?.replaceChildren(p);
            return;
        }

        const list = Array.isArray(events) ? events : [];

        // NOTE: (peter) - hours in boot.dev finally paying off lol.
        const categories = [
            ...new Set(list.map((e) => e.category).filter(Boolean)),
        ].sort();
        const locations = [
            ...new Set(list.map((e) => e.location).filter(Boolean)),
        ].sort();

        this.setSelectOptions(
            this.categorySelect,
            categories,
            'All categories',
        );
        this.setSelectOptions(this.locationSelect, locations, 'All locations');

        const q = nextVal.trim().toLowerCase();
        const selectedCategory = this.categorySelect?.value || '';
        const selectedLocation = this.locationSelect?.value || '';

        const filtered = list.filter((ev) => {
            const matchesSearch =
                !q ||
                `${ev.title ?? ''} ${ev.description ?? ''} ${ev.location ?? ''} ${ev.date ?? ''}`
                    .toLowerCase()
                    .includes(q);

            const matchesCategory =
                !selectedCategory || ev.category === selectedCategory;
            const matchesLocation =
                !selectedLocation || ev.location === selectedLocation;

            return matchesSearch && matchesCategory && matchesLocation;
        });

        if (!this.listEl) return;

        if (filtered.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'muted';
            empty.textContent = 'No events match your search/filters.';
            this.listEl.replaceChildren(empty);
            return;
        }

        const frag = document.createDocumentFragment();
        for (const ev of filtered) {
            const card = document.createElement('event-card');
            card.myEvent = ev;
            frag.appendChild(card);
        }
        this.listEl.replaceChildren(frag);
    };
}

customElements.define('events-page', EventsPage);
