<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->excerpt,
            'thumbnail' => $this->thumbnail,
            'tags' => $this->tags->pluck('name'),
            'created_at' => $this->created_at,
            'content' => $this->when($request->routeIs('public.posts.show'), $this->content),
            'updated_at' => $this->when($request->routeIs('public.posts.show'), $this->updated_at),
        ];
    }
}
