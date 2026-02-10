// NOTE: (peter) - Simple page, template contains <featured-carousel> element, that does all the heavy lifting on this page.
export class HomePage extends HTMLElement {
    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        const template = document.getElementById('home-page-template');
        this.replaceChildren(template.content.cloneNode(true));
    }
}

customElements.define('home-page', HomePage);
