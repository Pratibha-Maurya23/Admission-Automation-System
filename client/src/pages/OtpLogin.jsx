import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function OtpLogin({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

useEffect(() => {
    if (step !== 2) return;

  setTimer(60);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const sendOtp = async () => {
  try {
    setError("");

    const res = await fetch(`${API_URL}/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Failed to send OTP");
      return;
    }

    setStep(2);

  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    setError("Server error");
  }
};


  const verifyOtp = async () => {
    if (!otp) return setError("OTP required");

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid OTP");
        return;
      }

      // ✅ SAFE updates
      onLogin(data.student);
      navigate("/dashboard");

    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      {step === 1 ? (
        <>
          <h2 className="text-xl font-bold mb-4">Login with OTP</h2>
          <input
            placeholder="Phone Number"
            className="w-full p-2 border mb-3"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={sendOtp} className="w-full bg-blue-600 text-white py-2 rounded">
            Send OTP
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
          <input
            placeholder="6-digit OTP"
            className="w-full p-2 border mb-3"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp} className="w-1/2 bg-green-600 text-white py-2 rounded">
            Verify OTP
          </button>
          <button
  disabled={timer > 0}
  onClick={sendOtp}
  className="w-1/2 bg-red-600 text-white py-2 rounded disabled:opacity-50"
>
  {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
</button>

        </>
      )}
    </div>
  );
}
