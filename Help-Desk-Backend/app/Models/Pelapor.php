<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pelapor extends Model
{
    protected $table = 'pelapor';
    public $timestamps = true;

    protected $fillable = [
        'nama',
        'no_telepon',
        'jabatan',
    ];

    /**
     * Get all tikets created by this pelapor
     */
    public function tikets(): HasMany
    {
        return $this->hasMany(Tiket::class, 'pelapor_id');
    }
}
