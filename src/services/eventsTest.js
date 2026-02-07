const DEMO_EVENTS = [
    {
        id: '1',
        title: 'Great Oak Tour',
        date: '2026-02-10',
        location: 'Great Oak',
        description: 'Fun at the great oak',
    },
    {
        id: '2',
        title: 'Cove Tribal',
        date: '2026-02-11',
        location: 'The Cove',
        description: 'Fun at the cove',
    },
    {
        id: '3',
        title: 'Valentines Visit',
        date: '2026-02-14',
        location: "Kelsey's",
        description: "Fun at Kelsey's",
    },
    {
        id: '4',
        title: 'Great Oak Tour',
        date: '2026-02-15',
        location: 'Great Oak',
        description: 'Fun at the great oak',
    },
    {
        id: '5',
        title: 'Great Oak Tour',
        date: '2026-02-15',
        location: 'Great Oak',
        description: 'Fun at the great oak',
    },
    {
        id: '6',
        title: 'Great Oak Tour',
        date: '2026-02-15',
        location: 'Great Oak',
        description: 'Fun at the great oak',
    },
];

export function listEvents() {
    return DEMO_EVENTS;
}

export function getEventById(id) {
    return DEMO_EVENTS.find((e) => e.id === id) || null;
}
