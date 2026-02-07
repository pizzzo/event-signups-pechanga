export default class HomePage extends HTMLElement {
    constructor() {
        super();
    }
    // NOTE: (peter) - connectedCallback is used to do a deep clone of the specified template.
    connectedCallback() {
        const template = document.getElementById('home-page-template');
        const content = template.content.cloneNode(true);
        this.appendChild(content);
    }
}

customElements.define('home-page', HomePage);
