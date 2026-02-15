<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kategori extends Model
{
    protected $table = 'kategori';
    public $timestamps = true;

    protected $fillable = [
        'nama',
        'slug',
        'deskripsi',
    ];

    /**
     * Get all jenis permasalahan for this kategori
     */
    public function jenisPermasalahan(): HasMany
    {
        return $this->hasMany(JenisPermasalahan::class, 'kategori_id');
    }

    /**
     * Get all tikets for this kategori
     */
    public function tikets(): HasMany
    {
        return $this->hasMany(Tiket::class, 'kategori_id');
    }

    /**
     * Get all lokasi for this kategori
     */
    public function lokasi(): HasMany
    {
        return $this->hasMany(Lokasi::class, 'kategori_id');
    }
}
