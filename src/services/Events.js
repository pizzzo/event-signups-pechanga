import API from './API';

export async function loadData() {
    app.store.events = await API.fetchData();
}
