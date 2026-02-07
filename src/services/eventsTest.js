const DEMO_EVENTS = [
    {
        _id: '698299439a4cac03e8a330cb',
        title: 'Holiday of Hope',
        description:
            'A community holiday event focused on giving back to families in need.',
        date: '2026-12-15',
        location: 'Pechanga Resort Casino',
        category: 'Holiday',
        featured: true,
        capacity: 300,
        imageUrl: 'https://picsum.photos/600/400?random=1',
    },
    {
        _id: '6982994f9a4cac03e8a330cc',
        title: 'Tribal Day at the Cove',
        description:
            'A celebration of tribal culture, traditions, and community at The Cove.',
        date: '2026-06-20',
        location: 'The Cove at Pechanga',
        category: 'Cultural',
        featured: true,
        capacity: 200,
        imageUrl: 'https://picsum.photos/600/400?random=2',
    },
    {
        _id: '6982995b9a4cac03e8a330cd',
        title: 'Tribal Day at the Cove',
        description:
            'A celebration of tribal culture, traditions, and community at The Cove.',
        date: '2026-06-21',
        location: 'The Cove at Pechanga',
        category: 'Cultural',
        featured: true,
        capacity: 200,
        imageUrl: 'https://picsum.photos/600/400?random=2',
    },
];

export function listEvents() {
    return DEMO_EVENTS;
}

export function getEventById(id) {
    return DEMO_EVENTS.find((e) => e._id === id) || null;
}
