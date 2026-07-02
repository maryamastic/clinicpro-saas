import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

function PatientDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [reviewForm, setReviewForm] = useState({
        appointmentId: "",
        doctorId: "",
        rating: 5,
        comment: "",
    });

    const fetchAppointments = async () => {
        try {
            const res = await API.get("/appointments/my");
            setAppointments(res.data.appointments);
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to load appointments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const openReviewForm = (appointment) => {
        setReviewForm({
            appointmentId: appointment._id,
            doctorId: appointment.doctor._id,
            rating: 5,
            comment: "",
        });
    };

    const submitReview = async (e) => {
        e.preventDefault();

        try {
            await API.post("/reviews", {
                doctor: reviewForm.doctorId,
                appointment: reviewForm.appointmentId,
                rating: Number(reviewForm.rating),
                comment: reviewForm.comment,
            });

            toast.success("Review submitted successfully");

            setReviewForm({
                appointmentId: "",
                doctorId: "",
                rating: 5,
                comment: "",
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        }
    };

    const total = appointments.length;
    const pending = appointments.filter((a) => a.status === "pending").length;
    const accepted = appointments.filter((a) => a.status === "accepted").length;
    const rejected = appointments.filter((a) => a.status === "rejected").length;

    return (
        <DashboardLayout title="Patient Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl shadow">
                    <p className="text-slate-500">Total Appointments</p>
                    <h3 className="text-3xl font-bold">{total}</h3>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                    <p className="text-slate-500">Pending</p>
                    <h3 className="text-3xl font-bold text-yellow-600">{pending}</h3>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                    <p className="text-slate-500">Accepted</p>
                    <h3 className="text-3xl font-bold text-green-600">{accepted}</h3>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                    <p className="text-slate-500">Rejected</p>
                    <h3 className="text-3xl font-bold text-red-600">{rejected}</h3>
                </div>
            </div>

            <Link to="/doctors">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    Book New Appointment
                </button>
            </Link>

            <h2 className="text-xl font-semibold mt-6 mb-4">My Appointments</h2>

            <div className="space-y-4">
                {loading ? (
                    <Loader text="Loading appointments..." />
                ) : appointments.length === 0 ? (
                    <p className="text-slate-500">No appointments yet.</p>
                ) : (
                    appointments.map((item) => (
                        <div key={item._id} className="bg-white p-5 rounded-xl shadow">
                            <h3 className="text-lg font-bold">{item.doctor.name}</h3>
                            <p>{item.doctor.specialization}</p>
                            <p>
                                {item.appointmentDate} at {item.appointmentTime}
                            </p>
                            <p>
                                Status:{" "}
                                <span className="font-semibold uppercase">{item.status}</span>
                            </p>

                            {item.status === "accepted" && (
                                <button
                                    onClick={() => openReviewForm(item)}
                                    className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Leave Review
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            {reviewForm.appointmentId && (
                <div className="mt-8 bg-white p-6 rounded-xl shadow max-w-xl">
                    <h2 className="text-xl font-bold mb-4">Leave a Review</h2>

                    <form onSubmit={submitReview} className="space-y-4">
                        <select
                            value={reviewForm.rating}
                            onChange={(e) =>
                                setReviewForm({ ...reviewForm, rating: e.target.value })
                            }
                            className="w-full border p-3 rounded-lg"
                        >
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Good</option>
                            <option value="3">3 - Average</option>
                            <option value="2">2 - Poor</option>
                            <option value="1">1 - Bad</option>
                        </select>

                        <textarea
                            value={reviewForm.comment}
                            onChange={(e) =>
                                setReviewForm({ ...reviewForm, comment: e.target.value })
                            }
                            placeholder="Write your review..."
                            required
                            className="w-full border p-3 rounded-lg"
                            rows="4"
                        />

                        <div className="flex gap-3">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                                Submit Review
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setReviewForm({
                                        appointmentId: "",
                                        doctorId: "",
                                        rating: 5,
                                        comment: "",
                                    })
                                }
                                className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </DashboardLayout>
    );
}

export default PatientDashboard;