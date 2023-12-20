export default class {
    static #notifications = [];
    static #onNotifAddedEvents = [];
    static #onNotifRemovedEvents = [];

    /**
     * Tiggers an error notification event (red)
     * @param {string} title Notification title
     * @param {string} desc Notification description
     */
    static error(title, desc) {
        this.#spawnNewNotif(title, desc, "#dc2626", "#7f1d1d");
    }

    /**
     * Tiggers a log notification event (gray)
     * @param {string} title Notification title
     * @param {string} desc Notification description
     */
    static log(title, desc) {
        this.#spawnNewNotif(title, desc, "#4b5563", "#1f2937");
    }

    /**
     * Tiggers a success notification event (green)
     * @param {string} title Notification title
     * @param {string} desc Notification description
     */
    static success(title, desc) {
        this.#spawnNewNotif(title, desc, "#16a34a", "#14532d");
    }

    /**
     * Tiggers a warning notification event (yellow)
     * @param {string} title Notification title
     * @param {string} desc Notification description
     */
    static warning(title, desc) {
        this.#spawnNewNotif(title, desc, "#d97706", "#78350f");
    }

    /**
     * Triggers a new notification event with given parameters
     * @param {string} title Notification title
     * @param {*} desc Notification description
     * @param {*} inner_color Notification background color
     * @param {*} outer_color Notification border color
     * @param {*} timeout Notification timeout before deseapearing
     */
    static #spawnNewNotif(title, desc, inner_color, outer_color, timeout = 4000) {
        const notif = {
            message: title,
            description: desc,
            inner_color,
            outer_color,
            id: Date.now()
        };
        this.notifications.push(notif);
        this.#onNotifAddedEvents.forEach(callback => callback(notif));

        setTimeout(() => {
            this.notifications.splice(this.notifications.indexOf(notif), 1);
            this.#onNotifRemovedEvents.forEach(callback => callback(notif));
        }, timeout);
    }

    /**
     * Returns the current diplayed notifications
     * @returns {object[]} The current diplayed notifications
     */
    static get notifications() {
        return this.#notifications;
    }

    /**
     * Sets the current diplayed notifications
     * @param {object[]} value The new notifications
     */
    static set notifications(value) {
        this.#notifications.forEach(n => 
            this.#onNotifRemovedEvents.forEach(callback => callback(n))
        );
        this.#notifications = value;
        this.#notifications.forEach(n => 
            this.#onNotifAddedEvents.forEach(callback => callback(n))
        );
    }

    /**
     * Adds a new notification event listener
     * @param {function} callback The callback to call when a new notification is added
     */
    static onNotifAdded(callback) {
        this.#onNotifAddedEvents.push(callback);
    }

    /**
     * Adds a notification removed event listener
     * @param {function} callback The callback to call when a notification is removed
     */
    static onNotifRemoved(callback) {
        this.#onNotifRemovedEvents.push(callback);
    }
}
