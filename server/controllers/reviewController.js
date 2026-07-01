const Review = require("../models/Review");
const Appointment = require("../models/Appointment");

const createReview = async (req, res) => {
    try {
        const { doctor, appointment, rating, comment } = req.body;

        if (!doctor || !appointment || !rating || !comment) {
            return res.status(400).json({
                message: "Doctor, appointment, rating and comment are required"
            });
        }

        const appointmentExists = await Appointment.findById(appointment);

        if (!appointmentExists) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        if (appointmentExists.patient.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You can only review your own appointment"
            });
        }

        if (appointmentExists.status !== "accepted") {
            return res.status(400).json({
                message: "You can only review accepted appointments"
            });
        }

        const review = await Review.create({
            patient: req.user._id,
            doctor,
            appointment,
            rating,
            comment
        });

        res.status(201).json({
            message: "Review added successfully",
            review
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "You have already reviewed this appointment"
            });
        }

        res.status(500).json({
            message: "Failed to add review",
            error: error.message
        });
    }
};

const getDoctorReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ doctor: req.params.doctorId })
            .populate("patient", "name email")
            .sort({ createdAt: -1 });

        const averageRating =
            reviews.length === 0
                ? 0
                : reviews.reduce((sum, review) => sum + review.rating, 0) /
                reviews.length;

        res.json({
            count: reviews.length,
            averageRating: Number(averageRating.toFixed(1)),
            reviews
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to get reviews",
            error: error.message
        });
    }
};

module.exports = {
    createReview,
    getDoctorReviews
};