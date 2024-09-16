const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Portfolio {
    id: ID!
    image: String!
    title: String!
    link: String!
  }

  type Query {
    portfolios: [Portfolio]
    portfolio(id: ID!): Portfolio
  }

  type Mutation {
    addPortfolio(image: String!, title: String!, link: String!): Portfolio
    updatePortfolio(id: ID!, image: String, title: String, link: String): Portfolio
    deletePortfolio(id: ID!): String
  }
`;

module.exports = typeDefs;