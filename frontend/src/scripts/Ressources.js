import CachedRessource from "./CachedRessource";
import API from "./API";
import User from "../models/User";
import Doc from "../models/Doc";

export default class Ressources {
    static #USERS_FETCHER = id => async () => {
        const res = await API.execute_logged(API.ROUTE.USERS(id));
        return User.fromData(res);
    };

    static #DOCUMENTS_FETCHER = id => async () => {
        const res = await API.execute_logged(API.ROUTE.SHEETS.call(id));
        return Doc.fromData(res);
    };

    static #users = {};
    static #documents = {};

    /**
     * Returns the ressource corresponding to the given id in the given cache.
     * If the ressource is not in the cache, it will be fetched from the server,
     * and added to the cache.
     * @param {string} id Ressource id
     * @param {object} cache Cache object to search in
     * @param {function} fetcher Function to call to fetch the ressource
     * @param {boolean} forceFetch Force a new fetching of the ressource
     * @returns {CachedRessource} The ressource
     */
    static async #getRessource(id, cache, fetcher, forceFetch) {
        if (!cache[id]) {
            cache[id] = new CachedRessource(fetcher);
        } else if (forceFetch) {
            cache[id].invalidate();
        }
        return await cache[id].get();
    }

    /**
     * Returns the user corresponding to the given id
     * @param {string} id User id
     * @param {boolean} forceFetch Force a new fetching of the User
     * @returns {User} The user
     */
    static async getUser(id, forceFetch=false) {
        return await Ressources.#getRessource(id, Ressources.#users, Ressources.#USERS_FETCHER(id), forceFetch);
    }

    /**
     * Returns the document corresponding to the given id
     * @param {string} id Document id
     * @param {boolean} forceFetch Force a new fetching of the Document
     * @returns {Doc} The document
     */
    static async getDocument(id, forceFetch=false) {
        return await Ressources.#getRessource(id, Ressources.#documents, Ressources.#DOCUMENTS_FETCHER(id), forceFetch);
    }
}
