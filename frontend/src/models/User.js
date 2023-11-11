import Slot from "./Slot";

export default class User {
    /** @type {string} default user pseudo */
    static DEFAULT_PSEUDO = 'Anonymous';
    /** @type {string} default user email */
    static DEFAULT_EMAIL = 'anonym@us.com';
    /** @type {string} default user color */
    static DEFAULT_COLOR = '#FF0000';

    /** @type {User} Current device user */
    static #currentUser = null;

    /**
     * Get the current device user
     * @returns A user object representing the current device user
     */
    static get currentUser() {
        if (User.#currentUser === null) {
            const localUser = localStorage.getItem('user');
            if (localUser !== null) {
                User.#currentUser = new User(JSON.parse(localUser));
            }
        }
        return User.#currentUser;
    }

    /**
     * Sets the current device user
     * @param {User} user The user to set as current
     */
    static set currentUser(user) {
        User.#currentUser = user;
    }

    /** @type {string} User pseudonym */
    #pseudo = '';
    /** @type {string} User email */
    #email = '';
    /** @type {string} User color */
    #color = '';
    /** @type {Slot} User selected slot */
    #slot = null;

    constructor(infos) {
        this.#pseudo = infos?.pseudo ?? User.DEFAULT_PSEUDO;
        this.#email = infos?.email ?? User.DEFAULT_EMAIL;
        this.#color = infos?.color ?? User.DEFAULT_COLOR;
    }

    /**
     * Compares this user to another one
     * @param {User} user user to compare to
     * @returns If the user is the same as the one given
     */
    equals(user) {
        if (user === null) return false;
        return this.#email === user.#email;
    }

    /**
     * Get the user email
     * @returns a string representing the user's email
     */
    get email() {
        return this.#email;
    }

    /**
     * Get the user pseudo
     * @returns a string representing the user's pseudo
     */
    get pseudo() {
        return this.#pseudo;
    }

    /**
     * Get the user color accent
     * @returns a string representing the user's color accent (hexadecimal)
     */
    get color() {
        return this.#color;
    }

    /**
     * Assigns a slot to this user (as the one selected)
     * @param {Slot} slot the slot to select
     */
    set slot(slot) {
        if (this.#slot !== null) {
            if (this.#slot.equals(slot)) return;
            this.#slot.removeUser(this);
        }
        this.#slot = slot;
        this.#slot?.addUser(this);
    }

    /**
     * get the current user's slot
     * @returns The slot currently selected by this user
     */
    get slot() {
        return this.#slot;
    }

    save() {
        localStorage.setItem('user', JSON.stringify(this));
    }
}
