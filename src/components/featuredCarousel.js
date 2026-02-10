export class FeaturedCarousel extends HTMLElement {
    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        const template = document.getElementById('featured-carousel-template');
        if (!template) {
            console.warn('Missing #featured-carousel-template in index.html');
            return;
        }
        this.replaceChildren(template.content.cloneNode(true));

        const all = listEvents();
        const featured = all.filter((e) => e.featured);
        this.events = featured.length ? featured : all;
        this.index = 0;

        this.selected = this.querySelector('.carousel-selected');
        this.counterEl = this.querySelector('.carousel-count');

        this.previousBtn = this.querySelector('.prev');
        this.nextBtn = this.querySelector('.next');

        // NOTE: (peter) - button logic, left right in carousel.
        this.previousBtn.addEventListener('click', () => this.go(-1));
        this.nextBtn.addEventListener('click', () => this.go(1));

        this.renderCard();
    }

    // NOTE: (peter) - Testing this https://www.reddit.com/r/learnjavascript/comments/10wbebj/use_modular_arithmetic_to_handle_lists_that_wrap/
    go(change) {
        const len = this.events.length;
        if (!len) return;
        this.index = (this.index + change + len) % len;
        this.renderCard();

        console.log(`Currently on:${this.index} going to->${change}`);
    }

    renderCard() {
        const ev = this.events[this.index];
        if (!ev || !this.selected) return;
        const card = document.createElement('event-card');
        card.event = ev;
        card.classList.add('carousel-card');
        this.selected.replaceChildren(card);

        // TODO: (peter) - showing numbers for index currently, might just change to dots w/ CSS.
        if (this.counterEl) {
            this.counterEl.textContent = `${this.index + 1} / ${this.events.length}`;
        }
    }
}

customElements.define('featured-carousel', FeaturedCarousel);
