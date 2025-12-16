import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  setCredentials,
  setError,
  clearError,
} from "../store/slices/authSlice";
import api from "../utils/api";

function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error } = useSelector((state) => state.auth);

  const email = location.state?.email || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setLoading(true);

    try {
      const response = await api.post("/auth/verify", { email, otp });
      const { token, user } = response.data;

      dispatch(setCredentials({ token, user }));
      navigate("/dashboard");
    } catch (err) {
      dispatch(
        setError(err.response?.data?.message || "OTP verification failed")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await api.post("/auth/send-otp", { email });
      alert("OTP sent successfully!");
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Failed to resend OTP"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 px-4">
      <div className="card max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Chat App
        </h1>
        <h2 className="text-2xl font-semibold text-center mb-6">Verify OTP</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <p className="text-center text-gray-600 mb-6">
          Enter the OTP sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              OTP Code
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="input text-center text-2xl tracking-widest"
              required
              placeholder="000000"
              maxLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="btn btn-primary w-full"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleResendOTP}
            className="text-sm text-primary-600 hover:underline"
          >
            Resend OTP
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link to="/login" className="text-primary-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyOTP;
