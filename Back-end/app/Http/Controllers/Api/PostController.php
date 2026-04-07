<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    //cette fonction permet de lister tout les posts du plus récent au plus ancien, on utilise la fonction "with" pour charger les relations user, comments.user et likes
    public function index()
    {
        return Post::with(['user', 'comments.user', 'likes'])
            ->latest()
            ->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => ['nullable', 'string'],
            'image_path' => ['nullable', 'string', 'max:255'],
        ]);

        $user = $request->user();

        $post = Post::create([
            'user_id' => $user->id,
            'author_label' => $user->firstname . ' ' . $user->lastname,
            'content' => $request->input('content'),
            'image_path' => $request->input('image_path'),
        ]);

        return response()->json($post->load('user'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $post = Post::with(['user', 'comments.user', 'likes'])
            ->findOrFail($id);

        return response()->json($post);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'content' => ['nullable', 'string'],
            'image_path' => ['nullable', 'string', 'max:255'],
        ]);

        $post->update($request->only(['content', 'image_path']));

        return response()->json($post->fresh()->load('user'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $post = Post::findOrFail($id);

        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'Post deleted']);
    }
}
