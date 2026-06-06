import { useParams, useNavigate, useLocation } from "react-router-dom";
import { CreditCard, CheckCircle } from "lucide-react";
import { useState } from "react";
import { API_URL } from "../config";

export default function PaymentPage() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const { admissionNo, password } = location.state || {};

  const handlePayment = async () => {
  setLoading(true);
  try {
    const res = await fetch(`${API_URL}/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,     
        amount: 50000,
        method: "ONLINE",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Payment failed ❌");
      setLoading(false);
      return;
    }

    alert("Payment successful ✅");
    navigate("/login");
  } catch (err) {
    console.error("PAYMENT ERROR:", err);
    alert("Payment error ❌");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
        <CreditCard className="h-14 w-14 text-blue-600 mx-auto mb-4" />

        <h2 className="text-2xl font-bold mb-2">
          Admission Fee Payment
        </h2>

        <p className="text-gray-600 mb-4">
          Student Id: <strong>{studentId}</strong>
        </p>

        {admissionNo && password && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left shadow-sm">
            <h3 className="text-yellow-800 font-bold text-sm mb-2">
              ⚠️ Copy & Save Credentials for Login:
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-white p-2 rounded border border-yellow-100">
                <span className="text-gray-600">Admission No: <strong className="text-gray-900 select-all">{admissionNo}</strong></span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(admissionNo);
                    alert("Admission Number copied! ✅");
                  }}
                  className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200 font-semibold"
                >
                  Copy
                </button>
              </div>
              <div className="flex justify-between items-center bg-white p-2 rounded border border-yellow-100">
                <span className="text-gray-600">Password: <strong className="text-gray-900 select-all">{password}</strong></span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(password);
                    alert("Password copied! ✅");
                  }}
                  className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200 font-semibold"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-100 p-4 rounded mb-6 text-left">
          <p>Course Fee: ₹50,000</p>
          <p>GST: Included</p>
          <p className="font-semibold mt-2">Total: ₹50,000</p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Secure payment • No real money charged (demo)
        </p>
      </div>
    </div>
  );
}
