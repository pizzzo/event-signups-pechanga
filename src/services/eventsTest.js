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
        title: 'Make a Wish Foundation',
        description: 'Make a wish comes to Pechanga',
        date: '2026-06-21',
        location: 'Summit',
        category: 'Charity',
        featured: false,
        capacity: 200,
        imageUrl: 'https://picsum.photos/600/400?random=2',
    },
    {
        _id: '698299439a4cac03e84340cb',
        title: 'Holiday of Hope',
        description:
            'A community holiday event focused on giving back to families in need.',
        date: '2026-12-25',
        location: 'Pechanga Resort Casino',
        category: 'Holiday',
        featured: true,
        capacity: 300,
        imageUrl: 'https://picsum.photos/600/400?random=1',
    },
    {
        _id: '6982994f9a4cac03e82331cc',
        title: 'Tribal Day at the Cove',
        description:
            'A celebration of tribal culture, traditions, and community at The Cove.',
        date: '2026-06-05',
        location: 'The Cove at Pechanga',
        category: 'Cultural',
        featured: false,
        capacity: 200,
        imageUrl: 'https://picsum.photos/600/400?random=2',
    },
    {
        _id: '6982995b9a4cac0378a337cd',
        title: 'Lakers Private Event',
        description: 'Charity event featuring the Los Angeles Lakers',
        date: '2026-03-21',
        location: 'The Cove at Pechanga',
        category: 'Charity',
        featured: false,
        capacity: 80,
        imageUrl: 'https://picsum.photos/600/400?random=2',
    },
    {
        _id: '698299439a4cac0378a777cb',
        title: 'Random Test Event',
        description: 'Test event for testing.',
        date: '2026-02-15',
        location: 'Pechanga Resort Casino',
        category: 'Test',
        featured: false,
        capacity: 350,
        imageUrl: 'https://picsum.photos/600/400?random=1',
    },
    {
        _id: '698279443a4cac03e8a330cc',
        title: 'Slot Tourney',
        description: 'Slot Tournament!',
        date: '2026-04-25',
        location: 'Grand Ballroom',
        category: 'Marketing',
        featured: false,
        capacity: 200,
        imageUrl: 'https://picsum.photos/600/400?random=2',
    },
    {
        _id: '6982995b3415c03e8a330cd',
        title: 'Cove Event - Valentines',
        description:
            'A celebration of tribal culture, traditions, and community at The Cove.',
        date: '2026-02-14',
        location: 'The Cove at Pechanga',
        category: 'Guest',
        featured: false,
        capacity: 100,
        imageUrl: 'https://picsum.photos/600/400?random=1',
    },
];

export function listEvents() {
    return DEMO_EVENTS;
}

export function getEventById(id) {
    return DEMO_EVENTS.find((e) => e._id === id) || null;
}
