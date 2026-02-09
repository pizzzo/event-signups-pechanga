// TODO: (peter) - Make this more modular, going to look into possibly using regex?

const normalizeRoute = (route) => {
    if (!route) return '/';
    if (route.length > 1 && route.endsWith('/')) return route.slice(0, -1);
    return route;
};

function setActiveNav(path) {
    const links = document.querySelectorAll('nav.side-bar-nav a.navlink[href]');
    links.forEach((a) => {
        const href = normalizeRoute(a.getAttribute('href'));
        const isActive = href === path;
        if (isActive) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
    });
}

const Router = {
    //NOTE: (peter) - This pulls all links with class "navlink" and adds an eventListener for clicks
    // also preventing default page reload
    init: () => {
        document.addEventListener('click', (event) => {
            const a = event.target.closest('a.navlink');
            if (!a) return;

            event.preventDefault();
            console.log('Link clicked');
            const url = a.getAttribute('href');
            Router.go(url);
        });

        window.addEventListener('popstate', () => {
            Router.go(location.pathname, false);
        });

        // NOTE: (peter) - Checking original URL
        Router.go(location.pathname, false);
    },
    go: (route, addToHistory = true) => {
        const nextRoute = normalizeRoute(route);
        setActiveNav(nextRoute);
        window.app?.setMenuOpen?.(false);
        const currentRoute = normalizeRoute(location.pathname);

        console.log(`Going to ${nextRoute}`);

        if (nextRoute === currentRoute) {
            addToHistory = false;
        }

        if (addToHistory) {
            history.pushState({ route: nextRoute }, null, nextRoute);
        }

        let pageElement = null;
        switch (nextRoute) {
            case '/':
                {
                    pageElement = document.createElement('home-page');
                }
                break;

            case '/events':
                {
                    pageElement = document.createElement('events-page');
                }
                break;
            case '/about':
                {
                    pageElement = document.createElement('about-page');
                }
                break;
            default:
                if (nextRoute.startsWith('/event/')) {
                    pageElement = document.createElement('event-details-page');
                    const eventID = nextRoute.substring(
                        nextRoute.lastIndexOf('/') + 1,
                    );
                    pageElement.dataset.id = eventID;
                }
        }
        if (pageElement) {
            const cachedElement = document.querySelector('#outlet');
            cachedElement.replaceChildren(pageElement);
            // NOTE: (peter) - This resets scroll position on route change.
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
    },
};

export default Router;
