<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Lokasi;
use App\Models\Kategori;

class LokasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get kategori IDs
        $server = Kategori::where('slug', 'server')->first();
        $website = Kategori::where('slug', 'website')->first();
        $internet = Kategori::where('slug', 'internet')->first();
        $labKomputer = Kategori::where('slug', 'lab-komputer')->first();

        // Lokasi untuk Server
        if ($server) {
            Lokasi::create(['kategori_id' => $server->id, 'nama' => 'Ruang Server', 'deskripsi' => 'Ruang server utama sekolah']);
            Lokasi::create(['kategori_id' => $server->id, 'nama' => 'Data Center', 'deskripsi' => 'Data center untuk server backup']);
        }

        // Lokasi untuk Website
        if ($website) {
            Lokasi::create(['kategori_id' => $website->id, 'nama' => 'Ruang Admin', 'deskripsi' => 'Ruang administrasi website']);
            Lokasi::create(['kategori_id' => $website->id, 'nama' => 'Kantor TI', 'deskripsi' => 'Kantor Teknologi Informasi']);
        }

        // Lokasi untuk Internet
        if ($internet) {
            Lokasi::create(['kategori_id' => $internet->id, 'nama' => 'Ruang Guru', 'deskripsi' => 'Area guru di ruang guru']);
            Lokasi::create(['kategori_id' => $internet->id, 'nama' => 'Ruang Siswa', 'deskripsi' => 'Area siswa di ruang sekolah']);
            Lokasi::create(['kategori_id' => $internet->id, 'nama' => 'Lab Komputer', 'deskripsi' => 'Area lab komputer']);
            Lokasi::create(['kategori_id' => $internet->id, 'nama' => 'Kantin', 'deskripsi' => 'Area kantin sekolah']);
            Lokasi::create(['kategori_id' => $internet->id, 'nama' => 'Aula', 'deskripsi' => 'Aula sekolah']);
        }

        // Lokasi untuk Lab Komputer
        if ($labKomputer) {
            Lokasi::create(['kategori_id' => $labKomputer->id, 'nama' => 'Lab 1', 'deskripsi' => 'Laboratorium Komputer 1']);
            Lokasi::create(['kategori_id' => $labKomputer->id, 'nama' => 'Lab 2', 'deskripsi' => 'Laboratorium Komputer 2']);
            Lokasi::create(['kategori_id' => $labKomputer->id, 'nama' => 'Lab 3', 'deskripsi' => 'Laboratorium Komputer 3']);
            Lokasi::create(['kategori_id' => $labKomputer->id, 'nama' => 'Lab 4', 'deskripsi' => 'Laboratorium Komputer 4']);
            Lokasi::create(['kategori_id' => $labKomputer->id, 'nama' => 'Lab 5', 'deskripsi' => 'Laboratorium Komputer 5']);
            Lokasi::create(['kategori_id' => $labKomputer->id, 'nama' => 'Lab 6', 'deskripsi' => 'Laboratorium Komputer 6']);
            Lokasi::create(['kategori_id' => $labKomputer->id, 'nama' => 'Lab 7', 'deskripsi' => 'Laboratorium Komputer 7']);
        }
    }
}
