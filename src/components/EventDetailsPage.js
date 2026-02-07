export class EventDetailsPage extends HTMLElement {
    connectedCallback() {
        if (this._rendered) return;
        this._rendered = true;

        const template = document.getElementById('event-details-template');
    }
}
