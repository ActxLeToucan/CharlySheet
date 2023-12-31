import Lang from './Lang.js';
import User from '../models/User.js';
import ROUTES from './routes.js';

class Credentials {
    token = "";

    constructor(token) {
        if (typeof(token) !== "string" || token == "") {
            console.error("Error: Invalid token given to Credentials constructor");
            return;
        }
        if (token.split(" ").length < 2) {
            token = "Bearer " + token;
        }
        this.token = token;
    }

    getToken() {
        return this.token;
    }
}

class API {
    static Credentials = Credentials;

    // API constants
    static API_URL = import.meta.env.VITE_API_HOST;
    static get METHOD() {
        return {
            GET: "GET",
            PUT: "PUT",
            POST: "POST",
            PATCH: "PATCH",
            DELETE: "DELETE"
        };
    }
    static get TYPE() {
        return {
            FORM: "application/x-www-form-urlencoded",
            JSON: "application/json",
            FILE: "multipart/form-data",
            NONE: undefined
        }
    }

    static get ERROR() {
        return {
            OK: 200,
            CREATED: 201,
            ACCEPTED: 202,
            BAD_REQUEST: 400,
            UNAUTHORIZED: 401,
            PAYEMENT_REQUIRED: 402,
            FORBIDDEN: 403,
            NOT_FOUND: 404,
            NOT_ACCEPTABLE: 406,
            CONFLICT: 409,
            EXPECTATION_FAILED: 417,
            TEAPOT: 418,
            ENHANCE_YOUR_CALM: 420,
            TOO_MANY_REQUESTS: 429,
            TOKEN_EXPIRED: 498,
            INTERNAL_SERVER_ERROR: 500,
            NOT_IMPLEMENTED: 501
        }
    }

    static get AuthorizationHeader() { return "Authorization"; };

    static setURL(url) {
        if (!url) return;
        if (url.endsWith("/")) url = url.substring(0, url.length - 1);
        API.API_URL = url;
    }

    // API routes
    static ROUTE = ROUTES;

    /**
     * Makes an API call with the specified parameters
     * @param {string} path API call url path (see API.ROUTES for possible routes)
     * @param {string} method API call method (see API.METHOD for possible values)
     * @param {object|string} body API call body (data to send, ignored if METHOD.GET is used)
     * @param {string} type API call data type (see API.TYPE for possible values)
     * @param {object[]} headers API call additional headers
     * @returns a promise resolving when the API call is done
     */
    static execute(path, method = this.METHOD.GET, body = {}, type = this.TYPE.JSON, headers = []) {
        return new Promise((resolve, reject) => {
            if (!API.API_URL) reject("Error : API host not set");
            path = path.replace("/?", "?").replace(/\/\//g, "/");
            let urlparts = path.split("?");
            let base = urlparts.splice(0, 1);
            let params = (urlparts.length > 0)? ("?" + urlparts.join("&")) : "";
            path = base + params;

            let reqHeaders = {
                "Accept": "application/json",
                "Accept-Language": Lang.getLanguage()
            };
            if (type != this.TYPE_NONE && type != this.TYPE_FILE) reqHeaders["Content-Type"] = type;

            if (headers)
                for (let key in headers)
                    reqHeaders[key] = headers[key];

            let reqBody = type == this.TYPE.FORM ? "" : {};
            if (body && type != this.TYPE.FILE) {
                switch (typeof (body)) {
                case "string":
                    if (body.startsWith("{") && body.endsWith("}"))
                        body = JSON.parse(body);
                    // @SuppressWarnings("fallthrough") pas de break, pour faire le traitement "object" suivant
                case "object":
                    if (type == this.TYPE_FORM)
                        reqBody = new URLSearchParams(body).toString();
                    else reqBody = JSON.stringify(body);
                    break;
                default: break;
                }
            }

            if (type == this.TYPE.FILE) { // create a form data from the body
                reqBody = new FormData();
                reqBody.append("model", body);
            }

            const sendError = (err) => {
                err.json().then(data => {
                    reject({
                        status: err.status,
                        message: data.error.message ?? 'Unknown error'
                    });
                }).catch(_ => {
                    err.text().then(_ => {
                        reject({
                            status: err.status,
                            message: err.message ?? err.text()
                        });
                    }).catch(_ => {
                        reject({
                            status: err.status,
                            message: err.statusText ?? 'Unknown error'
                        });
                    });
                });
            };

            fetch(API.API_URL + path, {
                credentials: "omit",
                method: method,
                body: method == this.METHOD.GET ? undefined : reqBody,
                headers: reqHeaders,
                referrer: window.location.origin,
                mode: "cors"
            }).then(response => {
                if (!response.status.toString().startsWith("2")) {
                    sendError(response);
                } else {
                    if (response.status == 204) resolve({});
                    else response.json().then(data => {
                        resolve(data);
                    }).catch(err => sendError(err));
                }
            }).catch(err => sendError(err));
        });
    }

    /**
     * Makes a logged API call with the specified parameters, using the specified credentials (token + token type / username + password)
     * @param {string} path API call url path (see API.ROUTES for possible routes)
     * @param {string} method API call method (see API.METHOD for possible values)
     * @param {object|string} body API call body (data to send, ignored if METHOD.GET is used)
     * @param {string} type API call data type (see API.TYPE for possible values)
     * @param {object[]} headers API call additional headers
     * @param {object} user User to use for the API call (by default User.currentUser)
     * @returns A promise resolving when the API call is done
     */
    static execute_logged(path, method = API.METHOD.GET, body = {}, type = this.TYPE.JSON, headers = [], user = User.currentUser) {
        return new Promise((resolve, reject) => {
            const credentials = user.getCredentials();
            if (!credentials) {
                reject({status: -1, message: "Please provide credentials (token/type or username/password)"});
                return;
            }

            let reqHeaders = {};
            if (headers)
                for (let key in headers)
                    reqHeaders[key] = headers[key];

            reqHeaders[API.AuthorizationHeader] = credentials.getToken();
            this.execute(path, method, body, type, reqHeaders).then(resolve).catch(err => {
                if (err.status === 498 || err.status === 406) {
                    // token expired TODO
                    console.error("Token expired");
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * Creates API parameters from an object
     * @param {object} params key-value pairs of parameters to add to the url
     * @returns string corresponding to the query parameters part of the url
     */
    static createParameters(params) {
        switch (typeof (params)) {
        case "string":
            if (params.startsWith("?")) return params;
            if (params.startsWith("{") && params.endsWith("}"))
                params = JSON.parse(String(params));
            // @SuppressWarnings("fallthrough") pas de break, pour faire le traitement "object" suivant
        case "object":
            return "?" + new URLSearchParams(params).toString();
        default:
            console.error("API Error: Error while creating parameters with argument: ", params);
            return "";
        }
    }

    /**
     * Creates pagination parameters from a page index and page number of elements
     * @param {number} offset number of elements to skip
     * @param {number} limit number of elements in one page
     * @returns a string corresponding to the pagination's parameters part of the url
     */
    static createPagination(offset = 0, limit = 10) {
        return new Pagination(offset, limit);
    }
}

export default API;