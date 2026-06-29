const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        specialization: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true
        },
        experience: {
            type: Number,
            default: 0
        },
        fee: {
            type: Number,
            required: true
        },
        availableDays: {
            type: [String],
            default: []
        },
        availableTime: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Doctor", doctorSchema);