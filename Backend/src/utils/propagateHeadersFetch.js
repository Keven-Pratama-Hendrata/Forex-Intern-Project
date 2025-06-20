import fetch from 'node-fetch';

export default async function propagateHeadersFetch(req, url, options = {}, propagateHeaders = ['x-flow-id']) {
    const outgoingHeaders = { ...options.headers };
    for (const header of propagateHeaders) {
        const value = req.header(header);
        if (value) {
            outgoingHeaders[header] = value;
        }
    }
    return fetch(url, { ...options, headers: outgoingHeaders });
} 