import { useEffect, useState } from "react";
import API from "../services/api";

function AdminDashboard() {
    const [doctors, setDoctors] = useState([]);

    const [form, setForm] = useState({
        name: "",
        specialization: "",
        email: "",
        phone: "",
        experience: "",
        fee: "",
        availableDays: "",
        availableTime: "",
        imageUrl: "",
    });

    const fetchDoctors = async () => {
        const res = await API.get("/doctors");
        setDoctors(res.data.doctors);
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const addDoctor = async (e) => {
        e.preventDefault();

        await API.post("/doctors", {
            ...form,
            experience: Number(form.experience),
            fee: Number(form.fee),
            availableDays: form.availableDays.split(",").map((day) => day.trim()),
        });

        setForm({
            name: "",
            specialization: "",
            email: "",
            phone: "",
            experience: "",
            fee: "",
            availableDays: "",
            availableTime: "",
            imageUrl: "",
        });

        fetchDoctors();
    };

    const deleteDoctor = async (id) => {
        await API.delete(`/doctors/${id}`);
        fetchDoctors();
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>

            <h2>Add Doctor</h2>

            <form onSubmit={addDoctor}>
                <input name="name" placeholder="Doctor Name" value={form.name} onChange={handleChange} required />
                <br />

                <input name="specialization" placeholder="Specialization" value={form.specialization} onChange={handleChange} required />
                <br />

                <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <br />

                <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
                <br />

                <input name="experience" placeholder="Experience" value={form.experience} onChange={handleChange} required />
                <br />

                <input name="fee" placeholder="Fee" value={form.fee} onChange={handleChange} required />
                <br />

                <input name="availableDays" placeholder="Monday, Wednesday, Friday" value={form.availableDays} onChange={handleChange} required />
                <br />

                <input name="availableTime" placeholder="5:00 PM - 9:00 PM" value={form.availableTime} onChange={handleChange} required />
                <br />

                <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} />
                <br />

                <button type="submit">Add Doctor</button>
            </form>

            <h2>Doctors List</h2>

            {doctors.map((doctor) => (
                <div key={doctor._id}>
                    <h3>{doctor.name}</h3>
                    <p>{doctor.specialization}</p>
                    <p>{doctor.email}</p>
                    <p>Fee: Rs. {doctor.fee}</p>

                    <button onClick={() => deleteDoctor(doctor._id)}>
                        Delete
                    </button>

                    <hr />
                </div>
            ))}
        </div>
    );
}

export default AdminDashboard;