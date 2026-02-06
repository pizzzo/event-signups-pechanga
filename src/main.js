import Store from './services/Store.js';
import API from './services/API.js';
import { loadData } from './services/Events.js';
import Router from './services/Router.js';

window.app = {};
app.store = Store;
app.router = Router;

const sidebar = document.querySelector('.sidebar-menu');
sidebar.classList.add('-translate-x-full');

console.log(sidebar);
