import { Link, useNavigate } from "react-router-dom";

function DashboardLayout({ children, title }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex bg-slate-100">
            <aside className="w-64 bg-slate-900 text-white p-6">
                <h1 className="text-2xl font-bold mb-8">ClinicPro</h1>

                <nav className="space-y-3">
                    <Link className="block hover:text-blue-300" to="/patient-dashboard">
                        Patient Dashboard
                    </Link>
                    <Link className="block hover:text-blue-300" to="/doctor-dashboard">
                        Doctor Dashboard
                    </Link>
                    <Link className="block hover:text-blue-300" to="/admin">
                        Admin Dashboard
                    </Link>
                    <Link className="block hover:text-blue-300" to="/doctors">
                        Doctors
                    </Link>
                </nav>
            </aside>

            <main className="flex-1">
                <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-semibold">{title}</h2>
                        <p className="text-sm text-slate-500">
                            Logged in as {user?.name} ({user?.role})
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                        Logout
                    </button>
                </header>

                <section className="p-8">{children}</section>
            </main>
        </div>
    );
}

export default DashboardLayout;