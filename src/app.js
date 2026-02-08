import Router from './services/router.js';
import { store } from './services/state.js';

// NOTE: (peter) - Importing my custom web components
import { HomePage } from './pages/HomePage.js';
import { EventsPage } from './pages/EventsPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { EventDetailsPage } from './pages/EventDetailsPage.js';

window.app = {};
app.router = Router;
app.store = store;

window.addEventListener('state-changed', () => {
    console.log(app.store.getState());
});

window.addEventListener('DOMContentLoaded', () => {
    app.router.init();
});
