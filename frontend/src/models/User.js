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

    static GetRandomColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 60;
        const lightness = 60;

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    static GetUserColor(id) {
        const id2number = id.split('').map(c => c.charCodeAt(0)).reduce((a, b) => a + b, 0);
        const hue = Math.floor(id2number % 360);
        const saturation = 60;
        const lightness = 60;

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

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
        return User.fromData(userInfos);
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

    /**
     * Builds a new User object from given data
     * @param {object} data Object representing a User
     * @returns A User object with the given data properties
     */
    static fromData(data) {
        return new User(
            data.id ?? data._id,
            data.username ?? data.pseudo,
            data.email,
            data.color,
            data.token
        );
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

    /**
     * Full User constructor
     * @param {string} id User unique id
     * @param {string} username User username
     * @param {string} email User email address
     * @param {string} color User color 
     * @param {string} token User access token
     */
    constructor(id, username=User.DEFAULT_USERNAME, email=User.DEFAULT_EMAIL, color, token) {
        super();
        this.setInformations({id, username, email, color, token});
    }

    setInformations(infos) {
        if (!infos) return;
        this.#username = infos?.username ?? this.#username ?? User.DEFAULT_USERNAME;
        this.#email = infos?.email ?? this.#email ?? User.DEFAULT_EMAIL;
        this.#color = User.GetUserColor(infos?.id ?? '0');

        this.#id = infos?.id ?? this.#id;
        this.#token = infos?.token ?? this.#token;
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
        return this.#username.charAt(0).toUpperCase() + this.#username.slice(1);
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
