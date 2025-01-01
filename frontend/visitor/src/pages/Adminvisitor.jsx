import React from "react";
import { useState } from "react";
import Nav from "../components/nav";
import { useGlobalContext } from "../Context";
import { Link, useNavigate, Navigate } from "react-router-dom";

const Adminvisitor = () => {
  const navigate = useNavigate();
  const { allVisitors, apartments, user } = useGlobalContext();
  const [filter, setFilter] = useState({
    apartmentName: "",
    entryDate: "",
    exitDate: "",
    uniqueCode: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const filteredVisits = allVisitors.filter((visit) => {
    return (
      (filter.apartmentName === "" ||
        visit.apartmentId.name.includes(filter.apartmentName)) &&
      (filter.entryDate === "" ||
        visit.entryDate.startsWith(filter.entryDate)) &&
      (filter.exitDate === "" || visit.exitDate.startsWith(filter.exitDate)) &&
      (filter.uniqueCode === "" ||
        visit.uniqueCode.toString().includes(filter.uniqueCode))
    );
  });

  function convertDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const today = new Date().toISOString().split("T")[0];

  const totalEnteredToday = allVisitors.filter((visit) =>
    visit.entryDate.startsWith(today)
  ).length;

  const totalExitedToday = allVisitors.filter((visit) =>
    visit.exitDate.startsWith(today)
  ).length;

  if (user === null) {
    return <Navigate to="/" />;
  }

  if (user.role === "user") {
    return <Navigate to="/home" />;
  }

  return (
    <>
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          Visitor Management System
        </div>
        <div>
          <h2 className="text-white">Welcome {user.name}</h2>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex">
        <Nav />
        <div className="container mx-auto mt-10 p-4" style={{ width: "85%" }}>
          {/* Filters */}
          <div className="mb-4 flex space-x-4">
            <input
              type="text"
              name="uniqueCode"
              placeholder="Search by Unique Code"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              value={filter.uniqueCode}
              onChange={handleFilterChange}
            />
            <select
              name="apartmentName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              value={filter.apartmentName}
              onChange={handleFilterChange}
            >
              <option value="">Filter by Apartment Name</option>
              {apartments.map((apartment) => (
                <option key={apartment.name} value={apartment.name}>
                  {apartment.name}
                </option>
              ))}
            </select>
            <input
              placeholder="EntryDate"
              type="date"
              name="entryDate"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              value={filter.entryDate}
              onChange={handleFilterChange}
            />
            <input
              placeholder="ExitDate"
              type="date"
              name="exitDate"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
              value={filter.exitDate}
              onChange={handleFilterChange}
            />
          </div>

          {/* Total Counts */}
          <div className="mb-6 text-gray-800 text-lg">
            <p>
              <strong>Total Visitors Entered Today:</strong> {totalEnteredToday}
            </p>
            <p>
              <strong>Total Visitors Exited Today:</strong> {totalExitedToday}
            </p>
          </div>

          {/* Visitors List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVisits.map((visit, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
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
      </div>
    </>
  );
};

export default Adminvisitor;
