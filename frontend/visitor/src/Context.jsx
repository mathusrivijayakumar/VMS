import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AppContext = React.createContext();
const AppProvider = ({ children }) => {
  const url = "http://localhost:3001";
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [apartments, setApartments] = useState([]);
  const [Vtoken, setVtoken] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [allVisitors,setAllVisitors] = useState([]);

  const registerUser = async (username, email, password) => {
    try {
      const role = "user";
      const response = await axios.post(`${url}/register`, {
        username,
        email,
        password,
        role,
      });
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      alert("Check the values");
      console.error("Error registering user:", error);
    }
  };

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post(`${url}/login`, {
        email,
        password,
      });
      if (response.status === 200) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        console.log(user);
        if (user.role === "admin") {
          navigate("/adminvisitor");
          getApartments();
          getAllVisitors();
        } else {
          navigate("/home");
          getApartments();
          getMyVisitors();
        }
      }
    } catch (error) {
      alert("Invalid credentials");
      console.error("Error logging in user:", error);
    }
  };

  const getApartments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${url}/apartments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setApartments(response.data);
      }
    } catch (error) {
      console.error("Error fetching apartments:", error);
    }
  };
  
  const insertVisitor = async (apartmentId, visitorName, phoneNumber, entryDate, exitDate) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${url}/visitors`,
        {
          apartmentId,
          visitorName,
          phoneNumber,
          entryDate,
          exitDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setVtoken(response.data.uniqueCode);
        await getMyVisitors();
        return response.data.uniqueCode;
      }
    } catch (error) {
      alert("Error adding visitor");
      console.error("Error adding visitor:", error);
    }
  };

  const getMyVisitors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${url}/myvisitors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setVisitors(response.data);
      }
    } catch (error) {
      console.error("Error fetching visitors:", error);
    }
  };
  
  const createApartment = async (name) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${url}/apartments`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        getApartments(); // Refresh the list of apartments
      }
    } catch (error) {
      alert("Error creating apartment");
      console.error("Error creating apartment:", error);
    }
  };

  const deleteApartment = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${url}/apartments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        getApartments(); // Refresh the list of apartments
      }
    } catch (error) {
      alert("Error deleting apartment");
      console.error("Error deleting apartment:", error);
    }
  };

  const editApartment = async (apartmentId, name) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${url}/apartments/${apartmentId}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        getApartments(); // Refresh the list of apartments
      }
    } catch (error) {
      alert("Error editing apartment");
      console.error("Error editing apartment:", error);
    }
  };

  const getAllVisitors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${url}/visitors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setAllVisitors(response.data);
      }
    } catch (error) {
      console.error("Error fetching all visitors:", error);
    }
  };

  const checkToken = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(`${url}/checkToken`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          const user = response.data;
          setUser(user);
          if (user.role === "admin") {
            navigate("/adminvisitor");
            getApartments();
            getAllVisitors();
          } else {
            navigate("/home");
            getApartments();
            getMyVisitors();
          }
        }
      }
    } catch (error) {
      console.error("Error checking token:", error);
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      await axios.post(`${url}/api/request-password-reset`, { email });
      alert("Password reset token sent to your email");
    } catch (error) {
      console.error(error);
      alert("Error sending password reset token");
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await axios.post(`${url}/api/reset-password`, { token, newPassword });
      alert("Password has been reset");
    } catch (error) {
      console.error(error);
      alert("Error resetting password");
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        apartments,
        Vtoken,
        visitors,
        allVisitors,
        setUser,
        registerUser,
        loginUser,
        insertVisitor,
        createApartment,
        deleteApartment,
        editApartment,
        checkToken,
        requestPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider, AppContext };
