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
        Schema::create('lampiran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tiket_id')->constrained('tiket')->onDelete('cascade');
            $table->string('file_path');
            $table->string('file_name');
            $table->integer('file_size');
            $table->timestamps();
            
            $table->index('tiket_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lampiran');
    }
};
