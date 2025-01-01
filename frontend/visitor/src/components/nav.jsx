import React from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useGlobalContext } from "../Context";

const Nav = () => {
  const navigate = useNavigate();
   const { setUser } = useGlobalContext();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <div
        className="bg-gray-800 text-white flex flex-col items-start p-4"
        style={{ width: "15%", minHeight: "95vh" }}
      >
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 w-full text-left"
          onClick={() => navigate("/apartment")}
        >
          Apartment
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full text-left mb-4"
          onClick={() => navigate("/adminvisitor")}
        >
          Visitor
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full text-left"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </>
  );
};

export default Nav;
