export class AboutPage extends HTMLElement {
    connectedCallback() {
        const template = document.getElementById('about-page-template');
        const content = template.content.cloneNode(true);
        this.appendChild(content);
    }
}
