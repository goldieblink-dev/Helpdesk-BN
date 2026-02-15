<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonnteService
{
    /**
     * Send WhatsApp message via Fonnte API
     *
     * @param string $target Phone number (can be comma separated for multiple targets)
     * @param string $message Message content
     * @return array|mixed
     */
    public static function sendMessage($target, $message)
    {
        try {
            $token = config('services.fonnte.token');
            
            if (empty($token)) {
                Log::warning('Fonnte Token is not set in .env');
                return false;
            }

            // Sanitize phone number: 08xx -> 628xx
            $target = preg_replace('/[^0-9]/', '', $target); // Remove non-digits
            if (substr($target, 0, 1) === '0') {
                $target = '62' . substr($target, 1);
            }
            
            // Basic validation: minimal length for Indonesia is roughly 10 digits (628...)
            if (strlen($target) < 10) {
                 Log::warning("Fonnte: Invalid phone number format ($target)");
                 return false;
            }

            $response = Http::withHeaders([
                'Authorization' => $token,
            ])->post('https://api.fonnte.com/send', [
                'target' => $target,
                'message' => $message,
                'countryCode' => '62', // Default to Indonesia
            ]);

            $result = $response->json();
            
            Log::info('Fonnte Send Message Result:', ['target' => $target, 'result' => $result]);

            return $result;
        } catch (\Exception $e) {
            Log::error('Fonnte Error: ' . $e->getMessage());
            return false;
        }
    }
}
