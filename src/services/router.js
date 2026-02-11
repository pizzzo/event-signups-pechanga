// TODO: (peter) - Make this more modular, going to look into possibly using regex?

const normalizeRoute = (route) => {
    if (!route) return '/';
    if (route.length > 1 && route.endsWith('/')) return route.slice(0, -1);
    return route;
};

function setActiveNav(path) {
    // NOTE: (peter) - runs through all links with navlink class and adds current href as path.
    const links = document.querySelectorAll('nav.side-bar-nav a.navlink[href]');
    links.forEach((a) => {
        const href = normalizeRoute(a.getAttribute('href'));
        const isActive = href === path;
        if (isActive) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
    });
}

function matchEventDetails(path) {
    const parts = normalizeRoute(path).split('/').filter(Boolean);
    if (parts[0] !== 'event') return null;
    if (!parts[1]) return null;
    return parts[1];
}

const Router = {
    //NOTE: (peter) - This pulls all links with class "navlink" and adds an eventListener for clicks
    // also preventing default page reload
    init: () => {
        document.addEventListener('click', (event) => {
            const a = event.target.closest('a.navlink');
            if (!a) return;
            // NOTE: (peter) - this gets optional user key combos back, ctrl click and alt click.
            if (
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                a.target === '_blank'
            ) {
                return;
            }

            event.preventDefault();
            Router.go(a.getAttribute('href'));
        });

        window.addEventListener('popstate', () => {
            Router.go(location.pathname, false);
        });

        // NOTE: (peter) - Checking original URL
        Router.go(location.pathname, false);
    },
    go: (route, addToHistory = true) => {
        const nextRoute = normalizeRoute(route);
        const currentRoute = normalizeRoute(location.pathname);

        console.log(`Going to ${nextRoute}`);

        if (nextRoute === currentRoute) {
            addToHistory = false;
        }

        if (addToHistory) {
            history.pushState({ route: nextRoute }, '', nextRoute);
        }

        // NOTE: (peter) - Here is where we route to element.
        let pageElement = null;

        if (nextRoute === '/' || nextRoute === '/events') {
            pageElement = document.createElement('events-page');
            setActiveNav('/events');
        } else if (nextRoute === '/about') {
            pageElement = document.createElement('about-page');
            setActiveNav('/about');
        } else {
            const eventId = matchEventDetails(nextRoute);
            if (eventId) {
                pageElement = document.createElement('event-details-page');
                pageElement.dataset.id = eventId;
                setActiveNav('');
            }
        }
        const outlet = document.querySelector('#outlet');

        if (!outlet) return;

        if (!pageElement) {
            const notFound = document.createElement('section');
            notFound.className = 'page';
            notFound.innerHTML = `
             <div class="container">
          <h1 class="page-title">Page not found</h1>
          <p class="muted">That route doesn’t exist.</p>
          <a class="navlink" href="/events">Go to Events</a>
        </div> `;
            outlet.replaceChildren(notFound);
        } else {
            outlet.replaceChildren(pageElement);
        }

        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    },
};

export default Router;
