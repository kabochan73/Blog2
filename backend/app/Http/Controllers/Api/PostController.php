<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $posts = Post::query()
            ->where('status', 'published')
            ->with('tags')
            ->when(
                $request->filled('tag'),
                fn ($query) => $query->whereHas('tags', fn ($query) => $query->where('name', $request->string('tag')))
            )
            ->latest()
            ->paginate($request->integer('per_page', 20));

        return PostResource::collection($posts);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        abort_unless($post->status === 'published', 404);

        return new PostResource($post->load('tags'));
    }
}
