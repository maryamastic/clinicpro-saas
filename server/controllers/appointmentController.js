const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const sendEmail = require("../services/emailService");

const bookAppointment = async (req, res) => {
    try {
        const { doctor, appointmentDate, appointmentTime, reason } = req.body;
        const patient = req.user._id;
        if (!patient || !doctor || !appointmentDate || !appointmentTime || !reason) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const doctorExists = await Doctor.findById(doctor);

        if (!doctorExists) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        const existingAppointment = await Appointment.findOne({
            doctor,
            appointmentDate,
            appointmentTime,
            status: { $in: ["pending", "accepted"] }
        });

        if (existingAppointment) {
            return res.status(400).json({
                message: "This time slot is already booked. Please choose another time."
            });
        }


        const appointment = await Appointment.create({
            patient,
            doctor,
            appointmentDate,
            appointmentTime,
            reason
        });

        await sendEmail({
            to: req.user.email,
            subject: "Appointment Booked - ClinicPro",
            html: `
    <h2>Appointment Booked Successfully</h2>
    <p>Your appointment has been booked.</p>
    <p><strong>Date:</strong> ${appointmentDate}</p>
    <p><strong>Time:</strong> ${appointmentTime}</p>
    <p><strong>Reason:</strong> ${reason}</p>
  `,
        });

        res.status(201).json({
            message: "Appointment booked successfully",
            appointment
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to book appointment",
            error: error.message
        });
    }
};

const getMyAppointments = async (req, res) => {
    try {
        // await new Promise((resolve) => setTimeout(resolve, 2000)); testing loaders
        let filter = {};

        if (req.user.role === "patient") {
            filter.patient = req.user._id;
        }

        if (req.user.role === "doctor") {
            filter = {};
        }

        if (req.user.role === "admin") {
            filter = {};
        }

        const appointments = await Appointment.find(filter)
            .populate("doctor")
            .populate("patient", "name email role")
            .sort({ createdAt: -1 });

        res.json({
            count: appointments.length,
            appointments
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to get appointments",
            error: error.message
        });
    }
};

const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["pending", "accepted", "rejected", "cancelled"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        )
            .populate("doctor")
            .populate("patient", "name email role");

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        res.json({
            message: "Appointment status updated successfully",
            appointment
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update appointment status",
            error: error.message
        });
    }
};

const getAvailableSlots = async (req, res) => {
    try {
        const { doctor, date } = req.query;

        if (!doctor || !date) {
            return res.status(400).json({
                message: "Doctor id and date are required"
            });
        }

        const allSlots = [
            "4:00 PM",
            "5:00 PM",
            "6:00 PM",
            "7:00 PM",
            "8:00 PM"
        ];

        const bookedAppointments = await Appointment.find({
            doctor,
            appointmentDate: date,
            status: { $in: ["pending", "accepted"] }
        });

        const bookedSlots = bookedAppointments.map(
            (appointment) => appointment.appointmentTime
        );

        const availableSlots = allSlots.filter(
            (slot) => !bookedSlots.includes(slot)
        );

        res.json({
            doctor,
            date,
            availableSlots
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to get available slots",
            error: error.message
        });
    }
};


module.exports = {
    bookAppointment,
    getMyAppointments,
    updateAppointmentStatus,
    getAvailableSlots
};