<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Resources\PostAdminResource;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $posts = Post::query()
            ->with('tags')
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')))
            ->when(
                $request->filled('tag'),
                fn ($query) => $query->whereHas('tags', fn ($query) => $query->where('name', $request->string('tag')))
            )
            ->latest()
            ->paginate($request->integer('per_page', 20));

        return PostAdminResource::collection($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {
        $post = Post::create($request->safe()->except('tags'));
        $post->tags()->sync(Tag::whereIn('name', $request->safe()->input('tags', []))->pluck('id'));

        return (new PostAdminResource($post->load('tags')))->response()->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        return new PostAdminResource($post->load('tags'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
