const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("morgan");
const { graphqlHTTP } = require("express-graphql");
const path = require("path");
const uploader = require("./middlewares/uploader");
const sequelize = require("./util/database");
const session = require("express-session");
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const config = require("./config");
const graphqlSchema = require("./graphql/schema/index");
const graphqlResolver = require("./graphql/resolvers/index");
const authJWT = require("./middlewares/authjwt");
const guard = require("./middlewares/guard");
const port = config.port;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));
app.use(uploader());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
        store: new SequelizeStore({ db: sequelize }),
    })
);

// routes
app.use(authJWT);
app.use("/graphql", guard);

// graphql
app.use(
    "/graphql",
    graphqlHTTP({
        schema: graphqlSchema,
        rootValue: graphqlResolver,
        graphiql: true,
        customFormatErrorFn(err) {
            if (!err.originalError) {
                return err;
            }
            const data = err.originalError.data;
            const message = err.message || "An error occurred.";
            const code = err.originalError.code || 500;
            return { message: message, status: code, data: data };
        },
    })
);

// Starting database and Server
sequelize.sync().then(() => {
// sequelize.sync({ force: true }).then(() => {
    app.listen(port, () => console.log(`server is running on port: ${port}`));
});
