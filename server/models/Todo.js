const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxLength: 50,
        },
        description: {
            type: String,
            required: true,
            maxLength: 50,
        },
        completed: {
            type: Boolean,
            required: true,
            default: false,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        dueDate: {
            type: Date,
        },
        tags: {
            type: [String],
            default: [],
        },
        createAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
        updateAt: {
            type: Date,
            required: true,
            default: Date.now,
        }
    })

module.exports = mongoose.model("Todo", todoSchema);