import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [day, setDay] = useState("");

    useEffect(() => {
        const fetchDoctors = async () => {
            const res = await API.get("/doctors");
            setDoctors(res.data.doctors);
        };

        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter((doctor) => {
        const matchesSearch =
            doctor.name.toLowerCase().includes(search.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(search.toLowerCase());

        const matchesSpecialization = specialization
            ? doctor.specialization === specialization
            : true;

        const matchesDay = day ? doctor.availableDays.includes(day) : true;

        return matchesSearch && matchesSpecialization && matchesDay;
    });

    const specializations = [...new Set(doctors.map((doctor) => doctor.specialization))];

    return (
        <DashboardLayout title="Find Doctors">
            <div className="bg-white p-5 rounded-xl shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                    type="text"
                    placeholder="Search doctor or specialization..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-3 rounded-lg"
                />

                <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="border p-3 rounded-lg"
                >
                    <option value="">All Specializations</option>
                    {specializations.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </select>

                <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="border p-3 rounded-lg"
                >
                    <option value="">All Days</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                </select>
            </div>

            <p className="mb-4 text-slate-600">
                Showing {filteredDoctors.length} doctor(s)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDoctors.length === 0 ? (
                    <p className="text-slate-500">No doctors found.</p>
                ) : (
                    filteredDoctors.map((doctor) => (
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

                            <div className="mt-5 flex gap-3">
                                <Link to={`/doctor/${doctor._id}`} className="flex-1">
                                    <button className="w-full bg-slate-200 text-slate-800 py-2 rounded-lg">
                                        View Profile
                                    </button>
                                </Link>

                                <Link to={`/book-appointment/${doctor._id}`} className="flex-1">
                                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
                                        Book
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
}

export default Doctors;