<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Tiket extends Model
{
    protected $table = 'tiket';
    public $timestamps = true;

    protected $fillable = [
        'nomor_tiket',
        'pelapor_id',
        'kategori_id',
        'jenis_permasalahan_id',
        'admin_id',
        'lokasi_gedung',
        'link_url',
        'deskripsi',
        'status',
        'catatan_admin',
        'alasan_penolakan',
        'tanggal',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the pelapor that created this tiket
     */
    public function pelapor(): BelongsTo
    {
        return $this->belongsTo(Pelapor::class, 'pelapor_id');
    }

    /**
     * Get the kategori of this tiket
     */
    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class, 'kategori_id');
    }

    /**
     * Get the jenis permasalahan of this tiket
     */
    public function jenisPermasalahan(): BelongsTo
    {
        return $this->belongsTo(JenisPermasalahan::class, 'jenis_permasalahan_id');
    }

    /**
     * Get the admin handling this tiket
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'admin_id');
    }

    /**
     * Get all lampiran for this tiket
     */
    public function lampiran(): HasMany
    {
        return $this->hasMany(Lampiran::class, 'tiket_id');
    }

    /**
     * Generate unique nomor tiket with format: BN-DDMMYYYY-00001
     * Uses database locking to prevent race condition
     */
    public static function generateNomorTiket(): string
    {
        $today = now();
        $date = $today->format('dmY'); // DDMMYYYY
        
        // Use transaction to prevent race condition
        DB::beginTransaction();
        try {
            $count = self::whereDate('created_at', $today->toDateString())
                ->lockForUpdate()
                ->count() + 1;
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw new \Exception('Failed to generate ticket number: ' . $e->getMessage());
        }
        
        return sprintf('BN-%s-%05d', $date, $count);
    }
}
