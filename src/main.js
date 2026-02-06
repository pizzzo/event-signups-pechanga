import './styles.css';
import { createApp } from './app/app.js';

// NOTE: (peter) - Mount the app to main div element.
const mount = document.querySelector('#app');
// NOTE: (peter) - setup router global.
const router = createApp({ mount });

router.start();
