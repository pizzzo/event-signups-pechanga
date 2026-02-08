export class HomePage extends HTMLElement {
    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        const template = document.getElementById('home-page-template');
        const content = template.content.cloneNode(true);
        this.replaceChildren(content);

        const featuredContainer = this.querySelector('#featuredEvents');
    }
}

customElements.define('home-page', HomePage);
