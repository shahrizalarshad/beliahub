<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\ServiceOrder;
use Illuminate\Foundation\Http\FormRequest;

class StoreOrderFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        $order = $this->route('order');

        if ($user === null || ! $order instanceof ServiceOrder) {
            return false;
        }

        if (! $order->viewerCanAccess($user)) {
            return false;
        }

        $category = $this->input('category');

        if (! is_string($category)) {
            return true;
        }

        return $order->userCanUploadCategory($user, $category);
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
