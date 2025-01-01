import React from "react";
import { useState } from "react";
import { useGlobalContext } from "../Context";
import { Link, useNavigate, Navigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const { user, visitors, setUser } = useGlobalContext();

  const [selectedVisit, setSelectedVisit] = useState(null);

  const handleCardClick = (visit) => {
    setSelectedVisit(visit);
  };

  const closeModal = () => {
    setSelectedVisit(null);
  };

  function convertDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  if (user === null) {
      return <Navigate to="/" />;
    }
  
    if (user.role === "admin") {
      return <Navigate to="/adminvisitor" />;
    }
  

  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-lg font-bold">
            Visitor Management System
          </div>
          <div>
            <h2 className="text-white">Welcome {user.name}</h2>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-4"
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-4" style={{ width: "80%" }}>
        <div className="flex justify-end mb-6">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow-md transition duration-300 mt-4 mb-4" onClick={() => navigate("/visit")}>
            Add Visit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visitors.map((visit, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => handleCardClick(visit)}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                {visit.apartmentId.name}
              </h3>
              <p className="text-gray-700 mb-1">
                <strong>Visitor Name:</strong> {visit.visitorName}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Phone Number:</strong> {visit.phoneNumber}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Entry Date:</strong> {convertDate(visit.entryDate)}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Exit Date:</strong> {convertDate(visit.exitDate)}
              </p>
              <p className="text-gray-700">
                <strong>Unique Code:</strong> {visit.uniqueCode}
              </p>
            </div>
          ))}
        </div>
      </div>

      {selectedVisit && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              {selectedVisit.apartmentId.name}
            </h3>
            <p className="text-gray-700 mb-1">
              <strong>Visitor Name:</strong> {selectedVisit.visitorName}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Phone Number:</strong> {selectedVisit.phoneNumber}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Entry Date:</strong> {convertDate(selectedVisit.entryDate)}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Exit Date:</strong> {convertDate(selectedVisit.exitDate)}
            </p>
            <p className="text-gray-700">
              <strong>Unique Code:</strong> {selectedVisit.uniqueCode}
            </p>
            <button
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
