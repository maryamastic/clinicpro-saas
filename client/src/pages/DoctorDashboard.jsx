import { useEffect, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);

    const fetchAppointments = async () => {
        const res = await API.get("/appointments/my");
        setAppointments(res.data.appointments);
    };

    const updateStatus = async (id, status) => {
        await API.put(`/appointments/${id}/status`, { status });
        fetchAppointments();
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return (
        <DashboardLayout title="Doctor Dashboard">
            <h2 className="text-xl font-semibold mb-4">Appointments</h2>

            <div className="grid gap-4">
                {appointments.length === 0 ? (
                    <p className="text-slate-500">No appointments found.</p>
                ) : (
                    appointments.map((item) => (
                        <div key={item._id} className="bg-white p-5 rounded-xl shadow">
                            <h3 className="text-lg font-bold">Patient: {item.patient.name}</h3>
                            <p className="text-slate-600">Email: {item.patient.email}</p>
                            <p>Date: {item.appointmentDate}</p>
                            <p>Time: {item.appointmentTime}</p>
                            <p>Reason: {item.reason}</p>

                            <p className="mt-2">
                                Status:{" "}
                                <span className="font-semibold uppercase">{item.status}</span>
                            </p>

                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={() => updateStatus(item._id, "accepted")}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Accept
                                </button>

                                <button
                                    onClick={() => updateStatus(item._id, "rejected")}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
}

export default DoctorDashboard;