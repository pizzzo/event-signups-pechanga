// TODO: (peter) - Create add button in connected callback and update render()
export class RegistrantsList extends HTMLElement {
    connectedCallback() {
        if (this.rendered) return;
        this.rendered = true;

        const template = document.getElementById('registrants-list-template');
        this.replaceChildren(template.content.cloneNode(true));

        this.bodyEl = this.querySelector('[data-registrants-body]');
        this.countEl = this.querySelector('[data-registrants-count]');
        this.editingId = null;

        // NOTE:(peter) cache add button and setup click listener.
        this.addBtn = this.querySelector('[data-registrants-add]');
        this.creating = false;
        this.addBtn?.addEventListener('click', () => {
            this.editingId = null; // NOTE:(peter) this should kill editing if open.
            this.creating = true; // NOTE:(peter) this should show the create form.
            this.render();
        });
    }

    // NOTE: (peter) - pulls registrantListData from EventDetailsPage.
    // not sure if it's better just to read from store.js but this currently works.
    // kinda doing a react custom attribute thing.
    set registrantListData({ registrants, eventId }) {
        this.registrants = Array.isArray(registrants) ? registrants : [];
        this.eventId = eventId;
        this.render();
    }

    render() {
        if (!this.bodyEl) return;

        const eventRegistrants = this.registrants.filter(
            (r) => String(r.eventId) === String(this.eventId),
        );

        if (this.countEl) {
            this.countEl.textContent = eventRegistrants.length
                ? `(${eventRegistrants.length})`
                : '';
        }

        const frag = document.createDocumentFragment();
        if (this.creating) {
            frag.appendChild(this.createRow());
        }

        if (eventRegistrants.length === 0 && !this.creating) {
            console.log('Events registrants: ', eventRegistrants.length);
            frag.appendChild(this.makeTextMuted('No registrants yet.'));
            this.bodyEl.replaceChildren(frag);
            return;
        }
        for (const r of eventRegistrants) {
            // NOTE: (peter) - checks if editingId is set after clicking edit button on registrant element.
            //  and render editRow with form input, if not set it will render viewRow
            frag.appendChild(
                this.editingId === r._id ? this.editRow(r) : this.viewRow(r),
            );
        }
        this.bodyEl.replaceChildren(frag);
    }

    createRow() {
        const row = document.createElement('div');
        row.className = 'registrant-row';

        const form = document.createElement('form');
        form.className = 'registrant-edit-form';

        const name = this.field('Full name', 'text', '');
        const email = this.field('Email', 'email', '');
        const guests = this.field('Guests', 'number', '');
        guests.input.min = '0';
        guests.input.max = '5';

        const notesLabel = document.createElement('label');
        notesLabel.className = 'field';
        notesLabel.textContent = 'Notes';
        const notes = document.createElement('textarea');
        notes.rows = 2;
        notes.value = '';
        notesLabel.appendChild(notes);

        const actions = document.createElement('div');
        actions.className = 'registrant-actions';

        const save = document.createElement('button');
        save.type = 'submit';
        save.className = 'btn btn-primary';
        save.textContent = 'Save';

        const cancel = document.createElement('button');
        cancel.type = 'button';
        cancel.className = 'btn';
        cancel.textContent = 'Cancel';
        cancel.addEventListener('click', () => {
            this.creating = false;
            this.render();
        });
        actions.append(save, cancel);

        form.append(name, email, guests, notesLabel, actions);

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const payload = {
                fullName: name.input.value.trim(),
                email: email.input.value.trim(),
                guests: Number(guests.input.value || 0),
                notes: notes.value.trim(),
                eventId: this.eventId,
            };
            if (!payload.fullName || !payload.email) return;

            this.dispatchEvent(
                new CustomEvent('registrant-create', {
                    bubbles: true,
                    detail: { registrant: payload },
                }),
            );
            this.creating = false;
        });
        row.appendChild(form);
        return row;
    }

    // NOTE: (peter) - creates registrant list item appends edit and delete button.
    viewRow(r) {
        const row = document.createElement('div');
        row.className = 'registrant-row';

        const info = document.createElement('div');
        info.className = 'registrant-info';

        const name = document.createElement('strong');
        name.textContent = r.fullName;

        const details = document.createElement('div');
        details.className = 'muted';
        details.textContent = `${r.email} • Guests: ${r.guests}`;

        info.append(name, details);

        const actions = document.createElement('div');
        actions.className = 'registrant-actions';

        const edit = document.createElement('button');
        edit.type = 'button';
        edit.className = 'btn';
        edit.textContent = 'Edit';
        // NOTE: (peter) - sets the editingId to the selected users _id. runs render which
        edit.addEventListener('click', () => {
            this.editingId = r._id;
            this.render();
        });

        const del = document.createElement('button');
        del.type = 'button';
        del.className = 'btn';
        del.textContent = 'Delete';
        del.addEventListener('click', () => {
            this.dispatchEvent(
                new CustomEvent('registrant-delete', {
                    bubbles: true,
                    detail: { id: r._id },
                }), // NOTE: (peter) - Not sure if bubbles is needed or not
            );
        });

        actions.append(edit, del);

        row.append(info, actions);
        return row;
    }

    // NOTE: (peter) - creates form and buttons when edit option is pressed.
    editRow(r) {
        const row = document.createElement('div');
        row.className = 'registrant-row';

        const form = document.createElement('form');
        form.className = 'registrant-edit-form';

        const name = this.field('Full name', 'text', r.fullName);
        const email = this.field('Email', 'email', r.email);
        const guests = this.field('Guests', 'number', String(r.guests ?? 0));
        guests.input.min = '0';
        guests.input.max = '5';

        const notesLabel = document.createElement('label');
        notesLabel.className = 'field';
        notesLabel.textContent = 'Notes';
        const notes = document.createElement('textarea');
        notes.rows = 2;
        notes.value = r.notes ?? '';
        notesLabel.appendChild(notes);

        const actions = document.createElement('div');
        actions.className = 'registrant-actions';

        const save = document.createElement('button');
        save.type = 'submit';
        save.className = 'btn btn-primary';
        save.textContent = 'Save';

        const cancel = document.createElement('button');
        cancel.type = 'button';
        cancel.className = 'btn';
        cancel.textContent = 'Cancel';
        cancel.addEventListener('click', () => {
            this.editingId = null;
            this.render();
        });
        actions.append(save, cancel);

        form.append(name, email, guests, notesLabel, actions);

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            this.dispatchEvent(
                new CustomEvent('registrant-save', {
                    bubbles: true,
                    detail: {
                        id: r._id,
                        updates: {
                            fullName: name.input.value.trim(),
                            email: email.input.value.trim(),
                            guests: Number(guests.input.value || 0),
                            notes: notes.value.trim(),
                        },
                    },
                }),
            );

            this.editingId = null;
        });

        row.appendChild(form);
        return row;
    }

    field(labelText, type, value) {
        const label = document.createElement('label');
        label.className = 'field';
        label.textContent = labelText;

        const input = document.createElement('input');
        input.type = type;
        input.value = value ?? '';
        label.appendChild(input);

        label.input = input;
        return label;
    }

    makeTextMuted(text) {
        const p = document.createElement('p');
        p.className = 'muted';
        p.textContent = text;
        return p;
    }
}

customElements.define('registrants-list', RegistrantsList);
