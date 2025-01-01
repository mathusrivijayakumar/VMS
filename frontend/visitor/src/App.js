import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Visit from "./pages/Visit";
import Apartment from "./pages/Apartment";
import Adminvisitor from "./pages/Adminvisitor";
import ResetPassword from "./pages/Resetpassword";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/visit" element={<Visit />} />
        <Route path="/apartment" element={<Apartment />} />
        <Route path="/adminvisitor" element={<Adminvisitor />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
