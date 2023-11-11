export default {
    USERS: (...args) => "/user" + (args.length ? "/" + args.join("/") : ""),
    ME: (...args) => "/user/me" + (args.length ? "/" + args.join("/") : ""),
    LOGIN: (...args) => "/user/login" + (args.length ? "/" + args.join("/") : ""),
    SIGNUP: (...args) => "/user/signup" + (args.length > 1 ? `/${args[0]}?token=${args[1]}` : ""),
    SHEETS: (...args) => "/sheets" + (args.length ? "/" + args.join("/") : "")
};