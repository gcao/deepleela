export function getUrlParams() {
    const queryString = window.location.search;
    return new URLSearchParams(queryString);
}

/**
 * Parse parameters from URL and remove them so when the page is reloaded, it
 * does not start from beginning.
 */
export function parseAndUpdateUrl() {
}
