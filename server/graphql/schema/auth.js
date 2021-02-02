const types = `
type AuthData {
    user: UserData
    token: String
}

input AuthVerifyInput {
    username: String!
    password: String!
    code: String!
}
`;

const root = {
    query: `
        authLogin(query: UserInput): AuthData
        authCheckUsername(username: String!): Boolean!
        authLogout: ID!
        authFindMe: User!
        `,
    mutation: `
        authSignup(input: UserInput): User!
        authVerify(input: AuthVerifyInput): User!
        `,
};

module.exports = {
    types: types,
    root: root,
};
