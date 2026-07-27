<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $maxKb = (int) config('beliahub.upload.max_size_kb', 10240);

        return [
            'file' => ['required', 'file', 'max:'.$maxKb],
            'category' => ['required', 'in:reference,delivery,payment_proof'],
        ];
    }
}
