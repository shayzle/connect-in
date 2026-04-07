import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Edit from "../components/editButton";
import DeleteAll from "../components/deleteAllButton";
import ImageUpload from "../components/ImageUpload";
import photo from "../assets/IMG_3411.jpg";
import axios from "../api/axios";

function Profile() {
    const navigate = useNavigate();

    //state utilisé pour stocker les données du formulaire de profil, initialisé avec des champs vide
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });
    //contient les données de l'utilisateur connecté, initialisé à null
    const [currentUser, setCurrentUser] = useState(null);
    //permet d'enable/disable le mode edition du profil
    const [isEditing, setIsEditing] = useState(false);
    //indique si les données du profil sont en cours de chargement
    const [loading, setLoading] = useState(true);

    //récupère les informations du profil utilisateur depuis le backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get("/auth/me");
                setCurrentUser(response.data);

                //on initialise  les champs du formulaire avec les données du profil (password reste vide)
                setFormData({
                    firstname: response.data.firstname || "",
                    lastname: response.data.lastname || "",
                    email: response.data.email || "",
                    password: "",
                });
            } catch (error) {
                console.error("Erreur lors du chargement du profil :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);
    //update en temps réel les données du formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    //fonction appelé quand on a submit le form elle va update les données du profil dans la db
    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email,
            };

            //si le champ n'est pas vide on l'ajoute sinon, on le laisse de coté pour pas écraser le mdp actuel par une valeur vide
            if (formData.password.trim()) {
                payload.password = formData.password;
            }
            //on envoie la requête de mise à jour du profil avec les données du form (payload)
            const response = await axios.put("/auth/me", payload);

            setCurrentUser(response.data);
            //reset le champ password après avoir update son profil
            setFormData((prev) => ({
                ...prev,
                password: "",
            }));
            setIsEditing(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil :", error);
        }
    };
    //fonction pour reset le form et désactiver le mode edit
    const handleCancel = () => {
        if (!currentUser) return;

        setFormData({
            firstname: currentUser.firstname || "",
            lastname: currentUser.lastname || "",
            email: currentUser.email || "",
            password: "",
        });

        setIsEditing(false);
    };
    //fonction pour supprimer le compte
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Es-tu sûr de vouloir supprimer ton compte ?",
        );

        if (!confirmDelete) return;

        try {
            //on envoie la requête en methode delete elle va exec le code du controller, un fois delete, on supprime le token local et on redirige sur la page login
            await axios.delete("/auth/delete");
            localStorage.removeItem("token");
            navigate("/login");
        } catch (error) {
            console.error("Erreur lors de la suppression du compte :", error);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <section className="min-h-screen min-w-screen flex items-center justify-center bg-[linear-gradient(90deg,#e2e2e2,#e2e2e2)]">
                    <p className="text-black text-2xl font-semibold">
                        Loading profile...
                    </p>
                </section>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <section className="min-h-screen min-w-screen flex items-center justify-center bg-[linear-gradient(90deg,#e2e2e2,#e2e2e2)]">
                <div className="m-15">
                    <div className="w-230 h-300 bg-[#f5f5f5] rounded-[30px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] flex overflow-hidden">
                        <div className="flex-auto justify-center items-center h-screen text-black mt-18">
                            <h1 className="text-black text-8xl font-extrabold text-center mt-7 mb-12">
                                Profile User
                            </h1>

                            <form
                                onSubmit={handleUpdateProfile}
                                className="border-black border flex flex-col justify-center max-w-lg mx-auto bg-white shadow-xl rounded-xl p-5 overflow-hidden"
                            >
                                <img
                                    src={photo}
                                    className="h-65 w-200 rounded-2xl -mt-13"
                                    alt="cover"
                                />

                                <div className="flex flex-col items-center">
                                    <div className="flex justify-center -mt-26 overflow-hidden">
                                        <ImageUpload />
                                    </div>

                                    <h3 className="m-5 font-semibold text-3xl">
                                        {currentUser?.firstname}{" "}
                                        {currentUser?.lastname}
                                    </h3>
                                    <p className="mb-2 font-medium text-lg">
                                        {currentUser?.email}
                                    </p>
                                </div>

                                <div className="space-y-6 m-5">
                                    <input
                                        type="text"
                                        name="firstname"
                                        placeholder="First Name"
                                        // input permettant  de sync  les valeur de champs avec le state
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        //si editing est false alors les champs ne fonctionnent plus
                                        disabled={!isEditing}
                                        className="w-full bg-[#e6e6e6] text-black p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-black font-semibold disabled:opacity-70"
                                        required
                                    />

                                    <input
                                        type="text"
                                        name="lastname"
                                        placeholder="Last Name"
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full bg-[#e6e6e6] text-black p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-black font-semibold disabled:opacity-70"
                                        required
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full bg-[#e6e6e6] text-black p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-black font-semibold disabled:opacity-70"
                                        required
                                    />

                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="New Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full bg-[#e6e6e6] text-black p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder-black font-semibold disabled:opacity-70"
                                    />
                                </div>

                                <div className="flex justify-end space-x-4 m-5">
                                    {isEditing ? (
                                        <>
                                            <button
                                                type="button"
                                                //reset le form pour ne pas avoir à tout effacer
                                                onClick={handleCancel}
                                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 font-medium"
                                            >
                                                Save
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            //c'est ici qu'on set le mode edition pour rendre actif les champs
                                            onClick={() => setIsEditing(true)}
                                            className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 font-medium"
                                        >
                                            Edit profile
                                        </button>
                                    )}
                                </div>

                                <div className="flex justify-center m-5">
                                    <button
                                        type="button"
                                        onClick={handleDeleteAccount}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                                    >
                                        Delete account
                                    </button>
                                </div>
                            </form>

                            <div className="flex flex-row justify-center items-center mt-13 mr-2"></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Profile;
