import API from "./API";

class User {
    /** @type {User} */
    static #currentUser = null;
    static get CurrentUser() {
        return User.#currentUser || User.fromLocalStorage();
    }
    static props = ["id", "email", "username", "token"];

    static fromLocalStorage() {
        const data = localStorage.getItem("user");
        if (!data) return null;
        const userInfos = JSON.parse(data);
        for (const prop of User.props) {
            if (userInfos[prop] === undefined)
                return null;
        }
        return new User(userInfos);
    }

    static forget() {
        localStorage.removeItem("user");
        User.#currentUser = null;
    }

    id = "";
    email = "";
    username = "";
    token = "";

    constructor(infos) {
        this.setInformations(infos);
        User.#currentUser = this;
    }

    setInformations(infos) {
        if (!infos) return;
        for (const prop of User.props) {
            if (this[prop] != infos[prop] && infos[prop] !== undefined) {
                this[prop] = infos[prop];
            }
        }
    }

    async fetchInformations() {
        const res = await API.execute_logged(API.ROUTE.ME());
        this.setInformations({...res, id: res._id});
    }

    setToken(token) {
        this.token = token;
        this.save();
    }

    save() {
        const userInfos = {};
        for (const prop of User.props) {
            userInfos[prop] = this[prop];
        }
        localStorage.setItem("user", JSON.stringify(userInfos));
        User.#currentUser = this;
    }

    getCredentials() {
        return new API.Credentials(this.token);
    }
}

window.User = User; // for debug
export default User;
