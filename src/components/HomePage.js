export class HomePage extends HTMLElement {
    connectedCallback() {
        const template = document.getElementById('home-page-template');
        const content = template.content.cloneNode(true);
        this.appendChild(content);
    }
}
