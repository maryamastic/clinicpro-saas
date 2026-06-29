const express = require("express");
const router = express.Router();

const {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
} = require("../controllers/doctorController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.get("/", getDoctors);
router.get("/:id", getDoctorById);

router.post("/", protect, authorizeRoles("admin"), createDoctor);
router.put("/:id", protect, authorizeRoles("admin"), updateDoctor);
router.delete("/:id", protect, authorizeRoles("admin"), deleteDoctor);

module.exports = router;