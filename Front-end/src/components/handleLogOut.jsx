import { Navigate, Outlet } from "react-router-dom";

const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
};

export default handleLogOut;

// je suis pas sur pour celui-là
