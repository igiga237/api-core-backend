const Blog = require('../models/Blog');

const resolvers = {
  Query: {
    getBlog: async (_, { id, language }) => {
      const blog = await Blog.findById(id);
      return {
        title: blog.title[language],
        description: blog.description[language],
        content: blog.content[language]
      };
    }
  }
};

module.exports = resolvers;
