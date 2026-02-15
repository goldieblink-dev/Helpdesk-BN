# CROSS-CHECK REPORT - BACKEND HELP DESK

## 🔍 **CRITICAL ISSUES DITEMUKAN**

---

### ❌ **ISSUE #1: ROUTES CONFLICT (CRITICAL)**

**Location:** `routes/api.php`  
**Severity:** CRITICAL - API won't work properly

**Problem:**
Routes dengan parameter dinamis `{nomor_tiket}` dan `{id}` akan conflict dengan routes yang lebih spesifik.

**Current Code:**
```php
Route::prefix('tikets')->group(function () {
    Route::get('/', [TiketController::class, 'index']);
    Route::get('/{nomor_tiket}', [TiketController::class, 'show']);  // ← DYNAMIC PARAM
    Route::put('/{nomor_tiket}', [TiketController::class, 'update']);
    Route::delete('/{nomor_tiket}', [TiketController::class, 'destroy']);
    Route::get('/stats/report', [TiketController::class, 'getStats']);  // ← AKAN JADI {nomor_tiket}
    Route::get('/search/by-phone/{no_telepon}', [TiketController::class, 'searchByPhone']);  // ← AKAN JADI {nomor_tiket}
});
```

**Why is this a problem?**
- `/api/tikets/stats/report` akan dianggap sebagai `/api/tikets/{nomor_tiket}` dengan `nomor_tiket='stats'`
- `/api/tikets/search/by-phone/082xxx` akan dianggap sebagai `/api/tikets/{nomor_tiket}` dengan `nomor_tiket='search'`
- Laravel routes diproses dari atas ke bawah, routes dengan parameter dinamis harus PALING BAWAH

**SOLUTION:**
Routes dengan parameter spesifik harus didefinisikan SEBELUM routes dengan parameter dinamis:

```php
Route::prefix('tikets')->group(function () {
    // SPECIFIC ROUTES FIRST
    Route::post('/', [TiketController::class, 'store']);
    Route::get('/stats/report', [TiketController::class, 'getStats']);
    Route::get('/search/by-phone/{no_telepon}', [TiketController::class, 'searchByPhone']);
    
    // DYNAMIC ROUTES LAST
    Route::get('/', [TiketController::class, 'index']);
    Route::get('/{nomor_tiket}', [TiketController::class, 'show']);
    Route::put('/{nomor_tiket}', [TiketController::class, 'update']);
    Route::delete('/{nomor_tiket}', [TiketController::class, 'destroy']);
});
```

---

### ❌ **ISSUE #2: KATEGORI ROUTES SAME PROBLEM**

**Location:** `routes/api.php`  
**Severity:** MEDIUM

**Problem:**
```php
Route::prefix('kategori')->group(function () {
    Route::get('/', [KategoriController::class, 'index']);
    Route::get('/{id}', [KategoriController::class, 'show']);  // ← DYNAMIC
    Route::get('/by-slug/{slug}', [KategoriController::class, 'getBySlug']);  // ← AKAN JADI /{id}
    Route::get('/{id}/jenis', [KategoriController::class, 'getJenisByKategori']);  // ← AKAN JADI /{id}
});
```

**SOLUTION:**
```php
Route::prefix('kategori')->group(function () {
    Route::get('/', [KategoriController::class, 'index']);
    Route::get('/by-slug/{slug}', [KategoriController::class, 'getBySlug']);
    Route::get('/{id}/jenis', [KategoriController::class, 'getJenisByKategori']);
    Route::get('/{id}', [KategoriController::class, 'show']);  // LAST
});
```

---

### ❌ **ISSUE #3: VALIDATION BUG - Jenis Permasalahan Cross-Category**

**Location:** `app/Http/Requests/StoreTiketRequest.php`  
**Severity:** HIGH

**Problem:**
User bisa memilih kategori "Server" tapi jenis_permasalahan dari kategori "Website". Validation tidak cek kategori_id dari jenis_permasalahan.

**Example Breaking:**
```json
{
  "kategori_id": 1,  // Server
  "jenis_permasalahan_id": 5  // Web Perpus (belongs to Website/kategori 2)
}
```

**Current Validation:**
```php
'jenis_permasalahan_id' => 'required|exists:jenis_permasalahan,id',
```

**SOLUTION:**
Tambah custom validation untuk cek kategori match:

```php
'jenis_permasalahan_id' => [
    'required',
    'exists:jenis_permasalahan,id',
    function ($attribute, $value, $fail) {
        $jenisPermasalahan = \App\Models\JenisPermasalahan::find($value);
        $kategoriId = request('kategori_id');
        
        if ($jenisPermasalahan && $jenisPermasalahan->kategori_id != $kategoriId) {
            $fail("Jenis permasalahan tidak sesuai dengan kategori yang dipilih");
        }
    },
],
```

---

### ❌ **ISSUE #4: NOMOR TIKET GENERATION BUG**

**Location:** `app/Models/Tiket.php` line 77-85  
**Severity:** MEDIUM

**Problem:**
Kode menggunakan `whereDate()` dengan `created_at`, tapi tiket count bisa salah karena race condition:

```php
$count = self::whereDate('created_at', $today->toDateString())
    ->count() + 1;  // Race condition bisa bikin duplicate
```

Jika 2 request datang bersamaan, keduanya bisa generate nomor yang sama.

**SOLUTION:**
Gunakan database locking atau increment column:

```php
public static function generateNomorTiket(): string
{
    $today = now();
    $date = $today->format('dmY');
    
    // Use lock untuk mencegah race condition
    DB::beginTransaction();
    try {
        $count = self::whereDate('created_at', $today->toDateString())
            ->lockForUpdate()
            ->count() + 1;
        DB::commit();
    } catch (\Exception $e) {
        DB::rollBack();
        throw $e;
    }
    
    return sprintf('BN-%s-%05d', $date, $count);
}
```

Atau lebih simple, gunakan UUID atau auto-increment di database.

---

### ⚠️ **ISSUE #5: FILE STORAGE PATH NOT CONFIGURED**

**Location:** `app/Http/Controllers/TiketController.php` line 100  
**Severity:** MEDIUM

**Problem:**
```php
$path = $file->store("complaints/{$nomorTiket}", 'public');
```

Tidak cek apakah:
1. Storage disk 'public' sudah di-link ke public folder
2. Folder `storage/app/public/complaints` sudah ada

**SOLUTION:**
```bash
# Run artisan command untuk link storage
php artisan storage:link

# Atau di code, tambah cek:
if (!Storage::disk('public')->exists("complaints")) {
    Storage::disk('public')->makeDirectory("complaints");
}
```

---

### ⚠️ **ISSUE #6: NO_TELEPON FORMAT NOT VALIDATED**

**Location:** `app/Http/Requests/StoreTiketRequest.php`  
**Severity:** LOW

**Problem:**
No telepon bisa diisi dengan format sembarangan. Bisa "abc", "123", dll.

**Current:**
```php
'no_telepon' => 'required|string|max:20',
```

**Recommendation:**
```php
'no_telepon' => 'required|string|max:20|regex:/^[0-9\-\+]{9,}$/',
```

---

### ⚠️ **ISSUE #7: TIMESTAMPS NOT CONSISTENT**

**Location:** Multiple models  
**Severity:** LOW

**Problem:**
Beberapa model tidak explicitly define timestamps, tapi Laravel default-nya include.

**Recommendation:**
Tambah di setiap model untuk clarity:
```php
public $timestamps = true;
```

---

### ⚠️ **ISSUE #8: RESPONSE FORMAT NOT MATCH FRONTEND EXPECTATION**

**Location:** `TiketController.php`  
**Severity:** MEDIUM

**Problem:**
Response format belum dijamin match dengan frontend expectation. Misal:
- Frontend expect `jenisPermasalahan` tapi response bisa `jenis_permasalahan`
- Frontend expect `nomorTiket` tapi response `nomor_tiket`

**SOLUTION:**
Gunakan API Resources untuk format response yang konsisten:

Create file `app/Http/Resources/TiketResource.php`:
```php
public function toArray($request)
{
    return [
        'id' => $this->id,
        'nomorTiket' => $this->nomor_tiket,
        'pelapor' => [
            'id' => $this->pelapor->id,
            'nama' => $this->pelapor->nama,
            'noTelepon' => $this->pelapor->no_telepon,
            'jabatan' => $this->pelapor->jabatan,
        ],
        'kategori' => [
            'id' => $this->kategori->id,
            'nama' => $this->kategori->nama,
            'slug' => $this->kategori->slug,
        ],
        'jenisPermasalahan' => [
            'id' => $this->jenisPermasalahan->id,
            'nama' => $this->jenisPermasalahan->nama,
        ],
        'lokasi_gedung' => $this->lokasi_gedung,
        'link_url' => $this->link_url,
        'deskripsi' => $this->deskripsi,
        'status' => $this->status,
        'catatan_admin' => $this->catatan_admin,
        'tanggal' => $this->tanggal,
        'lampiran' => $this->lampiran,
        'created_at' => $this->created_at,
        'updated_at' => $this->updated_at,
    ];
}
```

---

### ⚠️ **ISSUE #9: ADMIN FIELD NOT POPULATED WHEN CREATING TIKET**

**Location:** `TiketController.php` store method  
**Severity:** LOW

**Problem:**
Saat create tiket, `admin_id` langsung NULL. Frontend bisa expect ada field tapi di-response NULL.

**Recommendation:**
Pastikan di response ada field `admin` dengan value NULL jika belum di-assign:
```php
'admin' => null,
```

---

### ⚠️ **ISSUE #10: MISSING ERROR HANDLING FOR UNIQUE CONSTRAINT**

**Location:** `TiketController.php`  
**Severity:** MEDIUM

**Problem:**
Jika `nomor_tiket` duplicate (walaupun sudah di-lock), akan throw error 500 bukan 400.

**SOLUTION:**
```php
try {
    $tiket = Tiket::create([...]);
} catch (\Illuminate\Database\QueryException $e) {
    if ($e->getCode() == 23000) {  // Integrity constraint violation
        return response()->json([
            'success' => false,
            'message' => 'Tiket sudah ada dengan nomor yang sama',
        ], 400);
    }
    throw $e;
}
```

---

## 📋 **MINOR ADJUSTMENTS NEEDED**

### 🔧 **Adjustment #1: Import DB Facade**
**File:** `app/Models/Tiket.php`  
**Add:**
```php
use Illuminate\Support\Facades\DB;
```

---

### 🔧 **Adjustment #2: Storage Import**
**File:** `app/Http/Controllers/TiketController.php`  
Already present, good.

---

### 🔧 **Adjustment #3: Add method to ensure folder exists**
**Location:** Seeders perlu cek db sudah ada  
**Solution:**
```php
// Di DatabaseSeeder
public function run(): void
{
    if (!DB::select('SELECT 1 FROM information_schema.tables WHERE table_name = "kategori"')) {
        $this->call([
            AdminSeeder::class,
            KategoriSeeder::class,
        ]);
    }
}
```

---

## ✅ **THINGS THAT ARE CORRECT**

1. ✅ Models relationships defined correctly
2. ✅ Migrations structure is correct
3. ✅ File upload size validation (1MB) is correct
4. ✅ Seeders are well structured
5. ✅ Error handling with try-catch is good
6. ✅ HTTP status codes are appropriate (201, 200, 404, 500)
7. ✅ Status workflow validation (forward-only) is correct
8. ✅ Search functionality looks good
9. ✅ Pagination is implemented correctly
10. ✅ FormRequest validation messages are in Indonesian (good!)

---

## 🎯 **RECOMMENDED ORDER OF FIXES**

1. **CRITICAL** - Fix routes ordering (Issue #1 & #2)
2. **HIGH** - Add validation for jenis_permasalahan category match (Issue #3)
3. **MEDIUM** - Fix nomor tiket race condition (Issue #4)
4. **MEDIUM** - Configure storage (Issue #5)
5. **MEDIUM** - Add API Resources for response formatting (Issue #8)
6. **LOW** - Add phone number format validation (Issue #6)
7. **LOW** - Add timestamps explicit definition (Issue #7)

---

## 📝 **TESTING CHECKLIST**

Before running, prepare tests untuk:

```
✓ POST /api/tikets - Create complaint with files
  - Test dengan valid data
  - Test dengan missing required fields
  - Test dengan invalid categoria/jenis
  - Test dengan file terlalu besar
  - Test dengan file format invalid

✓ GET /api/tikets - List complaints
  - Test without filters
  - Test with status filter
  - Test with search
  - Test pagination

✓ GET /api/tikets/{nomor_tiket} - Get single
  - Test dengan tiket yang exist
  - Test dengan tiket yang tidak exist

✓ PUT /api/tikets/{nomor_tiket} - Update status
  - Test status transition valid
  - Test status transition invalid
  - Test update catatan_admin

✓ DELETE /api/tikets/{nomor_tiket} - Delete
  - Test dengan tiket yang exist
  - Test cascade delete lampiran

✓ GET /api/tikets/search/by-phone/{no} - Search
  - Test dengan no_telepon yang ada
  - Test dengan no_telepon yang tidak ada

✓ GET /api/tikets/stats/report - Stats
  - Test dengan month/year valid
  - Test calculation accuracy

✓ GET /api/kategori - Categories
  - Test mendapatkan semua kategori
  - Test struktur jenis_permasalahan

✓ GET /api/kategori/{id}/jenis - Jenis per kategori
  - Test mendapatkan jenis yang benar
```

---

## ⚠️ **SUMMARY**

**Total Issues Found:** 10  
- Critical: 2 (Routes conflict)
- High: 1 (Jenis validation)
- Medium: 3 (Nomor tiket, Storage, Response format, Error handling)
- Low: 4 (Phone format, Timestamps, Admin field, Adjustments)

**Status:** NOT READY FOR PRODUCTION - Need to fix critical issues first
