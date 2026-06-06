import { GraduationCap } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Header({ student, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
          <div
            className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl 
                          flex items-center justify-center text-white font-bold text-lg 
                          shadow-md group-hover:scale-110 transition"
          >
            SI
          </div>

          <div>
            <div className="font-extrabold text-xl text-gray-900 group-hover:text-blue-600 transition">
              Skyline Institute
            </div>
            <div className="text-xs text-gray-500 -mt-1">
              Institute of Technology
            </div>
          </div>
        </Link>

          <nav className="hidden md:flex items-center gap-6">

            {/* PUBLIC */}
            {!student && (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/login">Login</NavLink>
                <Link
                to="/admission"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 
                           text-white shadow hover:shadow-lg transform hover:-translate-y-1 transition"
              >
                New Admission
              </Link>
              </>
            )}

            {/* AFTER LOGIN */}
            {student && (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>

                <button
                  onClick={() => {
                    onLogout();
                    navigate("/");
                  }}
                  className="text-red-600 font-medium"
                >
                  Logout
                </button>
              </>
            )}

          </nav>
        </div>
      </div>
    </header>
  );
}
