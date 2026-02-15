-- ============================================================
-- HELP DESK SYSTEM - MySQL Database Setup Script
-- SMK Bakti Nusantara 66
-- Date: February 15, 2026
-- ============================================================

-- ============================================================
-- 1. CREATE DATABASE
-- ============================================================
CREATE DATABASE IF NOT EXISTS helpdesk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE helpdesk;

-- ============================================================
-- 2. DROP EXISTING TABLES (if needed)
-- ============================================================
-- Uncomment these lines if you want to reset the database
-- DROP TABLE IF EXISTS lampiran;
-- DROP TABLE IF EXISTS tiket;
-- DROP TABLE IF EXISTS jenis_permasalahan;
-- DROP TABLE IF EXISTS kategori;
-- DROP TABLE IF EXISTS pelapor;
-- DROP TABLE IF EXISTS admin;
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS cache;
-- DROP TABLE IF EXISTS jobs;

-- ============================================================
-- 3. CREATE TABLES
-- ============================================================

-- users table (Laravel default)
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified_at TIMESTAMP NULL,
  password VARCHAR(255) NOT NULL,
  remember_token VARCHAR(100) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- cache table (Laravel default)
CREATE TABLE IF NOT EXISTS cache (
  `key` VARCHAR(255) NOT NULL PRIMARY KEY,
  value LONGTEXT NOT NULL,
  expiration INT NOT NULL,
  INDEX idx_expiration (expiration)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- jobs table (Laravel default)
CREATE TABLE IF NOT EXISTS jobs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  queue VARCHAR(255) NOT NULL,
  payload LONGTEXT NOT NULL,
  exceptions LONGTEXT NULL,
  failed_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL,
  INDEX idx_queue (queue)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- admin table
CREATE TABLE IF NOT EXISTS admin (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- pelapor table
CREATE TABLE IF NOT EXISTS pelapor (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  no_telepon VARCHAR(20) NOT NULL,
  jabatan ENUM('Guru', 'Siswa', 'Karyawan') NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_no_telepon (no_telepon)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- kategori table
CREATE TABLE IF NOT EXISTS kategori (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  deskripsi TEXT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- jenis_permasalahan table
CREATE TABLE IF NOT EXISTS jenis_permasalahan (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  kategori_id BIGINT UNSIGNED NOT NULL,
  nama VARCHAR(150) NOT NULL,
  deskripsi TEXT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE CASCADE,
  INDEX idx_kategori_id (kategori_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- tiket table
CREATE TABLE IF NOT EXISTS tiket (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nomor_tiket VARCHAR(20) UNIQUE NOT NULL,
  pelapor_id BIGINT UNSIGNED NOT NULL,
  kategori_id BIGINT UNSIGNED NOT NULL,
  jenis_permasalahan_id BIGINT UNSIGNED NOT NULL,
  admin_id BIGINT UNSIGNED NULL,
  lokasi_gedung VARCHAR(100) NOT NULL,
  link_url VARCHAR(255) NULL,
  deskripsi TEXT NOT NULL,
  status ENUM('menunggu', 'diproses', 'selesai') NOT NULL DEFAULT 'menunggu',
  catatan_admin TEXT NULL,
  tanggal DATE NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pelapor_id) REFERENCES pelapor(id) ON DELETE CASCADE,
  FOREIGN KEY (kategori_id) REFERENCES kategori(id) ON DELETE CASCADE,
  FOREIGN KEY (jenis_permasalahan_id) REFERENCES jenis_permasalahan(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE SET NULL,
  INDEX idx_nomor_tiket (nomor_tiket),
  INDEX idx_status (status),
  INDEX idx_tanggal (tanggal),
  INDEX idx_pelapor_id (pelapor_id),
  INDEX idx_kategori_id (kategori_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- lampiran table
CREATE TABLE IF NOT EXISTS lampiran (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tiket_id BIGINT UNSIGNED NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INT NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tiket_id) REFERENCES tiket(id) ON DELETE CASCADE,
  INDEX idx_tiket_id (tiket_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. SEED INITIAL DATA
-- ============================================================

-- Insert Admin User
INSERT IGNORE INTO admin (username, password, nama, email) VALUES
('admin', '$2y$12$V7E1L2NWZKAhLKllW4.Ene6xH2tFWqxT0FkqKZB/2WCGhJ7kp3Kbm', 'Administrator', 'admin@helpdesk.sch.id');

-- Insert Categories
INSERT IGNORE INTO kategori (nama, slug, deskripsi) VALUES
('Server', 'server', 'Masalah pada infrastruktur server sekolah'),
('Website', 'website', 'Masalah terkait website sekolah'),
('Internet', 'internet', 'Masalah koneksi internet sekolah'),
('Lab Komputer', 'lab-komputer', 'Masalah di laboratorium komputer');

-- Insert Jenis Permasalahan for Server (kategori_id = 1)
INSERT IGNORE INTO jenis_permasalahan (kategori_id, nama, deskripsi) VALUES
(1, 'Server dari VPS', 'Gangguan pada Virtual Private Server yang digunakan untuk hosting aplikasi atau layanan sekolah'),
(1, 'Server Lokal', 'Gangguan pada server lokal yang ada di ruang server sekolah'),
(1, 'Backup & Recovery', 'Masalah backup data atau perlu recovery data dari backup');

-- Insert Jenis Permasalahan for Website (kategori_id = 2)
INSERT IGNORE INTO jenis_permasalahan (kategori_id, nama, deskripsi) VALUES
(2, 'Website Sekolah', 'Masalah pada website utama sekolah (smkbaknus.sch.id)'),
(2, 'Portal Akademik', 'Masalah pada portal akademik atau sistem nilai'),
(2, 'Website Departemen', 'Masalah pada website departemen atau sub-site'),
(2, 'Web Development', 'Request pembuatan website atau aplikasi web baru');

-- Insert Jenis Permasalahan for Internet (kategori_id = 3)
INSERT IGNORE INTO jenis_permasalahan (kategori_id, nama, deskripsi) VALUES
(3, 'WiFi Sekolah', 'Masalah pada WiFi atau jaringan wireless sekolah'),
(3, 'Koneksi Internet Putus', 'Internet tiba-tiba offline atau putus'),
(3, 'Kecepatan Internet Lambat', 'Koneksi internet sangat lambat atau lag'),
(3, 'Routing & Network', 'Masalah pada router, switch, atau konfigurasi jaringan');

-- Insert Jenis Permasalahan for Lab Komputer (kategori_id = 4)
INSERT IGNORE INTO jenis_permasalahan (kategori_id, nama, deskripsi) VALUES
(4, 'Komputer Tidak Menyala', 'Komputer lab tidak menyala atau bermasalah saat startup'),
(4, 'Software Belum Terinstall', 'Software yang diperlukan belum ada di lab komputer'),
(4, 'Hardware Rusak', 'Hardware komputer rusak (monitor, keyboard, mouse, dll)'),
(4, 'Printer Tidak Berfungsi', 'Printer lab tidak berfungsi atau offline'),
(4, 'Koneksi Network Lab', 'Lab komputer tidak terkoneksi jaringan'),
(4, 'OS/Driver Issue', 'Masalah pada sistem operasi atau driver'),
(4, 'Software License', 'Masalah lisensi atau activation software di lab'),
(4, 'Maintenance Lab', 'Request maintenance rutin atau pembersihan lab'),
(4, 'User Account', 'Masalah login atau user account di lab komputer');

-- ============================================================
-- 5. VERIFY SETUP
-- ============================================================

-- Display summary
SELECT 'Setup Complete!' as status;
SELECT 'Tables created:' as info;
SHOW TABLES;

SELECT COUNT(*) as admin_count FROM admin;
SELECT COUNT(*) as kategori_count FROM kategori;
SELECT COUNT(*) as jenis_count FROM jenis_permasalahan;

-- ============================================================
-- INFORMATION FOR DEVELOPMENT
-- ============================================================
/*

DATABASE CREDENTIALS:
- Database: helpdesk_db
- Host: localhost (127.0.0.1)
- Port: 3306
- Username: root
- Password: (empty or your password)

DEFAULT ADMIN LOGIN:
- Username: admin
- Password: admin123 (hashed)

TABLES CREATED (9):
1. users
2. cache
3. jobs
4. admin
5. pelapor
6. kategori (4 categories)
7. jenis_permasalahan (19 types)
8. tiket
9. lampiran

INITIAL DATA:
- 1 admin account
- 4 categories
- 19 jenis_permasalahan
- 0 pelapor (created on first complaint submission)
- 0 tiket (empty, ready for complaints)
- 0 lampiran (empty)

NEXT STEPS:
1. Update Help-Desk-Backend/.env if you have MySQL password
2. Run: php artisan migrate:fresh --seed (to use Laravel seeders)
3. Start Laravel: php artisan serve --port=8000
4. Start React: npm run dev (in Help-Desk-Frontend folder)
5. Access admin: http://localhost:5173/admin-login
6. Admin login: admin / admin123

*/

-- ============================================================
