# 🗄️ MySQL Setup Guide - Help Desk System

**Status:** .env file sudah dikonfigurasi untuk MySQL ✅  
**Database Name:** `helpdesk_db`  
**Username:** `root` (default)  
**Password:** (kosong - sesuaikan sesuai instalasi Anda)

---

## 📋 Prerequisite

Pastikan Anda sudah memiliki:
- ✅ MySQL Server (5.7+ or 8.0+)
- ✅ phpMyAdmin (untuk GUI management)
- ✅ PHP PDO MySQL extension (biasanya sudah include)

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Verify .env Configuration ✅

File `.env` sudah dikonfigurasi:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=helpdesk
DB_USERNAME=root
DB_PASSWORD=
```

**Jika password MySQL Anda ada, update `DB_PASSWORD` dengan password Anda!**

---

### Step 2: Create Database via phpMyAdmin

1. **Buka phpMyAdmin:**
   ```
   http://localhost/phpmyadmin
   ```

2. **Login dengan:**
   - Username: `root`
   - Password: (kosong atau sesuai instalasi)

3. **Create New Database:**
   - Klik tab "Databases"
   - Scroll ke bawah, cari form "Create new database"
   - Masukkan nama: `helpdesk_db`
   - Pilih Collation: `utf8mb4_unicode_ci`
   - Klik "Create"

4. **Hasilnya:**
   ```
   ✅ Database "helpdesk" created successfully
   ```

---

### Step 3: Run Migrations

```bash
cd Help-Desk-Backend

# Run migrations & seeders
php artisan migrate:fresh --seed
```

**Output yang diharapkan:**
```
  INFO  Running migrations.

  0001_01_01_000000_create_users_table .......................... 100.50ms DONE
  0001_01_01_000001_create_cache_table ........................... 50.25ms DONE
  0001_01_01_000002_create_jobs_table ............................ 75.30ms DONE
  2026_02_14_000001_create_admin_table ........................... 45.10ms DONE
  2026_02_14_000002_create_pelapor_table ......................... 40.20ms DONE
  2026_02_14_000003_create_kategori_table ........................ 42.15ms DONE
  2026_02_14_000004_create_jenis_permasalahan_table ............. 38.50ms DONE
  2026_02_14_000005_create_tiket_table .......................... 60.40ms DONE
  2026_02_14_000006_create_lampiran_table ........................ 35.30ms DONE

  INFO  Seeding database.

  Database\Seeders\AdminSeeder ....................................... DONE
  Database\Seeders\KategoriSeeder .................................... DONE
```

✅ **Database sekarang sudah ready!**

---

## 🔌 Verify Connection

### Option 1: Via phpMyAdmin
1. Buka http://localhost/phpmyadmin
2. Klik database `helpdesk` dari sidebar
3. Verify 6 tables sudah dibuat:
   - ✅ `users`
   - ✅ `cache`
   - ✅ `jobs`
   - ✅ `admin`
   - ✅ `pelapor`
   - ✅ `kategori`
   - ✅ `jenis_permasalahan`
   - ✅ `tiket`
   - ✅ `lampiran`

### Option 2: Via Laravel Command
```bash
cd Help-Desk-Backend

# Check database connection
php artisan tinker

# In tinker:
> DB::connection()->getPdo()
# Should return PDOConnection object
```

### Option 3: Test API
```bash
# Start Laravel server
php artisan serve --port=8000

# In another terminal, test:
curl http://localhost:8000/api/kategori

# Should return category data
```

---

## 🔐 Database Security

### Change Default Password (Recommended)

Jika Anda belum set password MySQL:

```bash
# Login to MySQL
mysql -u root

# Di MySQL prompt:
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_secure_password';
FLUSH PRIVILEGES;
EXIT;
```

Kemudian update `.env`:
```env
DB_PASSWORD=your_secure_password
```

---

## 📊 Database Structure

### Tables Created

```sql
-- Admin
CREATE TABLE admin (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Pelapor
CREATE TABLE pelapor (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  no_telepon VARCHAR(20) NOT NULL,
  jabatan ENUM('Guru', 'Siswa', 'Karyawan') NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Kategori
CREATE TABLE kategori (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Jenis Permasalahan
CREATE TABLE jenis_permasalahan (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  kategori_id BIGINT UNSIGNED NOT NULL,
  nama VARCHAR(150) NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (kategori_id) REFERENCES kategori(id)
);

-- Tiket
CREATE TABLE tiket (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nomor_tiket VARCHAR(20) UNIQUE NOT NULL,
  pelapor_id BIGINT UNSIGNED NOT NULL,
  kategori_id BIGINT UNSIGNED NOT NULL,
  jenis_permasalahan_id BIGINT UNSIGNED NOT NULL,
  admin_id BIGINT UNSIGNED,
  lokasi_gedung VARCHAR(100) NOT NULL,
  link_url VARCHAR(255),
  deskripsi TEXT NOT NULL,
  status ENUM('menunggu', 'diproses', 'selesai') DEFAULT 'menunggu',
  catatan_admin TEXT,
  tanggal DATE NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (pelapor_id) REFERENCES pelapor(id),
  FOREIGN KEY (kategori_id) REFERENCES kategori(id),
  FOREIGN KEY (jenis_permasalahan_id) REFERENCES jenis_permasalahan(id),
  FOREIGN KEY (admin_id) REFERENCES admin(id),
  INDEX idx_nomor_tiket (nomor_tiket),
  INDEX idx_status (status),
  INDEX idx_tanggal (tanggal),
  INDEX idx_pelapor (pelapor_id)
);

-- Lampiran
CREATE TABLE lampiran (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  tiket_id BIGINT UNSIGNED NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INT NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (tiket_id) REFERENCES tiket(id) ON DELETE CASCADE
);
```

---

## 🛠️ Troubleshooting

### Error: "SQLSTATE[HY000] [2002] Can't connect to local MySQL server"

**Solution:**
1. Pastikan MySQL/MariaDB service sudah running:
   ```bash
   sudo service mysql status
   # atau
   sudo service mariadb status
   ```

2. Jika tidak running, start service:
   ```bash
   sudo service mysql start
   # atau
   sudo service mariadb start
   ```

3. Verify MySQL listening on port 3306:
   ```bash
   netstat -tan | grep 3306
   # atau
   ss -tan | grep 3306
   ```

---

### Error: "SQLSTATE[HY000] [1045] Access denied for user 'root'@'localhost'"

**Solution:**
1. Check password di `.env`:
   ```env
   DB_PASSWORD=correct_password_here
   ```

2. Test connection manually:
   ```bash
   mysql -u root -p
   ```

3. Reset MySQL root password (jika lupa):
   ```bash
   # Linux/Mac
   sudo mysql
   FLUSH PRIVILEGES;
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
   FLUSH PRIVILEGES;
   EXIT;
   ```

---

### Error: "SQLSTATE[HY000] [2054] The server requested authentication method unknown to the client"

**Solution:**
Problem ini terjadi dengan MySQL 8.0+. Update password hash:

```bash
mysql -u root -p

# Di MySQL:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
FLUSH PRIVILEGES;
EXIT;
```

---

### Error: Migrations tidak jalan / constraint errors

**Solution:**
1. Verify database sudah ada:
   ```bash
   mysql -u root -e "SHOW DATABASES LIKE 'helpdesk';"
   ```

2. Jika ada, drop dan buat baru:
   ```bash
   mysql -u root -e "DROP DATABASE IF EXISTS helpdesk; CREATE DATABASE helpdesk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

3. Run migrations lagi:
   ```bash
   php artisan migrate:fresh --seed
   ```

---

## 📈 Performance Tips

1. **Add Indexes** (already done in migrations):
   - `nomor_tiket` - untuk search/filter
   - `status` - untuk status filtering
   - `tanggal` - untuk date range queries
   - `pelapor_id` - untuk relationship queries

2. **Connection Pooling** (untuk production):
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=helpdesk_db
   DB_USERNAME=root
   DB_PASSWORD=
   DB_POOL_MIN=5
   DB_POOL_MAX=100
   ```

3. **Enable Query Caching** (MySQL config):
   ```sql
   SET GLOBAL query_cache_type = 1;
   SET GLOBAL query_cache_size = 268435456;
   ```

---

## 🔍 Verify Everything OK

Setelah setup, jalankan check list ini:

```bash
cd Help-Desk-Backend

# 1. Check database connection
php artisan db:show

# 2. List all tables
php artisan tinker
> DB::select('SHOW TABLES');

# 3. Count records in each table
> DB::table('admin')->count();
> DB::table('kategori')->count();
> DB::table('tiket')->count();

# 4. Test API
> exit

php artisan serve --port=8000
```

Kemudian test:
```bash
curl http://localhost:8000/api/kategori
```

---

## 📱 Frontend Connection

Frontend React sudah konfigurasi untuk connect ke API:

```javascript
// src/main.jsx
const API_BASE_URL = 'http://localhost:8000/api';
```

Update jika URL berbeda.

---

## ✅ Checklist

- [ ] MySQL Server installed & running
- [ ] Can access phpMyAdmin (http://localhost/phpmyadmin)
- [ ] Database `helpdesk` created
- [ ] `.env` file configured correctly
- [ ] Migrations ran successfully
- [ ] All 9 tables created
- [ ] Seeders populated data (1 admin, 4 categories, 19 jenis)
- [ ] Can access API endpoints (http://localhost:8000/api/kategori)
- [ ] Frontend can connect to backend

---

## 🚀 Next Steps

Setelah MySQL setup:

1. **Start Backend:**
   ```bash
   cd Help-Desk-Backend
   php artisan serve --port=8000
   ```

2. **Start Frontend:**
   ```bash
   cd Help-Desk-Frontend
   npm run dev
   # Akses: http://localhost:5173
   ```

3. **Admin Login:**
   - URL: http://localhost:5173/admin-login
   - Username: `admin`
   - Password: `admin123`

4. **Monitor Database:**
   - phpMyAdmin: http://localhost/phpmyadmin
   - Login: root / password

---

## 📞 Support

Jika ada masalah:

1. Check logs:
   ```bash
   cd Help-Desk-Backend
   tail -100 storage/logs/laravel.log
   ```

2. Test connection:
   ```bash
   php artisan db:show
   php artisan migrate:status
   ```

3. Reset database:
   ```bash
   php artisan migrate:reset
   php artisan migrate:fresh --seed
   ```

---

Generated: February 15, 2026  
Document Version: 1.0
