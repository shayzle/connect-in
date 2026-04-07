import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
    //tentative de récupération du token
    const token = localStorage.getItem("token");

    //si récupérer, on redirige vers posts, sinon on redirige sur login
    return token ? <Navigate to="/posts" replace /> : <Outlet />;
};

export default PublicRoute;
