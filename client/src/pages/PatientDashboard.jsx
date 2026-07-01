import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function PatientDashboard() {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            const res = await API.get("/appointments/my");
            setAppointments(res.data.appointments);
        };

        fetchAppointments();
    }, []);

    return (
        <div>
            <h1>Patient Dashboard</h1>

            <Link to="/doctors">
                <button>Book New Appointment</button>
            </Link>

            <h2>My Appointments</h2>

            {appointments.length === 0 ? (
                <p>No appointments yet.</p>
            ) : (
                appointments.map((item) => (
                    <div key={item._id}>
                        <h3>{item.doctor.name}</h3>
                        <p>{item.doctor.specialization}</p>
                        <p>{item.appointmentDate} at {item.appointmentTime}</p>
                        <p>Status: {item.status}</p>
                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}

export default PatientDashboard;