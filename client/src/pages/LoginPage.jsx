import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const [admissionNo, setAdmissionNo] = useState("");
  const [password, setPassword] = useState("");
  
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

 const handleLogin = async () => {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ admissionNo, password }),
    });

    if (!res.ok) {
      alert("Invalid credentials ❌");
      return;
    }

    const data = await res.json();
    onLogin(data.student);
    navigate("/dashboard");
  } catch (err) {
    alert("Server error ❌");
  }
};

  const handleForgotPassword = async () => {
    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admissionNo, newPassword }),
      });

      if (!res.ok) {
        alert("Failed to reset password ❌");
        return;
      }

      alert("Password reset successfully ✅");
      setShowForgotPassword(false);
      setNewPassword("");
    } catch (err) {
      alert("Server error ❌");
    }
  };

  return (
    <div className="max-h-screen flex bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
      {/* LEFT SIDE IMAGE */}
      <div className="hidden md:flex w-1/2 relative">
        <img
          src="https://plus.unsplash.com/premium_photo-1713296255442-e9338f42aad8?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29sbGVnZXxlbnwwfHwwfHx8MA%3D%3D"
          alt="Campus"
          className="w-full h-full object-cover"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-blue-600/40"></div>

        <div className="absolute bottom-60 left-10 text-white">
          <h1 className="text-4xl font-extrabold drop-shadow-lg">
            Skyline Institute of Technology
          </h1>
          <p className="mt-2 text-lg opacity-90">
            Empowering Students for a Better Tomorrow
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 overflow-hidden">
        
      {!showForgotPassword && (
        <div className="w-full max-w-md backdrop-blur-lg bg-white/60 shadow-xl rounded-2xl p-8 border border-white/30">
          <h2 className="text-xl font-bold mb-4">Student Login</h2>
      <input
        placeholder="Admission No"
        className="w-full p-2 border mb-3"
        value={admissionNo}
        onChange={(e) => setAdmissionNo(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="w-full bg-blue-700 text-white py-2 rounded mb-3"
      >
        Login
      </button>

      <button
        onClick={() => setShowForgotPassword(!showForgotPassword)}
        className="w-1/2 text-blue-700 underline mb-2"
      >
        Forgot Password?
      </button>
         <Link
  to="/admission"
  className="w-1/2 text-blue-700 underline mt-6"
>
  New Admission
</Link>
</div>
)}
      {showForgotPassword && (
        <div className="w-full max-w-md backdrop-blur-lg bg-white/60 shadow-xl rounded-2xl p-8 border border-white/30">
          <h2 className="text-xl font-bold mb-4">Reset Password</h2>
          <input
        placeholder="Admission No"
        className="w-full p-2 border mb-3"
        value={admissionNo}
        onChange={(e) => setAdmissionNo(e.target.value)}
      />

          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 border mb-3"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            onClick={handleForgotPassword}
            className="w-1/2 bg-blue-700 text-white py-2 rounded"
          >
            Reset Password
          </button>
         <Link
  to="/admission"
  className="w-1/2 bg-blue-700 text-white py-3 px-8 rounded ml-2"
>
  New Admission
</Link>
</div>
      )}
      
      </div>
    </div>
  );
}
