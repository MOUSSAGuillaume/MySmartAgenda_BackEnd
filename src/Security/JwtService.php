<?php

namespace App\Security;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtService
{
    public function generateToken(array $user): string
    {
        $payload = [
            'iat' => time(),
            'exp' => time() + (int) $_ENV['JWT_EXPIRATION'],
            'user_id' => $user['id'],
            'email' => $user['email']
        ];

        return JWT::encode(
            $payload,
            $_ENV['JWT_SECRET'],
            'HS256'
        );
    }

    public function decodeToken(string $token): object
    {
        return JWT::decode(
            $token,
            new Key($_ENV['JWT_SECRET'], 'HS256')
        );
    }
}