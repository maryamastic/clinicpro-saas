const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

router.post("/", appointmentController.bookAppointment);

router.get("/my", appointmentController.getMyAppointments);

router.put("/:id/status", appointmentController.updateStatus);

module.exports = router;