<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Admin;

class AdminAuth
{
    /**
     * Handle an incoming request.
     * Verifies that the request has a valid admin Bearer token.
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Token tidak ditemukan',
            ], 401);
        }

        $admin = Admin::where('api_token', hash('sha256', $token))->first();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Token tidak valid atau expired',
            ], 401);
        }

        // Attach admin to request for use in controllers
        $request->merge(['authenticated_admin' => $admin]);
        
        return $next($request);
    }
}
