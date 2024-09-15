const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Define a type for Blog in multiple languages
  type BlogContent {
    introduction: String
    sections: [BlogSection]
    conclusion: String
  }

  type BlogSection {
    heading: String
    content: String
    subHeadings: [BlogSubHeading]
  }

  type BlogSubHeading {
    subHeading: String
    bulletPoints: [String]
  }

  type Blog {
    title: BlogTranslation
    author: BlogTranslation
    estimatedReadingTime: String
    tags: [BlogTranslation]
    content: BlogContent
    metadata: BlogMetadata
    createdAt: String
    updatedAt: String
  }

  type BlogTranslation {
    en: String
    fr: String
  }

  type BlogMetadata {
    description: BlogTranslation
    keywords: [BlogTranslation]
  }

  type Query {
    getBlog(id: ID!, language: String!): Blog
  }
`;

module.exports = typeDefs;
