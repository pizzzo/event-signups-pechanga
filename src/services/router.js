const Router = {
    //NOTE: (peter) - This pulls all links with class "navlink" and adds an eventListener for clicks
    // also preventing default page reload
    init: () => {
        document.querySelectorAll('a.navlink').forEach((a) => {
            a.addEventListener('click', (event) => {
                event.preventDefault();
                console.log('Link clicked');
            });
        });
    },
    go: (route, addToHistory = true) => {
        console.log(`Going to the ${route}`);
    },
};

export default Router;
