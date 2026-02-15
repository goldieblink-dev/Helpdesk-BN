<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    /**
     * Admin Login
     * POST /api/admin/login
     */
    public function login(Request $request)
    {
        try {
            $request->validate([
                'username' => 'required|string',
                'password' => 'required|string|min:6',
            ], [
                'username.required' => 'Username harus diisi',
                'password.required' => 'Password harus diisi',
                'password.min' => 'Password minimal 6 karakter',
            ]);

            $admin = Admin::where('username', $request->username)->first();

            if (!$admin || !Hash::check($request->password, $admin->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Username atau password salah',
                ], 401);
            }

            // Generate token
            $token = bin2hex(random_bytes(32));
            
            // Store hashed token in database
            $admin->update(['api_token' => hash('sha256', $token)]);

            return response()->json([
                'success' => true,
                'message' => 'Login berhasil',
                'token' => $token,
                'admin' => [
                    'id' => $admin->id,
                    'username' => $admin->username,
                    'nama' => $admin->nama,
                    'email' => $admin->email,
                ],
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal login: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Verify Token / Get Current Admin
     * GET /api/admin/verify-token
     * Header: Authorization: Bearer {token}
     */
    public function verifyToken(Request $request)
    {
        try {
            $token = $request->bearerToken();

            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token tidak ditemukan',
                ], 401);
            }

            // Verify with database (compare hashed token)
            $admin = Admin::where('api_token', hash('sha256', $token))->first();

            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token tidak valid or expired',
                ], 401);
            }

            return response()->json([
                'success' => true,
                'message' => 'Token valid',
                'admin' => [
                    'id' => $admin->id,
                    'username' => $admin->username,
                    'nama' => $admin->nama,
                    'email' => $admin->email,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal verify token: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Admin Logout
     * POST /api/admin/logout
     */
    public function logout(Request $request)
    {
        try {
            $token = $request->bearerToken();

            if ($token) {
                $admin = Admin::where('api_token', hash('sha256', $token))->first();
                if ($admin) {
                    $admin->update(['api_token' => null]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Logout berhasil',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal logout: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get Admin Profile
     * GET /api/admin/profile
     */
    public function profile(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $admin = Admin::where('api_token', hash('sha256', $token))->first();

            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            return response()->json([
                'success' => true,
                'message' => 'Profile berhasil diambil',
                'data' => [
                    'id' => $admin->id,
                    'username' => $admin->username,
                    'nama' => $admin->nama,
                    'email' => $admin->email,
                    'created_at' => $admin->created_at,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil profile: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update Admin Password
     * PUT /api/admin/change-password
     */
    public function changePassword(Request $request)
    {
        try {
            $token = $request->bearerToken();
            $admin = Admin::where('api_token', hash('sha256', $token))->first();

            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            $request->validate([
                'password_lama' => 'required|string|min:6',
                'password_baru' => 'required|string|min:6|confirmed',
            ], [
                'password_lama.required' => 'Password lama harus diisi',
                'password_baru.required' => 'Password baru harus diisi',
                'password_baru.min' => 'Password baru minimal 6 karakter',
                'password_baru.confirmed' => 'Konfirmasi password tidak cocok',
            ]);

            if (!Hash::check($request->password_lama, $admin->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Password lama tidak sesuai',
                ], 400);
            }

            $admin->update([
                'password' => Hash::make($request->password_baru),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password berhasil diubah',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengubah password: ' . $e->getMessage(),
            ], 500);
        }
    }
}
