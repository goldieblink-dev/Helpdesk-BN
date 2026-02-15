# BACKEND SETUP - HELP DESK SYSTEM

## 📋 Daftar Database Tables yang Sudah Dibuat:

1. ✅ **admin** - Data operator/staff IT
2. ✅ **pelapor** - Data pengguna yang membuat pengaduan
3. ✅ **kategori** - Kategori utama pengaduan (4 kategori)
4. ✅ **jenis_permasalahan** - Sub-kategori pengaduan (19 jenis)
5. ✅ **tiket** - Data utama pengaduan (core table)
6. ✅ **lampiran** - File attachments untuk tiket

---

## 🚀 SETUP INSTRUCTIONS

### Step 1: Install Dependencies
```bash
cd Help-Desk-Backend
composer install
```

### Step 2: Generate App Key
```bash
php artisan key:generate
```

### Step 3: Setup Database
```bash
# Run migrations
php artisan migrate

# Seed initial data (admin + kategori + jenis)
php artisan db:seed
```

### Step 4: Start Development Server
```bash
# Terminal 1 - Laravel Server
php artisan serve --host=localhost --port=8000

# Terminal 2 (optional) - Watch for changes
npm run dev
```

---

## 🔗 API ENDPOINTS

### TIKET Endpoints

#### 1. Create New Complaint (Public)
```
POST /api/tikets
Content-Type: multipart/form-data

Request Body:
{
  "nama": "Ahmad Fauzi",
  "no_telepon": "081234567890",
  "jabatan": "siswa",
  "kategori_id": 1,
  "jenis_permasalahan_id": 1,
  "lokasi_gedung": "Gedung A Lt. 2", // nullable
  "link_url": "https://example.com", // nullable
  "deskripsi": "Server VPS tidak bisa diakses sejak jam 09.00",
  "files": [file1, file2] // max 5 files, 1MB each
}

Response (201):
{
  "success": true,
  "message": "Pengaduan berhasil dibuat",
  "nomor_tiket": "BN-14022026-00001",
  "data": {
    "id": 1,
    "nomor_tiket": "BN-14022026-00001",
    "pelapor": {...},
    "kategori": {...},
    "jenisPermasalahan": {...},
    "deskripsi": "...",
    "status": "menunggu",
    "lampiran": [...]
  }
}
```

#### 2. Get All Complaints (with filtering)
```
GET /api/tikets?status=menunggu&kategori_id=1&search=Ahmad&per_page=10

Response (200):
{
  "success": true,
  "message": "Data tiket berhasil diambil",
  "data": {
    "data": [...],
    "links": {...},
    "meta": {...}
  }
}
```

#### 3. Get Single Complaint
```
GET /api/tikets/BN-14022026-00001

Response (200):
{
  "success": true,
  "message": "Detail tiket berhasil diambil",
  "data": {...}
}
```

#### 4. Update Ticket Status (Admin Only)
```
PUT /api/tikets/BN-14022026-00001

Request Body:
{
  "status": "diproses", // or "selesai"
  "catatan_admin": "Sedang dikerjakan oleh IT",
  "admin_id": 1
}

Response (200):
{
  "success": true,
  "message": "Tiket berhasil diperbarui",
  "data": {...}
}
```

Note: Status workflow adalah FORWARD-ONLY
- menunggu → diproses → selesai
- Tidak bisa mundur ke status sebelumnya

#### 5. Delete Complaint
```
DELETE /api/tikets/BN-14022026-00001

Response (200):
{
  "success": true,
  "message": "Tiket berhasil dihapus"
}
```

#### 6. Search by Phone Number
```
GET /api/tikets/search/by-phone/081234567890

Response (200):
{
  "success": true,
  "message": "Tiket berhasil ditemukan",
  "data": [...]
}
```

#### 7. Get Statistics/Report
```
GET /api/tikets/stats/report?month=2&year=2026

Response (200):
{
  "success": true,
  "message": "Statistik berhasil diambil",
  "data": {
    "bulan": 2,
    "tahun": 2026,
    "total": 10,
    "menunggu": 3,
    "diproses": 4,
    "selesai": 3,
    "completion_rate": 30
  }
}
```

---

### KATEGORI Endpoints

#### 1. Get All Categories
```
GET /api/kategori

Response (200):
{
  "success": true,
  "message": "Data kategori berhasil diambil",
  "data": [
    {
      "id": 1,
      "nama": "Server",
      "slug": "server",
      "deskripsi": "...",
      "jenisPermasalahan": [
        {...},
        {...}
      ]
    },
    ...
  ]
}
```

#### 2. Get Single Category
```
GET /api/kategori/1

Response (200):
{
  "success": true,
  "data": {...}
}
```

#### 3. Get Category by Slug
```
GET /api/kategori/by-slug/server

Response (200):
{
  "success": true,
  "data": {...}
}
```

#### 4. Get Jenis by Kategori
```
GET /api/kategori/1/jenis

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "kategori_id": 1,
      "nama": "Server dari VPS",
      "deskripsi": "..."
    },
    ...
  ]
}
```

---

## 📊 DATABASE SCHEMA

### ADMIN Table
- id (PK)
- username (UNIQUE)
- password (hashed)
- nama
- email
- timestamps

### PELAPOR Table
- id (PK)
- nama
- no_telepon
- jabatan (ENUM: siswa, guru, masyarakat_sekolah)
- timestamps

### KATEGORI Table
- id (PK)
- nama
- slug (UNIQUE)
- deskripsi
- timestamps

### JENIS_PERMASALAHAN Table
- id (PK)
- kategori_id (FK)
- nama
- deskripsi
- timestamps

### TIKET Table (Core)
- id (PK)
- nomor_tiket (UNIQUE, format: BN-DDMMYYYY-00001)
- pelapor_id (FK)
- kategori_id (FK)
- jenis_permasalahan_id (FK)
- admin_id (FK, nullable)
- lokasi_gedung (nullable)
- link_url (nullable)
- deskripsi
- status (ENUM: menunggu, diproses, selesai)
- catatan_admin
- tanggal
- timestamps + indexes

### LAMPIRAN Table
- id (PK)
- tiket_id (FK)
- file_path
- file_name
- file_size
- timestamps

---

## 🔐 DEFAULT CREDENTIALS

Username: `admin`
Password: `admin123`

---

## ✅ CHECKLIST

- [x] 6 Migrations created
- [x] 6 Models with relationships
- [x] 2 Form Requests (validation)
- [x] 2 Controllers (Tiket, Kategori)
- [x] API routes setup
- [x] CORS configured
- [x] Seeders for initial data
- [ ] Run migrations
- [ ] Seed database
- [ ] Test all endpoints
- [ ] Connect frontend with API
