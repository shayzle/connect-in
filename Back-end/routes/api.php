<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\LikeController;

// ici c'est juste une route de test que j'ai fait pour voir si l'api répondait bien, elle retourne un json test si ça marche
Route::get("/test", function () {
    return response()->json(["message" => 'test']);
});

//la route auth permet de rediriger les requêtes vers la fonction register ou login du Authcontroller
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login',    [AuthController::class, 'login']);

// middleware va donc protéger les routes suivantes edit : j'ai rajouté toute les route à protéger par middleware pour la page post (comme ça si quelqu'un n'est pas connecté il ne peut pas faire de requête au serveur pour créer: post/comments/like)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me',    [AuthController::class, 'me']);
    Route::put('/auth/me', [AuthController::class, 'update']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::delete('/auth/delete', [AuthController::class, 'destroy']);

    // peut être tu as remarqué on précise aucune méthode pour post ici, c'est parce que la fonction "apiResource" va automatiquement déterminer où envoyer les requêtes en fonction de sa méthode (elle va rediriger dans post controller)
    Route::apiResource('posts', PostController::class);

    //commentaire
    Route::post('posts/{post}/comments', [CommentController::class, 'store']);
    Route::put('comments/{comment}', [CommentController::class, 'update']);
    Route::delete('comments/{comment}', [CommentController::class, 'destroy']);
    //like
    Route::post('posts/{post}/like', [LikeController::class, 'store']);
    Route::delete('posts/{post}/like', [LikeController::class, 'destroy']);
});
