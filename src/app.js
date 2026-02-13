import Router from './services/router.js';
import { store } from './services/state.js';
import { api } from './api/api.js';
import { loadEvents } from './services/data.js';

// NOTE: (peter) - Importing my custom web components
import { EventsPage } from './pages/EventsPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { EventDetailsPage } from './pages/EventDetailsPage.js';
import { EventCard } from './components/eventCard.js';
import { RegistrantsList } from './components/registrantsList.js';

window.app = {};
app.router = Router;
//NOTE: (peter) - exposing to window for console testing.
app.store = store;
app.api = api;
const body = document.body;
const menuBtn = document.querySelector('.menu-button');
const themeBtn = document.getElementById('theme-toggle');
const backdrop = document.querySelector('[data-backdrop]');

function setTheme() {
    if (body.classList.contains('theme-light')) {
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('theme-light');
        localStorage.setItem('theme', 'dark');
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    console.log(savedTheme);
    if (savedTheme === 'light') {
        body.classList.add('theme-light');
    }
    setTheme(savedTheme || 'dark');
}

initTheme();

window.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    //// NOTE: (peter) - app starts here.
    app.router.init();

    // NOTE: (peter) - logic for nav button.
    function setMenuOpen(isOpen) {
        body.dataset.menuOpen = String(isOpen);
        if (backdrop) backdrop.hidden = !isOpen;
        if (menuBtn) menuBtn.setAttribute('aria-expanded', String(isOpen));
    }

    // NOTE: (peter) - opening up function to the app so router can make use of it. Might move to seperate module later?
    app.setMenuOpen = setMenuOpen;

    menuBtn?.addEventListener('click', () => {
        const open = body.dataset.menuOpen === 'true';
        setMenuOpen(!open);
    });

    themeBtn?.addEventListener('click', () => {
        body.classList.toggle('theme-light');
        console.log(body.classList.contains('theme-light'));
        setTheme();
    });

    backdrop?.addEventListener('click', () => setMenuOpen(false));
    // NOTE: (peter) - WIP not sure if this works properly yet.
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenuOpen(false);
    });
});

const toggleBtn = document.getElementById('toggle-mode');
