// NOTE: (peter) - A helper function to call picsum images on initial page load to get redirect url to actual image. Goal is to eventually cache this url and potentially cache the image to maintain some consistency on route change.
export async function resolveImageUrl(url) {
    const response = fetch(url, {
        method: 'GET',
        redirect: 'follow',
        cache: 'force-cache',
    });
    return response;
}
