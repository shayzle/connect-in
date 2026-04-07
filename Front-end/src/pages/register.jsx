import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import Navbar from "../components/navbar";
import axios from "../api/axios"; 
// import "../App.css"

// ici on doit mettre le functionalité

// ici le function pour mettre le html structure + tailwind css pour le visuelle (c'est code JSX)
function Register() {
    //c'est plus clean de stocker le navigate dans une variable pour l'utiliser dans les fonctions plus tard
    const navigate = useNavigate();
    // ici c'est les states pour stocker les valeurs des inputs du formulaire
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    // ici c'est la fonction pour submit le form, elle est "async" parce qu'on va faire une requête asynchrone (on va attendre la réponse de laravel avant de continuer l'execution du code)
    const submitRegisterForm = async (e) => {
        e.preventDefault();
        //comme je t'avais dit on utilise pas if mais try quand le else est une erreur
        try {
            // ici on fait une requête post vers la route register de laravel, on envoie les données du formulaire, le controller de laravel va executer la logique pour stocker  l'utilisateur si les champs sont valide (plus d'info sur Authcontroller)
            const response = await axios.post("/auth/register", {
                firstname: firstname,
                lastname: lastname,
                email: userEmail,
                password: userPassword,
            });

            // si on récupère un token dans la réponse, on le stock dans le local storage, et là c'est comme d'habitude on se sert de la vérification du token pour rediriger sur la page correspondante (if token on va sur posts, sinon on reste sur login)
            if (response.data?.token) {
                localStorage.setItem("token", response.data.token);
                navigate("/posts");
            } else {
                navigate("/login");
            }
        } catch (err) {
            // ici c'est important de renvoyer une alerte pour avertir l'utilisateur qu'il a surement mal rempli le formulaire
            //j'ai mis un message basique mais si tu veux mettre un message plus parlant tu peux
            alert("Registration failed");
        }
    };

    return (
        <>
            <section className="min-h-screen min-w-screen flex items-center justify-center bg-[linear-gradient(90deg,#e2e2e2,#c9d6ff)]">
                <div className="w-255 h-167.5 bg-[#f5f5f5] rounded-[30px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] flex overflow-hidden m-8">
                    <div className="w-1/2 bg-black text-white flex flex-col items-center justify-center rounded-r-[200px] p-10">
                        <h1 className="text-4xl font-bold mb-4">
                            Welcome Back!
                        </h1>
                        <p className="mb-8 text-white-300 font-medium">
                            Already have an account ?
                        </p>
                        <button className="text-white border border-white px-8 py-3 rounded-lg hover:bg-white transition duration-300">
                            <a className="text-lg" href="/login">
                                Login
                            </a>
                        </button>
                    </div>

                    <div className="w-1/2 flex flex-col justify-center px-16">
                        <h1 className="text-4xl font-bold text-center mb-8 text-black">
                            Registration
                        </h1>

                        <div className="space-y-6">
                            {/* j'ai du tout remettre dans un seul form*/}
                            <form
                                onSubmit={submitRegisterForm}
                                className="space-y-6"
                            >
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="w-full bg-[#e6e6e6] text-black p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-black font-semibold"
                                    required
                                    value={firstname}
                                    onChange={(e) =>
                                        setFirstname(e.target.value)
                                    }
                                />

                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="w-full bg-[#e6e6e6] text-black p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-black font-semibold"
                                    required
                                    value={lastname}
                                    onChange={(e) =>
                                        setLastname(e.target.value)
                                    }
                                />

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
                                    Register
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Register;

// above, c'est un façon pour rappel le function (en fait je pait mettre ça direct avec appel la function)
