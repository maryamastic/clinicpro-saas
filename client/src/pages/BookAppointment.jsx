import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import { toast } from "react-toastify";

function BookAppointment() {
    const { doctorId } = useParams();
    const navigate = useNavigate();

    const timeSlots = [
        "4:00 PM",
        "5:00 PM",
        "6:00 PM",
        "7:00 PM",
        "8:00 PM",
    ];

    const [form, setForm] = useState({
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const selectTime = (time) => {
        setForm({ ...form, appointmentTime: time });
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

            toast.success("Appointment booked successfully!");
            setTimeout(() => {
                navigate("/patient-dashboard");
            }, 1000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Booking failed");
        }
    };

    return (
        <DashboardLayout title="Book Appointment">
            <div className="max-w-xl bg-white p-6 rounded-xl shadow">
                {message && (
                    <p className="mb-4 text-green-600 font-medium">{message}</p>
                )}

                <form onSubmit={handleBook} className="space-y-5">
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
                        <label className="block mb-2 font-medium">Select Time Slot</label>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {timeSlots.map((time) => (
                                <button
                                    type="button"
                                    key={time}
                                    onClick={() => selectTime(time)}
                                    className={`border py-3 rounded-lg ${form.appointmentTime === time
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-slate-700"
                                        }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>

                        {!form.appointmentTime && (
                            <p className="text-sm text-slate-500 mt-2">
                                Please select an appointment time.
                            </p>
                        )}
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

                    <button
                        disabled={!form.appointmentTime}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:bg-slate-400"
                    >
                        Confirm Booking
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
}

export default BookAppointment;