<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'user_id',
        'post_id',
        'author_label',
        'content',
    ];

    // cette fonction va permettre de dire que ce que l'ont va écrire ici va appartenir à un utilisateur (user::class) pour préciser le model user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    //cette fonction va permettre de dire que ce que l'ont va écrire ici va appartenir à un post
    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
