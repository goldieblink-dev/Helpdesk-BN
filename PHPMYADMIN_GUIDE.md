# 📊 CARA IMPORT SQL KE PHPMYADMIN

**Status Database:** ✅ Already Created via `php artisan migrate:fresh --seed`

Namun jika Anda ingin mengimport ulang ke phpMyAdmin, ikuti langkah ini:

---

## 🚀 QUICK STEPS (Tercepat)

### **Step 1: Buka phpMyAdmin**
```
URL: http://localhost/phpmyadmin
```

### **Step 2: Copy SQL Script**
```
Buka file: helpdesk_phpmyadmin.sql
Ctrl+A untuk select semua
Ctrl+C untuk copy
```

### **Step 3: Pilih Database**
Di phpMyAdmin klik: **SQL** tab (di bagian atas)

### **Step 4: Paste & Execute**
```
1. Klik tab SQL (jika belum)
2. Paste SQL code ke text area besar
3. Klik tombol "Go" (bawah kanan)
4. Tunggu sampai "Query executed successfully"
5. Done! ✅
```

---

## 📸 STEP-BY-STEP VISUAL GUIDE

### **Step 1: Buka phpMyAdmin**

```
Browser → ketik: http://localhost/phpmyadmin
Tunggu sampai halaman phpMyAdmin terbuka
```

**Tampilan awal:**
```
┌─────────────────────────────────────┐
│  phpMyAdmin v5.x                    │
├─────────────────────────────────────┤
│  Server: localhost:3306             │
│  User: root                         │
│  Database: (Pilih di sini)          │
└─────────────────────────────────────┘
```

---

### **Step 2: Klik Tab SQL**

Di bagian atas phpMyAdmin, cari tab yang bertulisan:
```
┌──────┬──────┬──────┬──────┬──────┐
│ Home │ SQL  │ Logs │ .... │ Help │
└──────┼──────┴──────┴──────┴──────┘
       ↑
     KLIK SINI
```

---

### **Step 3: Buka File SQL**

**Option A: Buka dengan Text Editor**
```
1. Buka File Explorer
2. Navigate ke: Help-Desk-Backend/
3. Cari file: helpdesk_phpmyadmin.sql
4. Buka dengan Notepad / VS Code
5. Ctrl+A (select semua)
6. Ctrl+C (copy)
```

**Option B: Copy Dari Terminal**
```bash
# Linux/Mac
cat helpdesk_phpmyadmin.sql | xclip -selection clipboard

# Windows
type helpdesk_phpmyadmin.sql | clip
```

---

### **Step 4: Paste ke phpMyAdmin**

Di phpMyAdmin tab SQL, ada text area besar:

```
┌─────────────────────────────────────────┐
│  [Enter SQL statement(s) here...]      │
│                                         │
│  [PASTE SQL CODE DI SINI]              │
│                                         │
│  [Ctrl+V untuk paste]                  │
│                                         │
│  ┌──────┐    ┌──────┐    ┌──────┐     │
│  │ Go   │    │Clear │    │Close │     │
│  └──────┘    └──────┘    └──────┘     │
└─────────────────────────────────────────┘
```

**Langkah:**
```
1. Klik di dalam text area
2. Ctrl+V (Paste)
3. Lihat SQL code terisi penuh
```

---

### **Step 5: Klik Tombol "Go"**

Setelah SQL sudah ter-paste:

```
Klik tombol "Go" di bawah kanan
```

**Tunggu proses:**
```
Creating database helpdesk ... ✓
Creating table users ... ✓
Creating table cache ... ✓
Creating table jobs ... ✓
Creating table admin ... ✓
Creating table pelapor ... ✓
Creating table kategori ... ✓
Creating table jenis_permasalahan ... ✓
Creating table tiket ... ✓
Creating table lampiran ... ✓
Inserting admin user ... ✓
Inserting categories ... ✓
Inserting problem types ... ✓

✅ Query executed successfully!
```

---

## ✅ Verifikasi Setup

### **Method 1: Via phpMyAdmin**

**Cek Database Dibuat:**
```
1. Di sebelah kiri phpMyAdmin, cari "helpdesk"
2. Klik untuk membukanya
3. Lihat list 13 tables
```

**Lihat Data:**
```
1. Klik tabel "admin"
2. Lihat 1 baris admin user
3. Klik tabel "kategori"
4. Lihat 4 kategori (Server, Website, Internet, Lab)
5. Klik tabel "jenis_permasalahan"
6. Lihat 19 problem types
```

### **Method 2: Via Terminal**

```bash
# Test koneksi
cd Help-Desk-Backend
php artisan db:show

# Lihat tabel
php artisan tinker
> DB::select('SHOW TABLES FROM helpdesk;');
> DB::table('admin')->get();
> DB::table('kategori')->count();
> exit
```

### **Method 3: Via db-test.php**

```bash
# Start Laravel
php artisan serve --port=8000

# Buka di browser
http://localhost:8000/db-test.php

# Lihat status semua table dan data count
```

---

## 🔐 Admin Login Credentials

Setelah SQL dijalankan, Anda bisa login dengan:

```
Username: admin
Password: admin123
Email:    admin@helpdesk.sch.id
```

Login URL: `http://localhost:5173/admin-login`

---

## ⚠️ Jika Tidak Berhasil

### **Error 1: Database Sudah Ada**

```
Error: Database 'helpdesk' already exists
```

**Solusi:**
```
Option A: Dropdown database di phpMyAdmin
         → Klik helpdesk → Click "Drop"
         → Confirm → Jalankan SQL lagi

Option B: Edit SQL file
         → Uncomment baris: DROP DATABASE IF EXISTS helpdesk;
         → Paste & Go lagi
```

### **Error 2: Access Denied / Connection Error**

```
Error: Access denied for user 'root'@'localhost'
```

**Solusi:**
```
1. Pastikan MySQL running
2. Pastikan phpMyAdmin access benar
3. Check .env file:
   - DB_HOST=127.0.0.1 atau localhost
   - DB_USERNAME=root
   - DB_PASSWORD=kosong atau sesuai konfigurasi
```

### **Error 3: SQL Syntax Error**

```
Error: 1064 - You have an error in your SQL syntax
```

**Solusi:**
```
1. Pastikan file helpdesk_phpmyadmin.sql complete
2. Jangan custom/edit SQL jika tidak mengerti syntax SQL
3. Copy-paste penuh tanpa edit
```

---

## 📋 File Locations

```
Folder: /home/goldie/Documents/Code/HelpDesk/

SQL File untuk phpMyAdmin:
  → helpdesk_phpmyadmin.sql

Laravel Config:
  → Help-Desk-Backend/.env

API Test Tool:
  → Help-Desk-Backend/db-test.php (akses di http://localhost:8000/db-test.php)
```

---

## 🔄 Alternative Methods (Jika phpMyAdmin Tidak Bekerja)

### **Method A: Laravel Migration (RECOMMENDED)**

```bash
cd Help-Desk-Backend
php artisan migrate:fresh --seed
```

✅ Ini yang udah dijalankan dan berhasil!

### **Method B: MySQL Command Line**

```bash
# Navigate ke folder
cd /home/goldie/Documents/Code/HelpDesk

# Run SQL file
mysql -u root < helpdesk_phpmyadmin.sql

# Dengan password (jika ada)
mysql -u root -p < helpdesk_phpmyadmin.sql
# (Ketik password saat diminta)
```

### **Method C: MySQL Workbench**

```
1. Buka MySQL Workbench
2. File → Open SQL Script
3. Pilih: helpdesk_phpmyadmin.sql
4. Execute (Ctrl+Shift+Enter)
```

---

## 📊 Database Structure Review

**Total Tables: 13**

| # | Tabel | Fungsi |
|---|-------|--------|
| 1 | users | Laravel default users |
| 2 | cache | Cache storage |
| 3 | cache_locks | Cache locking |
| 4 | jobs | Job queue |
| 5 | job_batches | Batch jobs |
| 6 | failed_jobs | Failed job records |
| 7 | sessions | Session management |
| 8 | **admin** | Admin users (1 record) |
| 9 | **pelapor** | Complaint submitters |
| 10 | **kategori** | Problem categories (4 records) |
| 11 | **jenis_permasalahan** | Problem types (19 records) |
| 12 | **tiket** | Tickets/Complaints |
| 13 | **lampiran** | Attachments |

**Initial Data:**
- ✅ 1 admin user (admin/admin123)
- ✅ 4 categories
- ✅ 19 problem types
- ✅ 0 complaint tickets (akan dibuat oleh user)

---

## 🎯 Next Steps After Setup

1. ✅ SQL executed via phpMyAdmin
2. ✅ Database created
3. ✅ Verify dengan db-test.php
4. ⏳ Start backend: `php artisan serve --port=8000`
5. ⏳ Start frontend: `npm run dev`
6. ⏳ Access: `http://localhost:5173`
7. ⏳ Login: `admin/admin123`

---

## 📞 Quick Reference

**phpMyAdmin URL:**
```
http://localhost/phpmyadmin
```

**SQL File Location:**
```
/home/goldie/Documents/Code/HelpDesk/helpdesk_phpmyadmin.sql
```

**Database Name:**
```
helpdesk
```

**MySQL Credentials:**
```
Host: localhost
User: root
Password: (empty or your password)
Port: 3306
```

---

## ✨ Tips & Tricks

**Tip 1: Multiple Queries**
```
Anda bisa paste multiple SQL statements sekaligus
phpMyAdmin akan jalankan satu per satu otomatis
```

**Tip 2: View Execution Time**
```
Setelah "Go" diklik, lihat waktu eksekusi di bawah
Normalnya: <1 detik untuk seluruh setup
```

**Tip 3: Export Database**
```
Jika ingin backup nanti:
1. Klik database helpdesk
2. Export → Go
3. Download file SQL
```

**Tip 4: Check Charset**
```
Pastikan charset adalah utf8mb4 (support emoji & indo)
Di phpMyAdmin → Database → Operations → Collation
```

---

## 🎉 Selesai!

Setelah SQL berhasil di-execute:

**Database siap digunakan!** ✅

Akses aplikasi:
```
URL: http://localhost:5173
Username: admin
Password: admin123
```

---

**Dibuat:** 15 Februari 2026  
**Status:** Ready for phpMyAdmin Import  
**Supported:** All MySQL 5.7+, 8.0+, MariaDB 10.3+

