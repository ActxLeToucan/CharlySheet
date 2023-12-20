import Callbackable from "./Callbackable";
import Slot from "./Slot";
import User from "./User";

let DOC_ID_COUNTER = 1;

export default class Doc extends Callbackable {
    /** @type {string} Default document title */
    static DEFAULT_TITLE = "Untitled document";

    /** @type {Slot[]} Default document slots list */
    static DEFAULT_SLOTS = [];

    /** @type {User[]} Default document users list */
    static DEFAULT_USERS = [];

    /** @type {Doc} current document */
    static #currentDoc = null;

    static get currentDoc() {
        return Doc.#currentDoc;
    }

    /**
     * Builds a new Doc object from given data
     * @param {object} data Object representing a Doc
     * @returns A Doc object with the given data properties
     */
    static fromData(data) {
        return new Doc(
            data.id ?? data._id,
            User.fromData(data.owner ?? data.creator),
            data.name ?? data.title,
            (data.slots ?? data.cells).map(s => Slot.fromData(s)),
            data.users.map(u => User.fromData(u))
        );
    }

    /** @type {string} document id */
    #id = '';

    /** @type {string} document title */
    #title = '';

    /** @type {Slot[][]} document slots */
    #slots = [];

    /** @type {User[]} document users */
    #users = [];

    /** @type {User} document owner user */
    #owner = null;

    /**
     * Defaut document contructor, with default values if not given
     * @param {number} id The document's id
     * @param {User} owner The document's owner
     * @param {string} title The document's title
     * @param {Slot[]} slots The document's slots
     * @param {User[]} users The document's users
     */
    constructor(id, owner, title, slots, users) {
        super();
        this.#id = id ?? DOC_ID_COUNTER++;
        this.#owner = owner ?? null;
        this.#title = title ?? Doc.DEFAULT_TITLE;
        this.#slots = slots ?? Doc.DEFAULT_SLOTS;
        this.#users = users ?? Doc.DEFAULT_USERS;
    }

    /**
     * Returns the document's id
     * @returns {number} The document's id
     */
    get id() {
        return this.#id;
    }

    /**
     * Returns the document's title
     * @returns {string} The document's title
     */
    get title() {
        return this.#title;
    }

    /**
     * Returns the document's slots
     * @returns {Slot[][]} The document's slots
     */
    get slots() {
        return this.#slots;
    }

    /**
     * Returns the document's users
     * @returns {User[]} The document's users
     */
    get users() {
        return this.#users;
    }

    /**
     * Returns the document's owner
     * @returns {User} The document's owner
     */
    get owner() {
        return this.#owner;
    }

    /**
     * Sets the document's title
     * @param {string} title The new document's title
     */
    set title(title) {
        this.#title = title;
    }
    
    getSlotAt(x, y) {
        if (!this.#slots) this.#slots = [];
        if (!this.#slots[x]) this.#slots[x] = [];
        if (!this.#slots[x][y]) this.#slots[x][y] = new Slot(undefined, this, undefined, undefined, undefined, x, y);
        return this.#slots[x][y];
    }
    
    setSlotAt(x, y, slot) {
        slot.doc = this;
        if (!this.#slots) this.#slots = [];
        if (!this.#slots[x]) this.#slots[x] = [];
        if (!this.#slots[x][y]) this.#slots[x][y] = slot;
    }
}
