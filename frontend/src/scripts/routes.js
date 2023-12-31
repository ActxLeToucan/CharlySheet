export default {
    USERS: (...args) => "/user" + (args.length ? "/" + args.join("/") : ""),
    SEARCHUSERS: (...args) => "/user/search" + (args.length ? "/" + args.join("/") : ""),
    ME: (...args) => "/user/me" + (args.length ? "/" + args.join("/") : ""),
    LOGIN: (...args) => "/user/login" + (args.length ? "/" + args.join("/") : ""),
    SIGNUP: (...args) => "/user/signup" + (args.length > 1 ? `/${args[0]}?token=${args[1]}` : ""),
    Change_PWD: (...args) => "/user/me/password" + (args.length ? "/" + args.join("/") : ""),
    SHEETS: {
        call: (...args) => "/sheets" + (args.length ? "/" + args.join("/") : ""),
        ME: (...args) => "/sheets/me" + (args.length ? "/" + args.join("/") : ""),
        SHARED: (...args) => "/sheets/me/shared" + (args.length ? "/" + args.join("/") : ""),
        RECENTS: (...args) => "/sheets/me/recents" + (args.length ? "/" + args.join("/") : ""),
        USERS: (...args) => `/sheets/${args.length > 0 ? args[0] : null}/users${args.length > 1 ? `/${args[1]}` : ""}`,
        NAME: (...args) => `/sheets/${args.length > 0 ? args[0] : null}/name`,
        EXPORT: (...args) => `/sheets/${args.length > 0 ? args[0] : null}/export`,
        IMPORT: (...args) => `/sheets/import`,
    }
};