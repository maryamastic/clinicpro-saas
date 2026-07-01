import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function BookAppointment() {
    const { doctorId } = useParams();
    const navigate = useNavigate();

    const [availableSlots, setAvailableSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const [form, setForm] = useState({
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
    });

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!form.appointmentDate) return;

            try {
                setLoadingSlots(true);
                setForm((prev) => ({ ...prev, appointmentTime: "" }));

                const res = await API.get(
                    `/appointments/available-slots?doctor=${doctorId}&date=${form.appointmentDate}`
                );

                setAvailableSlots(res.data.availableSlots);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to load slots");
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchAvailableSlots();
    }, [form.appointmentDate, doctorId]);

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
                <form onSubmit={handleBook} className="space-y-5">
                    <div>
                        <label className="block mb-1 font-medium">Appointment Date</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => {
                                setSelectedDate(date);

                                const formattedDate = date.toISOString().split("T")[0];

                                setForm({
                                    ...form,
                                    appointmentDate: formattedDate,
                                    appointmentTime: "",
                                });
                            }}
                            minDate={new Date()}
                            placeholderText="Select appointment date"
                            className="w-full border p-3 rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">Available Time Slots</label>

                        {!form.appointmentDate && (
                            <p className="text-sm text-slate-500">
                                Select a date to view available slots.
                            </p>
                        )}

                        {loadingSlots && (
                            <p className="text-sm text-blue-600">Loading available slots...</p>
                        )}

                        {form.appointmentDate && !loadingSlots && availableSlots.length === 0 && (
                            <p className="text-sm text-red-600">
                                No slots available for this date.
                            </p>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {availableSlots.map((time) => (
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