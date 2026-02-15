# API Testing Guide - Help Desk Backend

## Setup & Prerequisites

```bash
# 1. Database Reset & Seed
cd Help-Desk-Backend
php artisan migrate:fresh --seed

# 2. Start Development Server
php artisan serve --port=8000

# 3. Open new terminal for testing
```

## Admin Authentication Endpoints

### 1. Login (Generate Token)
```bash
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "abc123...",
  "admin": {
    "id": 1,
    "username": "admin",
    "nama": "Administrator",
    "email": "admin@helpdesk.local"
  }
}
```

### 2. Verify Token
```bash
# Save token from login response first
TOKEN="your_token_here"

curl -X GET http://localhost:8000/api/admin/verify-token \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Token valid",
  "admin": {
    "id": 1,
    "username": "admin",
    "nama": "Administrator",
    "email": "admin@helpdesk.local"
  }
}
```

### 3. Get Admin Profile
```bash
curl -X GET http://localhost:8000/api/admin/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Profile berhasil diambil",
  "data": {
    "id": 1,
    "username": "admin",
    "nama": "Administrator",
    "email": "admin@helpdesk.local",
    "created_at": "2026-02-15..."
  }
}
```

### 4. Change Password
```bash
curl -X PUT http://localhost:8000/api/admin/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "password_lama": "admin123",
    "password_baru": "newpass123",
    "password_baru_confirmation": "newpass123"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Password berhasil diubah"
}
```

### 5. Logout
```bash
curl -X POST http://localhost:8000/api/admin/logout \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

## Tiket Endpoints

### 1. Create Complaint Ticket (POST /api/tikets)
```bash
curl -X POST http://localhost:8000/api/tikets \
  -H "Content-Type: multipart/form-data" \
  -F "nama=John Doe" \
  -F "no_telepon=081234567890" \
  -F "jabatan=Guru" \
  -F "kategori_id=1" \
  -F "jenis_permasalahan_id=1" \
  -F "lokasi_gedung=Gedung A" \
  -F "deskripsi=Internet di Lab Komputer 1 tidak bisa connect" \
  -F "tanggal=2026-02-15" \
  -F "files=@/path/to/file.jpg"
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Tiket berhasil dibuat",
  "data": {
    "id": 1,
    "nomor_tiket": "BN-15022026-00001",
    "status": "menunggu",
    "created_at": "..."
  }
}
```

### 2. Get All Tickets (GET /api/tikets)
```bash
curl -X GET "http://localhost:8000/api/tikets?status=menunggu&page=1" \
  -H "Accept: application/json"
```

**Optional Query Parameters:**
- `status=menunggu|diproses|selesai`
- `kategori_id=1`
- `search=keyword`
- `sort_by=tanggal` (tanggal, nomor_tiket, status)
- `page=1`
- `per_page=10`

### 3. Get Ticket Statistics (GET /api/tikets/stats/report)
```bash
curl -X GET http://localhost:8000/api/tikets/stats/report
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "menunggu": 3,
    "diproses": 5,
    "selesai": 2,
    "monthly_stats": [
      {
        "month": "January 2026",
        "total": 5
      }
    ]
  }
}
```

### 4. Search by Phone (GET /api/tikets/search/by-phone/{no_telepon})
```bash
curl -X GET "http://localhost:8000/api/tikets/search/by-phone/081234567890"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nomor_tiket": "BN-15022026-00001",
      "status": "menunggu",
      "pelapor": {...}
    }
  ]
}
```

### 5. Get Single Ticket (GET /api/tikets/{nomor_tiket})
```bash
curl -X GET http://localhost:8000/api/tikets/BN-15022026-00001
```

### 6. Update Ticket Status (PUT /api/tikets/{nomor_tiket})
```bash
curl -X PUT http://localhost:8000/api/tikets/BN-15022026-00001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "diproses",
    "admin_id": 1,
    "catatan_admin": "Sedang ditangani oleh Pak Budi"
  }'
```

**Status Workflow (Forward Only):**
- `menunggu` → `diproses` (admin accepts ticket)
- `diproses` → `selesai` (admin completes ticket)
- Cannot go backwards!

### 7. Delete Ticket (DELETE /api/tikets/{nomor_tiket})
```bash
curl -X DELETE http://localhost:8000/api/tikets/BN-15022026-00001 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Kategori Endpoints

### 1. Get All Categories (GET /api/kategori)
```bash
curl -X GET http://localhost:8000/api/kategori
```

### 2. Get Category by Slug (GET /api/kategori/by-slug/{slug})
```bash
curl -X GET http://localhost:8000/api/kategori/by-slug/server
```

### 3. Get Jenis Permasalahan by Category (GET /api/kategori/{id}/jenis)
```bash
curl -X GET http://localhost:8000/api/kategori/1/jenis
```

### 4. Get Single Category (GET /api/kategori/{id})
```bash
curl -X GET http://localhost:8000/api/kategori/1
```

---

## Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "username": ["Username harus diisi"]
  }
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Username atau password salah"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Tiket tidak ditemukan"
}
```

### 422 - Unprocessable Entity
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "no_telepon": ["Format nomor telepon tidak valid"]
  }
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Quick Test Script

```bash
#!/bin/bash

BASE_URL="http://localhost:8000/api"

echo "=== LOGIN ==="
TOKEN=$(curl -s -X POST "$BASE_URL/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.token')

echo "Token: $TOKEN"

echo "\n=== GET CATEGORIES ==="
curl -s -X GET "$BASE_URL/kategori" | jq '.'

echo "\n=== CREATE TICKET ==="
curl -s -X POST "$BASE_URL/tikets" \
  -H "Content-Type: multipart/form-data" \
  -F "nama=Test User" \
  -F "no_telepon=081234567890" \
  -F "jabatan=Guru" \
  -F "kategori_id=1" \
  -F "jenis_permasalahan_id=1" \
  -F "lokasi_gedung=Gedung A" \
  -F "deskripsi=Test ticket" \
  -F "tanggal=2026-02-15" | jq '.'

echo "\n=== GET ALL TICKETS ==="
curl -s -X GET "$BASE_URL/tikets" | jq '.'

echo "\n=== GET STATS ==="
curl -s -X GET "$BASE_URL/tikets/stats/report" | jq '.'

echo "\n=== VERIFY TOKEN ==="
curl -s -X GET "$BASE_URL/admin/verify-token" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

echo "\n=== LOGOUT ==="
curl -s -X POST "$BASE_URL/admin/logout" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

Save as `test-api.sh`, then run:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## Testing Checklist

### Authentication ✅
- [x] Admin login dengan valid credentials
- [x] Admin login dengan invalid password
- [x] Verify token when logged in
- [x] Verify token when logged out (should fail)
- [x] Get admin profile
- [x] Change password
- [x] Logout clears session

### Tiket Creation ✅
- [x] Create with all required fields
- [x] Create with file upload
- [x] Create with invalid kategori_id
- [x] Create with jenis from different kategori (should fail)
- [x] Create with invalid no_telepon format
- [x] Create with file > 1MB (should fail)
- [x] Create dengan tanggal kosong (use today)

### Tiket Retrieval ✅
- [x] Get all tickets
- [x] Get tickets with status filter
- [x] Get tickets with pagination
- [x] Get single ticket by nomor_tiket
- [x] Get ticket stats/report
- [x] Search by phone number
- [x] Search yang tidak ada (should return empty)

### Tiket Updates ✅
- [x] Update status menunggu → diproses
- [x] Update status diproses → selesai
- [x] Try update selesai → diproses (should fail)
- [x] Update with catatan_admin
- [x] Update dengan admin_id

### Tiket Deletion ✅
- [x] Delete ticket (cascade delete lampiran)
- [x] Try delete non-existent ticket
- [x] Verify files also deleted

### Kategori ✅
- [x] Get all categories
- [x] Get category by slug
- [x] Get jenis permasalahan for category
- [x] Get single category

