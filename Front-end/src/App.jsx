import { Routes, Route } from "react-router-dom"; // ici c'est une façon pour importer de choses que j'utilise dans les functions (function App() {....}) j'ai pris par react-router-dom
import "./App.css"; // cest pour importer le ficher ./App.css (pour que je puisse activer mon tailwind css dans ce page et tout les pages, vu que j'ai importé tailwind css dans mon App.css)

import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Register from "./pages/register"; // ici c'est les façons pour importer les fichiers visuelles que j'ai mis dans le dossier pages + components en appelant les functions
import Login from "./pages/login";
import Posts from "./pages/posts";
import Profile from "./pages/profile";
import Navbar from "./components/navbar";
import ImageUpload from "./components/ImageUpload"


// ici c'est une function pour mettre tous les routers de chaque fichiers dans le dossier pages
// normalement ici aussi où on doit préciser que certaines pages comme posts et profile sont privées (les gens peuvent accéder que avec tokens par exemple, mais je sais pas encore comme faire lol)
function App() {
    return (
        <Routes>
            {/* public routes */}
            <Route element={<PublicRoute />}>
                <Route path="/" element={<Login />} />
                {/* ici preciser que par defaut quand on activer le page localhost il va aller direct dans la page Login */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Route>

            {/* private routes */}
            {/* ici c'est private route pour preciser quand les gens ont tokens ils peuvent acceder le page posts ou profile direct et c'est vient d'une page component PrivateRoute.jsx */}
            <Route element={<PrivateRoute />}>
                <Route path="/posts" element={<Posts />} />
                <Route path="/profile" element={<Profile />} />
            </Route>

            {/* components */}
            <Route path="/navbar" element={<Navbar />} />
            <Route path="/ImageUpload" element={<ImageUpload/>} />
        </Routes>
    );
}

export default App;
