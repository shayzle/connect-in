<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Like;
use App\Models\Post;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    // cette fonction permet de liker un post, on vérifie en premier si l'user a déjà like, si c'est déjà le cas on return une erreur en json, sinon on génère un like dans la database et on return success en json
    public function store(Request $request, Post $post)
    {
        $user = $request->user();

        // c'est ici qu'on vérifie si le like existe déjà
        $exists = Like::where('user_id', $user->id)
            ->where('post_id', $post->id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Already liked'], 200);
        }
        //s'il n'existe pas c'est ici qu'on le génère
        Like::create([
            'user_id' => $user->id,
            'post_id' => $post->id,
        ]);

        return response()->json(['message' => 'Liked'], 201);
    }
    //cette fonction c'est pour unlike un post, il y a juste une vérification pour s'assurer que le like existe avant de le supprimer
    public function destroy(Request $request, Post $post)
    {
        $user = $request->user();

        Like::where('user_id', $user->id)
            ->where('post_id', $post->id)
            ->delete();

        return response()->json(['message' => 'Unliked']);
    }
}
