import User from "./User";

let SLOT_ID_COUNTER = 1;

export default class Slot {
    /** @type {string} Default slot formula */
    static DEFAULT_FORMULA = '';
    
    /** Vue object attached to this slot */
    #vueObject = null;

    /** @type {number} internal slot id */
    #id = SLOT_ID_COUNTER++;
    /** @type {User[]} users currently on this slot */
    #users = [];
    /** @type {string} slot formula */
    #formula = '';
    
    constructor() {
        this.#users = [];
        this.#formula = Slot.DEFAULT_FORMULA;
    }

    /**
     * Adds a user to this slot (when he selects it)
     * @param {User} user user to add to this slot
     * @return If user as been added
     */
    addUser(user) {
        if (user === null || this.hasUser(user)) return false;
        this.#users.push(user);
        user.slot = this;
        this.#onUpdate();
        return true;
    }

    /**
     * Returns if a given user is in this slot or not
    * @param {User} user user to check
     * @returns If the user is already in this slot
     */
    hasUser(user) {
        return this.#users.some(u => u.equals(user));
    }

    /**
     * Removes a user from this slot (when he unselects it)
     * @param {User} user user to remove from this slot
     * @return If user as been removed
     */
    removeUser(user) {
        if (!this.hasUser(user)) return false;
        this.#users = this.#users.filter(u => !u.equals(user));
        if (this.equals(user.slot))
            user.slot = null;
        this.#onUpdate();
        return true;
    }

    #onUpdate() {
        if (this.#vueObject !== null)
            this.#vueObject.$forceUpdate();
    }

    setVueObject(obj) {
        this.#vueObject = obj;
    }

    /**
     * Returns if this slot equals a given one
     * @param {Slot} slot slot to compate to
     * @returns If the slot is the same as the one given
     */
    equals(slot) {
        if (slot === null) return false;
        return this.#id === slot.#id;
    }

    /**
     * Every user currently on this slot
     * @returns a list of Users
     */
    get users() {
        return this.#users;
    }

    /**
     * The formula of this slot
     * @returns a string representing the formula of this slot
     */
    get formula() {
        return this.#formula;
    }

    /**
     * Returns the result of this slot formula
     * @returns A string representing the result of the formula
     */
    get result() {
        return '' // TODO : implement
    }
}