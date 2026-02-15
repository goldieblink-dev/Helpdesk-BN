<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tiket', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_tiket')->unique();
            $table->foreignId('pelapor_id')->constrained('pelapor')->onDelete('cascade');
            $table->foreignId('kategori_id')->constrained('kategori')->onDelete('restrict');
            $table->foreignId('jenis_permasalahan_id')->constrained('jenis_permasalahan')->onDelete('restrict');
            $table->foreignId('admin_id')->nullable()->constrained('admin')->onDelete('set null');
            $table->string('lokasi_gedung')->nullable();
            $table->string('link_url')->nullable();
            $table->text('deskripsi');
            $table->enum('status', ['menunggu', 'diproses', 'selesai', 'ditolak'])->default('menunggu');
            $table->text('catatan_admin')->nullable();
            $table->text('alasan_penolakan')->nullable();
            $table->date('tanggal');
            $table->timestamps();
            
            $table->index('nomor_tiket');
            $table->index('status');
            $table->index('tanggal');
            $table->index('pelapor_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tiket');
    }
};
