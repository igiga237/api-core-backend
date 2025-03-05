const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    translations: [
        {
            language: { type: String,},
            name: { type: String},
            description: { type: String},
        }
    ],
}, {
    timestamps: true
});

module.exports =  mongoose.model("Category", categorySchema);