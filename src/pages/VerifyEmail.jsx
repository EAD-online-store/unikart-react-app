import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verificationCode = params.get("code");

    if (verificationCode) {
      verifyEmail(verificationCode);
    } else {
      setError("Invalid verification link");
    }
  }, [location.search]);

  const verifyEmail = async (code) => {
    setLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.verifyEmail,
        data: { code },
      });

      if (response.data.error) {
        toast.error(response.data.message || "Verification failed");
        setError(response.data.message || "Verification failed");
      }

      if (response.data.success) {
        toast.success(response.data.message || "Email verified successfully!");
        navigate("/login");
      }
    } catch (error) {
      toast.error("An error occurred while verifying your email.");
      setError("An error occurred while verifying your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-logo"></div>
      <div className="auth-separator">
        <div className="separator-line"></div>
      </div>
      <div className="auth-content">
        <h1 className="auth-title">Verify Your Email</h1>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <div>Verifying...</div>
        ) : (
          <div className="success-message">Verification in progress...</div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
