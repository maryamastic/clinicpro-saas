import { useEffect, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

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
        setForm({ ...form, [e.target.name]: e.target.value });
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
        <DashboardLayout title="Admin Dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-bold mb-4">Add Doctor</h2>

                    <form onSubmit={addDoctor} className="space-y-3">
                        {Object.keys(form).map((field) => (
                            <input
                                key={field}
                                name={field}
                                placeholder={field}
                                value={form[field]}
                                onChange={handleChange}
                                className="w-full border p-3 rounded-lg"
                                required={field !== "imageUrl"}
                            />
                        ))}

                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                            Add Doctor
                        </button>
                    </form>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4">Doctors List</h2>

                    <div className="space-y-4">
                        {doctors.map((doctor) => (
                            <div key={doctor._id} className="bg-white p-5 rounded-xl shadow">
                                <h3 className="text-lg font-bold">{doctor.name}</h3>
                                <p className="text-slate-600">{doctor.specialization}</p>
                                <p>{doctor.email}</p>
                                <p>Fee: Rs. {doctor.fee}</p>

                                <button
                                    onClick={() => deleteDoctor(doctor._id)}
                                    className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default AdminDashboard;