<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'regex:/^[a-z0-9-]+$/', 'unique:posts,slug'],
            'status' => ['required', Rule::in(['draft', 'published'])],
            'tags' => ['array'],
            'tags.*' => ['string', 'exists:tags,name'],
            'thumbnail' => ['nullable', 'string'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
        ];
    }
}
