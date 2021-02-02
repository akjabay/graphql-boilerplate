const types = `
type PaginationOutput {
    offset: Int
    limit: Int
    total: Int
}

type Image {
    url: String!
    ProductId: ID
}

type City {
    id: ID!
    title: String!
    slug: String!
    province_id: ID!
    latitude: Float!
    longitude: Float!
}

type Province {
    id: ID!
    title: String!
    slug: String!
    latitude: Float!
    longitude: Float!
}

type AddressInfo {
    id: String!
    city: City!
    province: Province!
    address_complete: String!
    postal_code: String!
    lat: Float
    long: Float
}

input Pagination {
    offset: Int
    limit: Int    
}

input AddressInfoInput {
    id: String
    city_id: Int!
    address_complete: String!
    postal_code: String!
    lat: Float
    long: Float
}
`;

const root = {
    query: ``,
    mutation: ``,
}

module.exports = {
    types: types,
    root: root,
}