// TODO: (peter) - make use of templates rather than using innerHTML.
export class EventCard extends HTMLElement {
    set event(value) {
        this._event = value;
        this.render();
    }
    get event() {
        return this._event;
    }

    connectCallback() {
        if (this._event && !this.rendered) this.render();
    }

    render() {
        if (!this._event) return;

        const template = document.getElementById('event-card-template');
        if (!template)
            throw new Error('Missing #event-card-template in markup');

        this.replaceChildren(template.content.cloneNode(true));

        const link = this.querySelector('.navlink');
        const img = this.querySelector('.event-card-image');
        const title = this.querySelector('.event-card-title');
        const date = this.querySelector('.event-card-date');
        const loc = this.querySelector('.event-card-location');
        const badge = this.querySelector('.event-card-badge');

        title.textContent = this._event.title;
        date.textContent = this._event.date;
        loc.textContent = this._event.location;

        link.href = `/event/${this._event._id}`;
        img.src = this._event.imageUrl;
        img.alt = this._event.title;

        badge.hidden = !this._event.featured;
    }
}

customElements.define('event-card', EventCard);
