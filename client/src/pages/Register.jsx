import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "patient",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await API.post("/auth/register", form);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
                <h1 className="text-3xl font-bold text-center text-slate-900">
                    Create Account
                </h1>
                <p className="text-center text-slate-500 mt-2 mb-6">
                    Join ClinicPro today
                </p>

                {error && (
                    <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                        {error}
                    </p>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        className="w-full border p-3 rounded-lg"
                        name="name"
                        placeholder="Full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="w-full border p-3 rounded-lg"
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="w-full border p-3 rounded-lg"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <select
                        className="w-full border p-3 rounded-lg"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                    >
                        <option value="patient">Patient</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                    </select>

                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium">
                        Register
                    </button>
                </form>

                <p className="text-center text-sm text-slate-600 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 font-medium">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;