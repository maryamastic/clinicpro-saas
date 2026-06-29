const Doctor = require("../models/Doctor");

const createDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.create(req.body);

        res.status(201).json({
            message: "Doctor created successfully",
            doctor
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create doctor",
            error: error.message
        });
    }
};

const getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().sort({ createdAt: -1 });

        res.json({
            count: doctors.length,
            doctors
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to get doctors",
            error: error.message
        });
    }
};

const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        res.json(doctor);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get doctor",
            error: error.message
        });
    }
};

const updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        res.json({
            message: "Doctor updated successfully",
            doctor
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update doctor",
            error: error.message
        });
    }
};

const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        res.json({
            message: "Doctor deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete doctor",
            error: error.message
        });
    }
};

module.exports = {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
};