import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

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
        setForm({ ...form, [e.target.name]: e.target.value });
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
        <DashboardLayout title="Book Appointment">
            <div className="max-w-xl bg-white p-6 rounded-xl shadow">
                {message && (
                    <p className="mb-4 text-green-600 font-medium">{message}</p>
                )}

                <form onSubmit={handleBook} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Appointment Date</label>
                        <input
                            type="date"
                            name="appointmentDate"
                            value={form.appointmentDate}
                            onChange={handleChange}
                            required
                            className="w-full border p-3 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Appointment Time</label>
                        <input
                            type="text"
                            name="appointmentTime"
                            placeholder="Example: 7:00 PM"
                            value={form.appointmentTime}
                            onChange={handleChange}
                            required
                            className="w-full border p-3 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Reason</label>
                        <textarea
                            name="reason"
                            placeholder="Reason for appointment"
                            value={form.reason}
                            onChange={handleChange}
                            required
                            className="w-full border p-3 rounded-lg"
                            rows="4"
                        />
                    </div>

                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg">
                        Confirm Booking
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}

export default BookAppointment;