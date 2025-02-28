
const githubRegex: RegExp = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/;


async function fetchUrlContent(url: string): Promise<string> {
    const match: RegExpMatchArray | null = url.match(githubRegex);
    if (match !== null) {
        const org: string = match[1];
        const repo: string = match[2];
        const branch: string = match[3];
        const path: string = match[4];

        url = `https://raw.githubusercontent.com/${org}/${repo}/${branch}/${path}`;
    }

    console.info("[UrlService] Fetching content from a URL: ", url);

    const endpoint: string = url;
    return fetch(endpoint).then(response => response.text());
}


/**
 * The URL Service interface.
 */
export interface UrlService {
    fetchUrlContent(url: string): Promise<string>;
}


/**
 * React hook to get the URL service.
 */
export const useUrlService: () => UrlService = (): UrlService => {
    return {
        fetchUrlContent
    };
};
