# 🚀 MySQL Setup - Quick Reference

## ✅ Apa yang sudah dikonfigurasi:

1. ✅ **File `.env` sudah update** ke MySQL:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=helpdesk
   DB_USERNAME=root
   DB_PASSWORD=
   ```

2. ✅ **Script SQL sudah siap:** `helpdesk_mysql_setup.sql`
3. ✅ **Setup guide lengkap:** `MYSQL_SETUP_GUIDE.md`

---

## 🎯 Langkah Setup (3 Steps)

### **STEP 1: Buka phpMyAdmin**
```
http://localhost/phpmyadmin
```

### **STEP 2: Copy & Run SQL Script**

**Option A: Via phpMyAdmin GUI (Easiest)**
1. Klik tab **"SQL"**
2. Copy semua isi file: **`helpdesk_mysql_setup.sql`**
3. Paste ke text area phpMyAdmin
4. Klik **"Go"**
5. **Done!** ✅ Database + tables + initial data sudah created

**Option B: Via MySQL Command Line**
```bash
mysql -u root < helpdesk_mysql_setup.sql
```

**Option C: Menu Import**
1. Di phpMyAdmin, klik **"Import"**
2. Upload file **`helpdesk_mysql_setup.sql`**
3. Klik **"Go"**

### **STEP 3: Verify & Run Migrations**
```bash
cd Help-Desk-Backend

# Test connection
php artisan db:show

# Run migrations (untuk sync dengan Laravel)
php artisan migrate:fresh --seed
```

---

## 🔍 Verification

Setelah setup, verify:

```bash
# Di phpMyAdmin atau MySQL:
SHOW DATABASES;
USE helpdesk;
SHOW TABLES;
SELECT COUNT(*) FROM admin;
SELECT COUNT(*) FROM kategori;
```

**Expected Output:**
```
9 tables created:
- users ✅
- cache ✅
- jobs ✅
- admin ✅ (1 record)
- pelapor ✅
- kategori ✅ (4 records)
- jenis_permasalahan ✅ (19 records)
- tiket ✅
- lampiran ✅
```

---

## 🔧 Troubleshooting

### **Error 1: Can't connect to MySQL**
```bash
# Check if MySQL running
sudo service mysql status

# Start MySQL if not running
sudo service mysql start

# Or for MariaDB
sudo service mariadb start
```

### **Error 2: Access denied (password issue)**
1. Update `.env` dengan correct password:
   ```env
   DB_PASSWORD=your_correct_password
   ```

2. Test connection:
   ```bash
   mysql -u root -p
   # Enter password when prompted
   ```

### **Error 3: Database already exists**
**If you want to reset:**
1. At phpMyAdmin, select database `helpdesk`
2. Click "Operations" tab
3. Click "Drop database"
4. Re-run SQL script to recreate

**Or via MySQL:**
```bash
mysql -u root
DROP DATABASE IF EXISTS helpdesk;
# Then re-run the SQL script
```

---

## 📊 Database Info

**Database Name:** `helpdesk_db`  
**Charset:** utf8mb4  
**Collation:** utf8mb4_unicode_ci  

**9 Tables:**
1. `users` - Laravel default
2. `cache` - Laravel cache
3. `jobs` - Laravel jobs queue
4. `admin` - Admin users (1 record: admin/admin123)
5. `pelapor` - Complaint submitters
6. `kategori` - Complaint categories (4: Server, Website, Internet, Lab)
7. `jenis_permasalahan` - Problem types (19 total)
8. `tiket` - Complaint tickets
9. `lampiran` - Ticket attachments

**Indexes:** Added on frequently queried columns
- nomor_tiket (ticket search)
- status (status filtering)
- tanggal (date range)
- pelapor_id (relationship queries)

---

## 🎯 Next Steps

After MySQL setup:

```bash
# 1. Verify database
php artisan db:show

# 2. Start backend (port 8000)
php artisan serve --port=8000

# 3. In another terminal, start frontend (port 5173)
cd Help-Desk-Frontend
npm run dev

# 4. Access admin
# URL: http://localhost:5173/admin-login
# Username: admin
# Password: admin123

# 5. Monitor database in phpMyAdmin
# URL: http://localhost/phpmyadmin
```

---

## 📋 Credentials

**MySQL:**
- Host: localhost
- Port: 3306
- Database: helpdesk_db
- User: root
- Password: (leave empty, or set your own)

**Laravel .env:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=helpdesk_db
DB_USERNAME=root
DB_PASSWORD=
```

**Admin Account (in database):**
- Username: admin
- Password: admin123
- Name: Administrator
- Email: admin@helpdesk.sch.id

---

## ✅ Setup Complete Checklist

- [ ] MySQL/MariaDB installed & running
- [ ] phpMyAdmin accessible (http://localhost/phpmyadmin)
- [ ] `.env` file updated to use MySQL
- [ ] `helpdesk_mysql_setup.sql` executed
- [ ] Database `helpdesk` exists in phpMyAdmin
- [ ] 9 tables created successfully
- [ ] Initial data (admin + kategoris) loaded
- [ ] `php artisan db:show` works
- [ ] Can start Laravel server (`php artisan serve`)
- [ ] Can start React frontend (`npm run dev`)

---

**Status: Ready for Development! 🟢**

Need more details? See: `MYSQL_SETUP_GUIDE.md`
