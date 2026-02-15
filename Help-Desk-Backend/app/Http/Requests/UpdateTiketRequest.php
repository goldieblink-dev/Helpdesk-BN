<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTiketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Add proper authorization logic later if needed
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'status' => 'required|in:menunggu,diproses,selesai,ditolak',
            'catatan_admin' => 'nullable|string|max:1000',
            'admin_id' => 'nullable|exists:admin,id',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'status.required' => 'Status harus diisi',
            'status.in' => 'Status tidak valid',
            'catatan_admin.max' => 'Catatan maksimal 1000 karakter',
            'admin_id.exists' => 'Admin tidak ditemukan',
        ];
    }
}
