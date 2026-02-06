import './styles.css';
import Router from './services/router.js';
import state from './services/state.js';

window.app = {};
app.state = state;
app.router = Router;
