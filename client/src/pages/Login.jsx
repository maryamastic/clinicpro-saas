import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/auth/login", form);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            if (res.data.user.role === "admin") navigate("/admin");
            else if (res.data.user.role === "doctor") navigate("/doctor-dashboard");
            else navigate("/patient-dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
                <h1 className="text-3xl font-bold text-center text-slate-900">
                    ClinicPro
                </h1>
                <p className="text-center text-slate-500 mt-2 mb-6">
                    Login to your account
                </p>

                {error && (
                    <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                        {error}
                    </p>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
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

                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium">
                        Login
                    </button>
                </form>

                <p className="text-center text-sm text-slate-600 mt-6">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="text-blue-600 font-medium">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;