import { useEffect, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";
import { toast } from "react-toastify";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function AdminDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

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

    const fetchAppointments = async () => {
        const res = await API.get("/appointments/my");
        setAppointments(res.data.appointments);
    };

    useEffect(() => {
        fetchDoctors();
        fetchAppointments();
    }, []);

    const totalDoctors = doctors.length;
    const totalAppointments = appointments.length;
    const pending = appointments.filter((a) => a.status === "pending").length;
    const accepted = appointments.filter((a) => a.status === "accepted").length;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async () => {
        if (!imageFile) {
            toast.error("Please choose an image first");
            return "";
        }

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("image", imageFile);

            const res = await API.post("/upload/doctor-image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Image uploaded successfully");
            return res.data.imageUrl;
        } catch (error) {
            toast.error(error.response?.data?.message || "Image upload failed");
            return "";
        } finally {
            setUploading(false);
        }
    };

    const addDoctor = async (e) => {
        e.preventDefault();

        try {
            let uploadedImageUrl = form.imageUrl;

            if (imageFile) {
                uploadedImageUrl = await handleImageUpload();

                if (!uploadedImageUrl) {
                    return;
                }
            }

            await API.post("/doctors", {
                ...form,
                imageUrl: uploadedImageUrl,
                experience: Number(form.experience),
                fee: Number(form.fee),
                availableDays: form.availableDays.split(",").map((day) => day.trim()),
            });

            toast.success("Doctor added successfully");

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

            setImageFile(null);
            fetchDoctors();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add doctor");
        }
    };

    const deleteDoctor = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this doctor?");
        if (!confirmed) return;

        try {
            await API.delete(`/doctors/${id}`);
            toast.success("Doctor deleted successfully");
            fetchDoctors();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete doctor");
        }
    };

    const statusChartData = [
        { name: "Pending", value: pending },
        { name: "Accepted", value: accepted },
        {
            name: "Rejected",
            value: appointments.filter((a) => a.status === "rejected").length,
        },
    ];

    const specializationData = Object.values(
        doctors.reduce((acc, doctor) => {
            acc[doctor.specialization] = acc[doctor.specialization] || {
                specialization: doctor.specialization,
                count: 0,
            };

            acc[doctor.specialization].count += 1;
            return acc;
        }, {})
    );

    return (
        <DashboardLayout title="Admin Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-xl shadow">
                    <p className="text-slate-500">Total Doctors</p>
                    <h3 className="text-3xl font-bold">{totalDoctors}</h3>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                    <p className="text-slate-500">Total Appointments</p>
                    <h3 className="text-3xl font-bold">{totalAppointments}</h3>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                    <p className="text-slate-500">Pending</p>
                    <h3 className="text-3xl font-bold text-yellow-600">{pending}</h3>
                </div>

                <div className="bg-white p-5 rounded-xl shadow">
                    <p className="text-slate-500">Accepted</p>
                    <h3 className="text-3xl font-bold text-green-600">{accepted}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                    <h2 className="text-xl font-bold mb-4">Add Doctor</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-xl font-bold mb-4">Appointment Status</h2>

                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={statusChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={90}
                                        label
                                    >
                                        {statusChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow">
                            <h2 className="text-xl font-bold mb-4">Doctors by Specialization</h2>

                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={specializationData}>
                                    <XAxis dataKey="specialization" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>


                    <form onSubmit={addDoctor} className="space-y-3">
                        <input
                            name="name"
                            placeholder="Doctor Name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                            required
                        />

                        <input
                            name="specialization"
                            placeholder="Specialization"
                            value={form.specialization}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                            required
                        />

                        <input
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                            required
                        />

                        <input
                            name="phone"
                            placeholder="Phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                            required
                        />

                        <input
                            name="experience"
                            placeholder="Experience"
                            value={form.experience}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                            required
                        />

                        <input
                            name="fee"
                            placeholder="Fee"
                            value={form.fee}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                            required
                        />

                        <input
                            name="availableDays"
                            placeholder="Monday, Wednesday, Friday"
                            value={form.availableDays}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                            required
                        />

                        <input
                            name="availableTime"
                            placeholder="5:00 PM - 9:00 PM"
                            value={form.availableTime}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Doctor Image
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files[0])}
                                className="w-full border p-3 rounded-lg"
                            />

                            {imageFile && (
                                <p className="text-sm text-slate-500 mt-1">
                                    Selected: {imageFile.name}
                                </p>
                            )}
                        </div>

                        <input
                            name="imageUrl"
                            placeholder="Optional image URL"
                            value={form.imageUrl}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                        />

                        <button
                            disabled={uploading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-slate-400"
                        >
                            {uploading ? "Uploading..." : "Add Doctor"}
                        </button>
                    </form>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4">Doctors List</h2>

                    <div className="space-y-4">
                        {doctors.map((doctor) => (
                            <div key={doctor._id} className="bg-white p-5 rounded-xl shadow">
                                {doctor.imageUrl ? (
                                    <img
                                        src={doctor.imageUrl}
                                        alt={doctor.name}
                                        className="w-full h-40 object-cover rounded-lg mb-4"
                                    />
                                ) : (
                                    <div className="w-full h-40 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                        <span className="text-4xl">👨‍⚕️</span>
                                    </div>
                                )}

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