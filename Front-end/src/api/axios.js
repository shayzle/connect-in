// fetch ou axios ici
//
import axios from "axios";
//ici tu set la base url de ton api, à partir de ça tu peux faire des requêtes comme axios.get("/posts") ce qui nous donnera "http://localhost/api/posts"
axios.defaults.baseURL = "http://localhost:8080/api";
//ça si j'ai bien compris c'est pour accepter des fichier json dans les requêtes, c'est pas obligatoire mais c'est une bonne pratique
axios.defaults.headers.common["accept"] = "application/json";

//ici on utilise un interceptor pour pouvoir utiliser un token d'authentification dans les requêtes
axios.interceptors.request.use((config) => {
    //le token est récupérer dans le local storage, s'il existe on l'ajoute dans le header de la requête
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

//sert à rendre le fichier axios accessible pour les autres
export default axios;
