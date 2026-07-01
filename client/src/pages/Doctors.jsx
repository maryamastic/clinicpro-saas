import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

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
        <div>
            <h1>Doctors</h1>

            {doctors.map((doctor) => (
                <div key={doctor._id}>
                    <h2>{doctor.name}</h2>
                    <p>Specialization: {doctor.specialization}</p>
                    <p>Experience: {doctor.experience} years</p>
                    <p>Fee: Rs. {doctor.fee}</p>
                    <p>Available: {doctor.availableDays.join(", ")}</p>
                    <p>Time: {doctor.availableTime}</p>

                    <Link to={`/book-appointment/${doctor._id}`}>
                        <button>Book Appointment</button>
                    </Link>

                    <hr />
                </div>
            ))}
        </div>
    );
}

export default Doctors;