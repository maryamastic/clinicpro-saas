import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

function DoctorProfile() {
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        const fetchDoctor = async () => {
            const res = await API.get(`/doctors/${doctorId}`);
            setDoctor(res.data);
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
            <div className="max-w-3xl bg-white rounded-xl shadow p-8">
                <div className="h-40 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                    <span className="text-6xl">👨‍⚕️</span>
                </div>

                <h1 className="text-3xl font-bold">{doctor.name}</h1>
                <p className="text-blue-600 text-lg font-medium mt-1">
                    {doctor.specialization}
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
        </DashboardLayout>
    );
}

export default DoctorProfile;