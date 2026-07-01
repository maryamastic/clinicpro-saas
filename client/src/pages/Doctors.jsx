import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

function Doctors() {
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            const res = await API.get("/doctors");
            setDoctors(res.data.doctors);
        };

        fetchDoctors();
    }, []);

    return (
        <DashboardLayout title="Find Doctors">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                    <div key={doctor._id} className="bg-white rounded-xl shadow p-6">
                        <div className="h-32 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-4xl">👨‍⚕️</span>
                        </div>

                        <h2 className="text-xl font-bold">{doctor.name}</h2>
                        <p className="text-blue-600 font-medium">{doctor.specialization}</p>

                        <div className="mt-4 space-y-2 text-sm text-slate-600">
                            <p>Experience: {doctor.experience} years</p>
                            <p>Fee: Rs. {doctor.fee}</p>
                            <p>Available: {doctor.availableDays.join(", ")}</p>
                            <p>Time: {doctor.availableTime}</p>
                        </div>

                        <Link to={`/book-appointment/${doctor._id}`}>
                            <button className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg">
                                Book Appointment
                            </button>
                        </Link>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}

export default Doctors;