import { useState } from "react";
import { useNavigate } from "react-router-dom";
//pas utile d'utiliser navigate, il faut utiliser useNavigate
//import { Navigate } from "react-router-dom";
import logo from "../assets/r-square.svg";

// c'est component navbar que j'ai crée pour le page profile et post normalement
function Navbar() {
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    // quand tu clique sur logout il va delete le token et rediriger vers la page login (ta logique était bonne il manquait juste la suppression de token)
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <>
            <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-black bg-black">
                <div className="container px4 mx-auto relative text-xl">
                    <div className="flex justify-around items-center">
                        <div className="flex items-center shrink-0">
                            <img
                                className="h-10 w-10 mr-2 bg-white"
                                src={logo}
                                alt="logo"
                            />
                            <span className="ml-1 text-xl tracking-tight">
                                <a className="text-xl font-extrabold">
                                    Workspace R&S
                                </a>
                            </span>
                        </div>
                        <ul className="hidden lg:flex ml-180 space-x-12">
                            <li>
                                <a
                                    href="/profile"
                                    className="text-xl font-bold"
                                >
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a href="/posts" className="text-xl font-bold">
                                    Posts
                                </a>
                            </li>
                        </ul>
                        <div className="hidden lg:flex justify-center mr-10 space-x-12 items-center bg-black border-black">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="py-2 px-3 border rounded-md bg-black font-medium"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
