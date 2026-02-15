<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Admin extends Model
{
    protected $table = 'admin';
    public $timestamps = true;

    protected $fillable = [
        'username',
        'password',
        'nama',
        'email',
        'api_token',
    ];

    protected $hidden = [
        'password',
        'api_token',
    ];

    /**
     * Get all tikets handled by this admin
     */
    public function tikets(): HasMany
    {
        return $this->hasMany(Tiket::class, 'admin_id');
    }
}
