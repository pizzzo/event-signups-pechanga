import API from './services/API';

async function loadData() {
    const data = await API.fetchData('events');
    console.log(data);
}

loadData();
