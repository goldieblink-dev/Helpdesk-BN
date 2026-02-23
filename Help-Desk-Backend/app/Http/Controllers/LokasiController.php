<?php

namespace App\Http\Controllers;

use App\Models\Lokasi;
use Illuminate\Http\Request;

class LokasiController extends Controller
{
    /**
     * Display a listing of all lokasi
     * GET /api/lokasi
     */
    public function index()
    {
        try {
            $lokasi = Lokasi::all();
            return response()->json([
                'success' => true,
                'message' => 'Data lokasi berhasil diambil',
                'data' => $lokasi,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data lokasi: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get lokasi by kategori
     * GET /api/lokasi/by-kategori/{kategori_id}
     */
    public function getByKategori($kategori_id)
    {
        try {
            $lokasi = Lokasi::where('kategori_id', $kategori_id)->get();
            return response()->json([
                'success' => true,
                'message' => 'Data lokasi untuk kategori berhasil diambil',
                'data' => $lokasi,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data lokasi: ' . $e->getMessage(),
            ], 500);
        }
    }
}
