const types = `
type User {
    id: ID!
    name: String
    username: String!
    phone: Float
    email: String
    status_auth: String
    address: [AddressInfo]
    avatar_url: String
    password: String
    createdAt: String
    updatedAt: String
}

type UserData {
    id: ID!
    name: String
    username: String
    phone: String
    email: String
    address: [AddressInfo]
    avatar_url: String
    status_auth: String
}

input UserInput {
    name: String
    username: String
    phone: String
    email: String
    avatar_url: String
    password: String!
}

input UserUpdateInput {
    name: String
    bio: String
    username: String!
    phone: String
    email: String
    avatar_url: String
    password: String
}`;

const root = {
    query: `
        userFind(id: ID!): User!
        userFindByUsername(username: String!): User!
    `,
    mutation: `
        userCreate(input: UserInput): User!
        userUpdate(input: UserUpdateInput): User!
    `,
};

module.exports = {
    types: types,
    root: root,
};
