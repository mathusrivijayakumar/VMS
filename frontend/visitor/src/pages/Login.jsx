import React from "react";
import { useState } from "react";
import { useGlobalContext } from "../Context";
import { Link, useNavigate, Navigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const { loginUser, requestPasswordReset } = useGlobalContext();

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = async () => {
    await loginUser(email, password);
  };

  const handleForgotPassword = async () => {
    await requestPasswordReset(resetEmail);
    setShowForgotPassword(false);
  };

  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-lg font-bold">
            Visitor Management System
          </div>
          <div></div>
        </div>
      </nav>
      <div
        className="flex flex-col items-center justify-center bg-gray-100"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleRegister}
            >
              Register
            </button>
            <button
              onClick={() => setShowForgotPassword(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Forgot Password
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {showForgotPassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 border border-gray-300">
            <h2 className="text-2xl mb-4">Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300"
            />
            <button
              onClick={handleForgotPassword}
              className="w-full bg-blue-500 text-white p-2 mb-4"
            >
              Submit
            </button>
            <button
              onClick={() => setShowForgotPassword(false)}
              className="w-full bg-red-500 text-white p-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
