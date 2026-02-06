const API = {
    url: 'https://crudcrud.com/api/7e42b21784e849e197d7dcb5be768efe/',
    fetchData: async function (endpoint = 'events') {
        try {
            const response = await fetch(this.url + endpoint);
            if (!response.ok)
                throw new Error(`Result status ${response.status}`);
            const data = response.json();
            return data;
        } catch (err) {
            console.error(err);
        }
    },
};

export default API;
