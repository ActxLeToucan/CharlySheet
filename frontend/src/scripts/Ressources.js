import CachedRessource from "./CachedRessource";
import API from "./API";
import User from "../models/User";

export default class Ressources {
    static #USERS_FETCHER = id => async () => {
        const res = await API.execute_logged(API.ROUTE.USERS(id));
        return User.fromData(res);
    };

    static #users = {};

    /**
     * Returns the ressource corresponding to the given id in the given cache.
     * If the ressource is not in the cache, it will be fetched from the server,
     * and added to the cache.
     * @param {string} id Ressource id
     * @param {object} cache Cache object to search in
     * @param {function} fetcher Function to call to fetch the ressource
     * @returns The ressource
     */
    static async #getRessource(id, cache, fetcher) {
        if (!cache[id]) {
            cache[id] = new CachedRessource(fetcher);
        }
        return await cache[id].get();
    }

    /**
     * Returns the user corresponding to the given id
     * @param {string} id User id
     * @returns The user
     */
    static async getUser(id) {
        return await Ressources.#getRessource(id, Ressources.#users, Ressources.#USERS_FETCHER(id));
    }
}
