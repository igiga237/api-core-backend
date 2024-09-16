const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Contact {
    id: ID!
    name: String!
    email: String!
    phone: String
    subject: String!
    message: String!
  }

  type Query {
    contacts: [Contact]
  }

  type Mutation {
    addContact(name: String!, email: String!, phone: String, subject: String!, message: String!): Contact
  }
`;

module.exports = typeDefs;
