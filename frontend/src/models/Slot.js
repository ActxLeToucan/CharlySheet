import Callbackable from "./Callbackable";
import User from "./User";
import { parseFormula } from "js-formula-parser";
import constants from "./Constants";

let SLOT_ID_COUNTER = 1;

export default class Slot extends Callbackable {
    /** @type {string} Default slot formula */
    static DEFAULT_FORMULA = '';

    /** @type {User[]} Default slot users list */
    static DEFAULT_USERS = [];

    /**
     * Builds a new Slot object from given data
     * @param {object} data Object representing a Slot
     * @returns A Slot object with the given data properties
     */
    static fromData(data) {
        return new Slot(
            data.id ?? data._id,
            data.doc ?? data.document,
            data.users.map(u => User.fromData(u)),
            data.formula ?? data.value
        );
    }

    /** @type {number} internal slot id */
    #id = SLOT_ID_COUNTER++;
    /** @type {User[]} users currently on this slot */
    #users = [];
    /** @type {string} slot formula */
    #formula = '';
    /** @type {string} slot result */
    #result = '';
    /** @type {Doc} slot document */
    #doc = null;

    /** @type {string} slot listeners for child cells (for result calculations)*/
    #listeners = [];
    
    /**
     * Defaut slot contructor, with default values if not given
     * @param {Doc} doc The slot's document
     * @param {number} id The slot's id
     * @param {User[]} users The slots's users
     * @param {string} formula The slots's formula
     */
    constructor(id, doc, users, formula) {
        super();
        this.#id = id ?? SLOT_ID_COUNTER++;
        this.#users = users ?? Slot.DEFAULT_USERS;
        this.#formula = formula ?? Slot.DEFAULT_FORMULA;
        this.#doc = doc ?? null;
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
        this._callCallbacks('users', this.#users);
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
        this.#users = this.users.filter(u => !u.equals(user));
        if (this.equals(user.slot))
            user.slot = null;
        this._callCallbacks('users', this.#users);
        return true;
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
     * Get slot id
     * @returns The slot's id
     */
    get id() {
        return this.#id;
    }

    /**
     * Get slot users
     * @returns The slot's users
     */
    get users() {
        return this.#users;
    }

    /**
     * Get slot formula
     * @returns The slot's formula
     */
    get formula() {
        return this.#formula;
    }

    /**
     * Calculate and return the slot result (from the formula)
     * @returns The slot's result
     */
    get result() {
        if (!this.#result) this.#calculateResult();
        return this.#result;
    }

    /**
     * Get slot document
     * @returns The slot's document
     */
    get doc() {
        return this.#doc;
    }

    /**
     * Set slot document
     * @param {Doc} value the new document
     */
    set doc(value) {
        this.#doc = value;
    }

    /**
     * Set slot formula
     * @param {string} value the new formula
     */
    set formula(value) {
        this.#formula = value;
        this._callCallbacks('formula', this.#formula);
        this.#calculateResult();
    }

    /**
     * Calculate the slot result (from the formula)
     */
    #calculateResult() {
        // remove all listeners to sub cells
        this.#listeners.forEach(l => l.cell.no(l.id));
        this.#listeners = [];

        if (!this.#formula.startsWith('=')) {
            this.#result = this.#formula;
        } else {
            try {
                const resolved = this.#resolveConstants(this.#formula.substring(1));
                const res = parseFormula(resolved);
                if (typeof(res) === 'string') return this.#formula;
                this.#result = res;
            } catch (err) {
                console.error(err);
                return '#ERROR';
            }
        }

        this._callCallbacks('result', this.#result);
    }

    /**
     * Resolves all constants in a formula and returns the resolved formula
     * @param {string} formula The string representing the formula to resolve
     * @returns The formula with resolved constants each replaced by their value
     */
    #resolveConstants(formula) {
        const withConstants = formula.replace(/[A-Z][A-Z]+/g, (match, p1) => {
            const constant = constants[match];
            if (constant === undefined) throw new Error(`Unknown constant ${match}`);
            return constant;
        });
    
        const withCells = withConstants.replace(/[A-Z]+(\d)+/g, (match, p1) => {
            const parts = match.split('');
            const col = parts[0].charCodeAt(0) - 'A'.charCodeAt(0);
            const row = parseInt(parts[1]) - 1;
            const cell = this.doc.getSlotAt(col, row);
            if (cell) {
                const id = cell.on('result', () => {
                    this.#calculateResult();
                });
                this.#listeners.push({id, cell});
                return this.#isValidValue(cell.result) ? cell.result : 0;
            } else {
                throw new Error(`Unknown cell ${match}`);
            }
        });
    
        return withCells;
    }

    /**
     * Returns if a value is valid for a formula
     * @param {any} value Value to check
     * @returns If the value is a number or string representing a number
     */
    #isValidValue(value) {
        if (typeof(value) === 'number') return !isNaN(value);
        if (typeof(value) === 'string') return value !== '' && this.#isValidValue(Number(value));
        return false;
    }
}
