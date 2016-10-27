
const GITHUB_API_ENDPOINT = "https://api.github.com";

/**
 * An abstract base class for services that need to make API calls to Github.
 */
export abstract class AbstractGithubService {

    /**
     * Creates a github API endpoint from the api path and params.
     * @param path
     * @param params
     * @return {string}
     */
    protected endpoint(path: string, params?: any): string {
        if (params) {
            for (let key in params) {
                let value: string = params[key];
                path = path.replace(":" + key, value);
            }
        }
        return GITHUB_API_ENDPOINT + path;
    }

}