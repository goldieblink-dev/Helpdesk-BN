<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use App\Models\JenisPermasalahan;
use Illuminate\Http\Request;

class KategoriController extends Controller
{
    /**
     * Get all kategori with their jenis permasalahan
     * GET /api/kategori
     */
    public function index()
    {
        try {
            $kategori = Kategori::with('jenisPermasalahan')->get();

            return response()->json([
                'success' => true,
                'message' => 'Data kategori berhasil diambil',
                'data' => $kategori,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data kategori: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get single kategori with its jenis permasalahan
     * GET /api/kategori/{id}
     */
    public function show($id)
    {
        try {
            $kategori = Kategori::with('jenisPermasalahan')->find($id);

            if (!$kategori) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kategori tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Detail kategori berhasil diambil',
                'data' => $kategori,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail kategori: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get kategori by slug
     * GET /api/kategori/by-slug/{slug}
     */
    public function getBySlug($slug)
    {
        try {
            $kategori = Kategori::where('slug', $slug)->with('jenisPermasalahan')->first();

            if (!$kategori) {
                return response()->json([
                    'success' => false,
                    'message' => 'Kategori tidak ditemukan',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Detail kategori berhasil diambil',
                'data' => $kategori,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail kategori: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get jenis permasalahan by kategori id
     * GET /api/kategori/{id}/jenis
     */
    public function getJenisByKategori($kategoriId)
    {
        try {
            $jenis = JenisPermasalahan::where('kategori_id', $kategoriId)->get();

            if ($jenis->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Jenis permasalahan untuk kategori ini tidak ditemukan',
                    'data' => [],
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Data jenis permasalahan berhasil diambil',
                'data' => $jenis,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data jenis permasalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
}
