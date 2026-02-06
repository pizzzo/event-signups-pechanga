const Router = {
    //NOTE: (peter) - This pulls all links with class "navlink" and adds an eventListener for clicks
    // also preventing default page reload
    init: () => {
        document.querySelectorAll('a.navlink').forEach((a) => {
            a.addEventListener('click', (event) => {
                event.preventDefault();
                console.log('Link clicked');
                const url = event.target.getAttribute('href');
                Router.go(url);
            });
        });

        window.addEventListener('popstate', (e) => {
            Router.go(e.state.route, false);
        });

        // NOTE: (peter) - Checking original URL
        Router.go(location.pathname);
    },
    go: (route, addToHistory = true) => {
        console.log(`Going to ${route}`);

        if (addToHistory) {
            history.pushState({ route }, null, route);
        }
        let pageElement = null;
        switch (route) {
            case '/':
                {
                    pageElement = document.createElement('h1');
                    pageElement.textContent = 'HOME PAGE test';
                }
                break;

            case '/events':
                {
                    pageElement = document.createElement('h1');
                    pageElement.textContent = 'EVENTS PAGE test';
                }
                break;
            default:
                if (route.startsWith('/event/')) {
                    pageElement = document.createElement('h1');
                    pageElement.textContent = 'Event Details';
                    const eventID = route.substring(route.lastIndexOf('/') + 1);
                    pageElement.dataset.id = eventID;
                }
        }
        if (pageElement) {
            const cachedElement = document.querySelector('main');
            cachedElement.children[0].remove();
            cachedElement.appendChild(pageElement);
            // NOTE: (peter) - This resets scroll position on route change.
            window.scrollX = 0;
            window.scrollY = 0;
        }
    },
};

export default Router;
