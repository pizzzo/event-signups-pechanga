export class HomePage extends HTMLElement {
    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        const template = document.getElementById('home-page-template');
        this.replaceChildren(template.content.cloneNode(true));
    }
}

customElements.define('home-page', HomePage);
