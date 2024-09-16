const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList } = require('graphql');
const Newsletter = require('../../models/newsletter'); // Adjusted path

// Define the Newsletter Type
const NewsletterType = new GraphQLObjectType({
    name: 'Newsletter',
    fields: () => ({
        email: { type: GraphQLString },
        subscribedAt: { type: GraphQLString },
    }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        newsletters: {
            type: new GraphQLList(NewsletterType),
            resolve(parent, args) {
                // Fetch all subscribers from MongoDB
                return Newsletter.find();
            },
        },
    },
});

// Mutation for adding a new subscriber
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addNewsletter: {
            type: NewsletterType,
            args: {
                email: { type: GraphQLString },
            },
            async resolve(parent, args) {
                // Create a new subscriber
                const newSubscriber = new Newsletter({ email: args.email });
                try {
                    // Save to MongoDB
                    return await newSubscriber.save();
                } catch (err) {
                    throw new Error('Email already subscribed or invalid');
                }
            },
        },
    },
});

// Export the GraphQL schema
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});