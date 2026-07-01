const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

reviewSchema.index({ patient: 1, appointment: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);