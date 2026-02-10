import { store } from '../services/state.js';
import { loadEvents } from '../services/data.js';
import { api } from '../api/api.js';

// NOTE: (peter) - Flow is going to be -> retrieve page template which stores id in dataset -> searches id from store.events[n]._id
// renders Event name and form -> on form submission api.createRegistrant is called with registrant object as payload. -> stores registrant in store.registrants for reference.(WIP)
// Will probably just pull all registrants from API on submission to keep state up to date.

export class RegistrationPage extends HTMLElement {
    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;
        this.init();
    }

    async init() {
        const template = document.getElementById(
            'event-registration-page-template',
        );
        if (!template)
            throw new Error(
                'Missing #event-registration-page-template in index.html',
            );

        this.replaceChildren(template.content.cloneNode(true));

        const id = this.dataset.id;

        const { events } = store.getState();
        if (!events) {
            await loadEvents();
        }
        const event = events.find((e) => e._id === id) || null;

        const regEventName = this.querySelector('#regEventName');
        // FIXME: (peter) - currently displays id rather than title on reload. Need to hydrate title on reload?
        if (regEventName) {
            regEventName.textContent = event
                ? `Event: ${event.title}`
                : `Event: ${id ?? 'Unknown'}`;
        }

        const back = this.querySelector('#regBackLink');
        if (back && id) back.href = `/event/${id}`;

        const form = this.querySelector('#registrationForm');
        const submitBtn = form?.querySelector('button[type="submit"]');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fd = new FormData(form);

            const fullName = String(fd.get('fullName') ?? '').trim();
            const email = String(fd.get('email') ?? '').trim();
            const guests = Number(fd.get('guests') ?? 0);
            const notes = String(fd.get('notes') ?? '').trim();

            if (!fullName) return alert('Please enter your full name.');
            if (!email) return alert('Please enter your email.');
            if (Number.isNaN(guests) || guests < 0 || guests > 5)
                return alert('Guests must be between 0 and 5.');

            const payload = {
                eventId: id,
                eventTitle: event?.title ?? '',
                fullName,
                email,
                guests,
                notes: notes || '',
                createdAt: new Date().toISOString(),
            };

            try {
                submitBtn?.setAttribute('disabled', 'true');
                if (submitBtn) submitBtn.textContent = 'Submitting...';

                const created = await api.createRegistrant(payload);

                // NOTE: (peter) - might change this api.getRegistrants -> store.setState (WIP)
                const { registrants } = store.getState();
                store.setState({
                    registrants: [...(registrants ?? []), created],
                });
                window.app?.router?.go?.(`/event/${id}`);
            } catch (err) {
                alert(err?.message || 'Failed to submit registration.');
            } finally {
                submitBtn?.removeAttribute('disabled');
                if (submitBtn) submitBtn.textContent = 'Submit registration';
            }
        });
    }
}

customElements.define('event-registration-page', RegistrationPage);
