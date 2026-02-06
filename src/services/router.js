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
    },
    go: (route, addToHistory = true) => {
        console.log(`Going to ${route}`);
    },
};

export default Router;
