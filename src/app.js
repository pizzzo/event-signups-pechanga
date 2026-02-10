import Router from './services/router.js';
import { store } from './services/state.js';
import { api } from './api/api.js';
import { loadEvents } from './services/data.js';

// NOTE: (peter) - Importing my custom web components
import { HomePage } from './pages/HomePage.js';
import { EventsPage } from './pages/EventsPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { EventDetailsPage } from './pages/EventDetailsPage.js';
import { FeaturedCarousel } from './components/featuredCarousel.js';
import { RegistrationPage } from './pages/RegistrationPage.js';
import { EventCard } from './components/eventCard.js';
import { RegistrantsList } from './components/registrantsList.js';

window.app = {};
app.router = Router;
//NOTE: (peter) - exposing to window for console testing.
app.store = store;
app.api = api;

window.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    app.router.init();

    const menuBtn = document.querySelector('.menu-button');
    const backdrop = document.querySelector('[data-backdrop]');

    // NOTE: (peter) - logic for nav button.
    function setMenuOpen(isOpen) {
        document.body.dataset.menuOpen = String(isOpen);
        if (backdrop) backdrop.hidden = !isOpen;
        if (menuBtn) menuBtn.setAttribute('aria-expanded', String(isOpen));
    }

    // NOTE: (peter) - opening up function to the app so router can make use of it. Might move to seperate module later?
    app.setMenuOpen = setMenuOpen;

    menuBtn?.addEventListener('click', () => {
        const open = document.body.dataset.menuOpen === 'true';
        setMenuOpen(!open);
    });

    backdrop?.addEventListener('click', () => setMenuOpen(false));
    // NOTE: (peter) - WIP not sure if this works properly yet.
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenuOpen(false);
    });
});
