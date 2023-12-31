export default class CachedRessource {
    /** Default ressource cache timeout in s */
    static DEFAULT_CACHE_TIMEOUT = 60;

    #fetcher = null;
    #ressource = null;
    #timeout = -1;
    #timestamp = 0;
    #listeners = null;

    /**
     * Default CachedRessource constructor
     * @param {function} fetcher Function to call to fetch the ressource
     * @param {number} timeout Time in s before the cache is invalidated (-1 = never, default = 60)
     */
    constructor (fetcher, timeout=CachedRessource.DEFAULT_CACHE_TIMEOUT) {
        this.#fetcher = fetcher;
        this.#ressource = null;
        this.#timeout = timeout;
        this.#timestamp = 0;
    }

    async get () {
        // If already fetching (listeners not null)
        if (this.#listeners != null) {
            // Add this request to listeners list
            const promise = new Promise((resolve, reject) => {
                this.#listeners.push(resolve);
            });
            return await promise;
        }

        // If ressource expired or never fetched
        if (this.#ressource === null || this.isExpired()) {
            // Create listeners list to indicate fetching
            this.#listeners = [];
            this.#ressource = await this.#fetcher();
            // resolve every other pending request
            this.#listeners.forEach(l => l(this.#ressource));
            this.#listeners = null;
            this.#timestamp = Date.now();
        }
        return this.#ressource;
    }

    isExpired () {
        if (this.#timeout < 0) return false;
        return (Date.now() - this.#timestamp) / 1000 > this.#timeout;
    }

    invalidate () {
        this.#ressource = null;
    }

    set timeout (timeout) {
        this.#timeout = timeout;
    }

    get timeout () {
        return this.#timeout;
    }
}
