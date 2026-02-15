<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lampiran extends Model
{
    protected $table = 'lampiran';
    public $timestamps = true;

    protected $fillable = [
        'tiket_id',
        'file_path',
        'file_name',
        'file_size',
    ];

    /**
     * Get the tiket that owns this lampiran
     */
    public function tiket(): BelongsTo
    {
        return $this->belongsTo(Tiket::class, 'tiket_id');
    }
}
