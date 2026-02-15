<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Kategori;
use App\Models\JenisPermasalahan;

class KategoriSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create KATEGORI
        $server = Kategori::create([
            'nama' => 'Server',
            'slug' => 'server',
            'deskripsi' => 'Masalah pada infrastruktur server sekolah',
        ]);

        $website = Kategori::create([
            'nama' => 'Website',
            'slug' => 'website',
            'deskripsi' => 'Masalah pada website-website milik sekolah',
        ]);

        $internet = Kategori::create([
            'nama' => 'Internet',
            'slug' => 'internet',
            'deskripsi' => 'Masalah pada koneksi jaringan dan WiFi',
        ]);

        $labKomputer = Kategori::create([
            'nama' => 'Lab. Komputer',
            'slug' => 'lab-komputer',
            'deskripsi' => 'Masalah pada perangkat di laboratorium komputer',
        ]);

        // Create JENIS_PERMASALAHAN for SERVER
        JenisPermasalahan::create([
            'kategori_id' => $server->id,
            'nama' => 'Server dari VPS',
            'deskripsi' => 'Gangguan pada Virtual Private Server yang digunakan untuk hosting aplikasi atau layanan sekolah',
        ]);

        JenisPermasalahan::create([
            'kategori_id' => $server->id,
            'nama' => 'Server WS',
            'deskripsi' => 'Masalah pada Web Server sekolah seperti error 500, timeout, SSL certificate expired',
        ]);

        JenisPermasalahan::create([
            'kategori_id' => $server->id,
            'nama' => 'Server PK',
            'deskripsi' => 'Kendala pada server Pusat Komputer yang mendukung jaringan internal sekolah',
        ]);

        // Create JENIS_PERMASALAHAN for WEBSITE
        JenisPermasalahan::create([
            'kategori_id' => $website->id,
            'nama' => 'PKL / Prakerin',
            'deskripsi' => 'Masalah pada website sistem informasi Praktek Kerja Lapangan',
        ]);

        JenisPermasalahan::create([
            'kategori_id' => $website->id,
            'nama' => 'Web Perpus',
            'deskripsi' => 'Gangguan pada website perpustakaan digital sekolah',
        ]);

        JenisPermasalahan::create([
            'kategori_id' => $website->id,
            'nama' => 'Web Sekolah',
            'deskripsi' => 'Kendala pada website utama sekolah seperti halaman tidak bisa diakses',
        ]);

        JenisPermasalahan::create([
            'kategori_id' => $website->id,
            'nama' => 'Web Ujian',
            'deskripsi' => 'Masalah pada platform ujian online seperti timer error, logout otomatis',
        ]);

        JenisPermasalahan::create([
            'kategori_id' => $website->id,
            'nama' => 'Web SPMB',
            'deskripsi' => 'Kendala pada sistem pendaftaran SPMB seperti form error, upload gagal',
        ]);

        JenisPermasalahan::create([
            'kategori_id' => $website->id,
            'nama' => 'Karomah / Web Ramadan',
            'deskripsi' => 'Gangguan pada website/aplikasi Karomah atau Web Ramadan sekolah',
        ]);

        JenisPermasalahan::create([
            'kategori_id' => $website->id,
            'nama' => 'Web Help Desk',
            'deskripsi' => 'Masalah pada sistem Help Desk sendiri',
        ]);

        // Create JENIS_PERMASALAHAN for INTERNET
        JenisPermasalahan::create([
            'kategori_id' => $internet->id,
            'nama' => 'WiFi',
            'deskripsi' => 'Koneksi WiFi lambat, tidak terdeteksi, atau tidak bisa connect',
        ]);

        // Create JENIS_PERMASALAHAN for LAB KOMPUTER
        for ($i = 1; $i <= 7; $i++) {
            JenisPermasalahan::create([
                'kategori_id' => $labKomputer->id,
                'nama' => "Lab $i",
                'deskripsi' => "Masalah pada perangkat di Laboratorium Komputer $i",
            ]);
        }
    }
}
