import React, { useState } from "react";
import authLogo from "../assets/uniKart_Logo.svg";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.css"; // Update if using CSS modules

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    if (error) {
      setError(null);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/; // Only alphanumeric, 3-20 characters
    return usernameRegex.test(username);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (!data.name || !data.email || !data.password || !data.confirmPassword) {
      setError("All fields are required.");
      return false;
    }
    if (!validateUsername(data.name)) {
      setError(
        "Username must be 3-20 characters long and contain only letters and numbers."
      );
      return false;
    }
    if (!validateEmail(data.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (data.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Don't submit if form validation fails
    }

    try {
      const response = await Axios({
        ...SummaryApi.register,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">
        <img src={authLogo} alt="UniKart" width={200} height={200} />
      </div>
      <div className="auth-separator">
        <div className="separator-line"></div>
      </div>
      <div className="auth-content">
        <h1 className="auth-title">Register</h1>
        <form onSubmit={handleSubmit}>
          {error && <p className={`${styles.formError} formError`}>{error}</p>}
          <div className="formGroup">
            <label htmlFor="name">Username</label>
            <input
              type="text"
              id="name"
              name="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Enter your username"
              className={styles.inputField} // Using CSS modules
            />
          </div>
          <div className="formGroup">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={styles.inputField} // Using CSS modules
            />
          </div>
          <div className="formGroup">
            <label htmlFor="password">Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={styles.inputField} // Using CSS modules
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={toggleShowPassword}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="formGroup">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={styles.inputField} // Using CSS modules
            />
          </div>
          <button type="submit" className="auth-button">
            Register
          </button>
        </form>
        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="authFooterLink">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
