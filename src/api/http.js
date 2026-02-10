// NOTE: (peter) - basic fetch helpers.
// docs used: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

const BASE_API_URL =
    'https://crudcrud.com/api/7e42b21784e849e197d7dcb5be768efe';

function makeUrl(path) {
    if (!path.startsWith('/')) path = `/${path}`;
    return `${BASE_API_URL}${path}`;
}

// NOTE:(peter) - returns null on failure to parse.
async function parseJson(res) {
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

async function request(method, path, body) {
    const res = await fetch(makeUrl(path), {
        method,
        headers: {
            Accept: 'application/json',
            ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const data = await parseJson(res);

    if (!res.ok) {
        const message =
            (data && data.message) || `Request failed (${res.status})`;
        throw new Error(message);
    }

    return data;
}

export const http = {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
    put: (path, body) => request('PUT', path, body),
    del: (path) => request('DELETE', path),
};
