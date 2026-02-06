import Router from './services/router.js';
import state from './services/state.js';

window.app = {};
app.state = state;
app.router = Router;

window.addEventListener('DOMContentLoaded', () => {
    app.router.init();
});
