const express = require("express");
const router = express.Router();

const {
    bookAppointment,
    getMyAppointments,
    updateAppointmentStatus
} = require("../controllers/appointmentController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", protect, authorizeRoles("patient"), bookAppointment);

router.get("/my", protect, getMyAppointments);

router.put(
    "/:id/status",
    protect,
    authorizeRoles("doctor", "admin"),
    updateAppointmentStatus
);

module.exports = router;