import Router from './services/router.js';
import { store } from './services/state.js';

// NOTE: (peter) - Importing my custom web components
import { HomePage } from './components/HomePage.js';
import { EventsPage } from './components/EventsPage.js';
import { AboutPage } from './components/AboutPage.js';
import { EventDetailsPage } from './components/EventDetailsPage.js';

customElements.define('home-page', HomePage);
customElements.define('events-page', EventsPage);
customElements.define('about-page', AboutPage);
customElements.define('event-details-page', EventDetailsPage);

window.app = {};
app.router = Router;
app.store = store;

window.addEventListener('state-changed', (e) => {
    console.log('State has changed.');
    console.log('detail:', e.detail);
});

window.addEventListener('DOMContentLoaded', () => {
    app.router.init();
    console.log(store.getState());
});
