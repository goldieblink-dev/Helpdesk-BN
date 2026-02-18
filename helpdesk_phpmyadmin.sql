-- ============================================================
-- HELP DESK DATABASE - PHPMYADMIN SQL SCRIPT
-- ============================================================
-- Database untuk Sistem Help Desk SMK Bakti Nusantara 66
-- Paste semua ini ke phpMyAdmin SQL tab dan klik "Go"
-- ============================================================

-- 1. DROP DATABASE JIKA SUDAH ADA (HATI-HATI!)
-- DROP DATABASE IF EXISTS helpdesk_db;

-- 2. BUAT DATABASE
CREATE DATABASE IF NOT EXISTS helpdesk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE helpdesk;

-- ============================================================
-- TABLE: users (Laravel default)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL UNIQUE,
  email_verified_at timestamp NULL DEFAULT NULL,
  password varchar(255) NOT NULL,
  remember_token varchar(100) DEFAULT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL,
  KEY users_email_index (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: cache
-- ============================================================
CREATE TABLE IF NOT EXISTS cache (
  `key` varchar(255) NOT NULL PRIMARY KEY,
  value longtext NOT NULL,
  expiration int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: cache_locks
-- ============================================================
CREATE TABLE IF NOT EXISTS cache_locks (
  `key` varchar(255) NOT NULL PRIMARY KEY,
  owner varchar(255) NOT NULL,
  expiration int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: jobs
-- ============================================================
CREATE TABLE IF NOT EXISTS jobs (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  queue varchar(255) NOT NULL,
  payload longtext NOT NULL,
  attempts tinyint unsigned NOT NULL,
  reserved_at int unsigned DEFAULT NULL,
  available_at int unsigned NOT NULL,
  created_at int unsigned NOT NULL,
  KEY jobs_queue_index (queue)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: job_batches
-- ============================================================
CREATE TABLE IF NOT EXISTS job_batches (
  id varchar(255) NOT NULL PRIMARY KEY,
  name varchar(255) NOT NULL,
  total_jobs int NOT NULL,
  pending_jobs int NOT NULL,
  failed_jobs int NOT NULL,
  failed_job_ids longtext NOT NULL,
  options mediumtext DEFAULT NULL,
  cancelled_at int DEFAULT NULL,
  created_at int NOT NULL,
  finished_at int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: failed_jobs
-- ============================================================
CREATE TABLE IF NOT EXISTS failed_jobs (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  uuid varchar(255) NOT NULL UNIQUE,
  connection text NOT NULL,
  queue text NOT NULL,
  payload longtext NOT NULL,
  exception longtext NOT NULL,
  failed_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS sessions (
  id varchar(255) NOT NULL PRIMARY KEY,
  user_id bigint unsigned DEFAULT NULL,
  ip_address varchar(45) DEFAULT NULL,
  user_agent text DEFAULT NULL,
  payload text NOT NULL,
  last_activity int NOT NULL,
  KEY sessions_user_id_index (user_id),
  KEY sessions_last_activity_index (last_activity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: admin
-- ============================================================
CREATE TABLE IF NOT EXISTS admin (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username varchar(255) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  nama varchar(255) NOT NULL,
  email varchar(255) NOT NULL UNIQUE,
  api_token varchar(80) UNIQUE DEFAULT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: pelapor
-- ============================================================
CREATE TABLE IF NOT EXISTS pelapor (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nama varchar(255) NOT NULL,
  no_telepon varchar(255) NOT NULL,
  jabatan enum('siswa','guru','masyarakat_sekolah') NOT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: kategori
-- ============================================================
CREATE TABLE IF NOT EXISTS kategori (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nama varchar(255) NOT NULL,
  slug varchar(255) NOT NULL UNIQUE,
  deskripsi text DEFAULT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: lokasi
-- ============================================================
CREATE TABLE IF NOT EXISTS lokasi (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  kategori_id bigint unsigned NOT NULL,
  nama varchar(255) NOT NULL,
  deskripsi varchar(255) DEFAULT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL,
  KEY lokasi_kategori_id_foreign (kategori_id),
  CONSTRAINT lokasi_kategori_id_foreign 
    FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: jenis_permasalahan
-- ============================================================
CREATE TABLE IF NOT EXISTS jenis_permasalahan (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  kategori_id bigint unsigned NOT NULL,
  nama varchar(255) NOT NULL,
  deskripsi text DEFAULT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL,
  KEY jenis_permasalahan_kategori_id_foreign (kategori_id),
  CONSTRAINT jenis_permasalahan_kategori_id_foreign 
    FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: tiket
-- ============================================================
CREATE TABLE IF NOT EXISTS tiket (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nomor_tiket varchar(255) NOT NULL UNIQUE,
  pelapor_id bigint unsigned NOT NULL,
  kategori_id bigint unsigned NOT NULL,
  jenis_permasalahan_id bigint unsigned NOT NULL,
  admin_id bigint unsigned DEFAULT NULL,
  lokasi_gedung varchar(255) DEFAULT NULL,
  link_url varchar(255) DEFAULT NULL,
  deskripsi text NOT NULL,
  status enum('menunggu','diproses','selesai') NOT NULL DEFAULT 'menunggu',
  catatan_admin text DEFAULT NULL,
  alasan_penolakan text DEFAULT NULL,
  tanggal date NOT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL,
  KEY tiket_nomor_tiket_index (nomor_tiket),
  KEY tiket_status_index (status),
  KEY tiket_tanggal_index (tanggal),
  KEY tiket_pelapor_id_index (pelapor_id),
  KEY tiket_kategori_id_foreign (kategori_id),
  KEY tiket_jenis_permasalahan_id_foreign (jenis_permasalahan_id),
  KEY tiket_admin_id_foreign (admin_id),
  CONSTRAINT tiket_pelapor_id_foreign 
    FOREIGN KEY (pelapor_id) REFERENCES pelapor(id) ON DELETE CASCADE,
  CONSTRAINT tiket_kategori_id_foreign 
    FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE RESTRICT,
  CONSTRAINT tiket_jenis_permasalahan_id_foreign 
    FOREIGN KEY (jenis_permasalahan_id) REFERENCES jenis_permasalahan(id) ON DELETE RESTRICT,
  CONSTRAINT tiket_admin_id_foreign 
    FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: lampiran
-- ============================================================
CREATE TABLE IF NOT EXISTS lampiran (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tiket_id bigint unsigned NOT NULL,
  file_path varchar(255) NOT NULL,
  file_name varchar(255) NOT NULL,
  file_size int NOT NULL,
  created_at timestamp NULL DEFAULT NULL,
  updated_at timestamp NULL DEFAULT NULL,
  KEY lampiran_tiket_id_index (tiket_id),
  CONSTRAINT lampiran_tiket_id_foreign 
    FOREIGN KEY (tiket_id) REFERENCES tiket(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- INSERT DATA: ADMIN USER
-- ============================================================
-- Username: admin
-- Password: admin123 (hashed with bcrypt)
INSERT INTO admin (username, password, nama, email, created_at, updated_at) 
VALUES (
  'admin',
  '$2y$12$v.rVx/.hALj2Y5dJHveFm.0dFnRIIrTLjFkYZnvpM1eJpCsL2ztXK',
  'Administrator',
  'admin@helpdesk.sch.id',
  NOW(),
  NOW()
);

-- ============================================================
-- INSERT DATA: KATEGORI (Categories)
-- ============================================================
INSERT INTO kategori (nama, slug, deskripsi, created_at, updated_at) VALUES
('Server', 'server', 'Masalah pada infrastruktur server sekolah', NOW(), NOW()),
('Website', 'website', 'Masalah pada website-website milik sekolah', NOW(), NOW()),
('Internet', 'internet', 'Masalah pada koneksi jaringan dan WiFi', NOW(), NOW()),
('Lab. Komputer', 'lab-komputer', 'Masalah pada perangkat di laboratorium komputer', NOW(), NOW());

-- ============================================================
-- INSERT DATA: LOKASI (Locations)
-- ============================================================
-- KATEGORI: SERVER
INSERT INTO lokasi (kategori_id, nama, deskripsi, created_at, updated_at) VALUES
((SELECT id FROM kategori WHERE slug='server'), 'Ruang Server Utama (Gedung A)', 'Server utama sekolah di Gedung A Lantai 2', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='server'), 'Ruang Server Cadangan (Gedung B)', 'Backup server di Gedung B Lantai 1', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='server'), 'Rak Server TU', 'Rak server kecil di ruang Tata Usaha', NOW(), NOW());

-- KATEGORI: INTERNET
INSERT INTO lokasi (kategori_id, nama, deskripsi, created_at, updated_at) VALUES
((SELECT id FROM kategori WHERE slug='internet'), 'Gedung A - Lantai 1', 'Area kelas X dan Ruang Guru', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='internet'), 'Gedung A - Lantai 2', 'Area kelas XI dan Lab Komputer', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='internet'), 'Gedung B - Lantai 1', 'Area kelas XII dan Perpustakaan', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='internet'), 'Gedung B - Lantai 2', 'Area Aula dan Ruang Rapat', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='internet'), 'Area Kantin', 'Hotspot area kantin sekolah', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='internet'), 'Pos Satpam', 'Jaringan CCTV dan Pos Satpam', NOW(), NOW());

-- ============================================================
-- INSERT DATA: JENIS_PERMASALAHAN (Problem Types)
-- ============================================================

-- KATEGORI 1: SERVER (3 jenis)
INSERT INTO jenis_permasalahan (kategori_id, nama, deskripsi, created_at, updated_at) VALUES
((SELECT id FROM kategori WHERE slug='server'), 'Server dari VPS', 'Gangguan pada Virtual Private Server yang digunakan untuk hosting aplikasi atau layanan sekolah', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='server'), 'Server WS', 'Masalah pada Web Server sekolah seperti error 500, timeout, SSL certificate expired', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='server'), 'Server PK', 'Kendala pada server Pusat Komputer yang mendukung jaringan internal sekolah', NOW(), NOW());

-- KATEGORI 2: WEBSITE (8 jenis)
INSERT INTO jenis_permasalahan (kategori_id, nama, deskripsi, created_at, updated_at) VALUES
((SELECT id FROM kategori WHERE slug='website'), 'PKL / Prakerin', 'Masalah pada website sistem informasi Praktek Kerja Lapangan', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='website'), 'Web Perpus', 'Gangguan pada website perpustakaan digital sekolah', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='website'), 'Web Sekolah', 'Kendala pada website utama sekolah seperti halaman tidak bisa diakses', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='website'), 'Web Ujian', 'Masalah pada platform ujian online seperti timer error, logout otomatis', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='website'), 'Web SPMB', 'Kendala pada sistem pendaftaran SPMB seperti form error, upload gagal', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='website'), 'Karomah / Web Ramadan', 'Gangguan pada website/aplikasi Karomah atau Web Ramadan sekolah', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='website'), 'Web Help Desk', 'Masalah pada sistem Help Desk sendiri', NOW(), NOW());

-- KATEGORI 3: INTERNET (1 jenis)
INSERT INTO jenis_permasalahan (kategori_id, nama, deskripsi, created_at, updated_at) VALUES
((SELECT id FROM kategori WHERE slug='internet'), 'WiFi', 'Koneksi WiFi lambat, tidak terdeteksi, atau tidak bisa connect', NOW(), NOW());

-- KATEGORI 4: LAB KOMPUTER (7 jenis - Lab 1-7)
INSERT INTO jenis_permasalahan (kategori_id, nama, deskripsi, created_at, updated_at) VALUES
((SELECT id FROM kategori WHERE slug='lab-komputer'), 'Lab 1', 'Masalah pada perangkat di Laboratorium Komputer 1', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='lab-komputer'), 'Lab 2', 'Masalah pada perangkat di Laboratorium Komputer 2', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='lab-komputer'), 'Lab 3', 'Masalah pada perangkat di Laboratorium Komputer 3', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='lab-komputer'), 'Lab 4', 'Masalah pada perangkat di Laboratorium Komputer 4', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='lab-komputer'), 'Lab 5', 'Masalah pada perangkat di Laboratorium Komputer 5', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='lab-komputer'), 'Lab 6', 'Masalah pada perangkat di Laboratorium Komputer 6', NOW(), NOW()),
((SELECT id FROM kategori WHERE slug='lab-komputer'), 'Lab 7', 'Masalah pada perangkat di Laboratorium Komputer 7', NOW(), NOW());

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
-- Jalankan query ini untuk verifikasi:
-- SELECT 'TABLES' as info, COUNT(*) as total FROM information_schema.tables WHERE table_schema='helpdesk';
-- SELECT 'ADMIN USERS' as info, COUNT(*) as total FROM admin;
-- SELECT 'CATEGORIES' as info, COUNT(*) as total FROM kategori;
-- SELECT 'PROBLEM TYPES' as info, COUNT(*) as total FROM jenis_permasalahan;

-- ============================================================
-- DONE! DATABASE SETUP COMPLETE
-- ============================================================
-- Total tables: 13 (users, cache, cache_locks, jobs, job_batches, failed_jobs, sessions, admin, pelapor, kategori, jenis_permasalahan, tiket, lampiran)
-- Initial data: 1 admin + 4 categories + 19 problem types = 24 records
-- Ready for use!

