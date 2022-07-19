
export async function sleep(duration: number) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), duration);
    });
}

export function getUrlParams() {
    const queryString = window.location.search;
    return new URLSearchParams(queryString);
}
