export default class Selections {
    /** Selections list for all users selections */
    static #selections = {};
    /** Every listeners for selections update */
    static #listeners = [];

    /**
     * Shows the given selection on the current document for the given user
     * @param {string} userId user id selecting the slot
     * @param {{x:number,y:number}} s1 slot 1 coordinates
     * @param {{x:number,y:number}} s2 slot 2 coordinates
     */
    static setUserSelection(userId, s1, s2) {
        this.#selections[userId] = {s1, s2};
        this.#listeners.forEach(l => {
            if (l.userId === userId) l.callback(s1, s2);
        });
    }

    /**
     * Adds event listener for userId selection changes
     * @param {string} userId user id to listen to
     * @param {function} callback callback to call when the selection changes
     */
    static addEventListener(userId, callback) {
        this.#listeners.push({userId, callback});
    }
};
