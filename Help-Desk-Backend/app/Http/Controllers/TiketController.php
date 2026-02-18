<?php

namespace App\Http\Controllers;

use App\Models\Tiket;
use App\Models\Pelapor;
use App\Models\Lampiran;
use App\Http\Requests\StoreTiketRequest;
use App\Http\Requests\UpdateTiketRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TiketController extends Controller
{
    /**
     * Get all tikets with filtering and search
     * GET /api/tikets
     */
    public function index(Request $request)
    {
        try {
            $query = Tiket::with(['pelapor', 'kategori', 'jenisPermasalahan', 'admin', 'lampiran']);

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Search by nomor_tiket or nama pelapor or phone
            if ($request->has('search')) {
                $search = $request->search;
                $query->where('nomor_tiket', 'like', "%$search%")
                    ->orWhereHas('pelapor', function ($q) use ($search) {
                        $q->where('nama', 'like', "%$search%")
                            ->orWhere('no_telepon', 'like', "%$search%");
                    });
            }

            // Filter by kategori
            if ($request->has('kategori_id')) {
                $query->where('kategori_id', $request->kategori_id);
            }

            // Pagination
            $perPage = $request->get('per_page', 10);
            $tikets = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Data tiket berhasil diambil',
                'data' => $tikets,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data tiket: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create new tiket from public complaint form
     * POST /api/tikets
     */
    public function store(StoreTiketRequest $request)
    {
        // Start transaction
        \Illuminate\Support\Facades\DB::beginTransaction();
        
        try {
            // Ensure storage directory exists
            if (!Storage::disk('public')->exists("complaints")) {
                Storage::disk('public')->makeDirectory("complaints");
            }

            // Get or create pelapor
            $pelapor = Pelapor::updateOrCreate(
                ['no_telepon' => $request->no_telepon],
                [
                    'nama' => $request->nama,
                    'jabatan' => $request->jabatan,
                ]
            );

            // Generate nomor tiket
            $nomorTiket = Tiket::generateNomorTiket();

            // Create tiket
            $tiket = Tiket::create([
                'nomor_tiket' => $nomorTiket,
                'pelapor_id' => $pelapor->id,
                'kategori_id' => $request->kategori_id,
                'jenis_permasalahan_id' => $request->jenis_permasalahan_id,
                'lokasi_gedung' => $request->lokasi_gedung,
                'link_url' => $request->link_url,
                'deskripsi' => $request->deskripsi,
                'status' => 'menunggu',
                'tanggal' => now()->toDateString(),
            ]);

            // Handle file uploads
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    // Validate file type and size (max 2MB, allowed images/docs)
                    if (!$file->isValid() || 
                        !in_array($file->extension(), ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']) ||
                        $file->getSize() > 2 * 1024 * 1024) {
                        continue; // Skip invalid files
                    }

                    // Generate random filename for security
                    $filename = \Illuminate\Support\Str::random(40) . '.' . $file->extension();
                    $path = $file->storeAs("complaints/{$nomorTiket}", $filename, 'public');
                    
                    Lampiran::create([
                        'tiket_id' => $tiket->id,
                        'file_path' => $path,
                        'file_name' => $file->getClientOriginalName(), // Keep original name for display
                        'file_size' => $file->getSize(),
                    ]);
                }
            }

            // Commit transaction
            \Illuminate\Support\Facades\DB::commit();

            // Load relationships
            $tiket->load(['pelapor', 'kategori', 'jenisPermasalahan', 'lampiran']);

            // Send WhatsApp Notification
            if ($pelapor->no_telepon) {
                $message = "Halo {$pelapor->nama},\n\n" .
                    "Laporan Anda dengan Nomor Tiket: *{$nomorTiket}* telah kami terima.\n" .
                    "Status saat ini: *Menunggu*\n\n" .
                    "Mohon *simpan nomor ini* agar Anda tidak ketinggalan notifikasi update selanjutnya.\n\n" .
                    "--\nHelp Desk SMK Bakti Nusantara 666";
                
                \App\Services\FonnteService::sendMessage($pelapor->no_telepon, $message);
            }

            return response()->json([
                'success' => true,
                'message' => 'Pengaduan berhasil dibuat',
                'nomor_tiket' => $nomorTiket,
                'data' => $tiket,
            ], 201);
        } catch (\Illuminate\Database\QueryException $e) {
            // Rollback transaction
            \Illuminate\Support\Facades\DB::rollBack();
            
            // Handle database constraint violations
            if ($e->getCode() == 23000) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tiket dengan nomor tersebut sudah ada',
                ], 400);
            }
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat pengaduan: ' . $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            // Rollback transaction
            \Illuminate\Support\Facades\DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat pengaduan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get single tiket by nomor_tiket
     * GET /api/tikets/{nomor_tiket}
     */
    public function show($nomorTiket)
    {
        try {
            $tiket = Tiket::with(['pelapor', 'kategori', 'jenisPermasalahan', 'admin', 'lampiran'])
                ->where('nomor_tiket', $nomorTiket)
                ->first();

            if (!$tiket) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tiket tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Detail tiket berhasil diambil',
                'data' => $tiket,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail tiket: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update tiket status and admin notes (admin only)
     * PUT /api/tikets/{nomor_tiket}
     */
    public function update(UpdateTiketRequest $request, $nomorTiket)
    {
        try {
            $tiket = Tiket::where('nomor_tiket', $nomorTiket)->first();

            if (!$tiket) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tiket tidak ditemukan',
                ], 404);
            }

            // Validate status workflow (forward only)
            $validTransitions = [
                'menunggu' => ['diproses', 'ditolak'],
                'diproses' => ['selesai'],
                'selesai' => [], // Cannot transition from selesai
                'ditolak' => [], // Cannot transition from ditolak
            ];

            if (isset($request->status) && $request->status !== $tiket->status) {
                $allowedTransitions = $validTransitions[$tiket->status] ?? [];
                if (!in_array($request->status, $allowedTransitions)) {
                    return response()->json([
                        'success' => false,
                        'message' => "Transisi status dari '{$tiket->status}' ke '{$request->status}' tidak diperbolehkan",
                    ], 400);
                }
            }

            // Update tiket
            $tiket->update([
                'status' => $request->status ?? $tiket->status,
                'catatan_admin' => $request->catatan_admin ?? $tiket->catatan_admin,
                'admin_id' => $request->admin_id ?? $tiket->admin_id,
            ]);

            $tiket->load(['pelapor', 'kategori', 'jenisPermasalahan', 'admin', 'lampiran']);

            // Send WhatsApp Notification on Status Change
            if ($tiket->pelapor && $tiket->pelapor->no_telepon) {
                $statusLabel = ucfirst($tiket->status);
                $message = "Halo {$tiket->pelapor->nama},\n\n" .
                    "Status tiket laporan Anda (*{$tiket->nomor_tiket}*) telah diperbarui menjadi: *{$statusLabel}*.\n";
                
                if ($tiket->catatan_admin) {
                    $message .= "\nCatatan Admin: {$tiket->catatan_admin}\n";
                }
                
                if ($tiket->status === 'selesai') {
                    $message .= "\nTerima kasih telah menggunakan layanan kami.";
                }

                $message .= "\n\n--\nHelp Desk SMK Bakti Nusantara 666";

                \App\Services\FonnteService::sendMessage($tiket->pelapor->no_telepon, $message);
            }

            return response()->json([
                'success' => true,
                'message' => 'Tiket berhasil diperbarui',
                'data' => $tiket,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui tiket: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete tiket (soft or hard delete)
     * DELETE /api/tikets/{nomor_tiket}
     */
    public function destroy($nomorTiket)
    {
        try {
            $tiket = Tiket::where('nomor_tiket', $nomorTiket)->first();

            if (!$tiket) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tiket tidak ditemukan',
                ], 404);
            }

            // Delete associated files
            $lampiran = Lampiran::where('tiket_id', $tiket->id)->get();
            foreach ($lampiran as $file) {
                Storage::disk('public')->delete($file->file_path);
                $file->delete();
            }

            $tiket->delete();

            return response()->json([
                'success' => true,
                'message' => 'Tiket berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus tiket: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get statistics/report
     * GET /api/tikets/stats/report
     */
    public function getStats(Request $request)
    {
        try {
            $month = $request->query('month', now()->month);
            $year = $request->query('year', now()->year);

            $query = Tiket::whereMonth('tanggal', $month)
                ->whereYear('tanggal', $year);

            $total = $query->count();
            $menunggu = (clone $query)->where('status', 'menunggu')->count();
            $diproses = (clone $query)->where('status', 'diproses')->count();
            $selesai = (clone $query)->where('status', 'selesai')->count();

            $completionRate = $total > 0 ? round(($selesai / $total) * 100, 2) : 0;

            return response()->json([
                'success' => true,
                'message' => 'Statistik berhasil diambil',
                'data' => [
                    'bulan' => $month,
                    'tahun' => $year,
                    'total' => $total,
                    'menunggu' => $menunggu,
                    'diproses' => $diproses,
                    'selesai' => $selesai,
                    'ditolak' => (clone $query)->where('status', 'ditolak')->count(),
                    'completion_rate' => $completionRate,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil statistik: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update tiket status and admin notes (admin only)
     * PUT /api/tiket/{id}/status
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $tiket = Tiket::find($id);

            if (!$tiket) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tiket tidak ditemukan',
                ], 404);
            }

            // Validate input
            $rules = [
                'status' => 'required|in:menunggu,diproses,selesai,ditolak',
                'catatan_admin' => 'nullable|string',
                'alasan_penolakan' => 'nullable|string'
            ];

            // If status is ditolak, alasan_penolakan is required
            if ($request->status === 'ditolak') {
                $rules['alasan_penolakan'] = 'required|string|min:10';
            }

            $validated = $request->validate($rules, [
                'alasan_penolakan.required' => 'Alasan penolakan harus diisi',
                'alasan_penolakan.min' => 'Alasan penolakan minimal 10 karakter'
            ]);

            // Update status and notes
            $tiket->update([
                'status' => $validated['status'],
                'catatan_admin' => $validated['catatan_admin'] ?? $tiket->catatan_admin,
                'alasan_penolakan' => $validated['alasan_penolakan'] ?? null,
            ]);

            $tiket->load(['pelapor', 'kategori', 'jenisPermasalahan', 'admin', 'lampiran']);

            // Send WhatsApp Notification
            if ($tiket->pelapor && $tiket->pelapor->no_telepon) {
                $statusLabel = ucfirst($tiket->status);
                $message = "Halo {$tiket->pelapor->nama},\n\n" .
                    "Status tiket laporan Anda (*{$tiket->nomor_tiket}*) telah diperbarui menjadi: *{$statusLabel}*.\n";

                if ($tiket->status === 'ditolak' && $tiket->alasan_penolakan) {
                     $message .= "\nAlasan Penolakan: {$tiket->alasan_penolakan}\n";
                } elseif ($tiket->catatan_admin) {
                     $message .= "\nCatatan Admin: {$tiket->catatan_admin}\n";
                }

                $message .= "\n\n--\nHelp Desk SMK Bakti Nusantara 666";

                \App\Services\FonnteService::sendMessage($tiket->pelapor->no_telepon, $message);
            }

            return response()->json([
                'success' => true,
                'message' => 'Status tiket berhasil diupdate',
                'data' => $tiket,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate status tiket: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Search tiket by pelapor phone number
     * GET /api/tiket/search/by-phone/{no_telepon}
     */
    public function searchByPhone($noTelepon)
    {
        try {
            $tikets = Tiket::with(['pelapor', 'kategori', 'jenisPermasalahan', 'admin', 'lampiran'])
                ->whereHas('pelapor', function ($q) use ($noTelepon) {
                    $q->where('no_telepon', $noTelepon);
                })
                ->orderBy('created_at', 'desc')
                ->get();

            if ($tikets->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tiket dengan no telepon tersebut tidak ditemukan',
                    'data' => [],
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Tiket berhasil ditemukan',
                'data' => $tikets,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mencari tiket: ' . $e->getMessage(),
            ], 500);
        }
    }
}
