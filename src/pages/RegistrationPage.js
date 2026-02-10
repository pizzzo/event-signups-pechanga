export class RegistrationPage extends HTMLElement {
    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        const template = document.getElementById(
            'event-registration-page-template',
        );
        if (!template)
            throw new Error(
                'Missing #event-registration-page-template in index.html',
            );

        this.replaceChildren(template.content.cloneNode(true));

        const id = this.dataset.id;
        const event = getEventById(id);

        const regEventName = this.querySelector('#regEventName');

        regEventName.textContent = event
            ? `Event: ${event.title}`
            : `Event": ${id ?? 'Unknown'}`;

        const back = this.querySelector('#regBackLink');
        if (back && id) back.href = `/event/${id}`;

        const form = this.querySelector('#registrationForm');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const fd = new FormData(form);
            const payload = {
                eventId: id,
                fullName: String(fd.get('fullName') ?? '').trim(),
                email: String(fd.get('email') ?? '').trim(),
                guest: Number(fd.get('guests') ?? 0),
            };

            console.log('Registration payload:', payload);

            form.reset();
            alert('Registered (mock). TODO: wire API call to POST');
        });
    }
}
customElements.define('event-registration-page', RegistrationPage);
