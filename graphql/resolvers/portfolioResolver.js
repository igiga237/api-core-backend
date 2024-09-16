const Portfolio = require("../models/Portfolio");

const resolvers = {
    Query: {
        portfolios: async () => {
            return await Portfolio.find();
        },
        portfolio: async (parent, args) => {
            return await Portfolio.findById(args.id);
        },
    },

    Mutation: {
        addPortfolio: async (parent, args) => {
            const newPortfolio = new Portfolio({
                image: args.image,
                title: args.title,
                link: args.link,
            });
            return await newPortfolio.save();
        },
        updatePortfolio: async (parent, args) => {
            const updatedPortfolio = await Portfolio.findByIdAndUpdate(
                args.id,
                { ...args },
                { new: true }
            );
            return updatedPortfolio;
        },
        deletePortfolio: async (parent, args) => {
            await Portfolio.findByIdAndDelete(args.id);
            return "Portfolio deleted";
        },
    },
};

module.exports = resolvers;