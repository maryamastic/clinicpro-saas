import { useEffect, useState } from "react";
import API from "../services/api";

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
        <div>
            <h1>Doctor Dashboard</h1>

            {appointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                appointments.map((item) => (
                    <div key={item._id}>
                        <h3>Patient: {item.patient.name}</h3>
                        <p>Email: {item.patient.email}</p>
                        <p>Date: {item.appointmentDate}</p>
                        <p>Time: {item.appointmentTime}</p>
                        <p>Reason: {item.reason}</p>
                        <p>Status: {item.status}</p>

                        <button onClick={() => updateStatus(item._id, "accepted")}>
                            Accept
                        </button>

                        <button onClick={() => updateStatus(item._id, "rejected")}>
                            Reject
                        </button>

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}

export default DoctorDashboard;