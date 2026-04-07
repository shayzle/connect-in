import { useState } from "react";
import send from "../assets/send.svg";

// le composant Comment est responsable de l'affichage de la section commentaires pour un post donné, et donc la gestion de la creation/suppression de commentaire, il reçoit en "props" le post sélectionné, l'user, et toute les fonctions
function Comment({ post, currentUser, onCreateComment, onDeleteComment }) {
    // ajout d'un state pour stocker le contenu du commentaire en cours de rédaction (avant c'était juste fictif)
    //maintenant  ce que l'utilisateur tape est stocké, on peut réellement envoyer son contenu, et vider le champ après l'envoi
    const [commentContent, setCommentContent] = useState("");

    //la fonction empeche la page de reload, vérifie qu'un post existe, empêche l'envoi de commentaire vide
    //appelle la logique de création de commentaire passée en props plus haut, et enfin vide le champs après l'envoi
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!post || !commentContent.trim()) return;

        if (onCreateComment) {
            await onCreateComment(post.id, commentContent);
            setCommentContent("");
        }
    };

    return (
        <section className="w-150 flex justify-center items-center">
            <div className="main border border-gray-300 rounded-xl shadow-md m-3 bg-white">
                {/* j'ai essayé de baisser l'input commentaire au plus bas dans la card comment mais j'ai pas pu placer ça plus bas */}
                <div className="w-130 h-105 p-4 my-8 mx-auto max-w-xl m-3 flex flex-col justify-between">
                    <h3 className="text-black font-extrabold text-4xl mb-12 text-center">
                        Comments Section
                    </h3>

                    {/* on a remplacé le contenu statique par 3 cas : aucun post selectionné, post avec commentaire, et post sans commentaire */}
                    {!post ? (
                        <p className="text-center text-black mt-10">
                            Sélectionne un post pour voir ses commentaires.
                        </p>
                    ) : post.comments && post.comments.length > 0 ? (
                        // on parcourt le tableau de post.comments pour afficher chaque commentaire récupérer dans le backend
                        post.comments.map((comment) => (
                            <div
                                //permet d'identifier chaque commentaire de manière unique
                                key={comment.id}
                                className="flex justify-start mt-5"
                            >
                                <div className="w-14 h-14 rounded-full shrink-0 flex items-center justify-center bg-gray-200">
                                    <span className="text-black font-bold">
                                        {
                                            //on affiche les initial de l'utilisateur qui a commenté
                                            (
                                                comment.user?.firstname?.[0] ||
                                                "U"
                                            ).toUpperCase()
                                        }
                                    </span>
                                </div>

                                <div className="ml-3">
                                    {/*ici on affiche les info réel du commentaire retourné par le backend */}
                                    <div className="font-bold text-black">
                                        {comment.user?.firstname ?? ""}{" "}
                                        {comment.user?.lastname ?? ""}
                                    </div>
                                    <div className="mt-2 text-black flex items-center justify-between">
                                        <span>{comment.content}</span>
                                        {/* ici on ajoute le bouton delete sur le commentaire, uniquement si l'utilisateur connecté est le même que celui qui a posté le comm */}
                                        {currentUser &&
                                            comment.user?.id ===
                                                currentUser.id && (
                                                <button
                                                    onClick={() =>
                                                        onDeleteComment(
                                                            post.id,
                                                            comment.id,
                                                        )
                                                    }
                                                    className="text-red-500 ml-3 text-sm hover:underline"
                                                >
                                                    delete
                                                </button>
                                            )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-black mt-10">
                            Aucun commentaire pour ce post.
                        </p>
                    )}

                    {/* <!-- Comment Form --> */}
                    {/* le submit du formulaire est géré manuellement pour créer le commentaire via l'api */}
                    <form className="mt-10" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                htmlFor="comment"
                                className="text-black text-xl font-bold ml-2 mt-5"
                            >
                                Comment
                            </label>
                            <div className="relative mt-2">
                                {/* ici on synchronise le contenu de textarea avec le state */}
                                <textarea
                                    id="comment"
                                    name="comment"
                                    className="w-md h-14 border border-black rounded-lg p-3 pr-12 text-black text-lg font-medium placeholder-black bg-white"
                                    placeholder="Comment here ...."
                                    required
                                    value={commentContent}
                                    onChange={(e) =>
                                        setCommentContent(e.target.value)
                                    }
                                    // on empêche l'envoi de commentaire vide ou sans post sélectionné
                                    disabled={!post || !currentUser}
                                ></textarea>
                                {/* j'ai rajouté un bouton envoi lié au formulaire, disabled si aucun post ou utilisateur connecté n'est sélectionné */}
                                <button
                                    type="submit"
                                    disabled={!post || !currentUser}
                                    className="absolute right-2 bottom-4 p-1"
                                >
                                    <img
                                        src={send}
                                        alt="send"
                                        className="w-6 h-6 cursor-pointer"
                                    />
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Comment;
