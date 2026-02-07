import Router from './services/router.js';
import state from './services/state.js';

// NOTE: (peter) - Importing my custom web components
import HomePage from './components/HomePage.js';
import EventsPage from './components/EventsPage.js';

window.app = {};
app.state = state;
app.router = Router;

window.addEventListener('DOMContentLoaded', () => {
    app.router.init();
});
