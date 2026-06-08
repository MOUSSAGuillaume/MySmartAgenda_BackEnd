<?php

namespace App\Middleware;

use App\Security\JwtService;

class AuthMiddleware
{
    public static function getAuthenticatedUser(): ?object
    {
        $headers = getallheaders();

        if (!isset($headers['Authorization'])) {
            return null;
        }

        $authorizationHeader = $headers['Authorization'];

        if (!str_starts_with($authorizationHeader, 'Bearer ')) {
            return null;
        }

        $token = str_replace('Bearer ', '', $authorizationHeader);

        try {
            $jwtService = new JwtService();
            return $jwtService->decodeToken($token);
        } catch (\Exception $e) {
            return null;
        }
    }
}