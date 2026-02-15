<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTiketRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:255',
            'no_telepon' => 'required|string|max:20|regex:/^[0-9\-\+]{9,}$/',
            'jabatan' => 'required|in:siswa,guru,masyarakat_sekolah',
            'kategori_id' => 'required|exists:kategori,id',
            'jenis_permasalahan_id' => [
                'required',
                'exists:jenis_permasalahan,id',
                function ($attribute, $value, $fail) {
                    $jenisPermasalahan = \App\Models\JenisPermasalahan::find($value);
                    $kategoriId = $this->input('kategori_id');
                    
                    if ($jenisPermasalahan && $jenisPermasalahan->kategori_id != $kategoriId) {
                        $fail('Jenis permasalahan tidak sesuai dengan kategori yang dipilih');
                    }
                },
            ],
            'lokasi_gedung' => 'nullable|string|max:255',
            'link_url' => 'nullable|url|max:255',
            'deskripsi' => 'required|string|min:20|max:1000',
            'files' => 'nullable|array|max:5',
            'files.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:2048',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'nama.required' => 'Nama lengkap harus diisi',
            'nama.max' => 'Nama tidak boleh lebih dari 255 karakter',
            'no_telepon.required' => 'No. telepon harus diisi',
            'jabatan.required' => 'Jabatan harus dipilih',
            'jabatan.in' => 'Jabatan tidak valid',
            'kategori_id.required' => 'Kategori harus dipilih',
            'kategori_id.exists' => 'Kategori tidak ditemukan',
            'jenis_permasalahan_id.required' => 'Jenis permasalahan harus dipilih',
            'jenis_permasalahan_id.exists' => 'Jenis permasalahan tidak ditemukan',
            'deskripsi.required' => 'Deskripsi masalah harus diisi',
            'deskripsi.min' => 'Deskripsi minimal 20 karakter',
            'deskripsi.max' => 'Deskripsi maksimal 1000 karakter',
            'files.array' => 'File harus berupa array',
            'files.max' => 'Maksimal 5 file yang dapat di-upload',
            'files.*.mimes' => 'File harus berformat jpg, jpeg, png, atau pdf',
            'files.*.max' => 'Setiap file maksimal 2MB',
            'link_url.url' => 'URL harus format yang valid',
        ];
    }
}
