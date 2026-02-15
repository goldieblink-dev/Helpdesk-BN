<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JenisPermasalahan extends Model
{
    protected $table = 'jenis_permasalahan';
    public $timestamps = true;

    protected $fillable = [
        'kategori_id',
        'nama',
        'deskripsi',
    ];

    /**
     * Get the kategori that owns this jenis permasalahan
     */
    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class, 'kategori_id');
    }

    /**
     * Get all tikets for this jenis permasalahan
     */
    public function tikets(): HasMany
    {
        return $this->hasMany(Tiket::class, 'jenis_permasalahan_id');
    }
}
