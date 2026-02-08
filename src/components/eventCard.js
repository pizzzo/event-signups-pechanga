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
        if (this._event) this.render();
    }

    render() {
        if (!this._event) return;

        const ev = this._event;

        this.className = 'event-card';

        this.innerHTML = `
        <img class="card-image" src="${ev.imageUrl}" alt="${ev.title}">
        <h2 class="card-title"></h2>
        <p class="muted"></p>
        <a class="navlink" href="/event/${ev._id}">View Details</a>
        `;

        this.querySelector('.card-title').textContent = ev.title;
        this.querySelector('.muted').textContent =
            `${ev.date} - ${ev.location}`;
    }
}

customElements.define('event-card', EventCard);
