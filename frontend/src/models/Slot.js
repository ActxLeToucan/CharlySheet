import Callbackable from "./Callbackable";
import User from "./User";
import { parseFormula } from "js-formula-parser";

let SLOT_ID_COUNTER = 1;

const constants = {
    'PI': Math.PI
};

export default class Slot extends Callbackable {
    /** @type {string} Default slot formula */
    static DEFAULT_FORMULA = '';

    /** @type {number} internal slot id */
    #id = SLOT_ID_COUNTER++;
    /** @type {User[]} users currently on this slot */
    #users = [];
    /** @type {string} slot formula */
    #formula = '';
    /** @type {string} slot result */
    #result = '';

    /** @type {string} slot listeners for child cells (for result calculations)*/
    #listeners = [];
    
    constructor() {
        super();
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
     * Set slot formula
     * @param {string} value the new formula
     */
    set formula(value) {
        this.#formula = value;
        this._callCallbacks('formula', this.#formula);
        this.#calculateResult();
    }

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
            const cell = window.slots[col]?.[row];
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

    #isValidValue(value) {
        if (typeof(value) === 'number') return !isNaN(value);
        if (typeof(value) === 'string') return value !== '' && this.#isValidValue(Number(value));
        return false;
    }
}
