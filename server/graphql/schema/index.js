const { buildSchema } = require("graphql");
const auth = require("./auth");
const user = require("./user");
const nest = require("./nest");

const RootQuery =
    `
    type RootQuery {
        ` +
    auth.root.query +
    user.root.query +
    nest.root.query +
    `}`;

const RootMutation =
    `
    type RootMutation {
        ` +
    auth.root.mutation +
    user.root.mutation +
    nest.root.mutation +
    `}`;

module.exports = buildSchema(
    auth.types +
        user.types +
        nest.types +
        RootQuery +
        RootMutation +
        `
    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `
);
