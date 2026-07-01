import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function BookAppointment() {
    const { doctorId } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleBook = async (e) => {
        e.preventDefault();

        try {
            await API.post("/appointments", {
                doctor: doctorId,
                appointmentDate: form.appointmentDate,
                appointmentTime: form.appointmentTime,
                reason: form.reason,
            });

            setMessage("Appointment booked successfully!");

            setTimeout(() => {
                navigate("/patient-dashboard");
            }, 1000);
        } catch (error) {
            setMessage(error.response?.data?.message || "Booking failed");
        }
    };

    return (
        <div>
            <h1>Book Appointment</h1>

            {message && <p>{message}</p>}

            <form onSubmit={handleBook}>
                <input
                    type="date"
                    name="appointmentDate"
                    value={form.appointmentDate}
                    onChange={handleChange}
                    required
                />

                <br />

                <input
                    type="text"
                    name="appointmentTime"
                    placeholder="Example: 7:00 PM"
                    value={form.appointmentTime}
                    onChange={handleChange}
                    required
                />

                <br />

                <textarea
                    name="reason"
                    placeholder="Reason for appointment"
                    value={form.reason}
                    onChange={handleChange}
                    required
                />

                <br />

                <button type="submit">Confirm Booking</button>
            </form>
        </div>
    );
}

export default BookAppointment;