import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Comment from "../components/Comment";
import axios from "../api/axios";
// import '../App.css'

// --------------------------------------------------

function Posts() {
    //state pour stocker les posts, le contenu du nouveau post, et l'utilisateur connecté
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    // useEffect pour charger les posts et les infos de l'utilisateur connecté au chargement du composant
    useEffect(() => {
        const fetchData = async () => {
            try {
                //promise.all ça permet de faire 2 requêtes en parallèle
                const [postsResponse, meResponse] = await Promise.all([
                    axios.get("/posts"),
                    axios.get("/auth/me"),
                ]);

                setPosts(postsResponse.data);
                setCurrentUser(meResponse.data);
            } catch (error) {
                console.error("Erreur lors du chargement des posts :", error);
            }
        };

        fetchData();
    }, []);

    // ici on gère le like/dislike d'un post, on vérifie s'il a déjà été liké par l'user, si oui on envoie une requête pour delete le like, sinon le contraire
    const likeAndDislike = async (postId, isLiked) => {
        try {
            if (!isLiked) {
                await axios.post(`/posts/${postId}/like`);

                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.id === postId
                            ? {
                                  ...post,
                                  likes: [
                                      ...(post.likes || []),
                                      {
                                          user_id: currentUser.id,
                                          post_id: postId,
                                      },
                                  ],
                              }
                            : post,
                    ),
                );
            } else {
                await axios.delete(`/posts/${postId}/like`);

                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post.id === postId
                            ? {
                                  ...post,
                                  likes: (post.likes || []).filter(
                                      (like) => like.user_id !== currentUser.id,
                                  ),
                              }
                            : post,
                    ),
                );
            }
        } catch (error) {
            console.error("Erreur lors du like/unlike :", error);
        }
    };
    // ici on gère la création d'un post, on vérifie que le champ n'est pas vide, puis on envoie une requête pour créer le post, si c'est bon on met à jour le states pour l'affichier en temps réel
    //ça permet aussi d'ajouter en tête de liste le dernier post crée
    const handleCreatePost = async () => {
        if (!newPostContent.trim()) return;

        try {
            const response = await axios.post("/posts", {
                content: newPostContent,
            });

            setPosts((prevPosts) => [
                {
                    ...response.data,
                    comments: response.data.comments || [],
                    likes: response.data.likes || [],
                },
                ...prevPosts,
            ]);
            setNewPostContent("");
        } catch (error) {
            console.error("Erreur lors de la création du post :", error);
        }
    };
    // ajout de la logique de création de commentaire, on vérifie que le contenu n'est pas vide, puis on envoie une requête pour créer le commentaire
    // si c'est bon on met à jour le state des posts pour ajouter le commentaire dans le post concerné
    const handleCreateComment = async (postId, commentContent) => {
        if (!commentContent.trim()) return;

        try {
            const response = await axios.post(`/posts/${postId}/comments`, {
                content: commentContent,
            });

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              comments: [
                                  ...(post.comments || []),
                                  response.data,
                              ],
                          }
                        : post,
                ),
            );
        } catch (error) {
            console.error("Erreur lors de la création du commentaire :", error);
        }
    };
    //ici on gère la suppression d'un commentaire, on fait d'abord une confirmation à l'utilisateur, puis on fait une requête pour supprimer le commentaire, si c'est bon
    //on met à jour le state des post pour retirer le commentaire supprimé
    const handleDeleteComment = async (postId, commentId) => {
        const confirmed = window.confirm("Supprimer ce commentaire ?");
        if (!confirmed) return;

        try {
            await axios.delete(`/comments/${commentId}`);

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              comments: post.comments.filter(
                                  (comment) => comment.id !== commentId,
                              ),
                          }
                        : post,
                ),
            );
        } catch (error) {
            console.error("Erreur suppression commentaire :", error);
        }
    };
    // ici on gère la supression d'un post, on fait une popup de confirmation, puis on envoie la requête pour delete, si c'est bon
    // on met à jour le state pour retirer le post, les commentaire se supprimeront (deleteoncascade)
    const handleDeletePost = async (postId) => {
        const confirmed = window.confirm(
            "Voulez-vous vraiment supprimer ce post ?",
        );

        if (!confirmed) return;

        try {
            await axios.delete(`/posts/${postId}`);

            setPosts((prevPosts) =>
                prevPosts.filter((post) => post.id !== postId),
            );
        } catch (error) {
            console.error("Erreur lors de la suppression du post :", error);
        }
    };

    return (
        <>
            <Navbar />

            <section className="min-h-screen min-w-screen flex items-start justify-center bg-[linear-gradient(90deg,#e2e2e2,#e2e2e2)]">
                {/* Post Page Section */}
                <div className="m-12 w-full">
                    {/* Add Infos Section) */}
                    <div className="w-200 m-4 p-4 border-r bg-[#f5f5f5] rounded-[30px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] flex overflow-hidden flex-col justify-start">
                        <h3 className="text-black font-extrabold text-4xl mt-4 mb-1 ml-6">
                            Make A New Post
                        </h3>
                        <div className="p-4 flex items-center text-black">
                            <button type="button">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    fill="currentColor"
                                    className="bi bi-plus-circle"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                </svg>
                            </button>
                            <div className="ml-5">
                                <textarea
                                    className="mt-2 w-158 h-14 border border-black rounded-lg p-3 text-black text-lg font-medium placeholder-black"
                                    placeholder="Post here ..."
                                    value={newPostContent}
                                    onChange={(e) =>
                                        setNewPostContent(e.target.value)
                                    }
                                ></textarea>
                            </div>
                            <button
                                className="ml-auto text-blue-500 text-lg font-semibold"
                                onClick={handleCreatePost}
                            >
                                Post
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 m-4">
                        {posts.map((post) => {
                            const isLiked = currentUser
                                ? post.likes?.some(
                                      (like) => like.user_id === currentUser.id,
                                  )
                                : false;

                            const likeCount = post.likes?.length || 0;

                            const isOwner =
                                currentUser &&
                                (post.user_id === currentUser.id ||
                                    post.user?.id === currentUser.id);

                            return (
                                <div
                                    key={post.id}
                                    className="flex gap-8 items-start"
                                >
                                    <div className="w-205 bg-[#f5f5f5] rounded-[30px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] p-6">
                                        <div className="main border border-gray-300 rounded-xl shadow-md bg-white">
                                            {/* Top */}
                                            <div className="top">
                                                {/* User Icon and User Name  */}
                                                <div className="bg-gray-100 rounded-t-xl flex items-center gap-3 py-3 px-4 m-4">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shrink-0">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="w-8 h-8 text-gray-500"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                            />
                                                        </svg>
                                                    </div>

                                                    <div className="user_Name">
                                                        <h1 className="text-xl font-semibold text-black leading-none">
                                                            {post.author_label ||
                                                                `${post.user?.firstname ?? ""} ${post.user?.lastname ?? ""}`}
                                                        </h1>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Medium */}
                                            <div className="m-7">
                                                {post.content && (
                                                    <p className="text-black text-base font-medium mb-4 wrap-break-words whitespace-pre-wrap">
                                                        {post.content}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Bottom */}
                                            <div>
                                                {/* Like, comment, share and like text  */}
                                                <div className="like_comment_share_likeText bg-gray-100 flex justify-between items-center py-2 px-4 rounded-b-xl min-h-17">
                                                    <div className="like_comment_share flex gap-2 ml-2 items-center">
                                                        {/* Likes */}
                                                        {!isLiked ? (
                                                            // white
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    likeAndDislike(
                                                                        post.id,
                                                                        isLiked,
                                                                    )
                                                                }
                                                                className="p-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                    stroke="currentColor"
                                                                    className="w-6 h-6"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        ) : (
                                                            // red
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    likeAndDislike(
                                                                        post.id,
                                                                        isLiked,
                                                                    )
                                                                }
                                                                className="p-2 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="red"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                    stroke="currentColor"
                                                                    className="w-6 h-6 text-red-700"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        )}

                                                        {/* Comment */}
                                                        {isOwner && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDeletePost(
                                                                        post.id,
                                                                    )
                                                                }
                                                                className="px-3 py-2 rounded-lg border border-red-300 bg-white text-red-600 font-medium hover:bg-red-50 transition"
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="likeText">
                                                        <p className="text-xl font-semibold mr-4 text-black">
                                                            {likeCount}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-150 bg-[#f5f5f5] rounded-[30px] shadow-[0_20px_40px_rgba(0,0,0,0.15)] p-6">
                                        <Comment
                                            post={post}
                                            currentUser={currentUser}
                                            onCreateComment={
                                                handleCreateComment
                                            }
                                            onDeleteComment={
                                                handleDeleteComment
                                            }
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </>
    );
}

export default Posts;
