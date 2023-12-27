import Doc from "../models/Doc";
import User from "../models/User";
import EventManager from "./EventManager";
import Lang from "./Lang";
import Notify from "./Notify";
import Ressources from "./Ressources";
import Selections from "./Selections";

const Events = {
    /** Event fired by client when he wants to acquire a cell */
    ACQUIRE_CELL: 'acquireCell',
    /** Event fired by client when he wants to release a cell */
    RELEASE_CELL: 'releaseCell',
    /** Event fired by server when a client acquired a cell */
    CELL_ACQUIRED: 'cellAcquired',
    /** Event fired by server after a client tried to acquire a cell and it was already acquired */
    CELL_HOLDED: 'cellHolded',
    /** Event fired by server when a client released a cell */
    CELL_RELEASED: 'cellReleased',
    /** Event fired by client when he wants to select a cell */
    SELECT_CELL: 'selectCell',
    /** Event fired by server when a client selected a cell */
    CELL_SELECTED: 'cellSelected',
    /** Event fired by client when he wants to change a cell */
    CHANGE_CELL: 'changeCell',
    /** Event fired by server when a client changed a cell */
    CELL_CHANGED: 'cellChanged',
    /** Event fired by client when he wants to join a room */
    JOIN_ROOM: 'joinRoom',
    /** Event fired by server when a client joined a room */
    ROOM_JOINED: 'roomJoined',
    /** Event fired by client when he wants to leave a room */
    LEAVE_ROOM: 'leaveRoom',
    /** Event fired by server when a client left a room */
    ROOM_LEFT: 'roomLeaved',
};

export default class MultiDoc {
    /**@type {EventManager} */
    #events = null;
    /**@type {Doc} Target Doc object */
    #doc = null;

    /**@type {object} Buffer for event responses */
    #eventReponseBuffer = {};

    static Events = Events;

    /**
     * Creates a new MultiDoc object for a given document
     * @param {Doc} doc Document to create a MultiDoc for
     */
    constructor(doc) {
        this.#doc = doc;
        this.#events = EventManager.Instance;
        this.#setupEvents();
        this.#register();
    }

    /**
     * Setups all events for this document and user
     */
    #setupEvents() {
        this.#events.addEventListener(Events.ROOM_JOINED, async data => {
            const userId = data.userId;
            if (userId === User.currentUser.id) {
                Notify.success(
                    await Lang.GetTextAsync(Lang.CreateTranslationContext('doc', 'JoinedRoom')),
                    await Lang.GetTextAsync(Lang.CreateTranslationContext('doc', 'JoinedRoomDesc', {
                        name: (await Ressources.getDocument(this.#doc.id)).title
                    }))
                );
            } else {
                Notify.success(
                    await Lang.GetTextAsync(Lang.CreateTranslationContext('doc', 'UserJoin')),
                    await Lang.GetTextAsync(Lang.CreateTranslationContext('doc', 'UserJoinDesc', {
                        user: (await Ressources.getUser(userId)).username
                    }))
                );
            }
        });

        this.#events.addEventListener(Events.CELL_ACQUIRED, data => {
            const {x, y, holderId} = data;
            if (holderId === User.currentUser.id) {
                this.#eventReponseBuffer[Events.CELL_ACQUIRED]?.resolve(data);
                this.#eventReponseBuffer[Events.CELL_ACQUIRED] = undefined;
            }
        });
        this.#events.addEventListener(Events.CELL_CHANGED, data => {
            const {x, y, userId} = data;
            if (userId === User.currentUser.id) {
                this.#eventReponseBuffer[Events.CELL_CHANGED]?.resolve(data);
                this.#eventReponseBuffer[Events.CELL_CHANGED] = undefined;
            }
        });
        this.#events.addEventListener(Events.CELL_RELEASED, data => {
            const {x, y, holderId} = data;
            if (holderId === User.currentUser.id) {
                this.#eventReponseBuffer[Events.CELL_RELEASED]?.resolve(data);
                this.#eventReponseBuffer[Events.CELL_RELEASED] = undefined;
            }
        });
        this.#events.addEventListener(Events.CELL_SELECTED, data => {
            const {x, y, userId} = data;
            if (userId === User.currentUser.id) {
                this.#eventReponseBuffer[Events.CELL_SELECTED]?.resolve(data);
                this.#eventReponseBuffer[Events.CELL_SELECTED] = undefined;
            } else {
                Selections.setUserSelection(userId, {x, y}, {x, y});
            }
        });
        this.#events.addEventListener(Events.CELL_CHANGED, data => {
            const {x, y, userId, formula, style} = data;
            if (userId === User.currentUser.id) {
                this.#eventReponseBuffer[Events.CELL_CHANGED]?.resolve(data);
                this.#eventReponseBuffer[Events.CELL_CHANGED] = undefined;
            } else {
                Doc.currentDoc.getSlotAt(x, y).formula = formula;
                // style not implemented yet
            }
        });
        this.#events.addEventListener(Events.CELL_HOLDED, data => {
            const {x, y, holderId} = data;
            this.#eventReponseBuffer[Events.CELL_ACQUIRED]?.reject(data);
            this.#eventReponseBuffer[Events.CELL_ACQUIRED] = undefined;
        });
        this.#events.addEventListener(Events.ROOM_LEFT, data => {
            const { userId } = data;
            Selections.setUserSelection(userId, null, null);
        });
    }

    /**
     * Send a register call to th server,
     * to register as a new user on this document
     * and start receiving events
     */
    #register() {
        this.#events.sendEvent(Events.JOIN_ROOM, {
            sheetId: this.#doc.id
        });
    }

    /**
     * Ask for cell aquire to the server
     * @param {number} x x coordinate of the cell
     * @param {number} y y coordinate of the cell
     * @returns A promise that will be resolved if the cell is acquired, or rejected if not
     */
    askForAcquireCell(x, y) {
        return new Promise((resolve, reject) => {
            this.#eventReponseBuffer[Events.CELL_ACQUIRED] = { resolve, reject };
            this.#events.sendEvent(Events.ACQUIRE_CELL, {
                sheetId: this.#doc.id,
                x,
                y
            });
        });
    }

    /**
     * Ask for cell release to the server
     * @param {number} x x coordinate of the cell
     * @param {number} y y coordinate of the cell
     * @returns A promise that will be resolved if the cell is released, or rejected if not
     */
    askForReleaseCell(x, y) {
        return new Promise((resolve, reject) => {
            this.#eventReponseBuffer[Events.CELL_RELEASED] = { resolve, reject };
            this.#events.sendEvent(Events.RELEASE_CELL, {
                sheetId: this.#doc.id,
                x,
                y
            });
        });
    }

    /**
     * Ask for cell selection to the server
     * @param {number} x x coordinate of the cell
     * @param {number} y y coordinate of the cell
     * @returns A promise that will be resolved if the cell is selected, or rejected if not
     */
    askForSelectCell(x, y) {
        return new Promise((resolve, reject) => {
            this.#eventReponseBuffer[Events.CELL_SELECTED] = { resolve, reject };
            this.#events.sendEvent(Events.SELECT_CELL, {
                sheetId: this.#doc.id,
                x,
                y
            });
        });
    }

    /**
     * Ask for cell change to the server
     * @param {number} x x coordinate of the cell
     * @param {number} y y coordinate of the cell
     * @param {string} formula New cell formula
     * @param {string} style New cell style
     * @returns A promise that will be resolved if the cell is changed, or rejected if not
     */
    askForChangeCell(x, y, formula, style) {
        return new Promise((resolve, reject) => {
            this.#eventReponseBuffer[Events.CELL_CHANGED] = { resolve, reject };
            this.#events.sendEvent(Events.CHANGE_CELL, {
                sheetId: this.#doc.id,
                x,
                y,
                formula,
                style: style ?? {}
            });
        });
    }

    getEventManager() {
        return this.#events;
    }
}
