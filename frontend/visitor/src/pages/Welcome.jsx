import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useGlobalContext } from "../Context";
import welcome from "../static/welcome.jpeg";

const Welcome = () => {
  const navigate = useNavigate();
  const { checkToken, user } = useGlobalContext();

  useEffect(() => {
    const checkUserToken = async () => {
      await checkToken();
      if (user) {
        if (user.role === "admin") {
          navigate("/adminvisitor");
        } else {
          navigate("/home");
        }
      }
    };
    checkUserToken();
  }, [checkToken, user, navigate]);

  return (
    <>
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 fixed w-full z-10 top-0">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-lg font-bold">
            Visitor Management System
          </div>
          <div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 transition"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        className="flex flex-col items-center justify-center h-screen bg-cover bg-center text-white relative"
        style={{ backgroundImage: `url(${welcome})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            Welcome to the Visitor Management System
          </h1>
          <p className="mt-4 text-lg md:text-2xl">
            Streamline your visitor check-ins and manage entries with ease.
          </p>
          <div className="mt-8">
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg mr-4 hover:bg-blue-600 transition"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>
            <button
              className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 transition"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
          <div className="py-12 px-6">
            <div className="container mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-semibold">Features</h2>
              <ul className="mt-6 text-lg md:text-xl list-none list-inside mx-auto max-w-3xl">
                <li>Easy visitor check-ins</li>
                <li>Manage visitor data efficiently</li>
                <li>Secure and reliable</li>
                <li>Real-time updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
