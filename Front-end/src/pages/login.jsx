import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import Navbar from "../components/navbar";
import axios from "../api/axios"; 

// import '../App.css'

// ici on doit mettre le functionalité

// ici le function pour mettre le html structure + tailwind css pour le visuelle (c'est code JSX)

function Login() {
    const navigate = useNavigate();

    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const submitLoginForm = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("/auth/login", {
                email: userEmail,
                password: userPassword,
            });

            localStorage.setItem("token", response.data.token);
            navigate("/posts");
        } catch (err) {
            alert("Invalid credentials");
        }
    };

    return (
        <>
            <section className="min-h-screen min-w-screen flex items-center justify-center bg-[linear-gradient(90deg,#e2e2e2,#c9d6ff)]">
                <div className="w-255 h-167.5 bg-[#f5f5f5] rounded-[30px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] flex overflow-hidden">
                    <div className="w-1/2 bg-black text-white flex flex-col items-center justify-center rounded-r-[200px] p-10">
                        <h1 className="text-4xl font-bold mb-4">
                            Hello, Welcome!
                        </h1>
                        <p className="mb-8 text-white-900 font-medium">
                            Don't have an account ?
                        </p>
                        <button className="text-white border border-white px-8 py-3 rounded-lg hover:bg-white transition duration-300">
                            <a className="text-lg" href="/register">
                                Register
                            </a>
                        </button>
                    </div>

                    <div className="w-1/2 flex flex-col justify-center px-16">
                        <h1 className="text-4xl font-bold text-center mb-8 text-black">
                            Login
                        </h1>
                        <div className="space-y-6">
                            <form
                                onSubmit={submitLoginForm}
                                className="space-y-6"
                            >
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full bg-[#e6e6e6] text-black p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-black font-semibold"
                                    required
                                    value={userEmail}
                                    onChange={(e) =>
                                        setUserEmail(e.target.value)
                                    }
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full bg-[#e6e6e6] text-black p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-black font-semibold"
                                    required
                                    value={userPassword}
                                    onChange={(e) =>
                                        setUserPassword(e.target.value)
                                    }
                                />

                                <button
                                    type="submit"
                                    className="w-full bg-black text-white p-4 rounded-lg transition duration-300 font-bold"
                                >
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Login;

// above, c'est un façon pour rappel le function (en fait je pait mettre ça direct avec appel la function)
