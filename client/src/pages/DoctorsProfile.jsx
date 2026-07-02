import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

function DoctorProfile() {
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchDoctor = async () => {
            const doctorRes = await API.get(`/doctors/${doctorId}`);
            setDoctor(doctorRes.data);

            const reviewRes = await API.get(`/reviews/doctor/${doctorId}`);
            setReviews(reviewRes.data.reviews);
            setAverageRating(reviewRes.data.averageRating);
        };

        fetchDoctor();
    }, [doctorId]);

    if (!doctor) {
        return (
            <DashboardLayout title="Doctor Profile">
                <p>Loading doctor profile...</p>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Doctor Profile">
            <div className="max-w-4xl bg-white rounded-xl shadow p-8">
                {doctor.imageUrl ? (
                    <img
                        src={doctor.imageUrl}
                        alt={doctor.name}
                        className="h-64 w-full object-cover rounded-xl mb-6"
                    />
                ) : (
                    <div className="h-40 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                        <span className="text-6xl">👨‍⚕️</span>
                    </div>
                )}

                <h1 className="text-3xl font-bold">{doctor.name}</h1>
                <p className="text-blue-600 text-lg font-medium mt-1">
                    {doctor.specialization}
                </p>

                <p className="mt-3 text-yellow-600 font-semibold">
                    ⭐ {averageRating} / 5 ({reviews.length} review(s))
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-slate-700">
                    <p><strong>Email:</strong> {doctor.email}</p>
                    <p><strong>Phone:</strong> {doctor.phone}</p>
                    <p><strong>Experience:</strong> {doctor.experience} years</p>
                    <p><strong>Fee:</strong> Rs. {doctor.fee}</p>
                    <p><strong>Available Days:</strong> {doctor.availableDays.join(", ")}</p>
                    <p><strong>Available Time:</strong> {doctor.availableTime}</p>
                </div>

                <div className="mt-8 flex gap-3">
                    <Link to={`/book-appointment/${doctor._id}`}>
                        <button className="bg-blue-600 text-white px-5 py-3 rounded-lg">
                            Book Appointment
                        </button>
                    </Link>

                    <Link to="/doctors">
                        <button className="bg-slate-200 text-slate-800 px-5 py-3 rounded-lg">
                            Back to Doctors
                        </button>
                    </Link>
                </div>
            </div>

            <div className="max-w-4xl mt-6 bg-white rounded-xl shadow p-8">
                <h2 className="text-2xl font-bold mb-4">Patient Reviews</h2>

                {reviews.length === 0 ? (
                    <p className="text-slate-500">No reviews yet.</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review._id} className="border-b pb-4">
                                <p className="font-semibold">{review.patient.name}</p>
                                <p className="text-yellow-600">⭐ {review.rating} / 5</p>
                                <p className="text-slate-700">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default DoctorProfile;