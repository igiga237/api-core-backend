const Contact = require('/models/Contact');

const resolvers = {
    Query: {
        contacts: async () => await Contact.find(),
    },
    Mutation: {
        addContact: async (_, { name, email, phone, subject, message }) => {
            const newContact = new Contact({ name, email, phone, subject, message });
            return await newContact.save();
        },
    },
};

module.exports = resolvers;
