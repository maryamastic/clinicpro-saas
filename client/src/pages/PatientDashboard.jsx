import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";

function PatientDashboard() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            const res = await API.get("/appointments/my");
            setAppointments(res.data.appointments);
        };

        fetchAppointments();
    }, []);

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
                {appointments.length === 0 ? (
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
                        </div>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
}

export default PatientDashboard;