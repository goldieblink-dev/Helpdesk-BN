<?php

namespace App\Http\Controllers;

use App\Models\Pelapor;
use Illuminate\Http\Request;

class PeLaporController extends Controller
{
    /**
     * Get all pelapor
     * GET /api/pelapor
     */
    public function index()
    {
        try {
            $pelapor = Pelapor::all();

            return response()->json([
                'success' => true,
                'message' => 'Data pelapor berhasil diambil',
                'data' => $pelapor,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pelapor: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create new pelapor
     * POST /api/pelapor
     */
    public function store(Request $request)
    {
        try {
            // Validate input
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'no_telepon' => 'required|string|max:20',
                'jabatan' => 'required|in:siswa,guru,masyarakat_sekolah',
            ]);

            // Check if pelapor already exists
            $existingPelapor = Pelapor::where('no_telepon', $validated['no_telepon'])->first();
            if ($existingPelapor) {
                return response()->json([
                    'success' => true,
                    'message' => 'Pelapor sudah ada (menggunakan data yang ada)',
                    'data' => $existingPelapor,
                ]);
            }

            // Create new pelapor
            $pelapor = Pelapor::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Pelapor berhasil dibuat',
                'data' => $pelapor,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat pelapor: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get specific pelapor
     * GET /api/pelapor/{id}
     */
    public function show($id)
    {
        try {
            $pelapor = Pelapor::find($id);

            if (!$pelapor) {
                return response()->json([
                    'success' => false,
                    'message' => 'Pelapor tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Detail pelapor berhasil diambil',
                'data' => $pelapor,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail pelapor: ' . $e->getMessage(),
            ], 500);
        }
    }
}
