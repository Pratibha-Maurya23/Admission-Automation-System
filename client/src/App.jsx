import { useState,useEffect  } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Header from "./components/Header";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";
import AdmissionFormPage from "./pages/AdmissionFormPage";
import PaymentPage from "./pages/PaymentPage";
import OtpLogin from "./pages/OtpLogin";

import { API_URL } from "./config";

function App() {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ restore session on refresh
  useEffect(() => {
  fetch(`${API_URL}/me`, {
    credentials: "include",
  })
    .then((res) => {
      if (!res.ok) throw new Error("Not logged in");
      return res.json();
    })
    .then((data) => setCurrentStudent(data))
    .catch(() => setCurrentStudent(null))
    .finally(() => setLoading(false));
}, []);

  const handleLogin = (student) => {
    setCurrentStudent(student);
  };


    const handleLogout = async () => {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    setCurrentStudent(null);
  };

  if (loading) return null;

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        
        {/* Header */}
        <Header
          student={currentStudent}
          onLogout={handleLogout}
        />

        <main className="flex-grow">
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />

            <Route
              path="/login"
              element={
                <LoginPage onLogin={handleLogin} />
              }
            />

            <Route
              path="/admission"
              element={<AdmissionFormPage />}
            />

            {/* Protected Dashboard */}
            <Route
              path="/dashboard"
              element={
                currentStudent ? (
                  <UserDashboard student={currentStudent} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/payment/:studentId" element={<PaymentPage />} />
            <Route path="/otp-login" element={<OtpLogin onLogin={handleLogin} />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
