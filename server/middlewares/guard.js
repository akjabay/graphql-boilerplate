const authMw = require("./authMiddleware");

const prmsnMw = (req, res, next) => {
    const user = req.session.user ? req.session.user : null;

    const query = req.body.query ? req.body.query : null;
    if (!query) return next();

    // select type of query is query or mutation
    const queryType = query.split("{")[0].trim();
    if (queryType != "query" && queryType != "mutation") return next();

    // select query root
    const queryRoot = query.split("{")[1].split("(")[0].trim();

    // select first value of query root to find req routes
    const reqRoute = queryRoot.match(/[a-z]+/g)[0];

    // routes that we dont need authentication
    if (reqRoute == "auth") return next();
    if (reqRoute == "shop") return next();
    if ( reqRoute == "category") return next();
    if ( reqRoute == "product") return next();
    if ( reqRoute == "order") return next();
    if ( reqRoute == "user") return next();

    // all permissions are read and write access to some routes
    if (queryType == "query") {
        if (authMw.isSuperUserOrhasPermission(`read ${reqRoute}`, user)) {
            next();
        } else {
            return res.status(403).send({
                errors: [
                    {
                        message: "you have not permission!",
                    },
                ],
            });
        }
    } else if (queryType == "mutation") {
        if (authMw.isSuperUserOrhasPermission(`write ${reqRoute}`, user)) {
            next();
        } else {
            return res.status(403).send({
                errors: [
                    {
                        message: "you have not permission!",
                    },
                ],
            });
        }
    } else {
        return res.status(404).send({
            errors: [
                {
                    message: "the path you entered is wrong!",
                },
            ],
        });
    }
};

module.exports = prmsnMw;
