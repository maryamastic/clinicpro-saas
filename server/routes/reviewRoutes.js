const express = require("express");
const router = express.Router();

const {
    createReview,
    getDoctorReviews
} = require("../controllers/reviewController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, authorizeRoles("patient"), createReview);
router.get("/doctor/:doctorId", protect, getDoctorReviews);

module.exports = router;