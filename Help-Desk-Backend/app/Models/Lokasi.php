<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lokasi extends Model
{
    protected $table = 'lokasi';
    public $timestamps = true;

    protected $fillable = [
        'kategori_id',
        'nama',
        'deskripsi',
    ];

    /**
     * Get the kategori this lokasi belongs to
     */
    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class, 'kategori_id');
    }
}
