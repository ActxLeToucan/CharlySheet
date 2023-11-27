import API from "../scripts/API";
import Callbackable from "./Callbackable";
import Slot from "./Slot";

export default class User extends Callbackable {
    /** @type {string} default user name */
    static DEFAULT_USERNAME = 'Anonymous';
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
        if (!User.#currentUser) {
            User.#currentUser = User.fromLocalStorage();
        }
        return User.#currentUser;
    }

    static fromLocalStorage() {
        const data = localStorage.getItem("user");
        if (!data) return null;
        const userInfos = JSON.parse(data);
        return new User(userInfos);
    }

    /**
     * Sets the current device user
     * @param {User} user The user to set as current
     */
    static set currentUser(user) {
        User.#currentUser = user;
    }

    static forget() {
        localStorage.removeItem("user");
        User.#currentUser = null;
    }

    /** @type {string} User id */
    #id = '';
    /** @type {string} User name */
    #username = '';
    /** @type {string} User email */
    #email = '';
    /** @type {string} User token */
    #token = '';
    /** @type {string} User color */
    #color = '';
    /** @type {Slot} User selected slot */
    #slot = null;

    constructor(infos) {
        super();
        this.setInformations(infos);
    }

    setInformations(infos) {
        if (!infos) return;
        console.log('creating user', infos)
        this.#username = infos?.username ?? User.DEFAULT_USERNAME;
        this.#email = infos?.email ?? User.DEFAULT_EMAIL;
        this.#color = infos?.color ?? User.DEFAULT_COLOR;

        this.#id = infos?.id;
        this.#token = infos?.token;
    }

    async fetchInformations() {
        const res = await API.execute_logged(API.ROUTE.ME(), undefined, undefined, undefined, undefined, this);
        this.setInformations({...res, id: res._id});
    }

    setToken(token) {
        this.#token = token;
        this.save();
    }

    /**
     * Get the user id
     * @returns The user id
     */
    get id() {
        return this.#id;
    }

    /**
     * Get the user name
     * @returns The user name
     */
    get username() {
        return this.#username;
    }
    
    /**
     * Get the user email
     * @returns The user email
     */
    get email() {
        return this.#email;
    }
    
    /**
     * Get the user slot
     * @returns The user slot
     */
    get slot() {
        return this.#slot;
    }
    
    /**
     * Get the user color
     * @returns The user color
     */
    get color() {
        return this.#color;
    }

    /**
     * Get the user token
     * @returns The user token
     */
    get token() {
        return this.#token;
    }

    /**
     * Set the current user slot
     * @param {string} value the new slot
     */
    set slot(value) {
        if (this.#slot !== null) { 
            if (this.#slot.equals(value)) return; 
            this.#slot.removeUser(this); 
        }
        const oldSlot = this.#slot;
        this.#slot = value;
        value?.addUser(this);
        this._callCallbacks('slot', this.#slot, oldSlot);
    }

    /**
     * Compares this user to another one
     * @param {User} user user to compare to
     * @returns If the user is the same as the one given
     */
    equals(user) {
        if (user === null) return false;
        return this.email === user.email;
    }

    /**
     * Saves the user to local storage
     */
    save() {
        localStorage.setItem('user', JSON.stringify({
            id: this.#id,
            username: this.#username,
            email: this.#email,
            token: this.#token,
            color: this.#color
        }));
    }

    /**
     * Get the user credentials (token)
     * @returns The user credentials
     */
    getCredentials() {
        return new API.Credentials(this.#token);
    }
}
