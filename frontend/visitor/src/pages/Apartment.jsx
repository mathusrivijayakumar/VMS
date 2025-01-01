import React from "react";
import { useState } from "react";
import Nav from "../components/nav";
import { useGlobalContext } from "../Context";
import { Link, useNavigate, Navigate } from "react-router-dom";

const Apartment = () => {
  const navigate = useNavigate();
  const { apartments, createApartment, deleteApartment, editApartment, user } =
    useGlobalContext();

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedApartmentName, setSelectedApartmentName] = useState(null);
  const [newApartmentName, setNewApartmentName] = useState("");
  const [apartmentId, setApartmentId] = useState("");

  const handleDelete = async (id) => {
    await deleteApartment(id);
  };

  const handleAddApartment = async (e) => {
    e.preventDefault();
    await createApartment(newApartmentName);
    setShowModal(false);
    setNewApartmentName("");
  };

  const handleEditApartment = async (e) => {
    e.preventDefault();
    await editApartment(apartmentId, selectedApartmentName);
    setShowEditModal(false);
    setSelectedApartmentName("");
  };

  if (user === null) {
      return <Navigate to="/" />;
    }
  
    if (user.role === "user") {
      return <Navigate to="/home" />;
    }
  

  return (
    <>
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          Visitor Management System
        </div>
        <div>
          <h2 className="text-white">Welcome {user.name}</h2>
        </div>
      </nav>

      <div className="flex">
        <Nav />
        <div className="container mx-auto mt-10 p-4" style={{ width: "75%" }}>
          <div className="flex justify-end mb-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowModal(true)}
            >
              Add +
            </button>
          </div>
          <table className="min-w-full bg-white border-collapse">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b-2 border-gray-300 text-center">
                  Apartment ID
                </th>
                <th className="py-2 px-4 border-b-2 border-gray-300 text-center">
                  Apartment Name
                </th>
                <th className="py-2 px-4 border-b-2 border-gray-300 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {apartments.map((apartment) => (
                <tr key={apartment.id}>
                  <td className="py-2 px-4 border-b border-gray-300 text-center">
                    {apartment.apartmentId}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 text-center">
                    {apartment.name}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-300 text-center">
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-4"
                      onClick={() => handleDelete(apartment.apartmentId)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => {
                        setShowEditModal(true);
                        setSelectedApartmentName(apartment.name);
                        setApartmentId(apartment.apartmentId)
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Add Apartment
            </h3>
            <form onSubmit={handleAddApartment}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="apartmentName"
                >
                  Apartment Name
                </label>
                <input
                  type="text"
                  id="apartmentName"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={newApartmentName}
                  onChange={(e) => setNewApartmentName(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => setShowEditModal(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Edit Apartment
            </h3>
            <form onSubmit={handleEditApartment}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="apartmentName"
                >
                  Apartment Name
                </label>
                <input
                  type="text"
                  id="apartmentName"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={selectedApartmentName}
                  onChange={(e) => setSelectedApartmentName(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Apartment;
